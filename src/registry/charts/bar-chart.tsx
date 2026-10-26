"use client";

import type { Transition } from "motion/react";
import type { BarProps } from "./bar";

import {
  memo,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { localPoint } from "@visx/event";
import { scaleBand, scaleLinear } from "@visx/scale";
import { cn } from "cn";

import { DEFAULT_ANIMATION_EASING } from "./animation";
import { topSquareCenterY } from "./bar-squares-layout";
import {
  forEachChartChild,
  getChartChildName,
  partitionChartChildren,
  resolveChartChildElement,
} from "./chart-children";
import {
  ChartProvider,
  type LineConfig,
  type Margin,
  type TooltipData,
} from "./chart-context";
import { shortDateFmt } from "./chart-formatters";
import { ParentSize } from "./chart-parent-size";
import {
  type ChartPhase,
  type ChartStatus,
  DEFAULT_CHART_LIFECYCLE,
  resolveRestingChartPhase,
} from "./chart-phase";
import { BarLoadingSkeleton } from "./loading-sweep";
import { extractReferenceAreaConfigs } from "./reference-area-config";
import { useRevealReplay } from "./use-reveal-replay";
import { useScheduledTooltip } from "./use-scheduled-tooltip";
import {
  buildYScalesForLines,
  getPrimaryYScale,
  normalizeYAxisId,
  wrapSingleYScale,
} from "./y-axis-scales";
import {
  collectBarValueExtents,
  resolveBarValueDomain,
} from "./y-domain-utils";

/** Skeleton bars to show when `status="loading"` and `data` is empty. */
const FALLBACK_LOADING_BARS = 12;

export type BarOrientation = "vertical" | "horizontal";

export interface BarChartProps {
  /** Animation duration in milliseconds. Default: 1100 */
  animationDuration?: number;
  /** CSS easing for bar grow transitions. */
  animationEasing?: string;
  /** Aspect ratio as "width / height". Default: "2 / 1" */
  aspectRatio?: string;
  /** Gap between bar groups as a fraction of band width (0-1). Default: 0.2 */
  barGap?: number;
  /** Fixed bar width in pixels. If not set, bars auto-size to fill the band. */
  barWidth?: number;
  /** Child components (Bar, Grid, ChartTooltip, etc.). Optional — omit for a
   * pure `status="loading"` skeleton. */
  children?: ReactNode;
  /** Additional class name for the container */
  className?: string;
  /** Data array - each item should have an x-axis key and numeric values */
  data: Record<string, unknown>[];
  /** Motion enter transition (spring or cubic-bezier tween). */
  enterTransition?: Transition;
  /** Fill color for the loading skeleton. Defaults to the first `<Bar>`'s
   * `stroke`, falling back to `var(--foreground)`. */
  loadingFill?: string;
  /** Chart margins */
  margin?: Partial<Margin>;
  /** Reports reveal lifecycle for OG screenshots and loading orchestration. */
  onPhaseChange?: (phase: ChartPhase) => void;
  /** Bar chart orientation. Default: "vertical" */
  orientation?: BarOrientation;
  /** Signature of motion URL state — triggers enter replay when it changes. */
  revealSignature?: string;
  /** When set, tooltip Y positions snap to the top square center (shape variant). */
  squareSnap?: { squareGap: number; groupGap?: number; fit?: boolean };
  /** Whether to stack bars instead of grouping them. Default: false */
  stacked?: boolean;
  /** Gap between stacked bar segments in pixels. Default: 0 */
  stackGap?: number;
  /** Fetch / display status. When `"loading"`, a shimmer skeleton replaces the
   * bars (no chart data required). Default: `"ready"`. */
  status?: ChartStatus;
  /** Key in data for the categorical axis. Default: "name" */
  xDataKey?: string;
}

const DEFAULT_MARGIN: Margin = { bottom: 40, left: 40, right: 40, top: 40 };

// Extract bar configs from children synchronously
function extractBarConfigs(children: ReactNode): LineConfig[] {
  const configs: LineConfig[] = [];

  forEachChartChild(children, (child) => {
    const childType = child.type as { __isBarDepthLayer?: boolean };
    // Bar-depth surface layers (BarDepthBack/Front, BarPulse) carry a
    // `dataKey` to pair with a Bar but are not series themselves — skip them
    // so they don't inflate the series count and shrink the real bars.
    if (childType.__isBarDepthLayer) {
      return;
    }
    const componentName = getChartChildName(child);
    // Trend overlays fit an existing series — not a bar series themselves.
    if (componentName === "TrendLine") {
      return;
    }

    const props = child.props as BarProps | undefined;
    const isBarComponent =
      componentName === "Bar" ||
      componentName === "BarSquares" ||
      (props && typeof props.dataKey === "string" && props.dataKey.length > 0);

    if (isBarComponent && props?.dataKey) {
      // Use stroke for tooltip dot color if provided, otherwise fall back to fill
      // This allows gradient/pattern fills to have a solid dot color
      const dotColor =
        props.stroke || props.fill || "var(--chart-line-primary)";
      configs.push({
        dataKey: props.dataKey,
        stroke: dotColor,
        strokeWidth: 0,
        yAxisId: props.yAxisId,
      });
    }
  });

  return configs;
}

interface ChartInnerProps {
  animationDuration: number;
  animationEasing: string;
  barGap: number;
  barWidthProp?: number;
  children: ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
  data: Record<string, unknown>[];
  enterTransition?: Transition;
  height: number;
  loadingFill?: string;
  margin: Margin;
  onPhaseChange?: (phase: ChartPhase) => void;
  orientation: BarOrientation;
  revealSignature?: string;
  squareSnap?: { squareGap: number; groupGap?: number; fit?: boolean };
  stacked: boolean;
  stackGap: number;
  status: ChartStatus;
  width: number;
  xDataKey: string;
}

function ChartInner(props: ChartInnerProps) {
  const { width, height } = props;
  if (width < 10 || height < 10) {
    return null;
  }
  return <ChartCore {...props} />;
}

const ChartCore = memo(function ChartCore({
  width,
  height,
  data,
  xDataKey,
  margin,
  animationDuration,
  animationEasing,
  enterTransition,
  revealSignature = "",
  barGap,
  barWidthProp,
  orientation,
  stacked,
  stackGap,
  squareSnap,
  children,
  containerRef,
  onPhaseChange,
  status,
  loadingFill,
}: ChartInnerProps) {
  const { tooltipData, setTooltipData, scheduleTooltip, clearTooltip } =
    useScheduledTooltip<TooltipData>();
  const { isLoaded, revealEpoch } = useRevealReplay({
    // Bars grow with a stagger of up to 40% of the duration.
    delayMs:
      animationDuration + (data.length > 1 ? animationDuration * 0.4 : 0),
    // While loading, hold the skeleton (no reveal, no interaction); the grow
    // reveal plays once status flips to "ready".
    hold: status === "loading",
    replayKey: [animationDuration, revealSignature, status],
  });
  const hoveredBarIndex = tooltipData?.index ?? null;

  const isHorizontal = orientation === "horizontal";

  // Extract bar configs synchronously from children
  const lines = useMemo(() => extractBarConfigs(children), [children]);
  const effectiveLoadingFill =
    loadingFill ?? lines[0]?.stroke ?? "var(--foreground)";

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Category accessor function - returns string for categorical scale
  const categoryAccessor = useCallback(
    (d: Record<string, unknown>): string => {
      const value = d[xDataKey];
      if (value instanceof Date) {
        return shortDateFmt.format(value);
      }
      return String(value ?? "");
    },
    [xDataKey]
  );

  // For compatibility with ChartContext, provide a Date-based xAccessor
  const xAccessorDate = useCallback(
    (d: Record<string, unknown>): Date => {
      const value = d[xDataKey];
      if (value instanceof Date) {
        return value;
      }
      return new Date();
    },
    [xDataKey]
  );

  // Category scale (band) - for the categorical axis
  const categoryScale = useMemo(() => {
    const domain = data.map((d) => categoryAccessor(d));
    const range: [number, number] = isHorizontal
      ? [0, innerHeight]
      : [0, innerWidth];
    return scaleBand<string>({
      domain,
      padding: barGap,
      range,
    });
  }, [innerWidth, innerHeight, data, categoryAccessor, barGap, isHorizontal]);

  // Band width for bars - use prop if provided, otherwise use scale's bandwidth
  const bandWidth = barWidthProp ?? categoryScale.bandwidth();

  const valueExtents = useMemo(
    () =>
      collectBarValueExtents(
        data,
        lines.map((line) => line.dataKey),
        stacked
      ),
    [data, lines, stacked]
  );

  // Value scale (linear) - for the value axis. Always includes zero so bars
  // grow from the zero line in either direction.
  const valueScale = useMemo(() => {
    const range = isHorizontal ? [0, innerWidth] : [innerHeight, 0];
    return scaleLinear({
      domain: resolveBarValueDomain(valueExtents),
      nice: true,
      range,
    });
  }, [innerWidth, innerHeight, valueExtents, isHorizontal]);

  const yScales = useMemo(() => {
    if (isHorizontal) {
      return wrapSingleYScale(valueScale);
    }
    return buildYScalesForLines({
      data,
      innerHeight,
      lines,
      resolveDomain: (dataKeys) =>
        resolveBarValueDomain(collectBarValueExtents(data, dataKeys, stacked)),
    });
  }, [data, innerHeight, isHorizontal, lines, stacked, valueScale]);

  const primaryYScale = getPrimaryYScale(yScales, valueScale);

  // Compute stack offsets for stacked bars
  const stackOffsets = useMemo(() => {
    if (!stacked) {
      return;
    }
    const offsets = new Map<number, Map<string, number>>();
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      if (!d) {
        continue;
      }
      const pointOffsets = new Map<string, number>();
      let cumulative = 0;
      for (const line of lines) {
        pointOffsets.set(line.dataKey, cumulative);
        const value = d[line.dataKey];
        if (typeof value === "number") {
          cumulative += value;
        }
      }
      offsets.set(i, pointOffsets);
    }
    return offsets;
  }, [data, lines, stacked]);

  // Column width for tooltip indicator
  const columnWidth = useMemo(() => {
    if (data.length < 1) {
      return 0;
    }
    return isHorizontal ? innerHeight / data.length : innerWidth / data.length;
  }, [innerWidth, innerHeight, data.length, isHorizontal]);

  // Pre-compute labels for ticker animation
  const dateLabels = useMemo(
    () => data.map((d) => categoryAccessor(d)),
    [data, categoryAccessor]
  );

  // Create a fake time scale for compatibility with ChartContext
  const fakeTimeScale = useMemo(() => {
    const now = Date.now();
    const start = now - data.length * 24 * 60 * 60 * 1000;
    const scale = {
      ...categoryScale,
      copy: () => scale,
      domain: () => [new Date(start), new Date(now)],
      invert: (x: number) => new Date(start + (x / innerWidth) * (now - start)),
      range: () => [0, innerWidth] as [number, number],
    };
    return scale;
  }, [categoryScale, innerWidth, data.length]);

  useEffect(() => {
    onPhaseChange?.(isLoaded ? "ready" : "revealing");
  }, [isLoaded, onPhaseChange]);

  // Mouse move handler
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGGElement>) => {
      const point = localPoint(event);
      if (!point) {
        return;
      }

      const pos = isHorizontal ? point.y - margin.top : point.x - margin.left;

      // Find which band the mouse is over
      const bandIndex = Math.floor(pos / columnWidth);
      const clampedIndex = Math.max(0, Math.min(data.length - 1, bandIndex));
      const d = data[clampedIndex];

      if (!d) {
        return;
      }

      // Calculate positions for each bar
      const yPositions: Record<string, number> = {};
      const xPositions: Record<string, number> = {};
      const barPos = categoryScale(categoryAccessor(d)) ?? 0;

      if (isHorizontal) {
        // Horizontal bars: dots at end of bar (x = value), centered vertically in band
        const seriesCount = lines.length;
        const groupGap = seriesCount > 1 ? 4 : 0;
        const individualBarHeight =
          seriesCount > 0
            ? (bandWidth - groupGap * (seriesCount - 1)) / seriesCount
            : bandWidth;

        if (stacked) {
          // Stacked horizontal: all bars same y, x at cumulative end
          let cumulative = 0;
          for (const line of lines) {
            const value = d[line.dataKey];
            if (typeof value === "number") {
              cumulative += value;
              const axisScale =
                yScales[normalizeYAxisId(line.yAxisId)] ?? valueScale;
              xPositions[line.dataKey] = axisScale(cumulative) ?? 0;
              yPositions[line.dataKey] = barPos + bandWidth / 2;
            }
          }
        } else {
          // Grouped horizontal: each bar at its own y position
          lines.forEach((line, idx) => {
            const value = d[line.dataKey];
            if (typeof value === "number") {
              const axisScale =
                yScales[normalizeYAxisId(line.yAxisId)] ?? valueScale;
              xPositions[line.dataKey] = axisScale(value) ?? 0;
              yPositions[line.dataKey] =
                barPos +
                idx * (individualBarHeight + groupGap) +
                individualBarHeight / 2;
            }
          });
        }
      } else if (stacked) {
        // Vertical stacked bars
        let cumulative = 0;
        let seriesIdx = 0;
        for (const line of lines) {
          const value = d[line.dataKey];
          if (typeof value === "number") {
            cumulative += value;
            const axisScale =
              yScales[normalizeYAxisId(line.yAxisId)] ?? primaryYScale;
            const gapOffset = seriesIdx * stackGap;
            yPositions[line.dataKey] = (axisScale(cumulative) ?? 0) - gapOffset;
            seriesIdx++;
          }
        }
      } else {
        // Vertical grouped bars
        const seriesCount = lines.length;
        const groupGap = seriesCount > 1 ? 4 : 0;
        const individualBarWidth =
          seriesCount > 0
            ? (bandWidth - groupGap * (seriesCount - 1)) / seriesCount
            : bandWidth;

        lines.forEach((line, idx) => {
          const value = d[line.dataKey];
          if (typeof value === "number") {
            const axisScale =
              yScales[normalizeYAxisId(line.yAxisId)] ?? primaryYScale;
            const baselineY = axisScale(0) ?? innerHeight;
            const valueY = axisScale(value) ?? 0;
            const barLengthPx = baselineY - valueY;

            if (squareSnap && !isHorizontal && value > 0) {
              yPositions[line.dataKey] = topSquareCenterY({
                barLengthPx,
                baselineY,
                fit: squareSnap.fit,
                gap: squareSnap.squareGap,
                squareSize: individualBarWidth,
              });
            } else {
              yPositions[line.dataKey] = valueY;
            }

            xPositions[line.dataKey] =
              barPos +
              idx * (individualBarWidth + groupGap) +
              individualBarWidth / 2;
          }
        });
      }

      // Tooltip position: for horizontal, position at max bar end; for vertical, center of band
      let tooltipX: number;
      if (isHorizontal) {
        // Position tooltip at the right-most bar edge — the value end for
        // positive bars, the zero line for negative ones.
        const maxX = Math.max(...Object.values(xPositions), valueScale(0) ?? 0);
        tooltipX = maxX;
      } else {
        tooltipX = barPos + bandWidth / 2;
      }

      scheduleTooltip({
        index: clampedIndex,
        point: d,
        x: tooltipX,
        xPositions: Object.keys(xPositions).length > 0 ? xPositions : undefined,
        yPositions,
      });
    },
    [
      categoryScale,
      valueScale,
      data,
      lines,
      margin.left,
      margin.top,
      categoryAccessor,
      columnWidth,
      bandWidth,
      isHorizontal,
      stacked,
      stackGap,
      scheduleTooltip,
      yScales,
      primaryYScale,
      squareSnap,
      innerHeight,
    ]
  );

  const handleMouseLeave = useCallback(() => {
    clearTooltip();
  }, [clearTooltip]);

  const canInteract = isLoaded;

  // Separate children into defs, pre-overlay, and post-overlay
  const layers = partitionChartChildren(children);
  // Trend lines draw above every bar regardless of child order.
  const isTrendLine = (child: ReactElement) =>
    getChartChildName(resolveChartChildElement(child)) === "TrendLine";
  const bars = layers.series.filter((child) => !isTrendLine(child));
  const trendLines = layers.series.filter(isTrendLine);

  const referenceAreas = useMemo(
    () => extractReferenceAreaConfigs(children),
    [children]
  );

  const contextValue = {
    ...DEFAULT_CHART_LIFECYCLE,
    animationDuration,
    animationEasing,
    bandWidth,
    // Bar-specific properties
    barScale: categoryScale,
    barXAccessor: categoryAccessor,
    chartPhase: resolveRestingChartPhase(status),
    chartStatus: status,
    columnWidth,
    containerRef,
    data,
    dateLabels,
    enterTransition,
    height,
    hoveredBarIndex,
    innerHeight,
    innerWidth,
    isLoaded,
    lines,
    margin,
    orientation,
    referenceAreas,
    renderData: data,
    revealEpoch,
    setTooltipData,
    squareSnap,
    stacked,
    stackOffsets,
    tooltipData,
    width,
    xAccessor: xAccessorDate,
    xScale: fakeTimeScale as unknown as ReturnType<
      typeof import("@visx/scale").scaleTime<number>
    >,
    yScale: isHorizontal ? valueScale : primaryYScale,
    yScales,
  };

  return (
    <ChartProvider value={contextValue}>
      <svg
        aria-hidden="true"
        className="overflow-visible"
        height={height}
        width={width}
      >
        {/* Gradient and pattern definitions */}
        {layers.defs.length > 0 && <defs>{layers.defs}</defs>}

        <rect fill="transparent" height={height} width={width} x={0} y={0} />

        {/* biome-ignore lint/a11y/noStaticElementInteractions: Chart interaction area */}
        <g
          onMouseLeave={canInteract ? handleMouseLeave : undefined}
          onMouseMove={canInteract ? handleMouseMove : undefined}
          style={{ cursor: canInteract ? "crosshair" : "default" }}
          transform={`translate(${margin.left},${margin.top})`}
        >
          {/* Background rect for mouse event detection */}
          <rect
            fill="transparent"
            height={innerHeight}
            width={innerWidth}
            x={0}
            y={0}
          />

          {layers.clipExcluded}
          {layers.underlay}
          {status === "loading" ? (
            <BarLoadingSkeleton
              barCount={data.length || FALLBACK_LOADING_BARS}
              fill={effectiveLoadingFill}
              innerHeight={innerHeight}
              innerWidth={innerWidth}
            />
          ) : (
            <>
              {bars}
              {trendLines}
            </>
          )}

          {/* Markers rendered last so they're on top for interaction */}
          {layers.postOverlay}
        </g>
      </svg>
    </ChartProvider>
  );
});

