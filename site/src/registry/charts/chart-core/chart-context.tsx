"use client";

import type { ScaleBand, ScaleLinear, ScaleTime } from "d3-scale";
import type { Transition } from "motion/react";
import type { ChartPhase, ChartStatus } from "./chart-phase";
import type { ReferenceAreaConfig } from "./reference-area-config";
import type { ChartSelection } from "./use-chart-interaction";
import type { YDomain } from "./y-domain-utils";

import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useEffect,
  useState,
} from "react";

import { createSplitContext } from "../chart-utils/split-context";
import { DEFAULT_Y_AXIS_ID } from "./y-axis-scales";

// CSS variable references for theming
export const chartCssVars = {
  background: "var(--color-background)",
  badgeBackground: "var(--color-foreground)",
  badgeForeground: "var(--color-background)",
  brushBorder: "color-mix(in oklab, var(--color-foreground) 10%, transparent)",
  crosshair: "var(--color-foreground)",
  foreground: "var(--color-foreground)",
  foregroundMuted: "var(--color-foreground-muted)",
  grid: "color-mix(in oklab, var(--color-foreground) 10%, transparent)",
  indicatorColor: "var(--color-foreground)",
  label: "var(--color-foreground-muted)",
  linePrimary: "var(--color-chart-1)",
  lineSecondary: "var(--color-chart-2)",
  markerBackground: "var(--color-background-muted)",
  markerBorder: "color-mix(in oklab, var(--color-foreground) 10%, transparent)",
  markerForeground: "var(--color-foreground)",
  segmentBackground:
    "color-mix(in oklab, var(--color-foreground-muted) 10%, transparent)",
  segmentLine: "color-mix(in oklab, var(--color-foreground) 30%, transparent)",
  tooltipBackground: "var(--color-background)",
};

/** Default scatter series colors from the chart palette (`--color-chart-1` … `--color-chart-5`). */
export const defaultScatterColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
] as const;

export interface Margin {
  bottom: number;
  left: number;
  right: number;
  top: number;
}

export interface TooltipData {
  /**
   * Series whose point is hovered when hover snaps to the nearest point
   * (`ScatterChart` with `jitter`). The tooltip dot and panel follow this
   * point.
   */
  activeDataKey?: string;
  /** Index in the data array */
  index: number;
  /** The data point being hovered */
  point: Record<string, unknown>;
  /** X position in pixels (relative to chart area) */
  x: number;
  /** X positions for each series (for grouped bars), keyed by dataKey */
  xPositions?: Record<string, number>;
  /** Y positions for each line, keyed by dataKey */
  yPositions: Record<string, number>;
}

export interface LineConfig {
  dataKey: string;
  stroke: string;
  strokeWidth: number;
  /** Scale group id (Recharts `yAxisId`). @default "left" */
  yAxisId?: string | number;
}

/** Y-domain and tooltip inputs collected from a `<Band>` child. */
export interface BandConfig {
  /** Tooltip swatch / edge-dot colour (the band's `fill`). */
  color: string;
  /** Tooltip row label. */
  label: string;
  lowerKey: string;
  /** Whether the band adds a range row and edge dots to `ChartTooltip`. */
  showInTooltip: boolean;
  upperKey: string;
  yAxisId: string;
}

/**
 * Hover/selection state — every field here changes on mouse movement.
 * Lives in its own context so cold consumers (Grid, YAxis, PatternArea, …)
 * can subscribe to the stable slice and skip re-rendering on every hover.
 */
export interface ChartHoverContextValue {
  /** Clear the current selection */
  clearSelection?: () => void;

  // Bar chart hover (optional - only present in BarChart)
  /** Index of currently hovered bar */
  hoveredBarIndex?: number | null;

  // Candlestick hover (optional - only present in CandlestickChart)
  /** Index of currently hovered candle */
  hoveredCandleIndex?: number | null;

  // Selection state (optional - only present when useChartInteraction is used)
  /** Current drag/pinch selection range */
  selection?: ChartSelection | null;
  /** Setter for hovered bar index */
  setHoveredBarIndex?: (index: number | null) => void;
  /** Setter for hovered candle index */
  setHoveredCandleIndex?: (index: number | null) => void;
  /** Setter for tooltip data */
  setTooltipData: Dispatch<SetStateAction<TooltipData | null>>;
  // Tooltip state
  /** Current tooltip data including position */
  tooltipData: TooltipData | null;
}

