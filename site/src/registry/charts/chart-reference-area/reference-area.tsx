"use client";

import { useId, useLayoutEffect, useMemo } from "react";

import { motion } from "motion/react";

import {
  chartCssVars,
  useChartStable,
  useYScale,
} from "../chart-core/chart-context";
import { useReferenceAreaRegistration } from "../chart-core/reference-area-config";
import { normalizeYAxisId } from "../chart-core/y-axis-scales";
import { isReferenceAreaVisiblePhase } from "../chart-core/y-domain-utils";
import {
  type PatternPresetId,
  renderPatternPreset,
} from "../chart-patterns/pattern-preset";

const DEFAULT_FILL =
  "color-mix(in oklch, var(--color-foreground-muted) 12%, transparent)";

export type ReferenceAreaStrokeStyle = "solid" | "dashed";

export interface ReferenceAreaProps {
  /** Y-axis tick label color for values inside this band. */
  axisLabelColor?: string;
  /** Class on the reference area group */
  className?: string;
  /** Fade fill and edge lines at left/right. @default true */
  fadeEdges?: boolean;
  /** Horizontal fade zone as % of plot width per edge. @default 10 */
  fadeEdgesLength?: number;
  /**
   * Solid fill when `pattern` is `"none"`.
   * @default color-mix(in oklch, var(--color-foreground-muted) 12%, transparent)
   */
  fill?: string;
  /** Fill opacity @default 1 */
  fillOpacity?: number;
  /**
   * Clip the band to the plot when bounds exceed the domain
   * @default "hidden"
   */
  ifOverflow?: ReferenceAreaIfOverflow;
  /** Bracket marker color */
  markerColor?: string;
  /** Bracket marker size */
  markerSize?: number;
  /** Pattern preset. `"none"` uses solid `fill`. @default "none" */
  pattern?: PatternPresetId;
  /** Pattern stroke / tile color. */
  patternColor?: string;
  /** Alternate tile fill for circle patterns */
  patternComplement?: boolean;
  /** Dot grid only — hollow dots when `false` */
  patternDotFill?: boolean;
  /** Solid fill inside circles */
  patternFill?: string;
  /** Dot or circle radius for `dots` / `circles` */
  patternRadius?: number;
  /** Pattern tile scale */
  patternScale?: number;
  /** Line stroke width for line-based patterns */
  patternStrokeWidth?: number;
  /** Background color inside each pattern tile */
  patternTileBackground?: string;
  /**
   * Inward bracket markers at the horizontal center of the band.
   * @default false
   */
  showMarkers?: boolean;
  /** Edge line color */
  stroke?: string;
  /** Dash array when `strokeStyle` is `"dashed"`. @default "4,4" */
  strokeDasharray?: string;
  /** Edge line style @default "dashed" */
  strokeStyle?: ReferenceAreaStrokeStyle;
  /** Edge line width @default 1 */
  strokeWidth?: number;
  /** Starting X data coordinate (extends to plot left when omitted). */
  x1?: Date | number;
  /** Ending X data coordinate (extends to plot right when omitted). */
  x2?: Date | number;
  /** Lower Y data bound (extends to plot top when omitted). */
  y1?: number;
  /** Upper Y data bound (extends to plot bottom when omitted). */
  y2?: number;
  /** Y-scale group id. @default "left" */
  yAxisId?: string | number;
}

const ENTER_FADE_MS = 420;

function clampFadeLength(length: number): number {
  return Math.min(45, Math.max(0, length));
}

function bracketMarkerPath(
  centerX: number,
  edgeY: number,
  size: number,
  direction: "down" | "up"
): string {
  const half = size / 2;
  if (direction === "down") {
    return `M ${centerX - half} ${edgeY} L ${centerX + half} ${edgeY} L ${centerX} ${edgeY + size} Z`;
  }
  return `M ${centerX - half} ${edgeY} L ${centerX + half} ${edgeY} L ${centerX} ${edgeY - size} Z`;
}