export function BarChart({
  data,
  xDataKey = "name",
  margin: marginProp,
  animationDuration = 1100,
  animationEasing = DEFAULT_ANIMATION_EASING,
  enterTransition,
  revealSignature,
  aspectRatio = "2 / 1",
  className = "",
  barGap = 0.2,
  barWidth,
  orientation = "vertical",
  stacked = false,
  stackGap = 0,
  squareSnap,
  children,
  onPhaseChange,
  status = "ready",
  loadingFill,
}: BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const margin = { ...DEFAULT_MARGIN, ...marginProp };

  return (
    <div
      className={cn("relative w-full overflow-visible", className)}
      ref={containerRef}
      style={{ aspectRatio }}
    >
      <ParentSize debounceTime={10}>
        {({ width, height }) => (
          <ChartInner
            animationDuration={animationDuration}
            animationEasing={animationEasing}
            barGap={barGap}
            barWidthProp={barWidth}
            containerRef={containerRef}
            data={data}
            enterTransition={enterTransition}
            height={height}
            loadingFill={loadingFill}
            margin={margin}
            onPhaseChange={onPhaseChange}
            orientation={orientation}
            revealSignature={revealSignature}
            squareSnap={squareSnap}
            stacked={stacked}
            stackGap={stackGap}
            status={status}
            width={width}
            xDataKey={xDataKey}
          >
            {children}
          </ChartInner>
        )}
      </ParentSize>
    </div>
  );
}

BarChart.displayName = "BarChart";