export interface ChartContextValue extends ChartHoverContextValue {
  /** Animation duration in milliseconds */
  animationDuration: number;
  /** CSS easing for clip-reveal / line draw (cartesian charts). */
  animationEasing?: string;

  /** `<Band>` configs (time-series charts) — tooltip range rows and edge dots. */
  bands?: BandConfig[];
  /** Width of each bar band */
  bandWidth?: number;

  // Bar chart specific (optional - only present in BarChart)
  /** Band scale for categorical x-axis (bar charts) */
  barScale?: ScaleBand<string>;
  /** X accessor for bar charts (returns string instead of Date) */
  barXAccessor?: (d: Record<string, unknown>) => string;

  // Loading / lifecycle (LineChart status transitions)
  chartPhase: ChartPhase;
  chartStatus: ChartStatus;

  // Column width for spacing calculations
  /** Width of a single data column */
  columnWidth: number;

  // ComposedChart + SeriesBar (optional)
  /** `SeriesBar` dataKeys in tree order, for grouped columns at each x */
  composedBarDataKeys?: string[];
  /** Gap between grouped `SeriesBar` columns in px. */
  composedBarGap?: number;
  /** Target bar width in px (Recharts `barSize` style). */
  composedBarSize?: number;
  /** Max bar width in px (Recharts `maxBarSize`). */
  composedMaxBarSize?: number;
  /** When true, `SeriesBar` segments stack in child order at each x. */
  composedStacked?: boolean;
  /** Vertical gap in px between stacked `SeriesBar` segments. @default 0 */
  composedStackGap?: number;
  /** Per-row cumulative offsets for stacked `SeriesBar` (data index → dataKey → offset). */
  composedStackOffsets?: Map<number, Map<string, number>>;

  // Container ref for portals
  /** Ref to the chart container (for portals) */
  containerRef: RefObject<HTMLDivElement | null>;
  // Data
  /** The chart's data array */
  data: Record<string, unknown>[];

  // Pre-computed date labels for ticker animation
  /** Pre-computed date labels for the ticker */
  dateLabels: string[];
  /** Motion enter transition (spring or tween) — drives clip reveal when spring. */
  enterTransition?: Transition;
  /** Total chart height in pixels */
  height: number;
  /** Chart area height (excluding margins) */
  innerHeight: number;
  /** Chart area width (excluding margins) */
  innerWidth: number;

  // Animation state
  /** Whether the chart has finished its initial animation */
  isLoaded: boolean;

  // Line configurations (extracted from children)
  /** Registered line/bar configurations */
  lines: LineConfig[];
  /** Centered label while `chartPhase` shows loading chrome. */
  loadingLabel?: string;
  /** Chart margins `{ top, right, bottom, left }` */
  margin: Margin;

  /**
   * Hover resolves to the nearest point in 2D rather than the nearest x column
   * (e.g. `ScatterChart` with `jitter`). `ChartTooltip` hides its crosshair
   * line by default when set, since the line would not mark a single x value.
   */
  nearestPointHover?: boolean;
  /** Fired when a one-shot loading pulse (exit / enter) completes. */
  notifyLoadingPulseComplete?: () => void;
  /** Bar chart orientation */
  orientation?: "vertical" | "horizontal";

  /** {@link ReferenceArea} bands — drives y-axis label colors in range. */
  referenceAreas: ReferenceAreaConfig[];
  /** Decimated subset for SVG path rendering; equals `data` when no decimation is needed. */
  renderData: Record<string, unknown>[];
  /** Increments when enter animation should replay. */
  revealEpoch?: number;
  /** Squares variant — snap tooltip to top square and size ring dots. */
  squareSnap?: { squareGap: number; groupGap?: number; fit?: boolean };
  /** Whether bars are stacked */
  stacked?: boolean;
  /** Stack offsets: Map of data index -> Map of dataKey -> cumulative offset */
  stackOffsets?: Map<number, Map<string, number>>;

