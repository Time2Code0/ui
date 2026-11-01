"use client";

import { useEffect, useId } from "react";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

import {
  chartCssVars,
  useChartStable,
  useYScale,
} from "../chart-core/chart-context";
import {
  LINE_LOADING_LOOP_PAUSE_MS,
  LINE_LOADING_PULSE_CYCLE_S,
  LINE_LOADING_PULSE_EASE,
} from "../chart-core/chart-phase";
import {
  isLoadingChromePhase,
  isLoadingGridChromePhase,
} from "../chart-core/y-domain-utils";

const DEFAULT_SHIMMER_LENGTH_PX = 140;
const DEFAULT_SHIMMER_SPEED = 1;
const DEFAULT_SHIMMER_STROKE =
  "color-mix(in oklch, var(--color-foreground) 68%, transparent)";

export interface GridProps {
  /** Enable horizontal fade effect on grid rows (fades at left/right). @default true */
  fadeHorizontal?: boolean;
  /** Enable vertical fade effect on grid columns (fades at top/bottom). @default false */
  fadeVertical?: boolean;
  /** Omit the first and last horizontal grid lines. @default false */
  hideHorizontalEdgeLines?: boolean;
  /** Omit the first and last vertical grid lines. @default false */
  hideVerticalEdgeLines?: boolean;
  /** Stroke for highlighted rows. @default var(--color-foreground-muted) */
  highlightRowStroke?: string;
  /** Dash array for highlighted rows. @default "0" */
  highlightRowStrokeDasharray?: string;
  /** Stroke opacity for highlighted rows. @default 1 */
  highlightRowStrokeOpacity?: number;
  /** Stroke width for highlighted rows. @default 1 */
  highlightRowStrokeWidth?: number;
  /** Horizontal row values rendered with alternate styling (e.g. zero baseline). */
  highlightRowValues?: number[];
  /** Show horizontal grid lines. @default true */
  horizontal?: boolean;
  /** Grid stroke while loading chrome is active. Falls back to `stroke`. */
  loadingStroke?: string;
  /** Number of vertical grid lines. @default 10 */
  numTicksColumns?: number;
  /** Number of horizontal grid lines. @default 5 */
  numTicksRows?: number;
  /** Explicit tick values for horizontal grid lines. Overrides numTicksRows. */
  rowTickValues?: number[];
  /** Animate a shimmer band across horizontal grid lines. @default false */
  shimmer?: boolean;
  /** Shimmer band width in pixels. @default 140 */
  shimmerLength?: number;
  /** Shimmer speed multiplier (higher = faster). @default 1 */
  shimmerSpeed?: number;
  /**
   * Shimmer band stroke (color and opacity via color-mix or oklch alpha).
   * @default color-mix(in oklch, var(--color-foreground) 68%, transparent)
   */
  shimmerStroke?: string;
  /**
   * Match loop timing to the loading line pulse (cycle + inter-loop pause).
   * @default false
   */
  shimmerSync?: boolean;
  /** Grid line stroke color. @default color-mix(in oklab, var(--color-foreground) 10%, transparent) */
  stroke?: string;
  /** Grid line dash array. @default "4,4" */
  strokeDasharray?: string;
  /** Grid line stroke opacity. @default 1 */
  strokeOpacity?: number;
  /** Grid line stroke width. @default 1 */
  strokeWidth?: number;
  /** Show vertical grid lines. @default false */
  vertical?: boolean;
  /** Y-scale for horizontal grid lines. @default "left" */
  yAxisId?: string | number;
}

/**
 * Pixel position of each grid line: `scale(tick)` for `ticks`, without the
 * first and last when `hideEdgeLines`. Falls back to `defaultTicks` when
 * nothing is left.
 */
function gridLinePositions<T>(
  scale: (tick: T) => number | undefined,
  ticks: T[],
  defaultTicks: () => T[],
  hideEdgeLines: boolean
): number[] {
  const visible =
    hideEdgeLines && ticks.length > 2 ? ticks.slice(1, -1) : ticks;
  return (visible.length > 0 ? visible : defaultTicks()).map(
    (tick) => scale(tick) ?? 0
  );
}

