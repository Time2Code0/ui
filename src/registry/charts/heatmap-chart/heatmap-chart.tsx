"use client";

import type { Transition } from "motion/react";
import type { Margin } from "../chart-core/chart-context";
import type { HeatmapLevelColors } from "./heatmap-colors";

import {
  Fragment,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useParentSize } from "@visx/responsive";
import { scaleLinear, scaleTime } from "@visx/scale";
import { cn } from "cn";
import { useReducedMotion } from "motion/react";

import {
  type ChartPhase,
  type ChartStatus,
  DEFAULT_CHART_STATUS,
  resolveRestingChartPhase,
} from "../chart-core/chart-phase";
import { ChartLoadingLabel } from "../chart-loading/chart-loading-label";
import { renderPatternPreset } from "../chart-patterns/pattern-preset";
import {
  HEATMAP_DEFAULT_ENTER_DURATION_MS,
  HEATMAP_DEFAULT_ENTER_TRANSITION,
  HEATMAP_DEFAULT_LOADING_CELL_MAX_OPACITY,
  HEATMAP_DEFAULT_LOADING_CELL_RANDOMNESS,
  HEATMAP_LOADING_CHART_OPACITY,
  HEATMAP_LOADING_CONCEAL_MS,
} from "./heatmap-animation";
import {
  buildHeatmapColorScaleFromStyles,
  buildHeatmapFillScale,
  type HeatmapLevelStyles,
  heatmapLevelPatternId,
  heatmapLevelPatternRenderOptions,
  isHeatmapLevelPattern,
  resolveHeatmapLevelStyles,
} from "./heatmap-colors";
import {
  type HeatmapColumn,
  type HeatmapContextValue,
  HeatmapInteractionRoot,
  HeatmapProvider,
  type HeatmapRevealMode,
  useHeatmap,
  useHeatmapInteraction,
} from "./heatmap-context";
import { resolveHeatmapSeparatorConfigWithData } from "./heatmap-separator";
import {
  filterHeatmapColumns,
  getHeatmapColumnXOffset,
  getHeatmapPlotInnerWidth,
  getHeatmapSeparatorCount,
  getHeatmapTimeExtent,
  type HeatmapSeparatorLayout,
  type HeatmapSeparatorParsedConfig,
  type HeatmapWeekStartDay,
  rotateHeatmapColumnBins,
} from "./heatmap-utils";

export type HeatmapLayout = "fluid" | "fill";

export interface HeatmapChartProps {
  /** Play enter fade-in / loading shimmer animations. @default true */
  animate?: boolean;
  /** Enter animation duration in milliseconds. @default 1600 */
  animationDuration?: number;
  /** Optional outer aspect ratio (e.g. "2 / 1"). Omit to fill the parent. */
  aspectRatio?: string;
  /** Fixed cell size in pixels. When 0, cells are square and sized to fit the plot. @default 0 */
  binSize?: number;
  /** Child components (HeatmapCells, HeatmapXAxis, HeatmapYAxis) */
  children: ReactNode;
  /** Additional class name for the container */
  className?: string;
  /** Override the default color scale. */
  colorScale?: (count: number | null | undefined) => string;
  /**
   * Inserts horizontal gaps between column groups. Overridden when a
   * {@link HeatmapSeparator} child sets `every` / `spacing`.
   */
  columnSeparators?: HeatmapSeparatorParsedConfig;
  /** Column data — one entry per week (or category) with row bins inside. */
  data: HeatmapColumn[];
  /** Scales wave stagger delays (1 = default). */
  enterStaggerScale?: number;
  /** Motion enter transition (spring or cubic-bezier tween). */
  enterTransition?: Transition;
  /** Gap between cells in pixels. @default 2 */
  gap?: number;
  /**
   * `fluid` — width drives square cells; chart height hugs the grid (GitHub-style).
   * `fill` — expands cells to fill the parent.
   * @default "fluid"
   */
  layout?: HeatmapLayout;
  /** Per-level colors for the Less → More scale (5 entries). */
  levelColors?: HeatmapLevelColors;
  /** Per-level fill styles (color and optional pattern). Takes precedence over `levelColors`. */
  levelStyles?: HeatmapLevelStyles;
  /** Max opacity loading cells animate toward (0–1). @default 0.5 */
  loadingCellMaxOpacity?: number;
  /** Share of cells that participate in loading shimmer (0–1). @default 0.65 */
  loadingCellRandomness?: number;
  /** Centered label while loading. */
  loadingLabel?: string;
  /** Chart opacity while loading. @default 0.5 */
  loadingOpacity?: number;
  /** Chart margins @default { top: 28, right: 16, bottom: 0, left: 40 } */
  margin?: Partial<Margin>;
  /** Signature of motion URL state — triggers enter replay when it changes. @internal */
  revealSignature?: string;
  /** Show loading cell shimmer while loading. @default true */
  showLoadingCells?: boolean;
  /**
   * Week columns used for cell sizing when `xDomain` is set. Keeps bin height
   * stable while scrubbing (filtered columns can vary by ±1 at boundaries).
   */
  sizingColumnCount?: number;
  /** Fetch / display status. @default "ready" */
  status?: ChartStatus;
  /**
   * First row of the grid — `0` = Sunday (GitHub default), `1` = Monday, etc.
   * Rotates column bins for display without reshaping source data.
   * @default 0
   */
  weekStartDay?: HeatmapWeekStartDay;
  /** Visible time range — filters week columns that overlap the domain. */
  xDomain?: [Date, Date];
}

