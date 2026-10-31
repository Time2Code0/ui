"use client";

import type { Transition } from "motion/react";

import {
  Children,
  isValidElement,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { cn } from "cn";
import { scaleLinear, scaleTime } from "d3-scale";
import useMeasure from "react-use-measure";

import {
  type ChartContextValue,
  ChartProvider,
  defaultScatterColors,
  type LineConfig,
  type Margin,
} from "../chart-core/chart-context";
import {
  type ChartPhase,
  DEFAULT_CHART_LIFECYCLE,
} from "../chart-core/chart-phase";
import { extractReferenceAreaConfigs } from "../chart-core/reference-area-config";
import {
  minDistinctStepRatio,
  type ResolvedScatterJitterConfig,
  resolveScatterJitterConfig,
  type ScatterJitter,
  ScatterJitterContext,
  type ScatterJitterOffsets,
  scatterJitterRangePadding,
} from "../chart-core/scatter-jitter";
import { useChartInteraction } from "../chart-core/use-chart-interaction";
import {
  buildYScalesForLines,
  getPrimaryYScale,
} from "../chart-core/y-axis-scales";
import {
  DEFAULT_ANIMATION_EASING,
  DEFAULT_CHART_ENTER_TRANSITION,
} from "../chart-utils/animation";
import {
  getChartChildName,
  partitionChartChildren,
} from "../chart-utils/chart-children";
import { shortDateFmt } from "../chart-utils/formatters";
import { useRevealReplay } from "../chart-utils/use-reveal-replay";
import { Scatter, type ScatterProps } from "./scatter";

export interface ScatterChartProps {
  /** Animation duration in milliseconds. @default 1100 */
  animationDuration?: number;
  /** CSS easing for clip-reveal. @default cubic-bezier(0.85, 0, 0.15, 1) */
  animationEasing?: string;
  /** Aspect ratio as "width / height". @default "2 / 1" */
  aspectRatio?: string;
  /** Child components (Scatter, Grid, ChartTooltip, XAxis, etc.) */
  children: ReactNode;
  /** Additional class name for the container */
  className?: string;
  /** Data array — each item should have a date field and numeric values */
  data: Record<string, unknown>[];
  /**
   * Motion transition for the enter reveal. Defaults to the line chart reveal.
   */
  enterTransition?: Transition;
  /**
   * Format x-axis tick and date-pill labels, e.g. short month names for
   * monthly data. Hoist or memoize it to avoid recomputing labels. Defaults to
   * short dates such as "Jan 1".
   */
  formatXLabel?: (date: Date) => string;
  /**
   * Spread points that share an x value (strip plot). Offsets are deterministic
   * (seeded), so points never jump between renders; tooltips show the original
   * values. `true` = `0.35` band steps horizontally.
   * @default false
   */
  jitter?: ScatterJitter;
  /** Chart margins @default { top: 40, right: 40, bottom: 40, left: 40 } */
  margin?: Partial<Margin>;
  /**
   * Fires when the internal chart phase changes (e.g. OG capture readiness).
   */
  onPhaseChange?: (phase: ChartPhase) => void;
  /** Signature of motion URL state — triggers enter replay when it changes. @internal */
  revealSignature?: string;
  /** Key in data for the x-axis (date). @default "date" */
  xDataKey?: string;
}

const DEFAULT_MARGIN: Margin = { bottom: 40, left: 40, right: 40, top: 40 };

function extractScatterConfigs(children: ReactNode): LineConfig[] {
  const configs: LineConfig[] = [];
  let seriesIndex = 0;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    const componentName = getChartChildName(child);

    const props = child.props as ScatterProps | undefined;
    const isScatterComponent =
      componentName === "Scatter" ||
      child.type === Scatter ||
      (props && typeof props.dataKey === "string" && props.dataKey.length > 0);

    if (isScatterComponent && props?.dataKey) {
      const seriesColor =
        defaultScatterColors[seriesIndex % defaultScatterColors.length] ??
        defaultScatterColors[0];
      configs.push({
        dataKey: props.dataKey,
        stroke: props.fill || props.stroke || seriesColor,
        strokeWidth: props.radius ?? 5,
        yAxisId: props.yAxisId,
      });
      seriesIndex += 1;
    }
  });

  return configs;
}

interface ChartInnerProps {
  animationDuration: number;
  animationEasing?: string;
  children: ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
  data: Record<string, unknown>[];
  enterTransition?: Transition;
  formatXLabel?: (date: Date) => string;
  height: number;
  jitter: ResolvedScatterJitterConfig | null;
  margin: Margin;
  onPhaseChange?: (phase: ChartPhase) => void;
  revealSignature?: string;
  width: number;
  xDataKey: string;
}