  // Dimensions
  /** Total chart width in pixels */
  width: number;

  // X accessor - how to get the x value from data points
  /** Function to get the Date from a data point */
  xAccessor: (d: Record<string, unknown>) => Date;

  /** Active brush zoom range — when set, axis ticks align to visible data rows. */
  xDomain?: [Date, Date];
  /** Full dataset length when brush zoom is enabled (for zoom vs full-range detection). */
  xDomainSlotCount?: number;

  // Scales
  /** Time scale for x-axis (line/area charts) */
  xScale: ScaleTime<number, number>;
  /** Nice’d y-domains per axis from skeleton data (placeholder). */
  yDomainSkeletonByAxis: Record<string, YDomain>;
  /** Nice’d y-domains per axis from the current target data. */
  yDomainTargetByAxis: Record<string, YDomain>;
  /** Y-domain tween duration when transitioning loading ↔ ready (ms). */
  yDomainTweenDuration: number;
  /** Primary (left) y-scale — alias for `yScales[DEFAULT_Y_AXIS_ID]`. */
  yScale: ScaleLinear<number, number>;
  /** Per-axis y-scales keyed by `yAxisId`. */
  yScales: Record<string, ScaleLinear<number, number>>;
}

/**
 * Stable slice of the chart context — everything that doesn't change on hover
 * (data, scales, dimensions, animation state, layout config). Consumers that
 * subscribe via `useChartStable()` skip re-renders on every mouse move.
 */
export type ChartStableContextValue = Omit<
  ChartContextValue,
  keyof ChartHoverContextValue
>;

const {
  Provider: ChartProvider,
  useHover: useChartHover,
  useStable: useChartStable,
} = createSplitContext<ChartStableContextValue, ChartHoverContextValue>({
  hoverKeys: {
    clearSelection: true,
    hoveredBarIndex: true,
    hoveredCandleIndex: true,
    selection: true,
    setHoveredBarIndex: true,
    setHoveredCandleIndex: true,
    setTooltipData: true,
    tooltipData: true,
  },
  name: "Chart",
  wrappers: "<LineChart>, <AreaChart>, <BarChart>, or <ComposedChart>",
});

/**
 * `ChartProvider` publishes the stable slice (data, scales, dimensions,
 * animation state, layout config) and the hover slice (tooltip, selection,
 * hovered bar / candle) to separate contexts. Prefer `useChartStable()` in
 * cold consumers like axes, grid and pattern fills; they skip re-renders on
 * hover. `useChartHover()` subscribers re-render on every mouse move.
 */
export { ChartProvider, useChartHover, useChartStable };

/**
 * Resolves a chart container element to use as a `createPortal` target.
 *
 * The element is captured from the ref in an effect (after mount) and kept in
 * state, so nothing reads `ref.current` during render (React Compiler
 * `react-hooks/refs`). Costs the same single post-mount render as the previous
 * `mounted` flag pattern and returns `null` during SSR / the first render.
 */
export function useChartPortalContainer<T extends HTMLElement>(
  containerRef: RefObject<T | null> | undefined
): T | null {
  const [container, setContainer] = useState<T | null>(null);
  useEffect(() => {
    setContainer(containerRef?.current ?? null);
  }, [containerRef]);
  return container;
}

/** Y-scale for a series axis (`yAxisId` on Line / Area / YAxis). */
export function useYScale(
  yAxisId?: string | number
): ScaleLinear<number, number> {
  const { yScales, yScale } = useChartStable();
  const id =
    yAxisId == null || yAxisId === "" ? DEFAULT_Y_AXIS_ID : String(yAxisId);
  return yScales[id] ?? yScale;
}

/**
 * Merged stable + hover context. Convenient for components that need both,
 * but re-renders on every hover (because hover changes). Prefer
 * `useChartStable()` or `useChartHover()` for hot consumers that only need
 * one slice.
 */
export function useChart(): ChartContextValue {
  const stable = useChartStable();
  const hover = useChartHover();
  // Identity changes on every hover (hover is the volatile slice) — that's
  // fine for consumers using this merged hook; they explicitly opted in to
  // re-rendering on hover.
  return { ...stable, ...hover };
}