const DEFAULT_MARGIN: Margin = { bottom: 0, left: 40, right: 16, top: 28 };

function computeHeatmapDimensions({
  width,
  parentHeight,
  margin,
  columnCount,
  rowCount,
  binSize,
  layout,
  separator,
}: {
  width: number;
  parentHeight: number;
  margin: Margin;
  columnCount: number;
  rowCount: number;
  binSize: number;
  layout: HeatmapLayout;
  separator: Pick<HeatmapSeparatorLayout, "spacing" | "atColumns"> | null;
}) {
  const innerWidth = Math.max(width - margin.left - margin.right, 0);
  const availableHeight = Math.max(
    parentHeight - margin.top - margin.bottom,
    0
  );
  const separatorCount = separator ? getHeatmapSeparatorCount(separator) : 0;
  const totalSpacing = separatorCount * (separator?.spacing ?? 0);

  let binWidth: number;
  let binHeight: number;

  if (binSize > 0) {
    binWidth = binSize;
    binHeight = binSize;
  } else if (layout === "fluid") {
    const cellSize = Math.max((innerWidth - totalSpacing) / columnCount, 0);
    binWidth = cellSize;
    binHeight = cellSize;
  } else {
    const cellSize = Math.min(
      Math.max((innerWidth - totalSpacing) / columnCount, 0),
      availableHeight / rowCount
    );
    binWidth = cellSize;
    binHeight = cellSize;
  }

  const plotInnerWidth = getHeatmapPlotInnerWidth(
    columnCount,
    binWidth,
    separator
  );
  const innerHeight = rowCount * binHeight;
  const height =
    layout === "fluid"
      ? margin.top + innerHeight + margin.bottom
      : Math.max(parentHeight, margin.top + innerHeight + margin.bottom);
  const chartWidth =
    binSize > 0 && layout === "fluid"
      ? margin.left + plotInnerWidth + margin.right
      : width;

  return {
    binHeight,
    binWidth,
    height,
    innerHeight,
    innerWidth: plotInnerWidth,
    width: chartWidth,
  };
}

interface HeatmapChartInnerProps {
  animateCells: boolean;
  animationDuration: number;
  binSize: number;
  chartPhase: ChartPhase;
  chartStatus: ChartStatus;
  children: ReactNode;
  colorScale: (count: number | null | undefined) => string;
  columnSeparators?: HeatmapSeparatorParsedConfig;
  data: HeatmapColumn[];
  enterStaggerScale: number;
  enterTransition?: Transition;
  fillScale: (count: number | null | undefined) => string;
  gap: number;
  height: number;
  isLoaded: boolean;
  layout: HeatmapLayout;
  levelStyles: HeatmapLevelStyles;
  loadingCellMaxOpacity: number;
  loadingCellRandomness: number;
  loadingLabel?: string;
  loadingOpacity: number;
  margin: Margin;
  revealEpoch: number;
  revealMode: HeatmapRevealMode;
  showLoadingCells: boolean;
  showLoadingLabel: boolean;
  sizingColumnCount?: number;
  weekStartDay: HeatmapWeekStartDay;
  width: number;
  xDomain?: [Date, Date];
}

