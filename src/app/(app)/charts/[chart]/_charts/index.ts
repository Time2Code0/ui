// biome-ignore-all lint/performance/noBarrelFile: local entry point for the chart playground (mirrors @bklitui/ui/charts)
// Chart context and hooks

export type {
  GaugeLabelAlign,
  GaugeLabelPlacement,
} from "@/registry/charts/gauge-label-layout";
export type { ScatterJitter } from "@/registry/charts/scatter-jitter";
export type {
  SparklineCurve,
  SparklineDataKey,
  SparklinePadding,
} from "@/registry/charts/sparkline-geometry";
export type { SunburstNode } from "@/registry/charts/sunburst-data";

// Re-export visx gradient and pattern components for bar fill styling
export {
  GradientDarkgreenGreen,
  GradientLightgreenGreen,
  GradientOrangeRed,
  GradientPinkBlue,
  GradientPinkRed,
  GradientPurpleOrange,
  GradientPurpleTeal,
  GradientSteelPurple,
  GradientTealBlue,
  LinearGradient,
  RadialGradient,
} from "@visx/gradient";

export {
  DEFAULT_ANIMATION_DURATION_MS,
  DEFAULT_ANIMATION_EASING,
  DEFAULT_CHART_ENTER_TRANSITION,
} from "@/registry/charts/animation";
// Area chart components
export { Area, type AreaProps } from "@/registry/charts/area";
export { AreaChart, type AreaChartProps } from "@/registry/charts/area-chart";
export {
  AreaChartLoading,
  type AreaChartLoadingProps,
} from "@/registry/charts/area-chart-loading";
// Shared chart elements
export { Background, type BackgroundProps } from "@/registry/charts/background";
export {
  Band,
  type BandFadeEdges,
  type BandFillType,
  type BandProps,
  type BandStrokeProps,
} from "@/registry/charts/band";
export {
  type BandConfig,
  extractBandConfigs,
} from "@/registry/charts/band-config";
// Bar chart components
export {
  Bar,
  type BarAnimationType,
  type BarLineCap,
  type BarProps,
} from "@/registry/charts/bar";
export {
  BarChart,
  type BarChartProps,
  type BarOrientation,
} from "@/registry/charts/bar-chart";
// Bar chart loading skeleton (a `status="loading"` shortcut)
export {
  BarChartLoading,
  type BarChartLoadingProps,
} from "@/registry/charts/bar-chart-loading";
// Bar 3D depth + glass surfaces (composable layers for BarChart)
export {
  BarDepthBack,
  type BarDepthBackProps,
  type BarDepthEntry,
  BarDepthFront,
  type BarDepthFrontProps,
  BarDepthProvider,
  type BarDepthProviderProps,
  type BarDepthSegment,
  BarPulse,
  type BarPulseProps,
  useBarDepthEntries,
} from "@/registry/charts/bar-depth";
export {
  BarColumnTrack,
  type BarColumnTrackProps,
  BarSquares,
  type BarSquaresProps,
  type GradientStop,
} from "@/registry/charts/bar-squares";
export {
  computeSquareColumn,
  type SquareColumnLayout,
  topSquareCenterY,
} from "@/registry/charts/bar-squares-layout";
export { BarXAxis, type BarXAxisProps } from "@/registry/charts/bar-x-axis";
export { BarYAxis, type BarYAxisProps } from "@/registry/charts/bar-y-axis";
export {
  type BollingerBandsOptions,
  withBollingerBands,
} from "@/registry/charts/bollinger";
export {
  Candlestick,
  type CandlestickProps,
} from "@/registry/charts/candlestick";
export {
  CandlestickChart,
  type CandlestickChartProps,
  type OHLCDataPoint,
} from "@/registry/charts/candlestick-chart";
export {
  chartCenterContainerClassName,
  chartCenterLabelClassName,
  chartCenterValueClassName,
} from "@/registry/charts/chart-center-typography";
export { CHART_CLIP_PASSTHROUGH } from "@/registry/charts/chart-child-passthrough";
export {
  ChartConfigProvider,
  type ChartConfigProviderProps,
  type ChartConfigValue,
  DEFAULT_CHART_CONFIG,
  resolveTooltipBoxMotion,
  type SpringConfig,
  useChartConfig,
} from "@/registry/charts/chart-config-context";
export {
  type ChartContextValue,
  type ChartHoverContextValue,
  ChartProvider,
  type ChartStableContextValue,
  chartCssVars,
  defaultScatterColors,
  type LineConfig,
  type Margin,
  type TooltipData,
  useChart,
  useChartHover,
  useChartStable,
  useYScale,
} from "@/registry/charts/chart-context";
export {
  ChartLegendHoverProvider,
  useChartLegendHover,
} from "@/registry/charts/chart-legend-hover";
export {
  ChartLoadingLabel,
  type ChartLoadingLabelProps,
} from "@/registry/charts/chart-loading-label";
export {
  type ChartPhase,
  type ChartStatus,
  DEFAULT_CHART_LIFECYCLE,
  DEFAULT_CHART_STATUS,
  DEFAULT_Y_DOMAIN_TWEEN_MS,
  isChartInteractionPhase,
  type LoadingStyle,
  resolveRestingChartPhase,
} from "@/registry/charts/chart-phase";
export {
  ChartRevealClip,
  type ChartRevealClipProps,
} from "@/registry/charts/chart-reveal-clip";
export {
  CHART_SCALE_VARS,
  type ChartScaleVars,
  chartScaleCssVars,
} from "@/registry/charts/chart-scale";
export {
  ChartStatFlow,
  type ChartStatFlowFormat,
  type ChartStatFlowProps,
  defaultChartStatFlowFormat,
} from "@/registry/charts/chart-stat-flow";
// Choropleth chart components
export {
  ChoroplethChart,
  type ChoroplethChartProps,
  type ChoroplethContextValue,
  type ChoroplethFeature,
  ChoroplethFeatureComponent,
  type ChoroplethFeatureProperties,
  type ChoroplethFeatureProps,
  ChoroplethGraticule,
  type ChoroplethGraticuleProps,
  ChoroplethProvider,
  ChoroplethTooltip,
  type ChoroplethTooltipData,
  type ChoroplethTooltipProps,
  choroplethCssVars,
  defaultChoroplethColors,
  type TransformMatrix,
  useChoropleth,
  useChoroplethZoom,
} from "@/registry/charts/choropleth";
// Composed time-series (line + area + SeriesBar on shared time scale)
export {
  ComposedChart,
  type ComposedChartProps,
} from "@/registry/charts/composed-chart";
// Date-axis utilities (weekend shading, deadline marker)
export {
  computeWeekendIndexRuns,
  computeWeekendRanges,
  type DateRange,
  type DateRangeAlign,
  DEFAULT_WEEKEND_DAYS,
  isWeekendDate,
  type WeekdayIndex,
} from "@/registry/charts/date-ranges";
export {
  Deadline,
  type DeadlineDate,
  type DeadlineFillType,
  type DeadlineProps,
} from "@/registry/charts/deadline";
// Funnel chart components
export {
  FunnelChart,
  type FunnelChartProps,
  type FunnelGradientStop,
  type FunnelStage,
} from "@/registry/charts/funnel-chart";
// Gauge chart
export {
  Gauge,
  type GaugeOrientation,
  type GaugeProps,
} from "@/registry/charts/gauge";
export {
  type GenerateChartSkeletonDataOptions,
  generateChartSkeletonData,
} from "@/registry/charts/generate-chart-skeleton-data";
export { Grid, type GridProps } from "@/registry/charts/grid";
// Heatmap chart components
export {
  buildHeatmapColorScale,
  buildHeatmapColorScaleFromStyles,
  buildHeatmapFillScale,
  buildHeatmapLegendGradient,
  buildHeatmapRowOpacity,
  defaultHeatmapColorScale,
  defaultHeatmapFillScale,
  filterHeatmapColumns,
  formatHeatmapContributionLabel,
  formatHeatmapTooltipDate,
  formatHeatmapTooltipWeekday,
  formatHeatmapYAxisLabel,
  getHeatmapCalendarRangeStart,
  getHeatmapColumnMonthAnchor,
  getHeatmapDayLabels,
  getHeatmapSeparatorColumnIndices,
  getHeatmapTimeExtent,
  getHeatmapWeekCount,
  getHeatmapWeekStartAlignedToRange,
  getHeatmapWeekStartSunday,
  getHeatmapYearStartMonth,
  HEATMAP_DAY_LABELS,
  HEATMAP_DEFAULT_LEVEL_COLORS,
  HEATMAP_DEFAULT_LEVEL_STYLES,
  HEATMAP_LEGEND_LEVELS,
  HEATMAP_MONTHS_ONE_YEAR,
  HEATMAP_MONTHS_SIX,
  HEATMAP_WEEKS_ONE_YEAR,
  type HeatmapBin,
  HeatmapCells,
  type HeatmapCellsProps,
  HeatmapChart,
  HeatmapChartLoading,
  type HeatmapChartLoadingProps,
  type HeatmapChartProps,
  type HeatmapColumn,
  type HeatmapContextValue,
  HeatmapInteractionBoundary,
  HeatmapInteractionProvider,
  type HeatmapLayout,
  HeatmapLegend,
  type HeatmapLegendProps,
  type HeatmapLegendVariant,
  type HeatmapLevelColors,
  type HeatmapLevelFillMode,
  type HeatmapLevelStyle,
  type HeatmapLevelStyles,
  HeatmapProvider,
  HeatmapSeparator,
  type HeatmapSeparatorProps,
  HeatmapTooltip,
  type HeatmapTooltipProps,
  type HeatmapWeekRange,
  type HeatmapWeekStartDay,
  HeatmapXAxis,
  type HeatmapXAxisProps,
  HeatmapYAxis,
  type HeatmapYAxisLabelFormat,
  type HeatmapYAxisProps,
  type HeatmapYAxisTickFilter,
  heatmapLevelPatternId,
  inferHeatmapCalendarRangeStart,
  isHeatmapLevelPattern,
  levelColorsFromStyles,
  levelStylesFromColors,
  resolveHeatmapLevelStyles,
  resolveHeatmapWeekRange,
  shouldShowHeatmapYAxisTick,
  useHeatmap,
} from "@/registry/charts/heatmap";
export {
  type IndicatorFadeEdges,
  indicatorFadeGradientStops,
  resolveVerticalFadeSides,
} from "@/registry/charts/indicator-fade";
// Composable legend components
export {
  Legend,
  type LegendContextValue,
  LegendItem as LegendItemComponent,
  type LegendItemContextValue,
  type LegendItemData,
  type LegendItemProps,
  LegendLabel,
  type LegendLabelProps,
  LegendMarker,
  type LegendMarkerProps,
  LegendProgress,
  type LegendProgressProps,
  type LegendProps,
  LegendValue,
  type LegendValueProps,
  legendCssVars,
  useLegend,
  useLegendItem,
} from "@/registry/charts/legend";
// Line chart components
export { Line, type LineProps } from "@/registry/charts/line";
export { LineChart, type LineChartProps } from "@/registry/charts/line-chart";
export {
  LineChartLoading,
  type LineChartLoadingProps,
} from "@/registry/charts/line-chart-loading";
export {
  type LineLoadingPulseMode,
  LineLoadingPulseStroke,
  type LineLoadingPulseStrokeProps,
  resolveLineLoadingPulseMode,
} from "@/registry/charts/line-loading-pulse";
export {
  LineSeriesTerminalMarker,
  type LineSeriesTerminalMarkerProps,
} from "@/registry/charts/line-series-terminal-marker";
export {
  detectMomentum,
  LiveLine,
  type LiveLineProps,
  type Momentum,
  type MomentumColors,
} from "@/registry/charts/live-line";
// Live line chart (real-time streaming)
export {
  LiveLineChart,
  type LiveLineChartProps,
  type LiveLinePoint,
} from "@/registry/charts/live-line-chart";
export { LiveXAxis, type LiveXAxisProps } from "@/registry/charts/live-x-axis";
export { LiveYAxis, type LiveYAxisProps } from "@/registry/charts/live-y-axis";
// Sweep loading visuals: `loadingStyle="sweep"` on Line/Area + bar skeleton
export {
  BarLoadingSkeleton,
  type BarLoadingSkeletonProps,
  getSkeletonHeights,
  LineLoadingSweep,
  type LineLoadingSweepProps,
} from "@/registry/charts/loading-sweep";
// Marker components
export {
  type ChartMarker,
  ChartMarkers,
  type ChartMarkersProps,
  MarkerGroup,
  type MarkerGroupProps,
  MarkerTooltipContent,
  type MarkerTooltipContentProps,
  useActiveMarkers,
} from "@/registry/charts/markers";
export {
  PatternArea,
  type PatternAreaProps,
} from "@/registry/charts/pattern-area";
export {
  isCirclePattern,
  PATTERN_PRESET_IDS,
  type PatternPresetId,
  type PatternPresetOptions,
  patternPresetTileSize,
  renderPatternPreset,
} from "@/registry/charts/pattern-preset";
// Pie chart components
export { PieCenter, type PieCenterProps } from "@/registry/charts/pie-center";
export {
  PieCenterShell,
  type PieCenterShellProps,
} from "@/registry/charts/pie-center-shell";
export {
  DEFAULT_HOVER_OFFSET,
  PieChart,
  type PieChartProps,
} from "@/registry/charts/pie-chart";
export {
  defaultPieColors,
  type PieArcData,
  type PieContextValue,
  type PieData,
  PieProvider,
  pieCssVars,
  usePie,
  usePieHover,
  usePieStable,
} from "@/registry/charts/pie-context";
export {
  PieSlice,
  type PieSliceHoverEffect,
  type PieSliceProps,
} from "@/registry/charts/pie-slice";
// Profit/loss line (sign-colored segments on LineChart)
export {
  PROFIT_LOSS_LEGEND_ITEMS,
  ProfitLossLegend,
  type ProfitLossLegendProps,
} from "@/registry/charts/profit-loss-legend";
export {
  ProfitLossLegendHoverProvider,
  useProfitLossLegendHover,
} from "@/registry/charts/profit-loss-legend-hover";
export {
  PROFIT_LOSS_NEGATIVE_COLOR,
  PROFIT_LOSS_POSITIVE_COLOR,
  PROFIT_LOSS_TOOLTIP_LABEL_FALLBACK,
  ProfitLossLine,
  type ProfitLossLineProps,
  profitLossColor,
  resolveProfitLossTooltipLabel,
} from "@/registry/charts/profit-loss-line";
export {
  type ProfitLossSegment,
  splitProfitLossSegments,
} from "@/registry/charts/profit-loss-segments";
export {
  extractProjectionLineConfigs,
  mergeProjectionXDomainMax,
  mergeProjectionYDomain,
  type ProjectionLineConfig,
} from "@/registry/charts/projection-config";
export {
  ProjectionLine,
  type ProjectionLineProps,
  type ProjectionStrokeStyle,
} from "@/registry/charts/projection-line";
export {
  ProjectionLineEndMarker,
  type ProjectionLineEndMarkerProps,
} from "@/registry/charts/projection-line-end-marker";
export {
  type BuildProjectionPathOptions,
  buildHorizontalTangentBezierPath,
  buildProjectionPath,
  type ProjectionAutoMethod,
  type ProjectionCurveKind,
  type ProjectionMode,
  type ProjectionPathDensity,
  type ProjectionPoint,
  projectionDateExtents,
  projectionValueExtents,
} from "@/registry/charts/projection-utils";
// Radar chart components
export { RadarArea, type RadarAreaProps } from "@/registry/charts/radar-area";
export { RadarAxis, type RadarAxisProps } from "@/registry/charts/radar-axis";
export {
  RadarChart,
  type RadarChartProps,
} from "@/registry/charts/radar-chart";
export {
  defaultRadarColors,
  type RadarContextValue,
  type RadarData,
  type RadarMetric,
  RadarProvider,
  radarCssVars,
  useRadar,
  useRadarHover,
  useRadarStable,
} from "@/registry/charts/radar-context";
export { RadarGrid, type RadarGridProps } from "@/registry/charts/radar-grid";
export {
  RadarLabels,
  type RadarLabelsProps,
} from "@/registry/charts/radar-labels";
export {
  ReferenceArea,
  type ReferenceAreaProps,
  type ReferenceAreaStrokeStyle,
} from "@/registry/charts/reference-area";
export {
  computeReferenceAreaRect,
  type ReferenceAreaIfOverflow,
  type ReferenceAreaRect,
} from "@/registry/charts/reference-area-geometry";
// Ring chart components
export { Ring, type RingLineCap, type RingProps } from "@/registry/charts/ring";
export {
  RingCenter,
  type RingCenterProps,
} from "@/registry/charts/ring-center";
export { RingChart, type RingChartProps } from "@/registry/charts/ring-chart";
export {
  defaultRingColors,
  type RingContextValue,
  type RingData,
  RingProvider,
  ringCssVars,
  useRing,
  useRingHover,
  useRingStable,
} from "@/registry/charts/ring-context";
// Sankey chart components
export {
  SankeyChart,
  type SankeyChartProps,
  type SankeyContextValue,
  type SankeyData,
  type SankeyLabelOrientation,
  SankeyLink,
  type SankeyLinkDatum,
  type SankeyLinkProps,
  SankeyNode,
  type SankeyNodeDatum,
  type SankeyNodeProps,
  SankeyProvider,
  SankeyTooltip,
  type SankeyTooltipData,
  type SankeyTooltipProps,
  sankeyCssVars,
  useSankey,
} from "@/registry/charts/sankey";
// Scatter chart components
export {
  Scatter,
  type ScatterInactiveMode,
  type ScatterProps,
} from "@/registry/charts/scatter";
export {
  ScatterChart,
  type ScatterChartProps,
} from "@/registry/charts/scatter-chart";
// Series bar (time-based columns for ComposedChart)
export { SeriesBar, type SeriesBarProps } from "@/registry/charts/series-bar";
export {
  SeriesMarkers,
  type SeriesMarkersProps,
} from "@/registry/charts/series-markers";
export {
  getSeriesMarkerVisualExtent,
  SeriesPointMarker,
  type SeriesPointMarkerProps,
  type SeriesPointMarkerStyle,
} from "@/registry/charts/series-point-marker";
// Sparkline components
export {
  AreaSparkline,
  type AreaSparklineProps,
  BarSparkline,
  type BarSparklineProps,
  DEFAULT_SPARKLINE_ANIMATION_DURATION_MS,
  DEFAULT_SPARKLINE_DATA_TRANSITION_MS,
  DEFAULT_SPARKLINE_HOVER_SPRING,
  LineSparkline,
  type LineSparklineProps,
  type SparklineBaseProps,
  type SparklineCrosshair,
  type SparklineSpringConfig,
  useSparklineHover,
} from "@/registry/charts/sparkline";
export {
  StaticChartPreviewProvider,
  useStaticChartPreview,
} from "@/registry/charts/static-chart-preview-context";
export {
  type ArcDatum,
  type ArcGeometry,
  arcPath,
  buildArcs,
  buildSunburstEnterTiming,
  clockwiseFraction,
  defaultSunburstGrowPadding,
  type Focus,
  geomCentroidAngle,
  geomCentroidRadius,
  geometryFor,
  lerpGeometry,
  ringOptions,
  type SunburstEnterTiming,
  type SunburstSegmentEnterDelays,
  sumValues,
  transitionGeometry,
} from "@/registry/charts/sunburst";
// Sunburst chart components
export {
  SunburstBreadcrumb,
  type SunburstBreadcrumbItem,
  type SunburstBreadcrumbProps,
  useSunburstBreadcrumbItems,
} from "@/registry/charts/sunburst-breadcrumb";
export {
  SunburstCenter,
  type SunburstCenterProps,
} from "@/registry/charts/sunburst-center";
export {
  SunburstChart,
  type SunburstChartProps,
} from "@/registry/charts/sunburst-chart";
export {
  defaultSunburstColors,
  opacityForRelativeDepth,
  sunburstCssVars,
  useSunburstHover,
  useSunburstStable,
} from "@/registry/charts/sunburst-context";
export {
  SunburstHint,
  type SunburstHintContext,
  type SunburstHintProps,
} from "@/registry/charts/sunburst-hint";
export {
  SunburstLabels,
  type SunburstLabelsProps,
} from "@/registry/charts/sunburst-labels";
export {
  SunburstSegment,
  type SunburstSegmentProps,
} from "@/registry/charts/sunburst-segment";
// Tooltip components
export {
  ChartTooltip,
  type ChartTooltipProps,
  DateTicker,
  type DateTickerProps,
  type IndicatorWidth,
  TooltipBox,
  type TooltipBoxProps,
  TooltipContent,
  type TooltipContentProps,
  TooltipDot,
  type TooltipDotProps,
  TooltipHeader,
  type TooltipHeaderProps,
  TooltipIndicator,
  type TooltipIndicatorProps,
  type TooltipRow,
} from "@/registry/charts/tooltip";
export {
  TrendLine,
  type TrendLineProps,
  type TrendLineStrokeStyle,
} from "@/registry/charts/trend-line";
export {
  computeLinearRegression,
  computeTrendSegment,
  interpolateTrendSegment,
  type LinearRegression,
  type TrendPoint,
  type TrendSegment,
} from "@/registry/charts/trend-line-utils";
export { useAnimatedYDomains } from "@/registry/charts/use-animated-y-domains";
// Chart interaction hook
export {
  type ChartSelection,
  useChartInteraction,
} from "@/registry/charts/use-chart-interaction";
export {
  PatternCircles,
  PatternHexagons,
  PatternLines,
  PatternWaves,
} from "@/registry/charts/visx-pattern";
export {
  Weekends,
  type WeekendsFillType,
  type WeekendsProps,
} from "@/registry/charts/weekends";
export { XAxis, type XAxisProps } from "@/registry/charts/x-axis";
export { YAxis, type YAxisProps } from "@/registry/charts/y-axis";
export {
  DEFAULT_Y_AXIS_ID,
  getPrimaryYScale,
  type YAxisOrientation,
} from "@/registry/charts/y-axis-scales";
export {
  resolveYAxisTickCount,
  Y_AXIS_DEFAULT_TICK_COUNT,
  Y_AXIS_MAX_TICK_COUNT,
  Y_AXIS_MIN_TICK_COUNT,
} from "@/registry/charts/y-axis-ticks";
export {
  computeYDomainsByAxis,
  isLoadingChromePhase,
  isYDomainTweenPhase,
  niceYDomain,
  shouldTweenYDomain,
  type YDomain,
} from "@/registry/charts/y-domain-utils";

export {
  ChartBrush,
  type ChartBrushProps,
  type ChartBrushSelection,
} from "./chart-brush";
export {
  ChartBrushLayout,
  type ChartBrushLayoutProps,
  type ChartBrushLayoutState,
} from "./chart-brush-layout";
export {
  type ChartBrushPatternPreset,
  ChartBrushSelectionOverlay,
  type ChartBrushSelectionOverlayProps,
  type ChartBrushSelectionPattern,
} from "./chart-brush-selection-overlay";
export {
  ChartBrushTrackOverlay,
  type ChartBrushTrackOverlayProps,
  type ChartBrushTrackOverlayStyle,
} from "./chart-brush-track-overlay";
// Legacy legend component (backward compatibility)
export {
  ChartLegend,
  type ChartLegendProps,
  type LegendItem,
} from "./chart-legend";
// Segment selection components
export {
  SegmentBackground,
  type SegmentBackgroundProps,
  SegmentLineFrom,
  type SegmentLineProps,
  SegmentLineTo,
  type SegmentLineVariant,
} from "./segment";
