import { type CurveFactory, area as d3Area, line as d3Line } from "d3-shape";

import {
  flattenSeriesPath,
  interpolateSeriesPathPoints,
  type SeriesPathPoint,
  samplePolylineY,
} from "./series-path-utils";

/** One plotted row of a band, in pixels. */
export interface BandPoint {
  key: string;
  lower: number;
  upper: number;
  x: number;
}

/** Contiguous run of defined rows (gaps split the band into segments). */
export type BandSegment = BandPoint[];

function finiteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Pixel band segments. Rows where either edge is null / undefined / NaN end
 * the current segment (e.g. Bollinger warm-up rows).
 */
export function computeBandSegments(
  data: Record<string, unknown>[],
  xAccessor: (datum: Record<string, unknown>) => Date,
  xScale: (value: Date) => number | undefined,
  yScale: (value: number) => number | undefined,
  upperKey: string,
  lowerKey: string
): BandSegment[] {
  const segments: BandSegment[] = [];
  let current: BandSegment = [];

  data.forEach((datum, index) => {
    const upper = datum[upperKey];
    const lower = datum[lowerKey];
    if (!(finiteNumber(upper) && finiteNumber(lower))) {
      if (current.length > 0) {
        segments.push(current);
        current = [];
      }
      return;
    }
    const xValue = xAccessor(datum);
    current.push({
      key: String(xValue.getTime?.() ?? index),
      lower: yScale(lower) ?? 0,
      upper: yScale(upper) ?? 0,
      x: xScale(xValue) ?? 0,
    });
  });

  if (current.length > 0) {
    segments.push(current);
  }
  return segments;
}

function edgePoints(
  segment: BandSegment,
  edge: "upper" | "lower"
): SeriesPathPoint[] {
  return segment.map((point) => ({
    key: point.key,
    x: point.x,
    y: point[edge],
  }));
}

/** Closed area path between the edges, one sub-path per segment. */
export function bandAreaPath(
  segments: BandSegment[],
  curve: CurveFactory
): string {
  const generator = d3Area<BandPoint>()
    .x((point) => point.x)
    .y0((point) => point.lower)
    .y1((point) => point.upper)
    .curve(curve);
  return segments
    .filter((segment) => segment.length > 1)
    .map((segment) => generator(segment) ?? "")
    .join("");
}

/** Open stroke path along one edge, one sub-path per segment. */
export function bandEdgePath(
  segments: BandSegment[],
  edge: "upper" | "lower",
  curve: CurveFactory
): string {
  const generator = d3Line<BandPoint>()
    .x((point) => point.x)
    .y((point) => point[edge])
    .curve(curve);
  return segments
    .filter((segment) => segment.length > 1)
    .map((segment) => generator(segment) ?? "")
    .join("");
}

/** Vertical pixel extent covered by both edges (top < bottom in SVG space). */
export function bandPixelExtent(
  segments: BandSegment[]
): { top: number; bottom: number } | null {
  let top = Number.POSITIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;
  for (const segment of segments) {
    for (const point of segment) {
      top = Math.min(top, point.upper, point.lower);
      bottom = Math.max(bottom, point.upper, point.lower);
    }
  }
  return Number.isFinite(top) ? { bottom, top } : null;
}

/** Dense polylines of both edges, all segments concatenated and sorted by x. */
export interface BandEdgePolylines {
  lower: SeriesPathPoint[];
  upper: SeriesPathPoint[];
}

export function flattenBandEdges(
  segments: BandSegment[],
  curve: CurveFactory,
  alreadyPolyline: boolean
): BandEdgePolylines {
  const flatten = (edge: "upper" | "lower") =>
    segments
      .flatMap((segment) => {
        const points = edgePoints(segment, edge);
        return alreadyPolyline ? points : flattenSeriesPath(points, curve);
      })
      .sort((a, b) => a.x - b.x);
  return { lower: flatten("lower"), upper: flatten("upper") };
}

/**
 * Vertical morph (same approach as `morphSeriesPolylines`): both edges are
 * sampled on a shared x grid per target segment and only y is interpolated,
 * so the band rises and falls into shape alongside morphing lines. Result is
 * a polyline — render with `curveLinear`.
 */