function HeatmapChartInner({
  width,
  height: parentHeight,
  data,
  xDomain,
  sizingColumnCount: sizingColumnCountProp,
  margin,
  binSize,
  gap,
  layout,
  colorScale,
  fillScale,
  levelStyles,
  chartStatus,
  chartPhase,
  isLoaded,
  revealEpoch,
  animationDuration,
  enterTransition,
  enterStaggerScale,
  animateCells,
  loadingOpacity,
  showLoadingCells,
  loadingCellMaxOpacity,
  loadingCellRandomness,
  revealMode,
  loadingLabel,
  showLoadingLabel,
  columnSeparators,
  weekStartDay,
  children,
}: HeatmapChartInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredData = useMemo(
    () => filterHeatmapColumns(data, xDomain),
    [data, xDomain]
  );

  const visibleData = useMemo(
    () => rotateHeatmapColumnBins(filteredData, weekStartDay),
    [filteredData, weekStartDay]
  );

  const visibleColumnCount = Math.max(visibleData.length, 1);
  const columnCount =
    xDomain && sizingColumnCountProp != null
      ? Math.max(sizingColumnCountProp, 1)
      : visibleColumnCount;
  const rowCount = Math.max(visibleData[0]?.bins.length ?? 7, 1);

  const separatorLayout = useMemo(
    () =>
      resolveHeatmapSeparatorConfigWithData(
        children,
        visibleData,
        columnSeparators
      ),
    [children, columnSeparators, visibleData]
  );

  const {
    binWidth,
    binHeight,
    innerWidth,
    innerHeight,
    height,
    width: chartWidth,
  } = useMemo(
    () =>
      computeHeatmapDimensions({
        binSize,
        columnCount,
        layout,
        margin,
        parentHeight,
        rowCount,
        separator: separatorLayout,
        width,
      }),
    [
      binSize,
      columnCount,
      layout,
      margin,
      parentHeight,
      rowCount,
      separatorLayout,
      width,
    ]
  );

  const xScale = useMemo(
    () => (columnIndex: number) =>
      columnIndex * binWidth +
      getHeatmapColumnXOffset(columnIndex, separatorLayout),
    [binWidth, separatorLayout]
  );
  const yScale = useMemo(
    () => (rowIndex: number) => rowIndex * binHeight,
    [binHeight]
  );

  const timeExtent = useMemo(() => getHeatmapTimeExtent(data), [data]);

  const timeXScale = useMemo(() => {
    const domain = timeExtent ?? [new Date(), new Date()];
    return scaleTime({
      domain,
      range: [0, innerWidth],
    });
  }, [innerWidth, timeExtent]);

  const brushYScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, 1],
        range: [innerHeight, 0],
      }),
    [innerHeight]
  );

  const contextValue = useMemo<HeatmapContextValue>(
    () => ({
      animateCells,
      animationDuration,
      binHeight,
      binWidth,
      brushYScale,
      chartPhase,
      chartStatus,
      colorScale,
      containerRef,
      data: visibleData,
      enterStaggerScale,
      enterTransition,
      fillScale,
      gap,
      height,
      innerHeight,
      innerWidth,
      isLoaded,
      isReady: chartWidth >= 10 && height >= 10,
      levelStyles,
      loadingCellMaxOpacity,
      loadingCellRandomness,
      loadingLabel,
      loadingOpacity,
      margin,
      revealEpoch,
      revealMode,
      separatorLayout,
      showLoadingCells,
      showLoadingLabel,
      timeXScale,
      weekStartDay,
      width: chartWidth,
      xScale,
      yScale,
    }),
    [
      animateCells,
      animationDuration,
      binHeight,
      binWidth,
      brushYScale,
      chartPhase,
      chartStatus,
      chartWidth,
      colorScale,
      fillScale,
      enterStaggerScale,
      enterTransition,
      gap,
      height,
      innerHeight,
      innerWidth,
      isLoaded,
      loadingCellMaxOpacity,
      loadingCellRandomness,
      loadingLabel,
      levelStyles,
      loadingOpacity,
      margin,
      revealMode,
      separatorLayout,
      showLoadingCells,
      showLoadingLabel,
      revealEpoch,
      timeXScale,
      visibleData,
      weekStartDay,
      xScale,
      yScale,
    ]
  );

  if (chartWidth < 10 || height < 10) {
    return null;
  }

  return (
    <HeatmapProvider value={contextValue}>
      <HeatmapInteractionRoot>
        <HeatmapChartSurface layout={layout}>{children}</HeatmapChartSurface>
      </HeatmapInteractionRoot>
    </HeatmapProvider>
  );
}

