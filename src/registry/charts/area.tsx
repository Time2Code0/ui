"use client";

import type { CurveFactory } from "d3-shape";
import type { LoadingStyle } from "./chart-phase";
import type { SeriesPointMarkerStyle } from "./series-point-marker";

import { useCallback, useId, useMemo, useRef } from "react";

import { curveMonotoneX } from "@visx/curve";
import { AreaClosed, LinePath } from "@visx/shape";

import { AreaGradientDefs } from "./area-gradient-defs";
import { chartCssVars, useChartStable, useYScale } from "./chart-context";
import { isSeriesContentPhase } from "./chart-phase";
import { type FadeEdges, resolveFadeSides } from "./fade-edges";
import {
  type LineLoadingPulseMode,
  SeriesLoadingOverlays,
  useSeriesLoadingPulse,
} from "./line-loading-pulse";
import {
  resolveDashTailBounds,
  usePathStrokeMetrics,
} from "./path-stroke-utils";
import { SeriesDashTailOverlay } from "./series-dash-tail-overlay";
import { SeriesHighlightLayer } from "./series-highlight-layer";
import { SeriesHoverDim } from "./series-hover-dim";
import { SeriesMarkers } from "./series-markers";

export interface AreaProps {
  /** Whether to animate the area. @default true */
  animate?: boolean;
  /** Curve function. @default curveMonotoneX */
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
   * Fade the area fill (and stroke) toward transparent at the chart edges.
   * - `true` fades both edges, `false` disables the fade entirely.
   * - `"left"` / `"right"` fades only that side — useful when the opposite
   *   edge butts up against another element you don't want to fade into.
   * @default false
   */
  fadeEdges?: FadeEdges;
  /** Fade value labels with the chart edges. @default false */
  fadeValueLabels?: boolean;
  /** Fill color for the area gradient start. @default var(--color-chart-1) */
  fill?: string;
  /** Fill opacity at the top of the area. @default 0.4 */
  fillOpacity?: number;
  /**
   * Vertical extent of the fill gradient (0–1). `1` fades across the full
   * height; lower values compress the gradient toward the top.
   */
  gradientSpan?: number;
  /** Gradient opacity at bottom (0 = fully transparent). @default 0 */
  gradientToOpacity?: number;
  /**
   * Show the loading pulse overlay. Follows the chart loading phase by
   * default; set `false` to disable even during loading.
   */
  loading?: boolean;
  /** Override pulse animation mode (loop / exit / enter). @internal */
  loadingPulseMode?: LineLoadingPulseMode;
  /** Pulse stroke color while chart is loading. @default var(--color-foreground) */
  loadingStroke?: string;
  /** Pulse stroke opacity while chart is loading. @default 0.5 */
  loadingStrokeOpacity?: number;
  /**
   * Loading animation while the chart is in loading status: the default
   * traveling `"pulse"`, or a diagonal `"sweep"` shimmer across the skeleton
   * area.
   * @default "pulse"
   */
  loadingStyle?: LoadingStyle;
  /** Marker styling (same options as Scatter). */
  markers?: SeriesPointMarkerStyle;
  /** Whether to show highlight segment on hover. @default true */
  showHighlight?: boolean;
  /** Whether to show the stroke line. @default true */
  showLine?: boolean;
  /** Render scatter-style circle markers at each data point. @default false */
  showMarkers?: boolean;
  /** Show smart formatted values above data points. @default false */
  showValue?: boolean;
  /** Stroke color for the line. @default fill */
  stroke?: string;
  /** Stroke width. @default 2 */
  strokeWidth?: number;
  /** Text color for values displayed above data points. @default stroke */
  valueLabelColor?: string;
  /**
   * Format values displayed above data points. Defaults to English integer formatting.
   */
  valueLabelFormatter?: (value: number) => string;
  /**
   * Maximum labels per series. `0` hides labels; when omitted, the count follows the available width.
   */
  valueLabelMaxCount?: number;
  /** Preferred minimum labels per series, subject to available space. @default 2 */
  valueLabelMinCount?: number;
  /** Y-scale group id (Recharts `yAxisId`). @default "left" */
  yAxisId?: string | number;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: mirrors Line series layout (fill, stroke, dash, markers, pulse)
export function Area({
  dataKey,
  yAxisId,
  fill = chartCssVars.linePrimary,
  fillOpacity = 0.4,
  stroke,
  strokeWidth = 2,
  curve = curveMonotoneX,
  animate = true,
  showLine = true,
  showHighlight = true,
  gradientToOpacity = 0,
  gradientSpan = 1,
  fadeEdges = false,
  showMarkers = false,
  markers,
  dashFromIndex,
  dashArray = "6,4",
  loading,
  loadingStroke = chartCssVars.foreground,
  loadingStrokeOpacity = 0.5,
  loadingPulseMode,
  loadingStyle = "pulse",
}: AreaProps) {
  // Stable slice only: hover state lives inside `<SeriesHoverDim>` and
  // `<SeriesHighlightLayer>` so this component (and its expensive
  // <SeriesDashTailOverlay> child) does not re-render on cursor motion.
  // The reveal-clip is now a single shared clipPath at the chart-shell
  // level (`time-series-chart-shell.tsx`); we no longer render a per-area
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
  } = useChartStable();
  const yScale = useYScale(yAxisId);
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
  });
  const showSeriesContent = isSeriesContentPhase(chartPhase);

  const seriesIndex = useMemo(() => {
    const index = lines.findIndex((line) => line.dataKey === dataKey);
    return index >= 0 ? index : 0;
  }, [lines, dataKey]);

  const pathRef = useRef<SVGPathElement>(null);
  const { pathLength, pathD } = usePathStrokeMetrics(pathRef, [
    renderData,
    innerWidth,
    dashFromIndex,
    showLine,
    showSeriesContent,
    showLoadingPulse,
  ]);

  // Unique IDs for this area
  const uniqueId = useId();
  const gradientId = `area-gradient-${dataKey}-${uniqueId}`;
  const strokeGradientId = `area-stroke-gradient-${dataKey}-${uniqueId}`;
  const edgeMaskId = `area-edge-mask-${dataKey}-${uniqueId}`;
  const edgeGradientId = `${edgeMaskId}-gradient`;

  const isPatternFill = fill.startsWith("url(");
  const showAreaFill = isPatternFill || fillOpacity > 0;
  const areaFill = isPatternFill ? fill : `url(#${gradientId})`;

  // Resolved stroke color (defaults to fill; pattern URLs need a real color)
  const resolvedStroke =
    stroke || (isPatternFill ? chartCssVars.linePrimary : fill);

  const getY = useCallback(
    (d: Record<string, unknown>) => {
      const value = d[dataKey];
      return typeof value === "number" ? (yScale(value) ?? 0) : 0;
    },
    [dataKey, yScale]
  );

  const hasDashTail = resolveDashTailBounds(dashFromIndex, data.length);
  // The stroke gradient is only emitted when at least one edge fades, so fall
  // back to the resolved solid color otherwise — avoids an invalid url(#...).
  const fadeSides = resolveFadeSides(fadeEdges);
  const useViewportEdgeFade = fadeSides.any && !isPatternFill;
  let strokePaint = resolvedStroke;
  if (!useViewportEdgeFade && fadeSides.any) {
    strokePaint = `url(#${strokeGradientId})`;
  }
  const highlightEnabled =
    showHighlight && showLine && !showLoadingPulse && showSeriesContent;
  const showSeriesStroke = showSeriesContent && showLine;
  let visibleStroke = "transparent";
  if (showSeriesStroke && !hasDashTail) {
    visibleStroke = strokePaint;
  }
  const shouldMeasurePath = showLine && (showSeriesContent || showLoadingPulse);

  const seriesLayers = (
    <>
      {showSeriesContent && showAreaFill ? (
        <AreaClosed
          curve={curve}
          data={renderData}
          fill={areaFill}
          x={(d) => xScale(xAccessor(d)) ?? 0}
          y={getY}
          yScale={yScale}
        />
      ) : null}

      {shouldMeasurePath ? (
        <>
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
          {showSeriesStroke ? (
            <SeriesDashTailOverlay
              dashArray={dashArray}
              dashFromIndex={dashFromIndex}
              data={data}
              innerHeight={innerHeight}
              innerWidth={innerWidth}
              pathD={pathD}
              pathLength={pathLength}
              stroke={strokePaint}
              strokeWidth={strokeWidth}
              xAccessor={xAccessor}
              xScale={xScale}
            />
          ) : null}
        </>
      ) : null}
    </>
  );

  return (
    <>
      <AreaGradientDefs
        edgeGradientId={edgeGradientId}
        edgeMaskId={edgeMaskId}
        fadeEdges={fadeEdges}
        fill={fill}
        fillOpacity={fillOpacity}
        gradientId={gradientId}
        gradientSpan={gradientSpan}
        gradientToOpacity={gradientToOpacity}
        innerHeight={innerHeight}
        innerWidth={innerWidth}
        isPatternFill={isPatternFill}
        resolvedStroke={resolvedStroke}
        strokeGradientId={strokeGradientId}
      />

      <SeriesHoverDim
        dimOpacity={0.6}
        enabled={showHighlight}
        seriesIndex={seriesIndex}
      >
        {useViewportEdgeFade ? (
          <g mask={`url(#${edgeMaskId})`}>{seriesLayers}</g>
        ) : (
          seriesLayers
        )}
      </SeriesHoverDim>

      {/* Highlight segment on hover — isolated hover subscriber. */}
      <SeriesHighlightLayer
        enabled={highlightEnabled}
        height={innerHeight}
        pathRef={pathRef}
        stroke={resolvedStroke}
        strokeWidth={strokeWidth}
      />

      {showMarkers && showSeriesContent ? (
        <SeriesMarkers
          animate={animate}
          dataKey={dataKey}
          {...markers}
          fill={markers?.fill ?? resolvedStroke}
          stroke={markers?.stroke ?? markers?.fill ?? resolvedStroke}
        />
      ) : null}

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
        withArea
      />
    </>
  );
}

Area.displayName = "Area";
