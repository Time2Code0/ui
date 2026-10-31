"use client";

import type { CurveFactory } from "d3-shape";
import type { LoadingStyle } from "../chart-core/chart-phase";
import type { SeriesPointMarkerStyle } from "../chart-series-markers/series-point-marker";

import { type RefObject, useCallback, useId, useMemo, useRef } from "react";

import { curveNatural } from "@visx/curve";
import { LinePath } from "@visx/shape";

import {
  chartCssVars,
  useChartStable,
  useYScale,
} from "../chart-core/chart-context";
import { isSeriesContentPhase } from "../chart-core/chart-phase";
import {
  resolveDashTailBounds,
  SeriesDashTailOverlay,
  usePathStrokeMetrics,
} from "../chart-series/series-dash-tail";
import { SeriesHighlightLayer } from "../chart-series/series-highlight";
import { SeriesHoverDim } from "../chart-series/series-hover-dim";
import {
  type LineLoadingPulseMode,
  SeriesLoadingOverlays,
  useSeriesLoadingPulse,
} from "../chart-series/series-loading-pulse";
import { SeriesMarkers } from "../chart-series-markers/series-markers";
import {
  type FadeEdges,
  fadeGradientStops,
  resolveFadeSides,
  viewportFadeGradientAttrs,
} from "../chart-utils/fade-edges";
import { useAnimatedSeriesPath } from "./use-animated-series-path";

export interface LineProps {
  /** Whether to animate the line. @default true */
  animate?: boolean;
  /** Curve function. @default curveNatural */
  curve?: CurveFactory;
  /** Dash pattern for the tail segment when `dashFromIndex` is set. @default "6,4" */
  dashArray?: string;
  /**
   * Data index from which the line stroke becomes dashed (inclusive).
   * Useful for projecting incomplete periods, e.g. dashed from yesterday through today.
   */
  dashFromIndex?: number;
  /** Key in data to use for y values */
  dataKey: string;
  /**
   * Fade the line stroke toward transparent at the chart edges.
   * - `true` fades both edges, `false` disables the fade entirely.
   * - `"left"` / `"right"` fades only that side.
   * @default true
   */
  fadeEdges?: FadeEdges;
  /**
   * Show the loading pulse overlay. Follows the chart loading phase by
   * default; set `false` to disable even during loading.
   */
  loading?: boolean;
  /** Override pulse animation mode (loop / exit / enter). @internal */
  loadingPulseMode?: LineLoadingPulseMode;
  /** Stroke color for the loading pulse overlay. @default var(--color-foreground) */
  loadingStroke?: string;
  /** Loading pulse stroke opacity. @default 0.5 */
  loadingStrokeOpacity?: number;
  /**
   * Loading animation while the chart is in loading status: the default
   * traveling `"pulse"`, or a diagonal `"sweep"` shimmer across the skeleton
   * line.
   * @default "pulse"
   */
  loadingStyle?: LoadingStyle;
  /** Marker styling (same options as Scatter). */
  markers?: SeriesPointMarkerStyle;
  /** Called when a loop-mode pulse cycle completes. */
  onLoadingPulseCycleComplete?: () => void;
  /** Whether to show highlight segment on hover. @default true */
  showHighlight?: boolean;
  /** Render scatter-style circle markers at each data point. @default false */
  showMarkers?: boolean;
  /** Stroke color. @default var(--color-chart-1) */
  stroke?: string;
  /** Stroke width. @default 2.5 */
  strokeWidth?: number;
  /** Y-scale group id (Recharts `yAxisId`). @default "left" */
  yAxisId?: string | number;
}

function LineSeriesStroke({
  animatedPathD,
  curve,
  getY,
  pathRef,
  renderData,
  strokeWidth,
  useDataTransitionPath,
  visibleStroke,
  xAccessor,
  xScale,
}: {
  animatedPathD: string;
  curve: CurveFactory;
  getY: (datum: Record<string, unknown>) => number;
  pathRef: RefObject<SVGPathElement | null>;
  renderData: Record<string, unknown>[];
  strokeWidth: number;
  useDataTransitionPath: boolean;
  visibleStroke: string;
  xAccessor: (datum: Record<string, unknown>) => Date;
  xScale: (value: Date) => number | undefined;
}) {
  if (useDataTransitionPath && animatedPathD) {
    return (
      <path
        d={animatedPathD}
        fill="none"
        ref={pathRef}
        stroke={visibleStroke}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      />
    );
  }

  return (
    <LinePath
      curve={curve}
      data={renderData}
      innerRef={pathRef}
      stroke={visibleStroke}
      strokeLinecap="round"
      strokeWidth={strokeWidth}
      x={(d) => xScale(xAccessor(d)) ?? 0}
      y={getY}
    />
  );
}