function HeatmapChartSurface({
  layout,
  children,
}: {
  layout: HeatmapLayout;
  children: ReactNode;
}) {
  const {
    containerRef,
    height,
    width,
    margin,
    levelStyles,
    chartPhase,
    loadingOpacity,
    loadingLabel,
    showLoadingLabel,
  } = useHeatmap();
  const { clearInteraction } = useHeatmapInteraction();
  const reducedOpacity =
    chartPhase === "loading" || chartPhase === "exitingReady"
      ? loadingOpacity
      : 1;

  return (
    <div
      className={cn("relative w-full", layout === "fill" && "h-full")}
      onPointerLeave={clearInteraction}
      ref={containerRef}
      style={{ opacity: reducedOpacity }}
    >
      <svg
        aria-hidden="true"
        className="overflow-visible"
        height={height}
        width={width}
      >
        <HeatmapPatternDefs levelStyles={levelStyles} />
        <g transform={`translate(${margin.left},${margin.top})`}>{children}</g>
      </svg>
      {showLoadingLabel && loadingLabel?.trim() ? (
        <div
          className="pointer-events-none absolute"
          style={{
            height: Math.max(height - margin.top - margin.bottom, 0),
            left: margin.left,
            top: margin.top,
            width: Math.max(width - margin.left - margin.right, 0),
          }}
        >
          <ChartLoadingLabel
            exiting={chartPhase !== "loading"}
            text={loadingLabel}
          />
        </div>
      ) : null}
    </div>
  );
}