export function Grid({
  horizontal = true,
  vertical = false,
  numTicksRows = 5,
  numTicksColumns = 10,
  rowTickValues,
  stroke = chartCssVars.grid,
  loadingStroke,
  strokeOpacity = 1,
  strokeWidth = 1,
  strokeDasharray = "4,4",
  highlightRowValues,
  highlightRowStroke = chartCssVars.foregroundMuted,
  highlightRowStrokeOpacity = 1,
  highlightRowStrokeWidth = 1,
  highlightRowStrokeDasharray = "0",
  fadeHorizontal = true,
  fadeVertical = false,
  hideHorizontalEdgeLines = false,
  hideVerticalEdgeLines = false,
  yAxisId,
  shimmer = false,
  shimmerStroke = DEFAULT_SHIMMER_STROKE,
  shimmerLength = DEFAULT_SHIMMER_LENGTH_PX,
  shimmerSpeed = DEFAULT_SHIMMER_SPEED,
  shimmerSync = false,
}: GridProps) {
  const { xScale, innerWidth, innerHeight, orientation, barScale, chartPhase } =
    useChartStable();
  const yScale = useYScale(yAxisId);
  const shimmerActive = shimmer && isLoadingChromePhase(chartPhase);
  const gridStroke =
    isLoadingGridChromePhase(chartPhase) && loadingStroke != null
      ? loadingStroke
      : stroke;
  const { shimmerEnabled, shimmerTransform } = useGridShimmer({
    active: shimmerActive,
    innerWidth,
    shimmer,
    shimmerLength,
    shimmerSpeed,
    shimmerSync,
  });

  // For bar charts, determine which scale to use for grid lines
  // Horizontal bar charts: vertical grid should use yScale (value scale)
  // Vertical bar charts: horizontal grid uses yScale (value scale)
  const isHorizontalBarChart = orientation === "horizontal" && barScale;

  // For vertical grid lines in horizontal bar charts, use yScale (the value scale)
  // For time-based charts, use xScale
  const columnScale = isHorizontalBarChart ? yScale : xScale;
  const rowPositions = gridLinePositions(
    yScale,
    rowTickValues ?? yScale.ticks(numTicksRows),
    () => yScale.ticks(numTicksRows),
    hideHorizontalEdgeLines
  );
  // Bar charts publish a plain-object stand-in for `xScale`; no columns then.
  const hasColumnScale = typeof columnScale === "function";
  const columnPositions = hasColumnScale
    ? gridLinePositions<number | Date>(
        columnScale,
        columnScale.ticks(numTicksColumns),
        () => columnScale.ticks(numTicksColumns),
        hideVerticalEdgeLines
      )
    : [];
  const uniqueId = useId();

  // Horizontal fade mask (for grid rows - fades left/right)
  const hMaskId = `grid-rows-fade-${uniqueId}`;
  const hGradientId = `${hMaskId}-gradient`;
  const shimmerGradientId = `grid-shimmer-${uniqueId}`;

  // Vertical fade mask (for grid columns - fades top/bottom)
  const vMaskId = `grid-cols-fade-${uniqueId}`;
  const vGradientId = `${vMaskId}-gradient`;
  const horizontalFadeMask = fadeHorizontal ? `url(#${hMaskId})` : undefined;

  return (
    <g className="chart-grid">
      {/* Gradient mask for horizontal grid lines - fades at left/right */}
      {horizontal && fadeHorizontal && (
        <defs>
          <linearGradient id={hGradientId} x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" style={{ stopColor: "white", stopOpacity: 0 }} />
            <stop offset="10%" style={{ stopColor: "white", stopOpacity: 1 }} />
            <stop offset="90%" style={{ stopColor: "white", stopOpacity: 1 }} />
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
              x="0"
              y="0"
            />
          </mask>
        </defs>
      )}

      {horizontal && shimmerEnabled ? (
        <defs>
          <motion.linearGradient
            gradientTransform={shimmerTransform}
            gradientUnits="userSpaceOnUse"
            id={shimmerGradientId}
            x1={0}
            x2={shimmerLength}
            y1={0}
            y2={0}
          >
            <stop offset="0%" stopColor={shimmerStroke} stopOpacity={0} />
            <stop offset="35%" stopColor={shimmerStroke} stopOpacity={0.45} />
            <stop offset="50%" stopColor={shimmerStroke} stopOpacity={1} />
            <stop offset="65%" stopColor={shimmerStroke} stopOpacity={0.45} />
            <stop offset="100%" stopColor={shimmerStroke} stopOpacity={0} />
          </motion.linearGradient>
        </defs>
      ) : null}

      {/* Gradient mask for vertical grid lines - fades at top/bottom */}
      {vertical && fadeVertical && (
        <defs>
          <linearGradient id={vGradientId} x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "white", stopOpacity: 0 }} />
            <stop offset="10%" style={{ stopColor: "white", stopOpacity: 1 }} />
            <stop offset="90%" style={{ stopColor: "white", stopOpacity: 1 }} />
            <stop
              offset="100%"
              style={{ stopColor: "white", stopOpacity: 0 }}
            />
          </linearGradient>
          <mask id={vMaskId}>
            <rect
              fill={`url(#${vGradientId})`}
              height={innerHeight}
              width={innerWidth}
              x="0"
              y="0"
            />
          </mask>
        </defs>
      )}

      {horizontal && (
        <g mask={horizontalFadeMask}>
          <GridLines
            length={innerWidth}
            orientation="horizontal"
            positions={rowPositions}
            stroke={gridStroke}
            strokeDasharray={strokeDasharray}
            strokeOpacity={strokeOpacity}
            strokeWidth={strokeWidth}
          />
          {shimmerEnabled ? (
            <GridLines
              length={innerWidth}
              orientation="horizontal"
              positions={rowPositions}
              stroke={`url(#${shimmerGradientId})`}
              strokeDasharray={strokeDasharray}
              strokeOpacity={1}
              strokeWidth={strokeWidth}
            />
          ) : null}
        </g>
      )}
      {horizontal && highlightRowValues && highlightRowValues.length > 0 ? (
        <g className="chart-grid-highlight-rows">
          {highlightRowValues.map((value) => {
            const y = yScale(value);
            if (y == null || !Number.isFinite(y)) {
              return null;
            }

            return (
              <line
                key={value}
                stroke={highlightRowStroke}
                strokeDasharray={highlightRowStrokeDasharray}
                strokeOpacity={highlightRowStrokeOpacity}
                strokeWidth={highlightRowStrokeWidth}
                x1={0}
                x2={innerWidth}
                y1={y}
                y2={y}
              />
            );
          })}
        </g>
      ) : null}
      {vertical && hasColumnScale ? (
        <g mask={fadeVertical ? `url(#${vMaskId})` : undefined}>
          <GridLines
            length={innerHeight}
            orientation="vertical"
            positions={columnPositions}
            stroke={stroke}
            strokeDasharray={strokeDasharray}
            strokeOpacity={strokeOpacity}
            strokeWidth={strokeWidth}
          />
        </g>
      ) : null}
    </g>
  );
}

