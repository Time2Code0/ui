"use client";

import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useId,
  useMemo,
} from "react";

import { type CurveFactory, curveLinear } from "d3-shape";

import { useChart, useChartStable } from "../chart-core/chart-context";
import { linePath } from "../chart-core/line-path";
import {
  type FadeEdges,
  fadeGradientStops,
  resolveFadeSides,
} from "../chart-utils/fade-edges";

/** Semantic trend colors from the base success / destructive tokens. */
export const PROFIT_LOSS_POSITIVE_COLOR = "var(--color-success-foreground)";
export const PROFIT_LOSS_NEGATIVE_COLOR = "var(--color-destructive-foreground)";

const LEGEND_DIM_OPACITY = 0.25;

export function profitLossColor(value: number) {
  return value >= 0 ? PROFIT_LOSS_POSITIVE_COLOR : PROFIT_LOSS_NEGATIVE_COLOR;
}

export const PROFIT_LOSS_TOOLTIP_LABEL_FALLBACK = "Profit/Loss";

export function resolveProfitLossTooltipLabel(label: string) {
  const trimmed = label.trim();
  return trimmed || PROFIT_LOSS_TOOLTIP_LABEL_FALLBACK;
}

export interface ProfitLossLineProps {
  /** Curve function. @default curveLinear */
  curve?: CurveFactory;
  /** Key in data for y values */
  dataKey: string;
  /**
   * Fade the line stroke toward transparent at the chart edges.
   * @default false
   */
  fadeEdges?: FadeEdges;
  /** Color for loss segments @default var(--color-destructive-foreground) */
  negativeColor?: string;
  /** Color for profit segments @default var(--color-success-foreground) */
  positiveColor?: string;
  /** Line width @default 2.5 */
  strokeWidth?: number;
  /** Key in data for x values @default "date" */
  xDataKey?: string;
}

function segmentLegendIndex(isPositive: boolean) {
  return isPositive ? 0 : 1;
}

export function ProfitLossLine({
  dataKey,
  xDataKey = "date",
  strokeWidth = 2.5,
  positiveColor = PROFIT_LOSS_POSITIVE_COLOR,
  negativeColor = PROFIT_LOSS_NEGATIVE_COLOR,
  curve = curveLinear,
  fadeEdges = false,
}: ProfitLossLineProps) {
  const { tooltipData } = useChart();
  const { hoveredIndex } = useProfitLossLegendHover();
  const { renderData, xScale, yScale, xAccessor, innerWidth } =
    useChartStable();
  const reactId = useId();
  const fadeSides = resolveFadeSides(fadeEdges);
  const fadeStops = fadeSides.any ? fadeGradientStops(fadeSides) : null;
  const positiveGradientId = `profit-loss-gradient-pos-${dataKey}-${reactId}`;
  const negativeGradientId = `profit-loss-gradient-neg-${dataKey}-${reactId}`;

  const focusedLegendIndex = useMemo(() => {
    if (hoveredIndex !== null) {
      return hoveredIndex;
    }
    if (!tooltipData) {
      return null;
    }
    const value = tooltipData.point[dataKey];
    if (typeof value !== "number") {
      return null;
    }
    return segmentLegendIndex(value >= 0);
  }, [dataKey, hoveredIndex, tooltipData]);

  const segments = useMemo(
    () =>
      splitProfitLossSegments({
        data: renderData,
        dataKey,
        xAccessor,
        xDataKey,
      }),
    [dataKey, renderData, xAccessor, xDataKey]
  );

  const getX = useCallback(
    (d: Record<string, unknown>) => xScale(xAccessor(d)) ?? 0,
    [xAccessor, xScale]
  );

  const getY = useCallback(
    (d: Record<string, unknown>) => {
      const value = d[dataKey];
      return typeof value === "number" ? (yScale(value) ?? 0) : 0;
    },
    [dataKey, yScale]
  );

  return (
    <>
      {fadeStops ? (
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id={positiveGradientId}
            x1={0}
            x2={innerWidth}
            y1={0}
            y2={0}
          >
            {fadeStops.map((stop) => (
              <stop
                key={stop.offset}
                offset={stop.offset}
                style={{
                  stopColor: positiveColor,
                  stopOpacity: stop.opacity,
                }}
              />
            ))}
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id={negativeGradientId}
            x1={0}
            x2={innerWidth}
            y1={0}
            y2={0}
          >
            {fadeStops.map((stop) => (
              <stop
                key={stop.offset}
                offset={stop.offset}
                style={{
                  stopColor: negativeColor,
                  stopOpacity: stop.opacity,
                }}
              />
            ))}
          </linearGradient>
        </defs>
      ) : null}
      {segments.map((segment) => {
        const isDimmed =
          focusedLegendIndex !== null &&
          focusedLegendIndex !== segmentLegendIndex(segment.isPositive);
        const firstPoint = segment.data[0];
        const lastPoint = segment.data.at(-1);
        const segmentKey = `${dataKey}-${segment.isPositive ? "pos" : "neg"}-${String(firstPoint?.[xDataKey])}-${String(lastPoint?.[xDataKey])}`;
        const stroke = segment.isPositive ? positiveColor : negativeColor;
        const segmentStroke = fadeStops
          ? `url(#${segment.isPositive ? positiveGradientId : negativeGradientId})`
          : stroke;

        return (
          <g
            key={segmentKey}
            opacity={isDimmed ? LEGEND_DIM_OPACITY : 1}
            style={{ transition: "opacity 0.2s ease-in-out" }}
          >
            <path
              d={linePath(segment.data, { curve, x: getX, y: getY })}
              fill="none"
              stroke={segmentStroke}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={strokeWidth}
            />
          </g>
        );
      })}
    </>
  );
}