function useHeatmapChartLifecycle({
  chartStatus,
  animationDuration,
  revealSignature = "",
  animate,
}: {
  chartStatus: ChartStatus;
  animationDuration: number;
  revealSignature?: string;
  animate: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const animateCells = animate && !reducedMotion;
  const animateEnter = animateCells && animationDuration > 0;

  // Mount state already reflects the enter reveal (previously applied by a
  // mount effect one commit later).
  const [chartPhase, setChartPhase] = useState<ChartPhase>(() => {
    if (animateEnter && chartStatus === "ready") {
      return "revealing";
    }
    return resolveRestingChartPhase(chartStatus);
  });
  const [isLoaded, setIsLoaded] = useState(() => !animateEnter);
  const [revealEpoch, setRevealEpoch] = useState(() =>
    animateEnter && chartStatus === "ready" ? 1 : 0
  );
  const [revealMode, setRevealMode] = useState<HeatmapRevealMode>(() =>
    animateEnter && chartStatus === "ready" ? "enter" : null
  );

  // Prop-driven transitions are applied during render ("store previous props
  // in state") instead of setState in effects — one render per transition and
  // no ref mirror of the phase read during render.
  const [prev, setPrev] = useState({
    animateEnter,
    animationDuration,
    chartStatus,
    revealSignature,
  });

  if (
    prev.chartStatus !== chartStatus ||
    prev.animateEnter !== animateEnter ||
    prev.animationDuration !== animationDuration ||
    prev.revealSignature !== revealSignature
  ) {
    setPrev({ animateEnter, animationDuration, chartStatus, revealSignature });

    // Status transitions (loading ↔ ready).
    if (prev.chartStatus !== chartStatus) {
      if (chartStatus === "ready" && prev.chartStatus === "loading") {
        setRevealMode("fromLoading");
        setIsLoaded(false);
        setChartPhase("revealing");
      } else if (chartStatus === "loading" && prev.chartStatus === "ready") {
        setRevealMode(null);
        setIsLoaded(false);
        setChartPhase("exitingReady");
      }
    }

    if (!animateEnter) {
      // No enter animation: settle straight into the resting phase.
      setIsLoaded(true);
      setChartPhase(resolveRestingChartPhase(chartStatus));
    } else if (chartStatus === "ready" && chartPhase === "ready") {
      // Motion replay (revealSignature / duration) while resting.
      setRevealMode("enter");
      setRevealEpoch((epoch) => epoch + 1);
      setIsLoaded(false);
      setChartPhase("revealing");
    }
  }

  const finishReveal = useCallback(() => {
    setIsLoaded(true);
    setChartPhase("ready");
    setRevealMode(null);
  }, []);

  useEffect(() => {
    if (chartPhase !== "exitingReady") {
      return;
    }

    const timer = window.setTimeout(() => {
      setChartPhase("loading");
    }, HEATMAP_LOADING_CONCEAL_MS);

    return () => window.clearTimeout(timer);
  }, [chartPhase]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: revealEpoch replays finish timer
  useEffect(() => {
    if (!animateEnter || chartPhase !== "revealing") {
      return;
    }

    const finishTimer = window.setTimeout(finishReveal, animationDuration);
    return () => window.clearTimeout(finishTimer);
  }, [animateEnter, animationDuration, chartPhase, finishReveal, revealEpoch]);

  return {
    animateCells,
    chartPhase,
    isLoaded,
    revealEpoch,
    revealMode,
  };
}

export function HeatmapChart({
  data,
  xDomain,
  sizingColumnCount,
  layout = "fluid",
  margin: marginProp,
  binSize = 0,
  gap = 2,
  colorScale: colorScaleProp,
  levelColors,
  levelStyles: levelStylesProp,
  aspectRatio,
  className = "",
  status = DEFAULT_CHART_STATUS,
  loadingLabel,
  animationDuration = HEATMAP_DEFAULT_ENTER_DURATION_MS,
  enterTransition = HEATMAP_DEFAULT_ENTER_TRANSITION,
  revealSignature = "",
  enterStaggerScale = 1,
  animate = true,
  loadingOpacity = HEATMAP_LOADING_CHART_OPACITY,
  showLoadingCells = true,
  loadingCellMaxOpacity = HEATMAP_DEFAULT_LOADING_CELL_MAX_OPACITY,
  loadingCellRandomness = HEATMAP_DEFAULT_LOADING_CELL_RANDOMNESS,
  columnSeparators,
  weekStartDay = 0,
  children,
}: HeatmapChartProps) {
  const margin = { ...DEFAULT_MARGIN, ...marginProp };
  const levelStyles = useMemo(
    () => resolveHeatmapLevelStyles(levelColors, levelStylesProp),
    [levelColors, levelStylesProp]
  );
  const colorScale = useMemo(
    () => colorScaleProp ?? buildHeatmapColorScaleFromStyles(levelStyles),
    [colorScaleProp, levelStyles]
  );
  const fillScale = useMemo(
    () => buildHeatmapFillScale(levelStyles),
    [levelStyles]
  );

  const { chartPhase, isLoaded, revealEpoch, revealMode, animateCells } =
    useHeatmapChartLifecycle({
      animate,
      animationDuration,
      chartStatus: status,
      revealSignature,
    });

  const showLoadingLabel = Boolean(
    loadingLabel?.trim() &&
      status === "loading" &&
      (chartPhase === "loading" || chartPhase === "exitingReady")
  );

  // Measure this container directly: visx 4's <ParentSize> renders children in
  // an absolutely positioned box, which collapses the content-sized fluid
  // layout to zero height.
  const { parentRef, width, height: parentHeight } = useParentSize();

  return (
    <div
      className={cn(
        "relative w-full",
        layout === "fill" && "h-full min-h-0",
        className
      )}
      ref={parentRef}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <HeatmapChartInner
        animateCells={animateCells}
        animationDuration={animationDuration}
        binSize={binSize}
        chartPhase={chartPhase}
        chartStatus={status}
        colorScale={colorScale}
        columnSeparators={columnSeparators}
        data={data}
        enterStaggerScale={enterStaggerScale}
        enterTransition={enterTransition}
        fillScale={fillScale}
        gap={gap}
        height={parentHeight}
        isLoaded={isLoaded}
        layout={layout}
        levelStyles={levelStyles}
        loadingCellMaxOpacity={loadingCellMaxOpacity}
        loadingCellRandomness={loadingCellRandomness}
        loadingLabel={loadingLabel}
        loadingOpacity={loadingOpacity}
        margin={margin}
        revealEpoch={revealEpoch}
        revealMode={revealMode}
        showLoadingCells={showLoadingCells}
        showLoadingLabel={showLoadingLabel}
        sizingColumnCount={sizingColumnCount}
        weekStartDay={weekStartDay}
        width={width}
        xDomain={xDomain}
      >
        {children}
      </HeatmapChartInner>
    </div>
  );
}

HeatmapChart.displayName = "HeatmapChart";

const HeatmapPatternDefs = memo(function HeatmapPatternDefs({
  levelStyles,
}: {
  levelStyles: HeatmapLevelStyles;
}) {
  const nodes = levelStyles.flatMap((style, level) => {
    if (!isHeatmapLevelPattern(style)) {
      return [];
    }

    const id = heatmapLevelPatternId(level);
    const pattern = style.pattern;
    if (!pattern) {
      return [];
    }

    const node = renderPatternPreset(
      pattern,
      id,
      heatmapLevelPatternRenderOptions(style)
    );

    return node ? [<Fragment key={id}>{node}</Fragment>] : [];
  });

  if (nodes.length === 0) {
    return null;
  }

  return <defs>{nodes}</defs>;
});

HeatmapPatternDefs.displayName = "HeatmapPatternDefs";