Grid.displayName = "Grid";

function GridLines({
  length,
  orientation,
  positions,
  ...lineProps
}: {
  length: number;
  orientation: "horizontal" | "vertical";
  positions: number[];
  stroke: string;
  strokeDasharray: string;
  strokeOpacity: number;
  strokeWidth: number;
}) {
  const horizontal = orientation === "horizontal";
  return (
    <g>
      {positions.map((position, index) => (
        <line
          // biome-ignore lint/suspicious/noArrayIndexKey: positions follow tick order
          key={index}
          shapeRendering="crispEdges"
          x1={horizontal ? 0 : position}
          x2={horizontal ? length : position}
          y1={horizontal ? position : 0}
          y2={horizontal ? position : length}
          {...lineProps}
        />
      ))}
    </g>
  );
}

interface UseGridShimmerOptions {
  /** When false, shimmer animation is paused (e.g. during exit transition). */
  active: boolean;
  innerWidth: number;
  /** Run a single synced sweep (loading → ready handoff). */
  oneShot?: boolean;
  shimmer: boolean;
  shimmerLength: number;
  shimmerSpeed: number;
  shimmerSync: boolean;
}

function useGridShimmer({
  innerWidth,
  shimmer,
  shimmerLength,
  shimmerSpeed,
  shimmerSync,
  active,
  oneShot = false,
}: UseGridShimmerOptions) {
  const progress = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const shimmerCycleS =
    LINE_LOADING_PULSE_CYCLE_S / Math.max(shimmerSpeed, 0.1);
  const shimmerEnabled =
    active && shimmer && reducedMotion !== true && innerWidth > 0;

  useEffect(() => {
    if (!shimmerEnabled) {
      return;
    }

    let cancelled = false;
    let timeoutId: number | undefined;
    let controls: ReturnType<typeof animate> | undefined;

    const runSyncedCycle = () => {
      if (cancelled) {
        return;
      }

      progress.set(0);
      controls = animate(progress, 1, {
        duration: shimmerCycleS,
        ease: [...LINE_LOADING_PULSE_EASE],
        onComplete: () => {
          if (cancelled) {
            return;
          }
          timeoutId = window.setTimeout(
            runSyncedCycle,
            LINE_LOADING_LOOP_PAUSE_MS
          );
        },
      });
    };

    if (shimmerSync && oneShot) {
      progress.set(0);
      controls = animate(progress, 1, {
        duration: shimmerCycleS / 2,
        ease: [...LINE_LOADING_PULSE_EASE],
      });
      return () => controls?.stop();
    }

    if (shimmerSync) {
      runSyncedCycle();
      return () => {
        cancelled = true;
        controls?.stop();
        if (timeoutId !== undefined) {
          window.clearTimeout(timeoutId);
        }
      };
    }

    progress.set(0);
    controls = animate(progress, 1, {
      duration: shimmerCycleS,
      ease: [...LINE_LOADING_PULSE_EASE],
      repeat: Number.POSITIVE_INFINITY,
    });

    return () => controls?.stop();
  }, [oneShot, progress, shimmerCycleS, shimmerEnabled, shimmerSync]);

  const shimmerX = useTransform(
    progress,
    (value) => -shimmerLength + value * (innerWidth + shimmerLength * 2)
  );
  const shimmerTransform = useTransform(shimmerX, (x) => `translate(${x}, 0)`);

  return { shimmerEnabled, shimmerTransform };
}