function ChartInner({
  width,
  height,
  data,
  xDataKey,
  margin,
  animationDuration,
  animationEasing,
  enterTransition,
  revealSignature,
  children,
  containerRef,
  jitter,
  formatXLabel,
  onPhaseChange,
}: ChartInnerProps) {
  const lines = useMemo(() => extractScatterConfigs(children), [children]);

  return (
    <ScatterChartInner
      animationDuration={animationDuration}
      animationEasing={animationEasing}
      containerRef={containerRef}
      data={data}
      enterTransition={enterTransition}
      formatXLabel={formatXLabel}
      height={height}
      jitter={jitter}
      lines={lines}
      margin={margin}
      onPhaseChange={onPhaseChange}
      revealSignature={revealSignature}
      width={width}
      xDataKey={xDataKey}
    >
      {children}
    </ScatterChartInner>
  );
}

export function ScatterChart({
  data,
  xDataKey = "date",
  margin: marginProp,
  animationDuration = 1100,
  animationEasing,
  enterTransition = DEFAULT_CHART_ENTER_TRANSITION,
  revealSignature,
  aspectRatio = "2 / 1",
  className = "",
  children,
  jitter: jitterProp,
  formatXLabel,
  onPhaseChange,
}: ScatterChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const margin = { ...DEFAULT_MARGIN, ...marginProp };
  const [measureRef, bounds] = useMeasure({ debounce: 10 });
  // Memo on primitives so inline `jitter={{ ... }}` objects stay stable.
  const resolvedJitter = resolveScatterJitterConfig(jitterProp);
  const hasJitter = resolvedJitter !== null;
  const jitterX = resolvedJitter?.x ?? 0;
  const jitterY = resolvedJitter?.y ?? 0;
  const jitterSeed = resolvedJitter?.seed ?? 0;
  const jitter = useMemo<ResolvedScatterJitterConfig | null>(
    () => (hasJitter ? { seed: jitterSeed, x: jitterX, y: jitterY } : null),
    [hasJitter, jitterX, jitterY, jitterSeed]
  );

  const setContainerRef = (node: HTMLDivElement | null) => {
    containerRef.current = node;
    measureRef(node);
  };

  const width = bounds.width ?? 0;
  const height = bounds.height ?? 0;

  return (
    <div
      className={cn("relative w-full", className)}
      ref={setContainerRef}
      style={{ aspectRatio, touchAction: "none" }}
    >
      {width > 0 && height > 0 ? (
        <ChartInner
          animationDuration={animationDuration}
          animationEasing={animationEasing}
          containerRef={containerRef}
          data={data}
          enterTransition={enterTransition}
          formatXLabel={formatXLabel}
          height={height}
          jitter={jitter}
          margin={margin}
          onPhaseChange={onPhaseChange}
          revealSignature={revealSignature}
          width={width}
          xDataKey={xDataKey}
        >
          {children}
        </ChartInner>
      ) : null}
    </div>
  );
}

ScatterChart.displayName = "ScatterChart";

interface ScatterChartInnerProps {
  animationDuration: number;
  animationEasing?: string;
  children: ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
  data: Record<string, unknown>[];
  enterTransition?: Transition;
  /** X-axis tick / date-pill label formatter. @default "Jan 1" */
  formatXLabel?: (date: Date) => string;
  height: number;
  /** Resolved jitter config (see `ScatterChart` `jitter`). */
  jitter?: ResolvedScatterJitterConfig | null;
  lines: LineConfig[];
  margin: Margin;
  onPhaseChange?: (phase: ChartPhase) => void;
  revealSignature?: string;
  width: number;
  xDataKey: string;
}

