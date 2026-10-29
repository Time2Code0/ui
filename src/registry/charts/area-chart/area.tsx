"use client";

import type { CurveFactory } from "d3-shape";
import type { LoadingStyle } from "../chart-core/chart-phase";
import type { SeriesPointMarkerStyle } from "../chart-series-markers/series-point-marker";

import { useCallback, useId, useMemo, useRef } from "react";

import { curveMonotoneX } from "@visx/curve";
import { AreaClosed, LinePath } from "@visx/shape";

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

interface AreaGradientDefsProps {
  edgeGradientId: string;
  edgeMaskId: string;
  fadeEdges: FadeEdges;
  fill: string;
  fillOpacity: number;
  gradientId: string;
  /** 0–1: where the bottom stop sits (1 = full-height gradient). */
  gradientSpan?: number;
  gradientToOpacity: number;
  innerHeight: number;
  innerWidth: number;
  isPatternFill: boolean;
  resolvedStroke: string;
  strokeGradientId: string;
}

function AreaGradientDefs({
  gradientId,
  strokeGradientId,
  edgeMaskId,
  edgeGradientId,
  fill,
  fillOpacity,
  gradientToOpacity,
  gradientSpan = 1,
  resolvedStroke,
  isPatternFill,
  fadeEdges,
  innerWidth,
  innerHeight,
}: AreaGradientDefsProps) {
  const sides = resolveFadeSides(fadeEdges);
  // Stroke gradient mirrors the area's edge fade so the line doesn't pop in
  // past the faded fill. Skip emitting it when neither edge fades — the line
  // can then paint a solid stroke instead of an unnecessary url(#...) ref.
  const strokeStops = sides.any ? fadeGradientStops(sides) : null;
  const showEdgeMask = sides.any && !isPatternFill;
  const edgeStops = showEdgeMask ? fadeGradientStops(sides) : null;
  const span = Math.min(1, Math.max(0.01, gradientSpan));
  const midOffset = `${span * 100}%`;

  return (
    <defs>
      {isPatternFill ? null : (
        <linearGradient id={gradientId} x1="0%" x2="0%" y1="0%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: fill, stopOpacity: fillOpacity }}
          />
          <stop
            offset={midOffset}
            style={{ stopColor: fill, stopOpacity: gradientToOpacity }}
          />
          {span < 1 ? (
            <stop
              offset="100%"
              style={{ stopColor: fill, stopOpacity: gradientToOpacity }}
            />
          ) : null}
        </linearGradient>
      )}

      {strokeStops ? (
        <linearGradient
          id={strokeGradientId}
          {...viewportFadeGradientAttrs(innerWidth)}
        >
          {strokeStops.map((stop) => (
            <stop
              key={stop.offset}
              offset={stop.offset}
              style={{ stopColor: resolvedStroke, stopOpacity: stop.opacity }}
            />
          ))}
        </linearGradient>
      ) : null}

      {edgeStops ? (
        <>
          <linearGradient
            id={edgeGradientId}
            {...viewportFadeGradientAttrs(innerWidth)}
          >
            {edgeStops.map((stop) => (
              <stop
                key={stop.offset}
                offset={stop.offset}
                style={{ stopColor: "white", stopOpacity: stop.opacity }}
              />
            ))}
          </linearGradient>
          <mask id={edgeMaskId}>
            <rect
              fill={`url(#${edgeGradientId})`}
              height={innerHeight}
              width={innerWidth}
              x="0"
              y="0"
            />
          </mask>
        </>
      ) : null}
    </defs>
  );
}