export function morphBandSegments(
  from: BandEdgePolylines,
  targets: BandSegment[],
  curve: CurveFactory,
  progress: number,
  sampleSpacingPx = 2
): BandSegment[] {
  if (from.upper.length === 0 || from.lower.length === 0) {
    return targets;
  }
  return targets.map((segment) => {
    const first = segment[0];
    const last = segment.at(-1);
    if (!(first && last) || segment.length < 2) {
      return segment;
    }
    const toUpper = flattenSeriesPath(edgePoints(segment, "upper"), curve);
    const toLower = flattenSeriesPath(edgePoints(segment, "lower"), curve);
    const span = last.x - first.x;
    const count = Math.max(2, Math.ceil(span / sampleSpacingPx) + 1);
    const result: BandSegment = new Array(count);
    for (let index = 0; index < count; index++) {
      const x = first.x + (span * index) / (count - 1);
      const fromUpper = samplePolylineY(from.upper, x);
      const fromLower = samplePolylineY(from.lower, x);
      result[index] = {
        key: "",
        lower: fromLower + (samplePolylineY(toLower, x) - fromLower) * progress,
        upper: fromUpper + (samplePolylineY(toUpper, x) - fromUpper) * progress,
        x,
      };
    }
    return result;
  });
}

/**
 * Keyed slide (same approach as `interpolateSeriesPathPoints`) for viewport
 * changes on unchanged data, e.g. brush pan / resize.
 */
export function interpolateBandSegments(
  from: BandSegment[],
  targets: BandSegment[],
  progress: number
): BandSegment[] {
  if (progress >= 1 || from.length === 0) {
    return targets;
  }
  const fromUpper = from.flatMap((segment) => edgePoints(segment, "upper"));
  const fromLower = from.flatMap((segment) => edgePoints(segment, "lower"));
  return targets.map((segment) => {
    const upper = interpolateSeriesPathPoints(
      fromUpper,
      edgePoints(segment, "upper"),
      progress
    );
    const lower = interpolateSeriesPathPoints(
      fromLower,
      edgePoints(segment, "lower"),
      progress
    );
    return upper.map((point, index) => ({
      key: point.key,
      lower: lower[index]?.y ?? point.y,
      upper: point.y,
      x: point.x,
    }));
  });
}

/** Signature of both edge values per row (ignores scales / width). */
export function bandDataSignature(
  renderData: Record<string, unknown>[],
  xAccessor: (datum: Record<string, unknown>) => Date,
  upperKey: string,
  lowerKey: string
): string {
  return renderData
    .map((datum) => {
      const upper = datum[upperKey];
      const lower = datum[lowerKey];
      return `${xAccessor(datum).getTime()}:${finiteNumber(upper) ? upper : ""}:${finiteNumber(lower) ? lower : ""}`;
    })
    .join(",");
}

export type BandFadeEdges =
  | boolean
  | "left"
  | "right"
  | { top?: boolean; right?: boolean; bottom?: boolean; left?: boolean };

export interface BandFadeSides {
  bottom: boolean;
  horizontal: boolean;
  left: boolean;
  right: boolean;
  top: boolean;
  vertical: boolean;
}

export function resolveBandFadeSides(
  fade: BandFadeEdges | undefined
): BandFadeSides {
  let sides = { bottom: false, left: false, right: false, top: false };
  if (fade === true) {
    sides = { bottom: true, left: true, right: true, top: true };
  } else if (fade === "left") {
    sides.left = true;
  } else if (fade === "right") {
    sides.right = true;
  } else if (fade && typeof fade === "object") {
    sides = {
      bottom: fade.bottom === true,
      left: fade.left === true,
      right: fade.right === true,
      top: fade.top === true,
    };
  }
  return {
    ...sides,
    horizontal: sides.left || sides.right,
    vertical: sides.top || sides.bottom,
  };
}

export interface BandFadeStop {
  offset: number;
  opacity: number;
}

/**
 * Mask stops along one axis: transparent at faded ends, opaque in between.
 * `size` is the fraction (0–0.5) of the axis each fade occupies.
 */
export function bandFadeStops(
  startFaded: boolean,
  endFaded: boolean,
  size: number
): BandFadeStop[] {
  const span = Math.min(0.5, Math.max(0, size));
  return [
    { offset: 0, opacity: startFaded ? 0 : 1 },
    { offset: span, opacity: 1 },
    { offset: 1 - span, opacity: 1 },
    { offset: 1, opacity: endFaded ? 0 : 1 },
  ];
}