export function Line({
  dataKey,
  yAxisId,
  stroke = chartCssVars.linePrimary,
  strokeWidth = 2.5,
  curve = curveNatural,
  animate = true,
  fadeEdges = true,
  showHighlight = true,
  showMarkers = false,
  markers,
  dashFromIndex,
  dashArray = "6,4",
  loading,
  loadingStroke = chartCssVars.foreground,
  loadingStrokeOpacity = 0.5,
  loadingPulseMode,
  onLoadingPulseCycleComplete,
  loadingStyle = "pulse",
}: LineProps) {
  // Stable slice only: hover state lives inside `<SeriesHoverDim>` and
  // `<SeriesHighlightLayer>` so this component (and its expensive
  // <SeriesDashTailOverlay> child) does not re-render on cursor motion.
  // The reveal-clip is now a single shared clipPath at the chart-shell
  // level (`time-series-chart-shell.tsx`); we no longer render a per-line
  // `<ChartRevealClip>` or read `revealEpoch` here.
  const {
    data,
    renderData,
    xScale,
    innerHeight,
    innerWidth,
    xAccessor,
    lines,
    chartPhase,
    notifyLoadingPulseComplete,
    yDomainTweenDuration,
  } = useChartStable();
  const yScale = useYScale(yAxisId);
  const useDataTransitionPath = animate && chartPhase === "ready";
  const { pathD: animatedPathD } = useAnimatedSeriesPath({
    chartPhase,
    curve,
    dataKey,
    durationMs: yDomainTweenDuration,
    enabled: useDataTransitionPath,
    innerWidth,
    renderData,
    xAccessor,
    xScale,
    yScale,
  });

  const {
    handleLoadingPulseComplete,
    pulseEpoch,
    pulseMode,
    showLoadingPulse,
  } = useSeriesLoadingPulse({
    chartPhase,
    loading,
    loadingPulseMode,
    notifyLoadingPulseComplete,
    onCycleComplete: onLoadingPulseCycleComplete,
  });
  const effectiveShowHighlight = showHighlight && !showLoadingPulse;

  const seriesIndex = useMemo(() => {
    const index = lines.findIndex((line) => line.dataKey === dataKey);
    return index >= 0 ? index : 0;
  }, [lines, dataKey]);

  const pathRef = useRef<SVGPathElement>(null);
  const { pathLength, pathD } = usePathStrokeMetrics(pathRef, [
    renderData,
    innerWidth,
    dashFromIndex,
    animate,
    useDataTransitionPath ? animatedPathD : null,
  ]);

  const reactId = useId();
  const gradientId = `line-gradient-${dataKey}-${reactId}`;

  const getY = useCallback(
    (d: Record<string, unknown>) => {
      const value = d[dataKey];
      return typeof value === "number" ? (yScale(value) ?? 0) : 0;
    },
    [dataKey, yScale]
  );

  const hasDashTail = resolveDashTailBounds(dashFromIndex, data.length);
  const fadeSides = resolveFadeSides(fadeEdges);
  const lineStroke = fadeSides.any ? `url(#${gradientId})` : stroke;
  const fadeStops = fadeSides.any ? fadeGradientStops(fadeSides) : null;
  const showSeriesStroke = isSeriesContentPhase(chartPhase);
  let visibleStroke = "transparent";
  if (showSeriesStroke && !hasDashTail) {
    visibleStroke = lineStroke;
  }

  return (
    <>
      {fadeStops ? (
        <defs>
          <linearGradient
            id={gradientId}
            {...viewportFadeGradientAttrs(innerWidth)}
          >
            {fadeStops.map((stop) => (
              <stop
                key={stop.offset}
                offset={stop.offset}
                style={{ stopColor: stroke, stopOpacity: stop.opacity }}
              />
            ))}
          </linearGradient>
        </defs>
      ) : null}

      <SeriesHoverDim
        dimOpacity={0.3}
        enabled={effectiveShowHighlight}
        seriesIndex={seriesIndex}
      >
        <LineSeriesStroke
          animatedPathD={animatedPathD}
          curve={curve}
          getY={getY}
          pathRef={pathRef}
          renderData={renderData}
          strokeWidth={strokeWidth}
          useDataTransitionPath={useDataTransitionPath}
          visibleStroke={visibleStroke}
          xAccessor={xAccessor}
          xScale={xScale}
        />

        <SeriesDashTailOverlay
          dashArray={dashArray}
          dashFromIndex={dashFromIndex}
          data={data}
          innerHeight={innerHeight}
          innerWidth={innerWidth}
          pathD={pathD}
          pathLength={pathLength}
          stroke={lineStroke}
          strokeWidth={strokeWidth}
          xAccessor={xAccessor}
          xScale={xScale}
        />
      </SeriesHoverDim>

      {showMarkers ? (
        <SeriesMarkers
          animate={animate}
          dataKey={dataKey}
          {...markers}
          fill={markers?.fill ?? stroke}
          stroke={markers?.stroke ?? markers?.fill ?? stroke}
        />
      ) : null}

      <SeriesHighlightLayer
        enabled={effectiveShowHighlight}
        height={innerHeight}
        pathRef={pathRef}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />

      <SeriesLoadingOverlays
        curve={curve}
        handleLoadingPulseComplete={handleLoadingPulseComplete}
        innerWidth={innerWidth}
        loadingStroke={loadingStroke}
        loadingStrokeOpacity={loadingStrokeOpacity}
        loadingStyle={loadingStyle}
        pathD={pathD}
        pulseEpoch={pulseEpoch}
        pulseMode={pulseMode}
        showLoadingPulse={showLoadingPulse}
        strokeWidth={strokeWidth}
      />
    </>
  );
}

Line.displayName = "Line";
