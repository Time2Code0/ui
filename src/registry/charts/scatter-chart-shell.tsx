"use client";

import type { Transition } from "motion/react";

import { type ReactNode, useCallback, useEffect, useMemo } from "react";

import { bisector } from "d3-array";
import { scaleLinear, scaleTime } from "d3-scale";

import { DEFAULT_ANIMATION_EASING } from "./animation";
import { partitionChartChildren } from "./chart-children";
import {
  type ChartContextValue,
  ChartProvider,
  type LineConfig,
  type Margin,
} from "./chart-context";
import { shortDateFmt } from "./chart-formatters";
import { type ChartPhase, DEFAULT_CHART_LIFECYCLE } from "./chart-phase";
import { extractReferenceAreaConfigs } from "./reference-area-config";
import {
  minDistinctStepRatio,
  type ResolvedScatterJitterConfig,
  ScatterJitterContext,
  type ScatterJitterOffsets,
  scatterJitterRangePadding,
} from "./scatter-jitter";
import { useRevealReplay } from "./use-reveal-replay";
import { useScatterChartInteraction } from "./use-scatter-chart-interaction";
import { buildYScalesForLines, getPrimaryYScale } from "./y-axis-scales";

export interface ScatterChartInnerProps {
  animationDuration: number;
  animationEasing?: string;
  children: ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
  data: Record<string, unknown>[];
  enterTransition?: Transition;
  /** X-axis tick / date-pill label formatter. Default: "Jan 1" */
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

export function ScatterChartInner({
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

  const bisectDate = useMemo(
    () => bisector<Record<string, unknown>, Date>((d) => xAccessor(d)).left,
    [xAccessor]
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
  } = useScatterChartInteraction({
    bisectDate,
    canInteract,
    data,
    jitter: jitterOffsets,
    lines,
    margin,
    xAccessor,
    xScale,
    yScale: yScale as ChartContextValue["yScale"],
    yScales: yScales as ChartContextValue["yScales"],
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
