"use client";

import type { Transition } from "motion/react";

import {
  type CSSProperties,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { scaleLinear, scaleTime } from "@visx/scale";
import { cn } from "cn";
import { extent } from "d3-array";

import {
  DEFAULT_ANIMATION_EASING,
  DEFAULT_CHART_ENTER_TRANSITION,
} from "./animation";
import {
  type BandConfig,
  bandKeysByAxis,
  extractBandConfigs,
} from "./band-config";
import { partitionChartChildren } from "./chart-children";
import { ChartProvider, type LineConfig, type Margin } from "./chart-context";
import { shortDateFmt } from "./chart-formatters";
import { ChartLoadingLabel } from "./chart-loading-label";
import { ParentSize } from "./chart-parent-size";
import {
  type ChartPhase,
  type ChartStatus,
  DEFAULT_CHART_STATUS,
  DEFAULT_Y_DOMAIN_TWEEN_MS,
  isChartInteractionPhase,
  resolveRestingChartPhase,
} from "./chart-phase";
import { ChartRevealClip } from "./chart-reveal-clip";
import {
  decimateTimeSeries,
  maxRenderPointsForWidth,
} from "./decimate-time-series";
import { filterDataByXDomain } from "./filter-data-by-x-domain";
import {
  generateChartSkeletonData,
  generateChartSkeletonFromTarget,
} from "./generate-chart-skeleton-data";
import {
  extractProjectionLineConfigs,
  mergeProjectionXDomainMax,
  mergeProjectionYDomain,
} from "./projection-config";
import {
  extractReferenceAreaConfigs,
  type ReferenceAreaConfig,
} from "./reference-area-config";
import { ReferenceAreaRegistrationContext } from "./reference-area-registration-context";
import {
  computeSeriesBarRevealClipPadding,
  computeSeriesBarWidth,
} from "./series-bar-layout";
import { useStaticChartPreview } from "./static-chart-preview-context";
import { useAnimatedYDomains } from "./use-animated-y-domains";
import { useChartInteraction } from "./use-chart-interaction";
import { useChartPhaseOrchestrator } from "./use-chart-phase-orchestrator";
import {
  buildYScalesFromDomains,
  DEFAULT_Y_AXIS_ID,
  getPrimaryYScale,
  groupLinesByYAxisId,
} from "./y-axis-scales";
import {
  computeYDomainsByAxis,
  resolveTimeSeriesYDomain,
} from "./y-domain-utils";

/**
 * Bleed around the series reveal clip so glyphs centred on the plot edge
 * (point markers, active rings, round stroke caps at min/max values) are not
 * cut in half once the reveal settles. The reveal only animates x, so the
 * vertical bleed is always applied; horizontal bleed is skipped while an
 * `xDomain` viewport is set because series then extend past the plot edges.
 */
const SERIES_CLIP_EDGE_BLEED = 24;

export interface TimeSeriesChartInnerProps {
  animationDuration: number;
  animationEasing?: string;
  /** Loading vs ready — drives chart phase until transition orchestration lands. */
  chartStatus?: ChartStatus;
  children: ReactNode;
  /**
   * Base SVG clipPath id for grow animation. Uniquified per chart instance so
   * multiple charts on one page do not share a clipPath (#226).
   */
  clipPathId: string;
  /** Optional ComposedChart bar layout (forwarded into context). */
  composedBarDataKeys?: string[];
  composedBarGap?: number;
  composedBarSize?: number;
  composedMaxBarSize?: number;
  composedStacked?: boolean;
  composedStackGap?: number;
  composedStackOffsets?: Map<number, Map<string, number>>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  data: Record<string, unknown>[];
  enterTransition?: Transition;
  height: number;
  /** Series keys driving y-domain and tooltip (Line / Area / SeriesBar configs). */
  lines: LineConfig[];
  loadingLabel?: string;
  margin: Margin;
  onPhaseChange?: (phase: ChartPhase) => void;
  /** Signature of motion URL state — triggers reveal replay when it changes. */
  revealSignature?: string;
  /** Tween y-domain when the visible x-range changes during the ready phase. */
  tweenYDomainOnXDomainChange?: boolean;
  width: number;
  xDataKey: string;
  /** Visible x-domain for brush zoom. When set, y-domain and series use data in this range. */
  xDomain?: [Date, Date];
  /** Full dataset length for x-scale padding when `xDomain` is set. */
  xDomainSlotCount?: number;
  /** Animate y-domain on status / data transitions. Default: true */
  yDomainTween?: boolean;
  yDomainTweenDuration?: number;
  /** When set, drives the y-axis max instead of scanning `lines` (e.g. stacked bar totals). */
  yScaleDomainMax?: number;
}

export function TimeSeriesChartInner(props: TimeSeriesChartInnerProps) {
  const { width, height } = props;
  if (width < 10 || height < 10) {
    return null;
  }
  return <TimeSeriesChartCore {...props} />;
}

const TimeSeriesChartCore = memo(function TimeSeriesChartCore({
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
  clipPathId,
  composedBarDataKeys,
  composedBarSize,
  composedMaxBarSize,
  composedBarGap,
  composedStacked,
  composedStackOffsets,
  composedStackGap,
  yScaleDomainMax,
  chartStatus = DEFAULT_CHART_STATUS,
  loadingLabel,
  yDomainTween = true,
  yDomainTweenDuration = DEFAULT_Y_DOMAIN_TWEEN_MS,
  xDomain,
  xDomainSlotCount,
  tweenYDomainOnXDomainChange = false,
  onPhaseChange,
}: TimeSeriesChartInnerProps) {
  // Unique per instance — shared clipPath ids crop later charts (#226).
  const uniqueClipPathId = `${clipPathId}-${useId().replace(/:/g, "")}`;
  const staticPreview = useStaticChartPreview();
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const resolveYDomain = useCallback(
    (sourceData: Record<string, unknown>[], dataKeys: string[]) => {
      const axisGroups = groupLinesByYAxisId(lines);
      const usesDefaultOnly =
        axisGroups.size === 1 && axisGroups.has(DEFAULT_Y_AXIS_ID);
      const domainMax =
        usesDefaultOnly && yScaleDomainMax != null
          ? yScaleDomainMax
          : undefined;
      return resolveTimeSeriesYDomain(sourceData, dataKeys, domainMax);
    },
    [lines, yScaleDomainMax]
  );

  const skeletonData = useMemo(() => {
    const primaryKey = lines[0]?.dataKey ?? "value";
    if (data.length === 0) {
      return generateChartSkeletonData({ dataKey: primaryKey });
    }
    return generateChartSkeletonFromTarget(data, primaryKey);
  }, [data, lines]);

  const {
    chartPhase,
    plotData,
    revealEpoch,
    concealEpoch,
    isLoaded,
    notifyLoadingPulseComplete,
    notifyRevealConcealComplete,
    notifyYDomainTweenComplete,
  } = useChartPhaseOrchestrator({
    animationDuration,
    chartStatus,
    revealSignature,
    skeletonData,
    skipEnterReveal: staticPreview,
    targetData: data,
    yDomainTweenDuration,
  });

  useEffect(() => {
    onPhaseChange?.(chartPhase);
  }, [chartPhase, onPhaseChange]);

  const xAccessor = useCallback(
    (d: Record<string, unknown>): Date => {
      const value = d[xDataKey];
      return value instanceof Date ? value : new Date(value as string | number);
    },
    [xDataKey]
  );

  const visiblePlotData = useMemo(() => {
    if (!xDomain) {
      return plotData;
    }
    return filterDataByXDomain(plotData, xDomain, xAccessor);
  }, [plotData, xDomain, xAccessor]);

  const projectionConfigs = useMemo(
    () => extractProjectionLineConfigs(children),
    [children]
  );

  // `<Band>` edges extend the y-domain and survive decimation, but are not
  // series: they never enter `lines`. The tooltip reads `bands` separately for
  // range rows / edge dots. Keyed by a string signature so new `children`
  // identities don't redo decimation.
  const bandConfigsSignature = JSON.stringify(extractBandConfigs(children));
  const bandConfigs = useMemo(
    () => JSON.parse(bandConfigsSignature) as BandConfig[],
    [bandConfigsSignature]
  );
  const bandKeysByAxisId = useMemo(
    () => bandKeysByAxis(bandConfigs),
    [bandConfigs]
  );

  const xScale = useMemo(() => {
    const minTime = xDomain
      ? xDomain[0].getTime()
      : (extent(plotData, (d) => xAccessor(d).getTime())[0] ?? 0);
    let maxTime = xDomain
      ? xDomain[1].getTime()
      : (extent(plotData, (d) => xAccessor(d).getTime())[1] ?? minTime);
    // Brush defines the viewport — projection horizon is included via brush
    // track extent, not by extending past the selection on the main chart.
    if (!xDomain) {
      maxTime = mergeProjectionXDomainMax(maxTime, projectionConfigs);
    }

    return scaleTime({
      domain: [minTime, maxTime],
      range: [0, innerWidth],
    });
  }, [innerWidth, plotData, projectionConfigs, xAccessor, xDomain]);

  // When brushing, keep the full series for path rendering so edge fades stay
  // anchored to the viewport while the line pans through them. Y-domain and
  // interaction still use the filtered visible slice.
  const seriesSourceData = xDomain ? plotData : visiblePlotData;

  const renderData = useMemo(() => {
    const valueKeys = lines.map((line) => line.dataKey);
    for (const keys of Object.values(bandKeysByAxisId)) {
      for (const key of keys) {
        if (!valueKeys.includes(key)) {
          valueKeys.push(key);
        }
      }
    }
    return decimateTimeSeries(
      seriesSourceData,
      maxRenderPointsForWidth(innerWidth),
      valueKeys
    );
  }, [seriesSourceData, innerWidth, lines, bandKeysByAxisId]);

  const columnWidth = useMemo(() => {
    const slotCount =
      xDomain && xDomainSlotCount != null
        ? xDomainSlotCount
        : visiblePlotData.length;
    if (slotCount < 2) {
      return 0;
    }
    return innerWidth / (slotCount - 1);
  }, [innerWidth, visiblePlotData.length, xDomain, xDomainSlotCount]);

  const yDomainSkeletonByAxis = useMemo(
    () =>
      computeYDomainsByAxis({
        lines,
        resolveDomain: (dataKeys) => resolveYDomain(skeletonData, dataKeys),
      }),
    [lines, resolveYDomain, skeletonData]
  );

  const yDomainTargetByAxis = useMemo(() => {
    const base = computeYDomainsByAxis({
      extraKeysByAxis: bandKeysByAxisId,
      lines,
      resolveDomain: (dataKeys) =>
        resolveYDomain(xDomain ? visiblePlotData : data, dataKeys),
    });
    if (projectionConfigs.length === 0) {
      return base;
    }
    const merged: Record<string, [number, number]> = { ...base };
    for (const axisId of Object.keys(base)) {
      merged[axisId] = mergeProjectionYDomain(
        base[axisId] ?? [0, 100],
        projectionConfigs,
        axisId
      );
    }
    for (const config of projectionConfigs) {
      if (!merged[config.yAxisId]) {
        merged[config.yAxisId] = mergeProjectionYDomain(
          [0, 100],
          projectionConfigs,
          config.yAxisId
        );
      }
    }
    return merged;
  }, [
    bandKeysByAxisId,
    data,
    lines,
    projectionConfigs,
    resolveYDomain,
    visiblePlotData,
    xDomain,
  ]);

  const animatedYDomainsByAxis = useAnimatedYDomains({
    chartPhase,
    durationMs: yDomainTweenDuration,
    enabled: yDomainTween,
    onSettled: notifyYDomainTweenComplete,
    skeletonByAxis: yDomainSkeletonByAxis,
    targetByAxis: yDomainTargetByAxis,
    tweenOnTargetChange:
      yDomainTween || (tweenYDomainOnXDomainChange && xDomain != null),
  });

  const yDomainsForScales = animatedYDomainsByAxis;

  const yScales = useMemo(
    () =>
      buildYScalesFromDomains({
        domainsByAxis: yDomainsForScales,
        innerHeight,
        lines,
      }),
    [yDomainsForScales, innerHeight, lines]
  );

  const yScale = getPrimaryYScale(
    yScales,
    scaleLinear({ domain: [0, 100], nice: true, range: [innerHeight, 0] })
  );

  const dateLabels = useMemo(
    () => visiblePlotData.map((d) => shortDateFmt.format(xAccessor(d))),
    [visiblePlotData, xAccessor]
  );

  const canInteract = isLoaded && isChartInteractionPhase(chartPhase);

  const {
    tooltipData,
    setTooltipData,
    selection,
    clearSelection,
    interactionHandlers,
    interactionStyle,
  } = useChartInteraction({
    bands: bandConfigs,
    canInteract,
    data: visiblePlotData,
    lines,
    margin,
    xAccessor,
    xScale,
    yScale,
    yScales,
  });

  const layers = partitionChartChildren(children);

  const [registeredReferenceAreas, setRegisteredReferenceAreas] = useState(
    () => new Map<string, ReferenceAreaConfig>()
  );

  const registerReferenceArea = useCallback(
    (id: string, config: ReferenceAreaConfig) => {
      setRegisteredReferenceAreas((prev) => {
        const existing = prev.get(id);
        if (
          existing &&
          existing.yAxisId === config.yAxisId &&
          existing.y1 === config.y1 &&
          existing.y2 === config.y2 &&
          existing.axisLabelColor === config.axisLabelColor
        ) {
          return prev;
        }
        const next = new Map(prev);
        next.set(id, config);
        return next;
      });
    },
    []
  );

  const unregisterReferenceArea = useCallback((id: string) => {
    setRegisteredReferenceAreas((prev) => {
      if (!prev.has(id)) {
        return prev;
      }
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const referenceAreaRegistration = useMemo(
    () => ({ registerReferenceArea, unregisterReferenceArea }),
    [registerReferenceArea, unregisterReferenceArea]
  );

  const referenceAreas = useMemo(() => {
    const extracted = extractReferenceAreaConfigs(children);
    const registered = [...registeredReferenceAreas.values()];
    if (registered.length === 0) {
      return extracted;
    }
    if (extracted.length === 0) {
      return registered;
    }
    return [...extracted, ...registered];
  }, [children, registeredReferenceAreas]);

  const contextValue = {
    animationDuration,
    animationEasing,
    bands: bandConfigs,
    chartPhase,
    chartStatus,
    clearSelection,
    columnWidth,
    composedBarDataKeys,
    composedBarGap,
    composedBarSize,
    composedMaxBarSize,
    composedStacked,
    composedStackGap,
    composedStackOffsets,
    containerRef,
    data: visiblePlotData,
    dateLabels,
    enterTransition,
    height,
    innerHeight,
    innerWidth,
    isLoaded,
    lines,
    loadingLabel,
    margin,
    notifyLoadingPulseComplete,
    referenceAreas,
    renderData,
    revealEpoch,
    selection,
    setTooltipData,
    tooltipData,
    width,
    xAccessor,
    xDomain,
    xDomainSlotCount,
    xScale,
    yDomainSkeletonByAxis,
    yDomainTargetByAxis,
    yDomainTweenDuration,
    yScale,
    yScales,
  };

  const useClipReveal =
    !staticPreview &&
    renderData.length > 1 &&
    innerWidth > 0 &&
    animationDuration > 0;
  const isRevealAnimating = chartPhase === "revealing";
  const isRevealConcealing =
    chartPhase === "exitingReady" && animationDuration > 0;

  const effectiveEnterTransition: Transition =
    enterTransition ??
    ({
      ...DEFAULT_CHART_ENTER_TRANSITION,
      duration: animationDuration / 1000,
    } satisfies Transition);

  const barRevealClipPadding = useMemo(() => {
    if (!composedBarDataKeys?.length) {
      return 0;
    }
    const barWidth = computeSeriesBarWidth({
      columnWidth,
      composedBarGap,
      composedBarSize,
      composedMaxBarSize,
      dataLength: plotData.length,
      innerWidth,
      seriesCount: composedBarDataKeys.length,
      stacked: composedStacked,
    });
    return computeSeriesBarRevealClipPadding({
      barWidth,
      gap: composedBarGap,
      seriesCount: composedBarDataKeys.length,
      stacked: composedStacked,
    });
  }, [
    columnWidth,
    composedBarDataKeys,
    composedBarGap,
    composedBarSize,
    composedMaxBarSize,
    composedStacked,
    innerWidth,
    plotData.length,
  ]);

  const revealClipPadding = xDomain
    ? barRevealClipPadding
    : Math.max(barRevealClipPadding, SERIES_CLIP_EDGE_BLEED);
  const revealClipPaddingY = Math.max(
    barRevealClipPadding,
    SERIES_CLIP_EDGE_BLEED
  );

  return (
    <ReferenceAreaRegistrationContext.Provider
      value={referenceAreaRegistration}
    >
      <ChartProvider value={contextValue}>
        <svg
          aria-hidden="true"
          className="overflow-visible"
          height={height}
          width={width}
        >
          <defs>
            {layers.defs}
            {useClipReveal ? (
              <ChartRevealClip
                animating={isRevealAnimating || isRevealConcealing}
                clipPathId={uniqueClipPathId}
                enterTransition={effectiveEnterTransition}
                height={innerHeight}
                mode={isRevealConcealing ? "conceal" : "reveal"}
                onComplete={
                  isRevealConcealing ? notifyRevealConcealComplete : undefined
                }
                padding={revealClipPadding}
                paddingY={revealClipPaddingY}
                revealEpoch={isRevealConcealing ? concealEpoch : revealEpoch}
                targetWidth={innerWidth}
              />
            ) : null}
          </defs>

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
            {useClipReveal ? (
              <g clipPath={`url(#${uniqueClipPathId})`}>{layers.series}</g>
            ) : (
              layers.series
            )}
            {layers.postOverlay}
          </g>
        </svg>
      </ChartProvider>
    </ReferenceAreaRegistrationContext.Provider>
  );
});

export interface TimeSeriesChartProps {
  /** Animation duration in milliseconds. Default: 1100 */
  animationDuration?: number;
  /** CSS easing for clip-reveal. Default: cubic-bezier(0.85, 0, 0.15, 1) */
  animationEasing?: string;
  /** Aspect ratio as "width / height". Default: "2 / 1". Omit to fill a sized parent. */
  aspectRatio?: string;
  /** Child components (series, Grid, axes, ChartTooltip, etc.) */
  children: ReactNode;
  /** Additional class name for the container */
  className?: string;
  /** Data array - each item should have a date field and numeric values */
  data: Record<string, unknown>[];
  /** Motion enter transition (spring or cubic-bezier tween). */
  enterTransition?: Transition;
  /** Centered shimmer label while loading. */
  loadingLabel?: string;
  /** Chart margins */
  margin?: Partial<Margin>;
  /** Fires when the internal chart phase changes (e.g. OG capture readiness). */
  onPhaseChange?: (phase: ChartPhase) => void;
  /** Signature of motion URL state — triggers reveal replay when it changes. */
  revealSignature?: string;
  /** Loading vs ready — drives chart phase and loading chrome. Default: `"ready"`. */
  status?: ChartStatus;
  /** Inline container styles (e.g. fixed height for brush strip). */
  style?: CSSProperties;
  /** Tween y-domain when brush changes the visible x-range. Default: false */
  tweenYDomainOnXDomainChange?: boolean;
  /** Key in data for the x-axis (date). Default: "date" */
  xDataKey?: string;
  /** Visible x-domain for brush zoom. */
  xDomain?: [Date, Date];
  /** Full dataset length for x-scale padding when `xDomain` is set. */
  xDomainSlotCount?: number;
  /** Animate y-domain when status or target domain changes. Default: true */
  yDomainTween?: boolean;
  /** Animate y-domain over this duration (ms) on status transitions. Default: 500. */
  yDomainTweenDuration?: number;
}

/** Series and layout a chart root derives from its children. */
type TimeSeriesChartSeriesProps = Pick<
  TimeSeriesChartInnerProps,
  | "clipPathId"
  | "composedBarDataKeys"
  | "composedBarGap"
  | "composedBarSize"
  | "composedMaxBarSize"
  | "composedStacked"
  | "composedStackGap"
  | "composedStackOffsets"
  | "lines"
  | "yScaleDomainMax"
>;

const DEFAULT_MARGIN: Margin = { bottom: 40, left: 40, right: 40, top: 40 };

/** Phases that show the centered loading label. */
const LOADING_LABEL_PHASES = new Set<ChartPhase>([
  "loading",
  "exiting",
  "gridTweenReady",
  "revealingLoading",
]);

/**
 * Root shared by `LineChart`, `AreaChart` and `ComposedChart`: a container
 * that measures itself, the time-series core and the loading label. Each
 * chart passes the series it extracted from its children.
 */
export function TimeSeriesChart({
  animationDuration = 1100,
  aspectRatio = "2 / 1",
  children,
  className = "",
  data,
  loadingLabel,
  margin: marginProp,
  onPhaseChange,
  status = DEFAULT_CHART_STATUS,
  style,
  xDataKey = "date",
  ...coreProps
}: TimeSeriesChartProps & TimeSeriesChartSeriesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const margin = { ...DEFAULT_MARGIN, ...marginProp };
  const [chartPhase, setChartPhase] = useState<ChartPhase>(() =>
    resolveRestingChartPhase(status)
  );
  const handlePhaseChange = useCallback(
    (phase: ChartPhase) => {
      setChartPhase(phase);
      onPhaseChange?.(phase);
    },
    [onPhaseChange]
  );

  const showLoadingLabel = Boolean(
    loadingLabel?.trim() && LOADING_LABEL_PHASES.has(chartPhase)
  );

  return (
    <div
      className={cn("relative w-full", className)}
      ref={containerRef}
      style={{ aspectRatio, touchAction: "none", ...style }}
    >
      <ParentSize debounceTime={10}>
        {({ width, height }) => (
          <TimeSeriesChartInner
            {...coreProps}
            animationDuration={animationDuration}
            chartStatus={status}
            containerRef={containerRef}
            data={data}
            height={height}
            loadingLabel={loadingLabel}
            margin={margin}
            onPhaseChange={handlePhaseChange}
            width={width}
            xDataKey={xDataKey}
          >
            {children}
          </TimeSeriesChartInner>
        )}
      </ParentSize>
      {showLoadingLabel ? (
        <ChartLoadingLabel
          exiting={chartPhase !== "loading"}
          text={loadingLabel}
        />
      ) : null}
    </div>
  );
}