export function ReferenceArea({
  y1,
  y2,
  x1,
  x2,
  yAxisId,
  fill = DEFAULT_FILL,
  fillOpacity = 1,
  pattern = "none",
  patternColor = chartCssVars.foregroundMuted,
  patternScale = 1,
  patternStrokeWidth,
  patternRadius,
  patternComplement,
  patternFill,
  patternDotFill,
  patternTileBackground,
  stroke = chartCssVars.foregroundMuted,
  strokeWidth = 1,
  strokeStyle = "dashed",
  strokeDasharray = "4,4",
  fadeEdges = true,
  fadeEdgesLength = 10,
  axisLabelColor,
  showMarkers = false,
  markerColor = "var(--color-chart-1)",
  markerSize = 6,
  ifOverflow = "hidden",
  className,
}: ReferenceAreaProps) {
  const { innerWidth, innerHeight, xScale, chartPhase, enterTransition } =
    useChartStable();
  const yScale = useYScale(yAxisId);
  const uniqueId = useId().replace(/:/g, "");
  const registration = useReferenceAreaRegistration();

  useLayoutEffect(() => {
    if (!registration) {
      return;
    }
    registration.registerReferenceArea(uniqueId, {
      axisLabelColor,
      y1,
      y2,
      yAxisId: normalizeYAxisId(yAxisId),
    });
    return () => registration.unregisterReferenceArea(uniqueId);
  }, [registration, uniqueId, yAxisId, y1, y2, axisLabelColor]);

  const patternId = `chart-reference-area-pattern-${uniqueId}`;
  const hMaskId = `chart-reference-area-fade-${uniqueId}`;
  const hGradientId = `${hMaskId}-gradient`;

  const rect = useMemo(
    () =>
      computeReferenceAreaRect({
        ifOverflow,
        innerHeight,
        innerWidth,
        x1,
        x2,
        xScale,
        y1,
        y2,
        yScale,
      }),
    [innerWidth, innerHeight, x1, x2, y1, y2, ifOverflow, xScale, yScale]
  );

  const usesPattern = pattern !== "none";
  const patternNode = useMemo(() => {
    if (!usesPattern) {
      return null;
    }
    return renderPatternPreset(pattern, patternId, {
      color: patternColor,
      complement: patternComplement,
      dotFill: patternDotFill,
      fill: patternFill,
      radius: patternRadius,
      scale: patternScale,
      strokeWidth: patternStrokeWidth,
      tileBackground: patternTileBackground,
    });
  }, [
    usesPattern,
    pattern,
    patternId,
    patternColor,
    patternScale,
    patternStrokeWidth,
    patternRadius,
    patternComplement,
    patternFill,
    patternDotFill,
    patternTileBackground,
  ]);

  const fadeEdge = clampFadeLength(fadeEdgesLength);
  const edgeMask = fadeEdges ? `url(#${hMaskId})` : undefined;
  const lineDash = strokeStyle === "dashed" ? strokeDasharray : undefined;

  if (!rect) {
    return null;
  }

  const { x, y, width, height } = rect;
  const topEdgeY = y;
  const bottomEdgeY = y + height;
  const centerX = x + width / 2;
  const visible = isReferenceAreaVisiblePhase(chartPhase);
  const fadeTransition =
    enterTransition && typeof enterTransition === "object"
      ? enterTransition
      : { duration: ENTER_FADE_MS / 1000, ease: "easeOut" as const };
  const areaFill = usesPattern && patternNode ? `url(#${patternId})` : fill;

  return (
    // biome-ignore lint/a11y/noAriaHiddenOnFocusable: decorative reference band
    <motion.g
      animate={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
      className={className ?? "chart-reference-area"}
      initial={{ opacity: 0 }}
      transition={fadeTransition}
    >
      {edgeMask ? (
        <defs>
          <linearGradient id={hGradientId} x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" style={{ stopColor: "white", stopOpacity: 0 }} />
            <stop
              offset={`${fadeEdge}%`}
              style={{ stopColor: "white", stopOpacity: 1 }}
            />
            <stop
              offset={`${100 - fadeEdge}%`}
              style={{ stopColor: "white", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "white", stopOpacity: 0 }}
            />
          </linearGradient>
          <mask id={hMaskId}>
            <rect
              fill={`url(#${hGradientId})`}
              height={innerHeight}
              width={innerWidth}
              x={0}
              y={0}
            />
          </mask>
        </defs>
      ) : null}
      {patternNode ? <defs>{patternNode}</defs> : null}
      <rect
        fill={areaFill}
        fillOpacity={fillOpacity}
        height={height}
        mask={edgeMask}
        width={width}
        x={x}
        y={y}
      />
      <g mask={edgeMask}>
        <line
          stroke={stroke}
          strokeDasharray={lineDash}
          strokeWidth={strokeWidth}
          x1={x}
          x2={x + width}
          y1={topEdgeY}
          y2={topEdgeY}
        />
        <line
          stroke={stroke}
          strokeDasharray={lineDash}
          strokeWidth={strokeWidth}
          x1={x}
          x2={x + width}
          y1={bottomEdgeY}
          y2={bottomEdgeY}
        />
      </g>
      {showMarkers ? (
        <>
          <path
            d={bracketMarkerPath(centerX, topEdgeY, markerSize, "down")}
            fill={markerColor}
          />
          <path
            d={bracketMarkerPath(centerX, bottomEdgeY, markerSize, "up")}
            fill={markerColor}
          />
        </>
      ) : null}
    </motion.g>
  );
}

ReferenceArea.displayName = "ReferenceArea";

export type ReferenceAreaIfOverflow = "hidden" | "visible" | "discard";

interface ReferenceAreaRect {
  height: number;
  width: number;
  x: number;
  y: number;
}

interface ComputeReferenceAreaRectOptions {
  ifOverflow?: ReferenceAreaIfOverflow;
  innerHeight: number;
  innerWidth: number;
  x1?: Date | number;
  x2?: Date | number;
  xScale: (value: Date) => number;
  y1?: number;
  y2?: number;
  yScale: (value: number) => number;
}

function toDate(value: Date | number): Date {
  return value instanceof Date ? value : new Date(value);
}

function resolveXPixel(
  xScale: (value: Date) => number,
  value: Date | number | undefined,
  fallback: number
): number {
  if (value == null) {
    return fallback;
  }
  return xScale(toDate(value));
}

function resolveYPixel(
  yScale: (value: number) => number,
  value: number | undefined,
  fallback: number
): number {
  if (value == null) {
    return fallback;
  }
  return yScale(value);
}

function clampRectToPlot(
  rect: ReferenceAreaRect,
  innerWidth: number,
  innerHeight: number
): ReferenceAreaRect | null {
  const x1 = Math.max(0, rect.x);
  const y1 = Math.max(0, rect.y);
  const x2 = Math.min(innerWidth, rect.x + rect.width);
  const y2 = Math.min(innerHeight, rect.y + rect.height);
  const width = x2 - x1;
  const height = y2 - y1;
  if (width <= 0 || height <= 0) {
    return null;
  }
  return { height, width, x: x1, y: y1 };
}

function isFullyInsidePlot(
  rect: ReferenceAreaRect,
  innerWidth: number,
  innerHeight: number
): boolean {
  return (
    rect.x >= 0 &&
    rect.y >= 0 &&
    rect.x + rect.width <= innerWidth &&
    rect.y + rect.height <= innerHeight
  );
}

/** Map data bounds to plot pixels for a reference rectangle. */
function computeReferenceAreaRect(
  options: ComputeReferenceAreaRectOptions
): ReferenceAreaRect | null {
  const {
    innerWidth,
    innerHeight,
    x1,
    x2,
    y1,
    y2,
    ifOverflow = "hidden",
    xScale,
    yScale,
  } = options;

  if (innerWidth <= 0 || innerHeight <= 0) {
    return null;
  }

  const left = resolveXPixel(xScale, x1, 0);
  const right = resolveXPixel(xScale, x2, innerWidth);
  const top = resolveYPixel(yScale, y1, 0);
  const bottom = resolveYPixel(yScale, y2, innerHeight);

  const x = Math.min(left, right);
  const y = Math.min(top, bottom);
  const width = Math.abs(right - left);
  const height = Math.abs(bottom - top);

  if (width <= 0 || height <= 0) {
    return null;
  }

  const rect: ReferenceAreaRect = { height, width, x, y };

  if (ifOverflow === "visible") {
    return rect;
  }

  if (ifOverflow === "discard") {
    return isFullyInsidePlot(rect, innerWidth, innerHeight) ? rect : null;
  }

  return clampRectToPlot(rect, innerWidth, innerHeight);
}

/** Inclusive data range for axis label highlighting. */
export function resolveReferenceDataRange(
  y1: number | undefined,
  y2: number | undefined,
  domain: [number, number]
): [number, number] {
  const dMin = Math.min(domain[0], domain[1]);
  const dMax = Math.max(domain[0], domain[1]);
  const low = y1 ?? dMin;
  const high = y2 ?? dMax;
  return [Math.min(low, high), Math.max(low, high)];
}