ProfitLossLine.displayName = "ProfitLossLine";

type SegmentSign = "positive" | "negative";

interface ProfitLossSegment {
  data: Record<string, unknown>[];
  isPositive: boolean;
}

function resolveSign(value: number, fallback: SegmentSign): SegmentSign {
  if (value > 0) {
    return "positive";
  }
  if (value < 0) {
    return "negative";
  }
  return fallback;
}

function findInitialSign(
  data: Record<string, unknown>[],
  dataKey: string
): SegmentSign {
  for (const row of data) {
    const value = row[dataKey];
    if (typeof value !== "number") {
      continue;
    }
    if (value > 0) {
      return "positive";
    }
    if (value < 0) {
      return "negative";
    }
  }
  return "positive";
}

function interpolateZeroCrossing(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  dataKey: string,
  xDataKey: string,
  xAccessor: (d: Record<string, unknown>) => Date
): Record<string, unknown> {
  const ya = a[dataKey] as number;
  const yb = b[dataKey] as number;
  const t = ya / (ya - yb);
  const start = xAccessor(a).getTime();
  const end = xAccessor(b).getTime();
  const crossDate = new Date(start + t * (end - start));

  return {
    ...a,
    [xDataKey]: crossDate,
    [dataKey]: 0,
  };
}

/** Split a single series into contiguous segments above/below zero. */
function splitProfitLossSegments({
  data,
  dataKey,
  xDataKey = "date",
  xAccessor,
}: {
  data: Record<string, unknown>[];
  dataKey: string;
  xDataKey?: string;
  xAccessor: (d: Record<string, unknown>) => Date;
}): ProfitLossSegment[] {
  if (data.length === 0) {
    return [];
  }

  const segments: ProfitLossSegment[] = [];
  let currentSign = findInitialSign(data, dataKey);
  const firstPoint = data[0];
  if (!firstPoint) {
    return [];
  }
  let currentSegment: Record<string, unknown>[] = [firstPoint];

  for (let i = 0; i < data.length - 1; i++) {
    const a = data[i];
    const b = data[i + 1];
    if (!(a && b)) {
      continue;
    }
    const ya = a[dataKey] as number;
    const yb = b[dataKey] as number;

    if (
      typeof ya === "number" &&
      typeof yb === "number" &&
      ya !== 0 &&
      yb !== 0 &&
      Math.sign(ya) !== Math.sign(yb)
    ) {
      const cross = interpolateZeroCrossing(a, b, dataKey, xDataKey, xAccessor);
      currentSegment.push(cross);
      segments.push({
        data: currentSegment,
        isPositive: currentSign === "positive",
      });
      currentSegment = [cross, b];
      currentSign = resolveSign(yb, currentSign);
      continue;
    }

    currentSegment.push(b);
    if (typeof yb === "number" && yb !== 0) {
      currentSign = resolveSign(yb, currentSign);
    }
  }

  if (currentSegment.length > 0) {
    segments.push({
      data: currentSegment,
      isPositive: currentSign === "positive",
    });
  }

  return segments;
}

interface ProfitLossLegendHoverContextValue {
  hoveredIndex: number | null;
}

const ProfitLossLegendHoverContext =
  createContext<ProfitLossLegendHoverContextValue | null>(null);

export function ProfitLossLegendHoverProvider({
  hoveredIndex,
  children,
}: {
  hoveredIndex: number | null;
  children: ReactNode;
}) {
  return (
    <ProfitLossLegendHoverContext.Provider value={{ hoveredIndex }}>
      {children}
    </ProfitLossLegendHoverContext.Provider>
  );
}

function useProfitLossLegendHover(): ProfitLossLegendHoverContextValue {
  const context = use(ProfitLossLegendHoverContext);
  return context ?? { hoveredIndex: null };
}