function ScatterChartInner({
  width,
  height,
  data,
  xDataKey,
  margin,
  animationDuration,
  animationEasing = DEFAULT_ANIMATION_EASING,
  enterTransition,
  revealSignature = "",
  children,
  containerRef,
  lines,
  jitter = null,
  formatXLabel,
  onPhaseChange,
}: ScatterChartInnerProps) {
  const { isLoaded, revealEpoch } = useRevealReplay({
    delayMs: animationDuration,
    replayKey: [animationDuration, revealSignature],
  });

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xAccessor = useCallback(
    (d: Record<string, unknown>): Date => {
      const value = d[xDataKey];
      return value instanceof Date ? value : new Date(value as string | number);
    },
    [xDataKey]
  );

  const baseRangePadding = useMemo(() => {
    if (lines.length === 0) {
      return 12;
    }
    const maxRadius = Math.max(...lines.map((line) => line.strokeWidth ?? 5));
    return maxRadius + 10;
  }, [lines]);

  const stepRatio = useMemo(
    () =>
      jitter && jitter.x > 0
        ? minDistinctStepRatio(data.map((d) => xAccessor(d).getTime()))
        : 0,
    [data, jitter, xAccessor]
  );

  const xRangePadding = scatterJitterRangePadding(
    baseRangePadding,
    innerWidth,
    stepRatio,
    jitter?.x ?? 0
  );

  const xScale = useMemo(() => {
    const dates = data.map((d) => xAccessor(d));
    const minTime = Math.min(...dates.map((d) => d.getTime()));
    const maxTime = Math.max(...dates.map((d) => d.getTime()));

    return scaleTime<number>()
      .range([
        xRangePadding,
        Math.max(xRangePadding, innerWidth - xRangePadding),
      ])
      .domain([minTime, maxTime]);
  }, [innerWidth, data, xAccessor, xRangePadding]);

  const jitterOffsets = useMemo<ScatterJitterOffsets | null>(() => {
    if (!jitter) {
      return null;
    }
    const plotWidth = Math.max(0, innerWidth - 2 * xRangePadding);
    return {
      seed: jitter.seed,
      x: (jitter.x / 2) * plotWidth * stepRatio,
      y: jitter.y,
    };
  }, [jitter, innerWidth, xRangePadding, stepRatio]);

  const columnWidth = useMemo(() => {
    if (data.length < 2) {
      return 0;
    }
    return innerWidth / (data.length - 1);
  }, [innerWidth, data.length]);

  const yScales = useMemo(
    () =>
      buildYScalesForLines({
        data,
        innerHeight,
        lines,
        resolveDomain: (dataKeys) => {
          let maxValue = 0;
          for (const d of data) {
            for (const key of dataKeys) {
              const value = d[key];
              if (typeof value === "number" && value > maxValue) {
                maxValue = value;
              }
            }
          }
          const top = maxValue <= 0 ? 100 : maxValue * 1.1;
          return [0, top];
        },
      }),
    [innerHeight, data, lines]
  );

  const yScale = getPrimaryYScale(
    yScales,
    scaleLinear<number>().range([innerHeight, 0]).domain([0, 100])
  );

  const dateLabels = useMemo(
    () =>
      data.map((d) =>
        formatXLabel
          ? formatXLabel(xAccessor(d))
          : shortDateFmt.format(xAccessor(d))
      ),
    [data, xAccessor, formatXLabel]
  );

  useEffect(() => {
    onPhaseChange?.(isLoaded ? "ready" : "revealing");
  }, [isLoaded, onPhaseChange]);

  const canInteract = isLoaded;

  const {
    tooltipData,
    setTooltipData,
    selection,
    clearSelection,
    interactionHandlers,
    interactionStyle,
  } = useChartInteraction({
    canInteract,
    data,
    jitter: jitterOffsets,
    lines,
    margin,
    xAccessor,
    xScale,
    yScale,
    yScales,
  });

  const referenceAreas = useMemo(
    () => extractReferenceAreaConfigs(children),
    [children]
  );

  if (width < 10 || height < 10) {
    return null;
  }

  const layers = partitionChartChildren(children);

  const contextValue: ChartContextValue = {
    ...DEFAULT_CHART_LIFECYCLE,
    animationDuration,
    animationEasing,
    clearSelection,
    columnWidth,
    containerRef,
    data,
    dateLabels,
    enterTransition,
    height,
    innerHeight,
    innerWidth,
    isLoaded,
    lines,
    margin,
    nearestPointHover: jitterOffsets !== null,
    referenceAreas,
    renderData: data,
    revealEpoch,
    selection,
    setTooltipData,
    tooltipData,
    width,
    xAccessor,
    xScale: xScale as ChartContextValue["xScale"],
    yScale: yScale as ChartContextValue["yScale"],
    yScales: yScales as ChartContextValue["yScales"],
  };

  return (
    <ChartProvider value={contextValue}>
      <ScatterJitterContext.Provider value={jitterOffsets}>
        <svg
          aria-hidden="true"
          className="overflow-visible"
          height={height}
          width={width}
        >
          {layers.defs.length > 0 && <defs>{layers.defs}</defs>}

          <rect fill="transparent" height={height} width={width} x={0} y={0} />

          <g
            {...interactionHandlers}
            style={interactionStyle}
            transform={`translate(${margin.left},${margin.top})`}
          >
            <rect
              fill="transparent"
              height={innerHeight}
              width={innerWidth}
              x={0}
              y={0}
            />

            {layers.clipExcluded}
            {layers.underlay}
            {layers.series}
            {layers.postOverlay}
          </g>
        </svg>
      </ScatterJitterContext.Provider>
    </ChartProvider>
  );
}
