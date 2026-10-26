"use client";

import "./_styles/chart-tokens.css";

import {
  type ComponentProps,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  curveBasis,
  curveCatmullRom,
  curveLinear,
  curveMonotoneX,
  curveNatural,
  curveStep,
} from "@visx/curve";
import { cn } from "cn";
import { motion, useSpring } from "motion/react";

import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select";

import {
  Area,
  AreaChart,
  AreaChartLoading,
  Background,
  Bar,
  BarChart,
  BarChartLoading,
  BarColumnTrack,
  BarDepthBack,
  BarDepthFront,
  BarDepthProvider,
  BarSquares,
  BarXAxis,
  BarYAxis,
  buildArcs,
  buildHeatmapRowOpacity,
  Candlestick,
  CandlestickChart,
  type ChartMarker,
  ChartMarkers,
  type ChartStatFlowFormat,
  ChartTooltip,
  ChoroplethChart,
  type ChoroplethFeature,
  ChoroplethFeatureComponent,
  ChoroplethGraticule,
  ChoroplethTooltip,
  ComposedChart,
  FunnelChart,
  type FunnelStage,
  Gauge,
  Grid,
  HEATMAP_DEFAULT_LEVEL_STYLES,
  HEATMAP_MONTHS_ONE_YEAR,
  HEATMAP_MONTHS_SIX,
  HEATMAP_WEEKS_ONE_YEAR,
  HeatmapCells,
  HeatmapChart,
  HeatmapChartLoading,
  type HeatmapColumn,
  HeatmapInteractionBoundary,
  HeatmapInteractionProvider,
  HeatmapLegend,
  type HeatmapLevelStyles,
  HeatmapSeparator,
  HeatmapTooltip,
  HeatmapXAxis,
  HeatmapYAxis,
  Legend,
  LegendItemComponent,
  LegendLabel,
  LegendMarker,
  LegendProgress,
  LegendValue,
  Line,
  LinearGradient,
  LineChart,
  LineChartLoading,
  LiveLine,
  LiveLineChart,
  type LiveLinePoint,
  LiveXAxis,
  LiveYAxis,
  type MomentumColors,
  type OHLCDataPoint,
  PatternArea,
  PatternLines,
  PieCenter,
  PieChart,
  type PieData,
  PieSlice,
  ProfitLossLegend,
  ProfitLossLegendHoverProvider,
  ProfitLossLine,
  profitLossColor,
  RadarArea,
  RadarAxis,
  RadarChart,
  type RadarData,
  RadarGrid,
  RadarLabels,
  type RadarMetric,
  RadialGradient,
  ReferenceArea,
  Ring,
  RingCenter,
  RingChart,
  type RingData,
  renderPatternPreset,
  resolveProfitLossTooltipLabel,
  SankeyChart,
  SankeyLink,
  SankeyNode,
  SankeyTooltip,
  Scatter,
  ScatterChart,
  SegmentBackground,
  SegmentLineFrom,
  SegmentLineTo,
  SeriesBar,
  SunburstBreadcrumb,
  SunburstCenter,
  SunburstChart,
  SunburstHint,
  SunburstLabels,
  type SunburstNode,
  SunburstSegment,
  sumValues,
  TrendLine,
  useChart,
  XAxis,
  YAxis,
} from "./_charts";
import { ChartExampleFrame } from "./_components/chart-example-frame";
import {
  type ChartExamplePreviewLayout,
  chartExampleGaugeClassName,
  chartExampleGaugeShellClassName,
  chartExampleRadialShellClassName,
  chartExampleSunburstHeroShellClassName,
} from "./_components/chart-example-preview";
import {
  type ChartGalleryAnchor,
  ChartGallerySidebar,
  chartGalleryAnchorLabel,
  createChartGalleryAnchorIds,
} from "./_components/chart-gallery-sidebar";
import { useChartPreviewOffscreen } from "./_components/chart-preview-gate";
import { FeaturedChartHero } from "./_components/featured-chart-hero";
import { LineChartStudioTrioDemo } from "./_components/line-chart-studio-trio-demo";
import {
  ProjectionLineDemo,
  ProjectionLineGradientDemo,
} from "./_components/projection-line-demo";
import {
  SparklineAreaExample,
  SparklineBarExample,
  SparklineCrosshairsExample,
  SparklineDenseGridExample,
  SparklineEndDotExample,
  SparklineHoverFeelExample,
  SparklineKpiCardsExample,
  SparklineLineExample,
  SparklineNegativeBarsExample,
  SparklineNoSpringExample,
  SparklineStepExample,
  SparklineSyncedExample,
  SparklineTableExample,
} from "./_components/sparkline-gallery-examples";
import { SunburstDrillBreadcrumb } from "./_components/sunburst-drill-breadcrumb";
import {
  composedDemoData,
  composedStackedData,
  composedTriSeriesData,
} from "./_data/composed-demo-data";
import { getHeatmapDemoData } from "./_data/heatmap-demo-data";
import {
  buildLineChartDemoData,
  REFERENCE_AREA_DEMO,
} from "./_data/line-chart-demo-data";
import {
  PROFIT_LOSS_DATA_KEY,
  profitLossLineDocsData,
} from "./_data/profit-loss-line-docs-data";
import {
  formatLoc,
  formatPrMonth,
  PrLocTooltip,
  prLocChartSnippet,
  prLocData,
  prLocDataSnippet,
  prLocSeries,
} from "./_data/scatter-pr-demo-data";
import { sunburstDemoData } from "./_data/sunburst-chart-demo-data";
import {
  weeklyVisitorsDashFromIndex,
  weeklyVisitorsData,
} from "./_data/weekly-visitors-demo-data";
import { AreaChartBrushDemo } from "./_demos/area-chart-brush-demo";
import { AreaChartPatternDemo } from "./_demos/area-chart-pattern-demo";
import { AreaChartYDomainDemo } from "./_demos/area-chart-y-domain-demo";
import { AreaTooltipPreview } from "./_demos/area-tooltip-demo";
import { AxisBothDemo, AxisXOnlyDemo, AxisYOnlyDemo } from "./_demos/axis-demo";
import {
  BackgroundCrossDemo,
  BackgroundDiagonalDemo,
  BackgroundDotsDemo,
  BackgroundNoFadeDemo,
} from "./_demos/background-demo";
import {
  BandBollingerDemo,
  BandEdgeStrokesDemo,
  BandFadeEdgesDemo,
  BandFillTypeDemo,
  BandRangeAreaDemo,
  BandRangeComboDemo,
  BandRangeDemo,
} from "./_demos/band-demo";
import {
  BarChart90DaysDemo,
  BarChartCustomTooltipDemo,
  BarChartGradientDemo,
  BarChartHorizontalDemo,
  BarChartNarrowGapsDemo,
  BarChartNoGapGradientDemo,
  BarChartPatternDemo,
  BarChartStackedDemo,
  BarChartStackedWithLegendDemo,
} from "./_demos/bar-chart-demo";
import { BarChartLoadingDemo } from "./_demos/bar-chart-loading-demo";
import { BarChartProfitLossDemo } from "./_demos/bar-chart-profit-loss-demo";
import { CandlestickChartDemo } from "./_demos/candlestick-chart-demo";
import {
  ChoroplethAnalyticsDemo,
  ChoroplethDemo,
} from "./_demos/choropleth-demo";
import { ChoroplethLinesPatternDemo } from "./_demos/choropleth-pattern-demo";
import { ChoroplethZoomDemo } from "./_demos/choropleth-zoom-demo";
import { docsDemoCode } from "./_demos/code";
import { CustomIndicatorDemo } from "./_demos/custom-indicator-demo";
import {
  DateHighlightsAreaDemo,
  DateHighlightsBarDemo,
  DateHighlightsBrushDemo,
  DateHighlightsComposedDemo,
  DateHighlightsLineDemo,
  DeadlineFillTypesDemo,
  DeadlineLineDemo,
  WeekendsLineDemo,
} from "./_demos/date-highlights-demo";
import { GaugeChartDemo } from "./_demos/gauge-chart-demo";
import {
  GridBothDemo,
  GridDenseDemo,
  GridHideEdgeLinesDemo,
  GridHorizontalDemo,
  GridNoFadeDemo,
  GridSolidDemo,
  GridVerticalDemo,
} from "./_demos/grid-demo";
import {
  LegendHorizontalDemo,
  LegendProgressDemo,
  LegendSimpleDemo,
} from "./_demos/legend-demo";
import { LineChartBrushDemo } from "./_demos/line-chart-brush-demo";
import { LineChartDateRangeDemo } from "./_demos/line-chart-date-range-demo";
import { LineChartLoadingDemo } from "./_demos/line-chart-loading-demo";
import { LineChartYDomainDemo } from "./_demos/line-chart-y-domain-demo";
import { LiveLineChartDemo } from "./_demos/live-line-chart-demo";
import {
  DiamondMarkersDemo,
  MarkersCompactDemo,
  MarkersDemo,
} from "./_demos/markers-demo";
import {
  PieChartBasicDemo,
  PieChartCustomCenterDemo,
  PieChartDemo,
  PieChartDonutDemo,
  PieChartDonutLegendDemo,
  PieChartGradientsDemo,
  PieChartHoverEffectDemo,
  PieChartPatternsDemo,
} from "./_demos/pie-chart-demo";
import { ProfitLossLineDemo } from "./_demos/profit-loss-line-demo";
import {
  RadarChartBasicDemo,
  RadarChartDemo,
  RadarChartMinimalDemo,
} from "./_demos/radar-chart-demo";
import {
  ReferenceAreaBandDemo,
  ReferenceAreaMarkersDemo,
  ReferenceAreaPatternDemo,
} from "./_demos/reference-area-demo";
import {
  RingChartBasicDemo,
  RingChartCustomColorsDemo,
  RingChartDemo,
} from "./_demos/ring-chart-demo";
import {
  SankeyNoLabelsDemo,
  SankeyPatternDemo,
} from "./_demos/sankey-pattern-demo";
import {
  ScatterChartDemo,
  ScatterJitterDemo,
} from "./_demos/scatter-chart-demo";
import { SegmentDemo } from "./_demos/segment-demo";
import {
  SparklineCrosshairDemo,
  SparklineDemo,
  SparklineGridDemo,
  SparklineHoverFeelDemo,
  SparklineSyncedDemo,
} from "./_demos/sparkline-demo";
import { SunburstChartDemo } from "./_demos/sunburst-chart-demo";
import {
  TooltipBarChartDemo,
  TooltipCrosshairFadeTopDemo,
  TooltipCrosshairOnlyDemo,
  TooltipCustomContentDemo,
  TooltipCustomRowsDemo,
  TooltipDashedCrosshairDemo,
  TooltipDefaultDemo,
  TooltipMatchCrosshairDemo,
  TooltipMinimalDemo,
  TooltipPanelDampingDemo,
  TooltipSolidCrosshairDemo,
} from "./_demos/tooltip-demo";
import {
  TrendLineAreaDemo,
  TrendLineBarDemo,
  TrendLineComposedDemo,
  TrendLineDashedDemo,
  TrendLineDemo,
  TrendLineFadeEdgesDemo,
  TrendLineGradientDemo,
  TrendLineHorizontalBarDemo,
  TrendLineSolidDemo,
} from "./_demos/trend-line-demo";
import { useWorldDataStandalone } from "./_hooks/use-world-data";
import { createChartExamplePreview } from "./_lib/chart-example-preview";

/** tailwind fuchsia-400 — patterned SeriesBar stroke in composed pattern demo */
const COMPOSED_PATTERN_FUCHSIA = "#e879f9";

/** Smoother path through dense daily points (hero + docs preview revenue / runRate). */
const composedHeroSmoothCurve = curveCatmullRom.alpha(0.42);

/** tailwind lime-300, amber-300, red-500 — composed “accent” gallery demo */
const COMPOSED_ACCENT_LIME = "#bef264";
const COMPOSED_ACCENT_AMBER = "#fcd34d";
const COMPOSED_ACCENT_RED = "#ef4444";

// ---------------------------------------------------------------------------
// Shared data
// ---------------------------------------------------------------------------

const areaData = [
  { date: new Date(2024, 0, 1), desktop: 186, mobile: 80 },
  { date: new Date(2024, 1, 1), desktop: 305, mobile: 200 },
  { date: new Date(2024, 2, 1), desktop: 237, mobile: 120 },
  { date: new Date(2024, 3, 1), desktop: 73, mobile: 190 },
  { date: new Date(2024, 4, 1), desktop: 209, mobile: 130 },
  { date: new Date(2024, 5, 1), desktop: 214, mobile: 140 },
];

const lineData = [
  { date: new Date(2024, 0, 1), desktop: 186 },
  { date: new Date(2024, 1, 1), desktop: 305 },
  { date: new Date(2024, 2, 1), desktop: 237 },
  { date: new Date(2024, 3, 1), desktop: 73 },
  { date: new Date(2024, 4, 1), desktop: 209 },
  { date: new Date(2024, 5, 1), desktop: 214 },
];

const multiLineData = [
  { date: new Date(2024, 0, 1), desktop: 186, mobile: 80 },
  { date: new Date(2024, 1, 1), desktop: 305, mobile: 200 },
  { date: new Date(2024, 2, 1), desktop: 237, mobile: 120 },
  { date: new Date(2024, 3, 1), desktop: 73, mobile: 190 },
  { date: new Date(2024, 4, 1), desktop: 209, mobile: 130 },
  { date: new Date(2024, 5, 1), desktop: 214, mobile: 140 },
];

/** Room for Y-axis tick labels on the left; default right margin. */
const chartMarginLeftYAxis = {
  bottom: 40,
  left: 56,
  right: 8,
  top: 8,
} as const;

/** Biaxial charts with labels on both sides. */
const chartMarginBiaxialYAxis = {
  bottom: 40,
  left: 56,
  right: 56,
  top: 8,
} as const;

const weeklyVisitorsCast = weeklyVisitorsData as unknown as Record<
  string,
  unknown
>[];

/** 24 months — desktop vs mobile for scatter hero and gallery examples */
const scatterMultiSeriesData = Array.from({ length: 24 }, (_, i) => ({
  date: new Date(2023, i, 1),
  desktop: Math.floor(140 + Math.sin(i / 3) * 90 + ((i * 11) % 40)),
  mobile: Math.floor(70 + Math.cos(i / 2.5) * 55 + ((i * 7) % 35)),
}));

const scatterChartDataSnippet = `const chartData = Array.from({ length: 24 }, (_, i) => ({
  date: new Date(2023, i, 1),
  desktop: Math.floor(140 + Math.sin(i / 3) * 90 + ((i * 11) % 40)),
  mobile: Math.floor(70 + Math.cos(i / 2.5) * 55 + ((i * 7) % 35)),
}));`;

const lineMarkers: ChartMarker[] = [
  {
    date: new Date(2024, 2, 1),
    description: "Major release with new features",
    icon: "🚀",
    title: "v2.0 Launch",
  },
  {
    date: new Date(2024, 4, 1),
    description: "Started new ad campaign",
    icon: "📈",
    title: "Marketing Push",
  },
];

// Candlestick OHLC data (~30 days)
const candlestickOhlcData: OHLCDataPoint[] = (() => {
  const points: OHLCDataPoint[] = [];
  const days = 30;
  let open = 100;
  const base = new Date(2024, 0, 1).getTime();
  for (let i = 0; i < days; i++) {
    const date = new Date(base + i * 24 * 60 * 60 * 1000);
    const volatility = 1.5 + Math.random() * 1.5;
    const drift = (Math.random() - 0.48) * volatility;
    const high = open + Math.abs(drift) * (1.5 + Math.random());
    const low = open - Math.abs(drift) * (1.5 + Math.random());
    const close = low + Math.random() * (high - low);
    points.push({ close, date, high, low, open });
    open = close;
  }
  return points;
})();

function CandlestickTooltipContent({
  point,
}: {
  point: Record<string, unknown>;
  index: number;
}) {
  const date = point.date instanceof Date ? point.date : new Date();
  const open = (point.open as number) ?? 0;
  const high = (point.high as number) ?? 0;
  const low = (point.low as number) ?? 0;
  const close = (point.close as number) ?? 0;
  const fmt = (v: number) => `$${v.toFixed(2)}`;
  return (
    <div className="px-3 py-2.5">
      <div className="mb-1.5 font-medium text-chart-tooltip-foreground text-xs opacity-60">
        {date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-sm">
        <span className="text-chart-tooltip-muted">Open</span>
        <span className="text-chart-tooltip-foreground tabular-nums">
          {fmt(open)}
        </span>
        <span className="text-chart-tooltip-muted">High</span>
        <span className="text-chart-positive tabular-nums">{fmt(high)}</span>
        <span className="text-chart-tooltip-muted">Low</span>
        <span className="text-chart-negative tabular-nums">{fmt(low)}</span>
        <span className="text-chart-tooltip-muted">Close</span>
        <span className="text-chart-tooltip-foreground tabular-nums">
          {fmt(close)}
        </span>
      </div>
    </div>
  );
}

// Live line chart: minimal hook for streaming demo data
function useLiveData(
  initialPrice: number,
  intervalMs: number,
  paused = false
): { data: LiveLinePoint[]; value: number } {
  const [data, setData] = useState<LiveLinePoint[]>([]);
  const [value, setValue] = useState(initialPrice);
  const priceRef = useRef(initialPrice);
  const momentumRef = useRef(0);
  const offscreen = useChartPreviewOffscreen();
  const isPaused = paused || offscreen;
  const pausedRef = useRef(isPaused);

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const nowSec = Date.now() / 1000;
    const seed: LiveLinePoint[] = [];
    let p = initialPrice;
    let mom = 0;
    for (let i = 40; i > 0; i--) {
      mom = mom * 0.92 + (Math.random() - 0.48) * 0.012;
      p *= 1 + mom;
      p = Math.max(p, 1);
      seed.push({
        time: nowSec - i * (intervalMs / 1000),
        value: Math.round(p * 100) / 100,
      });
    }
    priceRef.current = p;
    momentumRef.current = mom;
    setData(seed);
    setValue(p);
  }, [initialPrice, intervalMs]);

  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) {
        return;
      }
      momentumRef.current =
        momentumRef.current * 0.88 + (Math.random() - 0.48) * 0.008;
      momentumRef.current *= 0.995;
      priceRef.current *= 1 + momentumRef.current;
      priceRef.current = Math.max(priceRef.current, 1);
      const rounded = Math.round(priceRef.current * 100) / 100;
      setData((prev) => {
        const cutoff = Date.now() / 1000 - 120;
        return [
          ...prev.filter((p) => p.time >= cutoff),
          { time: Date.now() / 1000, value: rounded },
        ];
      });
      setValue(rounded);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { data, value };
}

const barData = [
  { desktop: 186, month: "Jan" },
  { desktop: 305, month: "Feb" },
  { desktop: 237, month: "Mar" },
  { desktop: 73, month: "Apr" },
  { desktop: 209, month: "May" },
  { desktop: 214, month: "Jun" },
];

const barStackedData = [
  { desktop: 4000, mobile: 2400, month: "Jan" },
  { desktop: 5000, mobile: 3000, month: "Feb" },
  { desktop: 3500, mobile: 2800, month: "Mar" },
  { desktop: 4200, mobile: 3200, month: "Apr" },
  { desktop: 3800, mobile: 2600, month: "May" },
  { desktop: 5500, mobile: 3800, month: "Jun" },
];

const barShapePatternColor = "var(--chart-5)";

const barShapeTrackPatternColor = "var(--chart-grid)";

const barShapeGradientStops = [
  { color: "var(--chart-1)", offset: 0 },
  { color: "var(--chart-2)", offset: 25 },
  { color: "var(--chart-3)", offset: 50 },
  { color: "var(--chart-4)", offset: 75 },
  { color: "var(--chart-5)", offset: 100 },
];

const barHorizontalData = [
  { browser: "Chrome", users: 275 },
  { browser: "Safari", users: 200 },
  { browser: "Firefox", users: 187 },
  { browser: "Edge", users: 173 },
  { browser: "Other", users: 90 },
];

const barValueLabelData = [
  { month: "Jan", orders: 720 },
  { month: "Feb", orders: 640 },
  { month: "Mar", orders: 810 },
  { month: "Apr", orders: 580 },
  { month: "May", orders: 930 },
  { month: "Jun", orders: 700 },
  { month: "Jul", orders: 880 },
  { month: "Aug", orders: 760 },
  { month: "Sep", orders: 1010 },
  { month: "Oct", orders: 860 },
  { month: "Nov", orders: 1120 },
  { month: "Dec", orders: 970 },
];

const barProfitLossData = [
  { month: "Jan", profit: 4200 },
  { month: "Feb", profit: -1800 },
  { month: "Mar", profit: 2600 },
  { month: "Apr", profit: -3400 },
  { month: "May", profit: 5100 },
  { month: "Jun", profit: -900 },
  { month: "Jul", profit: 3800 },
  { month: "Aug", profit: 6200 },
];

const barProfitLossDataSnippet = `const chartData = [
  { month: "Jan", profit: 4200 },
  { month: "Feb", profit: -1800 },
  { month: "Mar", profit: 2600 },
  { month: "Apr", profit: -3400 },
  { month: "May", profit: 5100 },
  { month: "Jun", profit: -900 },
  { month: "Jul", profit: 3800 },
  { month: "Aug", profit: 6200 },
];`;

const barDailyData = Array.from({ length: 60 }, (_, i) => {
  const date = new Date(2024, 0, 1);
  date.setDate(date.getDate() + i);
  const baseValue = 50 + Math.sin(i / 7) * 30;
  const variation = ((i * 7) % 37) - 18;
  return {
    day: date.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
    value: Math.floor(baseValue + variation),
  };
});

const barRevenueData = [
  { month: "Jan", revenue: 12_000 },
  { month: "Feb", revenue: 15_500 },
  { month: "Mar", revenue: 11_000 },
  { month: "Apr", revenue: 18_500 },
  { month: "May", revenue: 16_800 },
  { month: "Jun", revenue: 21_200 },
];

const pieData: PieData[] = [
  { color: "var(--chart-1)", label: "Chrome", value: 275 },
  { color: "var(--chart-2)", label: "Safari", value: 200 },
  { color: "var(--chart-3)", label: "Firefox", value: 187 },
  { color: "var(--chart-4)", label: "Edge", value: 173 },
  { color: "var(--chart-5)", label: "Other", value: 90 },
];

const radarMetrics5: RadarMetric[] = [
  { key: "speed", label: "Speed" },
  { key: "reliability", label: "Reliability" },
  { key: "comfort", label: "Comfort" },
  { key: "efficiency", label: "Efficiency" },
  { key: "safety", label: "Safety" },
];

const radarMetrics3: RadarMetric[] = [
  { key: "attack", label: "Attack" },
  { key: "defense", label: "Defense" },
  { key: "magic", label: "Magic" },
];

const radarMetrics6: RadarMetric[] = [
  { key: "js", label: "JS" },
  { key: "ts", label: "TS" },
  { key: "react", label: "React" },
  { key: "css", label: "CSS" },
  { key: "node", label: "Node" },
  { key: "sql", label: "SQL" },
];

const radarDataDual: RadarData[] = [
  {
    color: "var(--chart-1)",
    label: "Model A",
    values: {
      comfort: 92,
      efficiency: 70,
      reliability: 78,
      safety: 88,
      speed: 85,
    },
  },
  {
    color: "var(--chart-3)",
    label: "Model B",
    values: {
      comfort: 65,
      efficiency: 88,
      reliability: 90,
      safety: 75,
      speed: 72,
    },
  },
];

const radarDataTriangle: RadarData[] = [
  {
    color: "var(--chart-1)",
    label: "Warrior",
    values: { attack: 90, defense: 75, magic: 30 },
  },
  {
    color: "var(--chart-4)",
    label: "Mage",
    values: { attack: 35, defense: 40, magic: 95 },
  },
];

const radarDataSkills: RadarData[] = [
  {
    color: "var(--chart-1)",
    label: "Senior",
    values: { css: 75, js: 95, node: 82, react: 88, sql: 70, ts: 90 },
  },
  {
    color: "var(--chart-3)",
    label: "Junior",
    values: { css: 80, js: 70, node: 40, react: 65, sql: 35, ts: 50 },
  },
];

const radarDataLopsided: RadarData[] = [
  {
    color: "var(--chart-2)",
    label: "Product",
    values: {
      comfort: 20,
      efficiency: 90,
      reliability: 40,
      safety: 55,
      speed: 95,
    },
  },
];

const ringData: RingData[] = [
  { color: "var(--chart-1)", label: "Organic", maxValue: 5000, value: 4250 },
  { color: "var(--chart-2)", label: "Paid", maxValue: 5000, value: 3120 },
  { color: "var(--chart-3)", label: "Email", maxValue: 5000, value: 2100 },
  { color: "var(--chart-4)", label: "Social", maxValue: 5000, value: 1580 },
];

const ringFinanceData: RingData[] = [
  {
    color: "var(--chart-1)",
    label: "Revenue",
    maxValue: 100_000,
    value: 85_000,
  },
  {
    color: "var(--chart-2)",
    label: "Expenses",
    maxValue: 100_000,
    value: 62_000,
  },
  {
    color: "var(--chart-3)",
    label: "Profit",
    maxValue: 100_000,
    value: 23_000,
  },
];

const ringGoalData: RingData[] = [
  { color: "#0ea5e9", label: "Steps", maxValue: 10_000, value: 8200 },
  { color: "#a855f7", label: "Calories", maxValue: 2500, value: 1800 },
  { color: "#10b981", label: "Distance", maxValue: 5, value: 4.2 },
];

const sankeySimple = {
  links: [
    { source: 0, target: 2, value: 40 },
    { source: 0, target: 3, value: 20 },
    { source: 1, target: 2, value: 30 },
    { source: 1, target: 3, value: 35 },
    { source: 2, target: 4, value: 70 },
    { source: 3, target: 4, value: 55 },
  ],
  nodes: [
    { category: "source" as const, name: "A" },
    { category: "source" as const, name: "B" },
    { category: "landing" as const, name: "X" },
    { category: "landing" as const, name: "Y" },
    { category: "outcome" as const, name: "Z" },
  ],
};

const sankeyAnalytics = {
  links: [
    { source: 0, target: 4, value: 4200 },
    { source: 0, target: 5, value: 1500 },
    { source: 1, target: 5, value: 3100 },
    { source: 1, target: 6, value: 2200 },
    { source: 2, target: 4, value: 2800 },
    { source: 2, target: 6, value: 600 },
    { source: 3, target: 5, value: 1800 },
    { source: 3, target: 6, value: 1100 },
    { source: 4, target: 7, value: 3500 },
    { source: 4, target: 8, value: 3500 },
    { source: 5, target: 7, value: 4200 },
    { source: 5, target: 8, value: 2200 },
    { source: 6, target: 7, value: 2500 },
    { source: 6, target: 8, value: 1400 },
  ],
  nodes: [
    { category: "source" as const, name: "Organic" },
    { category: "source" as const, name: "Paid" },
    { category: "source" as const, name: "Social" },
    { category: "source" as const, name: "Direct" },
    { category: "landing" as const, name: "Blog" },
    { category: "landing" as const, name: "Pricing" },
    { category: "landing" as const, name: "Product" },
    { category: "outcome" as const, name: "Converted" },
    { category: "outcome" as const, name: "Bounced" },
  ],
};

// ---------------------------------------------------------------------------
// Example card wrapper
// ---------------------------------------------------------------------------

interface ChartExampleCardProps {
  anchorId?: string;
  chartSlug: string;
  children: ReactNode;
  code: string;
  data?: string;
  description: string;
  footer?: string;
  previewLayout?: ChartExamplePreviewLayout;
  title: string;
}

function ChartExampleCard({
  footer = "Trending up by 5.2% this month",
  ...props
}: ChartExampleCardProps) {
  return <ChartExampleFrame footer={footer} {...props} />;
}

// ---------------------------------------------------------------------------
// Bar line indicator (animated line that rises to bar top on hover)
// ---------------------------------------------------------------------------

function AnimatedBarLine({
  barX,
  barTopY,
  barBottomY,
  width,
  isHovered,
}: {
  barX: number;
  barTopY: number;
  barBottomY: number;
  width: number;
  isHovered: boolean;
}) {
  const animatedY = useSpring(barBottomY, { damping: 30, stiffness: 300 });
  const animatedOpacity = useSpring(0, { damping: 30, stiffness: 300 });

  useEffect(() => {
    animatedY.set(isHovered ? barTopY : barBottomY);
    animatedOpacity.set(isHovered ? 1 : 0);
  }, [isHovered, barTopY, barBottomY, animatedY, animatedOpacity]);

  return (
    <motion.rect
      fill="var(--chart-indicator-color)"
      height={2}
      style={{ opacity: animatedOpacity, y: animatedY }}
      width={width}
      x={barX}
    />
  );
}

function BarLineIndicator({
  data,
  valueKey,
  valueKeys,
  xKey,
  stacked = false,
}: {
  data: Record<string, unknown>[];
  valueKey?: string;
  valueKeys?: string[];
  xKey: string;
  stacked?: boolean;
}) {
  const {
    barScale,
    bandWidth,
    innerHeight,
    margin,
    containerRef,
    hoveredBarIndex,
    yScale,
  } = useChart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const container = containerRef.current;
  if (!(mounted && container && bandWidth && barScale)) {
    return null;
  }

  const keys = valueKeys ?? (valueKey ? [valueKey] : []);
  if (keys.length === 0) {
    return null;
  }

  const { createPortal } = require("react-dom") as typeof import("react-dom");

  return createPortal(
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-50 overflow-visible"
      height="100%"
      width="100%"
    >
      <g transform={`translate(${margin.left},${margin.top})`}>
        {data.flatMap((d, i) => {
          const xVal = d[xKey];
          const groupX = barScale(String(xVal)) ?? 0;
          const isHovered = hoveredBarIndex === i;

          if (stacked) {
            const total = keys.reduce(
              (sum, key) => sum + (Number(d[key]) || 0),
              0
            );

            return [
              <AnimatedBarLine
                barBottomY={innerHeight}
                barTopY={yScale(total) ?? innerHeight}
                barX={groupX}
                isHovered={isHovered}
                key={String(xVal)}
                width={bandWidth}
              />,
            ];
          }

          const barCount = keys.length;
          const individualBarWidth = bandWidth / barCount;

          return keys.map((key, barIndex) => {
            const yVal = d[key];
            const barTopY =
              typeof yVal === "number"
                ? (yScale(yVal) ?? innerHeight)
                : innerHeight;

            return (
              <AnimatedBarLine
                barBottomY={innerHeight}
                barTopY={barTopY}
                barX={groupX + barIndex * individualBarWidth}
                isHovered={isHovered}
                key={`${String(xVal)}-${key}`}
                width={individualBarWidth}
              />
            );
          });
        })}
      </g>
    </svg>,
    container
  );
}

// ---------------------------------------------------------------------------
// Example definitions per chart type
// ---------------------------------------------------------------------------

interface ChartExample {
  code: string;
  data?: string;
  description: string;
  footer?: string;
  /** Overrides the chart type's preview layout (e.g. horizontal bars). */
  previewLayout?: ChartExamplePreviewLayout;
  render: () => ReactNode;
  title: string;
}

function makeCartesianBackgroundExamples(options: {
  titlePrefix: string;
  chartOpen: string;
  chartClose: string;
  seriesSnippet: string;
  render: (background: ReactNode) => ReactNode;
}): ChartExample[] {
  const { titlePrefix, chartOpen, chartClose, seriesSnippet, render } = options;

  return [
    {
      code: `${chartOpen}
  <Background />
  ${seriesSnippet}
${chartClose}`,
      description: "Diagonal pattern fill instead of grid lines",
      footer: "Use Background instead of Grid — see /docs/utility/background",
      render: () => render(<Background />),
      title: `${titlePrefix} - Pattern Background`,
    },
    {
      code: `${chartOpen}
  <Background pattern="dots" opacity={0.85} />
  ${seriesSnippet}
${chartClose}`,
      description: "Dot grid texture with edge fade",
      render: () => render(<Background opacity={0.85} pattern="dots" />),
      title: `${titlePrefix} - Dot Grid Background`,
    },
  ];
}

function makeCartesianReferenceAreaExamples(options: {
  titlePrefix: string;
  chartOpen: string;
  chartClose: string;
  seriesSnippet: string;
  y1?: number;
  y2?: number;
  render: (referenceArea: ReactNode) => ReactNode;
}): ChartExample[] {
  const { titlePrefix, chartOpen, chartClose, seriesSnippet, render } = options;
  const y1 = options.y1 ?? 160;
  const y2 = options.y2 ?? 220;

  return [
    {
      code: `${chartOpen}
  <ReferenceArea y1={${y1}} y2={${y2}} strokeStyle="dashed" showMarkers />
  ${seriesSnippet}
${chartClose}`,
      description:
        "Horizontal Y band behind the series with dashed edges and bracket markers",
      footer:
        "See /docs/utility/reference-area — tune bounds, fill, and markers in Studio",
      render: () =>
        render(
          <ReferenceArea showMarkers strokeStyle="dashed" y1={y1} y2={y2} />
        ),
      title: `${titlePrefix} - Reference Band`,
    },
    {
      code: `${chartOpen}
  <ReferenceArea
    y1={${y1}}
    y2={${y2}}
    pattern="diagonal"
    patternColor="var(--chart-foreground-muted)"
    axisLabelColor="var(--chart-1)"
    fillOpacity={0.85}
  />
  ${seriesSnippet}
${chartClose}`,
      description:
        "Pattern fill inside the band with colored Y-axis tick labels",
      render: () =>
        render(
          <ReferenceArea
            axisLabelColor="var(--chart-1)"
            fillOpacity={0.85}
            pattern="diagonal"
            patternColor="var(--chart-foreground-muted)"
            y1={y1}
            y2={y2}
          />
        ),
      title: `${titlePrefix} - Pattern Reference Band`,
    },
  ];
}

function makeCartesianTrendLineExamples(options: {
  titlePrefix: string;
  chartOpen: string;
  chartClose: string;
  seriesSnippet: string;
  chromeSnippet: string;
  dataKey: string;
  render: (trendLine: ReactNode) => ReactNode;
}): ChartExample[] {
  const {
    titlePrefix,
    chartOpen,
    chartClose,
    seriesSnippet,
    chromeSnippet,
    dataKey,
    render,
  } = options;

  return [
    {
      code: `${chartOpen}
  <Grid horizontal />
  ${seriesSnippet}
  <TrendLine dataKey="${dataKey}" stroke="var(--chart-1)" />
  ${chromeSnippet}
${chartClose}`,
      description: "Dashed least-squares trend line drawn over the series",
      footer:
        "See /docs/utility/trend-line — place TrendLine after the series so it draws on top",
      render: () =>
        render(<TrendLine dataKey={dataKey} stroke="var(--chart-1)" />),
      title: `${titlePrefix} - Trend Line`,
    },
    {
      code: `${chartOpen}
  <Grid horizontal />
  ${seriesSnippet}
  <TrendLine
    dataKey="${dataKey}"
    strokeStyle="gradient"
    gradientStart="var(--chart-3)"
    gradientEnd="var(--chart-1)"
    strokeWidth={2.5}
    fadeEdges
  />
  ${chromeSnippet}
${chartClose}`,
      description: "Gradient stroke along the fit with faded ends",
      render: () =>
        render(
          <TrendLine
            dataKey={dataKey}
            fadeEdges
            gradientEnd="var(--chart-1)"
            gradientStart="var(--chart-3)"
            strokeStyle="gradient"
            strokeWidth={2.5}
          />
        ),
      title: `${titlePrefix} - Gradient Trend Line`,
    },
  ];
}

const AreaExampleChart = createChartExamplePreview(AreaChart);
const AreaChartLoadingExample = createChartExamplePreview(AreaChartLoading);
const BarExampleChart = createChartExamplePreview(BarChart);
const BarChartLoadingExample = createChartExamplePreview(BarChartLoading);
const LineExampleChart = createChartExamplePreview(LineChart);
const LineChartLoadingExample = createChartExamplePreview(LineChartLoading);
const ComposedExampleChart = createChartExamplePreview(ComposedChart);
const CandlestickExampleChart = createChartExamplePreview(CandlestickChart);
const LiveLinePreviewChart = createChartExamplePreview(LiveLineChart);

/** Freezes the live ticker while its gallery card is scrolled offscreen. */
function LiveLineExampleChart({
  paused,
  ...props
}: ComponentProps<typeof LiveLineChart>) {
  const offscreen = useChartPreviewOffscreen();

  return <LiveLinePreviewChart {...props} paused={paused || offscreen} />;
}
const ChoroplethExampleChart = createChartExamplePreview(ChoroplethChart);
const SankeyExampleChart = createChartExamplePreview(SankeyChart);

const SANKEY_LABELED_EXAMPLE_MARGIN = {
  bottom: 40,
  left: 56,
  right: 56,
  top: 20,
} as const;

const sankeyLabeledExampleMarginSnippet =
  "margin={{ top: 20, right: 56, bottom: 40, left: 56 }}";

function SankeyLabeledExampleChart({
  margin,
  ...props
}: ComponentProps<typeof SankeyExampleChart>) {
  return (
    <div className="px-2 py-1 sm:px-4">
      <SankeyExampleChart
        {...props}
        margin={{ ...SANKEY_LABELED_EXAMPLE_MARGIN, ...margin }}
      />
    </div>
  );
}
const HeatmapExampleChart = createChartExamplePreview(HeatmapChart);
const HeatmapChartLoadingExample =
  createChartExamplePreview(HeatmapChartLoading);
const ScatterExampleChart = createChartExamplePreview(ScatterChart);

const HEATMAP_GALLERY_GAP = 3;
const HEATMAP_CIRCULAR_CORNER_RADIUS = 999;
const HEATMAP_SEPARATOR_SPACING = 20;
/** Aligns separator tops with x-axis month labels (`text-xs` at container top). */
const HEATMAP_SEPARATOR_START_OFFSET = -20;
const HEATMAP_HERO_SEPARATOR_GRADIENT = {
  from: "var(--muted)",
  fromOpacity: 0,
  to: "var(--muted)",
  toOpacity: 0,
  via: "var(--muted)",
  viaOpacity: 1,
} as const;
const HEATMAP_HERO_SEPARATOR_LABEL_CLASS = "text-[var(--chart-3)]";
const HEATMAP_HERO_INACTIVE_OPACITY = 0.8;
const HEATMAP_HERO_INACTIVE_SCALE = 0.8;
const HEATMAP_SCROLL_VISIBLE_WEEKS = Math.round(
  (HEATMAP_WEEKS_ONE_YEAR / HEATMAP_MONTHS_ONE_YEAR) * HEATMAP_MONTHS_SIX
);
const HEATMAP_GALLERY_MARGIN = {
  bottom: 0,
  left: 44,
  right: 12,
  top: 28,
} as const;
const HEATMAP_SCROLL_MARGIN = {
  bottom: 0,
  left: 0,
  right: 12,
  top: 28,
} as const;
const HEATMAP_SCROLL_Y_LABELS = [
  { label: "Mon", row: 1 },
  { label: "Wed", row: 3 },
  { label: "Fri", row: 5 },
] as const;

function getHeatmapScrollBinSize(
  viewportWidth: number,
  columnCount: number,
  visibleWeeks: number,
  marginRight: number
) {
  if (viewportWidth <= 0) {
    return 0;
  }

  const plotWidth = viewportWidth * (columnCount / visibleWeeks) - marginRight;
  return plotWidth / columnCount;
}

const heatmapContributionData = getHeatmapDemoData();
const heatmapContributionDataSixMonths = getHeatmapDemoData(
  0,
  HEATMAP_MONTHS_SIX
);

const heatmapPatternLevelStyles = [
  HEATMAP_DEFAULT_LEVEL_STYLES[0],
  HEATMAP_DEFAULT_LEVEL_STYLES[1],
  {
    ...HEATMAP_DEFAULT_LEVEL_STYLES[2],
    fillMode: "pattern" as const,
    pattern: "diagonal" as const,
    patternColor: "var(--chart-scale-pattern-color)",
  },
  HEATMAP_DEFAULT_LEVEL_STYLES[3],
  HEATMAP_DEFAULT_LEVEL_STYLES[4],
] as const satisfies HeatmapLevelStyles;

const heatmapPerformanceLevelStyles = [
  { color: "#0e7490", fillMode: "solid" as const, pattern: "none" as const },
  { color: "#22d3ee", fillMode: "solid" as const, pattern: "none" as const },
  { color: "#bef264", fillMode: "solid" as const, pattern: "none" as const },
  { color: "#facc15", fillMode: "solid" as const, pattern: "none" as const },
  { color: "#f97316", fillMode: "solid" as const, pattern: "none" as const },
] as const satisfies HeatmapLevelStyles;

const HEATMAP_WEEKEND_ROW_OPACITY = buildHeatmapRowOpacity(
  (row) => row >= 5,
  0.35
);
const HEATMAP_ACTIVE_SCALE_GAP = 4;
const HEATMAP_ACTIVE_SCALE = 1.1;
const HEATMAP_ACTIVE_SCALE_INACTIVE_OPACITY = 0.45;

function HeatmapExampleShell({ children }: { children: ReactNode }) {
  return (
    <HeatmapInteractionProvider>
      <HeatmapInteractionBoundary>{children}</HeatmapInteractionBoundary>
    </HeatmapInteractionProvider>
  );
}

function HeatmapGalleryExample({
  data = heatmapContributionDataSixMonths,
  levelStyles = HEATMAP_DEFAULT_LEVEL_STYLES,
  gap = HEATMAP_GALLERY_GAP,
  cornerRadius = 2,
  inactiveOpacity,
  inactiveScale,
  activeScale,
}: {
  data?: HeatmapColumn[];
  levelStyles?: HeatmapLevelStyles;
  gap?: number;
  cornerRadius?: number;
  inactiveOpacity?: number;
  inactiveScale?: number;
  activeScale?: number;
}) {
  return (
    <HeatmapExampleShell>
      <div className="flex w-full max-w-full flex-col items-stretch gap-2">
        <HeatmapExampleChart
          className="w-full min-w-0"
          data={data}
          gap={gap}
          layout="fluid"
          levelStyles={levelStyles}
          margin={HEATMAP_GALLERY_MARGIN}
        >
          <HeatmapCells
            activeScale={activeScale}
            cornerRadius={cornerRadius}
            inactiveOpacity={inactiveOpacity}
            inactiveScale={inactiveScale}
          />
          <HeatmapXAxis />
          <HeatmapYAxis />
          <HeatmapTooltip />
        </HeatmapExampleChart>
        <HeatmapLegend
          activeScale={activeScale}
          align="center"
          cornerRadius={cornerRadius}
          gap={gap}
          inactiveOpacity={inactiveOpacity}
          inactiveScale={inactiveScale}
          levelStyles={levelStyles}
        />
      </div>
    </HeatmapExampleShell>
  );
}

/**
 * Quarter separator labels paint above the plot (outside the chart box), so
 * reserve that space on top to keep the chart + legend vertically centered.
 */
const HEATMAP_SEPARATOR_LABELS_WRAPPER_CLASS =
  "flex w-full max-w-full flex-col items-stretch gap-2 pt-5";

function HeatmapCompactYAxisGalleryExample() {
  return (
    <HeatmapExampleShell>
      <div className={HEATMAP_SEPARATOR_LABELS_WRAPPER_CLASS}>
        <HeatmapExampleChart
          className="w-full min-w-0"
          data={heatmapContributionDataSixMonths}
          gap={HEATMAP_GALLERY_GAP}
          layout="fluid"
          margin={HEATMAP_GALLERY_MARGIN}
        >
          <HeatmapCells cornerRadius={2} />
          <HeatmapSeparator
            gradient={HEATMAP_HERO_SEPARATOR_GRADIENT}
            groupBy="quarter"
            labelClassName="text-black dark:text-white"
            showLabels
            spacing={HEATMAP_SEPARATOR_SPACING}
            startOffset={HEATMAP_SEPARATOR_START_OFFSET}
            stroke="var(--muted)"
            strokeOpacity={1}
            strokeStyle="solid"
          />
          <HeatmapXAxis />
          <HeatmapYAxis labelFormat="initial" tickFilter="odd" />
          <HeatmapTooltip />
        </HeatmapExampleChart>
        <HeatmapLegend align="center" gap={HEATMAP_GALLERY_GAP} />
      </div>
    </HeatmapExampleShell>
  );
}

function HeatmapSolidSeparatorGalleryExample() {
  return (
    <HeatmapExampleShell>
      <div className={HEATMAP_SEPARATOR_LABELS_WRAPPER_CLASS}>
        <HeatmapExampleChart
          className="w-full min-w-0"
          data={heatmapContributionDataSixMonths}
          gap={HEATMAP_GALLERY_GAP}
          layout="fluid"
          margin={HEATMAP_GALLERY_MARGIN}
        >
          <HeatmapCells cornerRadius={2} />
          <HeatmapSeparator
            groupBy="quarter"
            labelClassName="text-black dark:text-white"
            showLabels
            spacing={HEATMAP_SEPARATOR_SPACING}
            startOffset={HEATMAP_SEPARATOR_START_OFFSET}
            stroke="var(--border)"
            strokeOpacity={1}
            strokeStyle="solid"
          />
          <HeatmapXAxis />
          <HeatmapYAxis labelFormat="initial" tickFilter="odd" />
          <HeatmapTooltip />
        </HeatmapExampleChart>
        <HeatmapLegend align="center" gap={HEATMAP_GALLERY_GAP} />
      </div>
    </HeatmapExampleShell>
  );
}

function HeatmapDashedSeparatorGalleryExample() {
  return (
    <HeatmapExampleShell>
      <div className={HEATMAP_SEPARATOR_LABELS_WRAPPER_CLASS}>
        <HeatmapExampleChart
          className="w-full min-w-0"
          data={heatmapContributionDataSixMonths}
          gap={HEATMAP_GALLERY_GAP}
          layout="fluid"
          margin={HEATMAP_GALLERY_MARGIN}
        >
          <HeatmapCells cornerRadius={2} />
          <HeatmapSeparator
            gradient={HEATMAP_HERO_SEPARATOR_GRADIENT}
            groupBy="quarter"
            showLabels
            spacing={HEATMAP_SEPARATOR_SPACING}
            startOffset={HEATMAP_SEPARATOR_START_OFFSET}
            stroke="var(--muted)"
            strokeDasharray="3,5"
            strokeOpacity={1}
            strokeStyle="dashed"
          />
          <HeatmapXAxis />
          <HeatmapTooltip />
        </HeatmapExampleChart>
        <HeatmapLegend align="center" gap={HEATMAP_GALLERY_GAP} />
      </div>
    </HeatmapExampleShell>
  );
}

function HeatmapHeroExample() {
  return (
    <HeatmapExampleShell>
      <div className={HEATMAP_SEPARATOR_LABELS_WRAPPER_CLASS}>
        <HeatmapExampleChart
          className="w-full min-w-0"
          data={heatmapContributionData}
          gap={HEATMAP_GALLERY_GAP}
          layout="fluid"
          margin={HEATMAP_GALLERY_MARGIN}
        >
          <HeatmapCells
            cornerRadius={HEATMAP_CIRCULAR_CORNER_RADIUS}
            inactiveOpacity={HEATMAP_HERO_INACTIVE_OPACITY}
            inactiveScale={HEATMAP_HERO_INACTIVE_SCALE}
          />
          <HeatmapSeparator
            gradient={HEATMAP_HERO_SEPARATOR_GRADIENT}
            groupBy="quarter"
            labelClassName={HEATMAP_HERO_SEPARATOR_LABEL_CLASS}
            showLabels
            spacing={HEATMAP_SEPARATOR_SPACING}
            startOffset={HEATMAP_SEPARATOR_START_OFFSET}
            stroke="var(--muted)"
            strokeOpacity={1}
            strokeStyle="solid"
          />
          <HeatmapXAxis />
          <HeatmapYAxis labelFormat="initial" tickFilter="all" />
          <HeatmapTooltip />
        </HeatmapExampleChart>
        <HeatmapLegend
          align="center"
          cornerRadius={HEATMAP_CIRCULAR_CORNER_RADIUS}
          gap={HEATMAP_GALLERY_GAP}
          inactiveOpacity={HEATMAP_HERO_INACTIVE_OPACITY}
          inactiveScale={HEATMAP_HERO_INACTIVE_SCALE}
        />
      </div>
    </HeatmapExampleShell>
  );
}

function HeatmapLoadingGalleryExample() {
  return (
    <HeatmapChartLoadingExample
      className="w-full min-w-0"
      cornerRadius={2}
      data={heatmapContributionDataSixMonths}
      gap={HEATMAP_GALLERY_GAP}
      label="Loading contributions"
      margin={HEATMAP_GALLERY_MARGIN}
    />
  );
}

function HeatmapHorizontalScrollGalleryExample() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const columnCount = heatmapContributionData.length;
  const innerWidthRatio = columnCount / HEATMAP_SCROLL_VISIBLE_WEEKS;

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }

    const updateWidth = () => {
      setViewportWidth(element.clientWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const binSize = getHeatmapScrollBinSize(
    viewportWidth,
    columnCount,
    HEATMAP_SCROLL_VISIBLE_WEEKS,
    HEATMAP_SCROLL_MARGIN.right
  );

  return (
    <HeatmapExampleShell>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full min-w-0">
          <div
            className="relative shrink-0"
            style={{ width: HEATMAP_GALLERY_MARGIN.left }}
          >
            {binSize > 0
              ? HEATMAP_SCROLL_Y_LABELS.map((item) => (
                  <div
                    className="pointer-events-none absolute right-1 flex w-[calc(100%-4px)] items-center justify-end"
                    key={item.label}
                    style={{
                      top:
                        HEATMAP_SCROLL_MARGIN.top +
                        item.row * binSize +
                        (binSize - HEATMAP_GALLERY_GAP) / 2,
                      transform: "translateY(-50%)",
                    }}
                  >
                    <span className="whitespace-nowrap text-chart-label text-xs">
                      {item.label}
                    </span>
                  </div>
                ))
              : null}
          </div>
          <div
            className="scroll-fade-x no-scrollbar min-w-0 flex-1 overflow-x-auto overscroll-x-contain"
            ref={scrollRef}
          >
            <div style={{ width: `${innerWidthRatio * 100}%` }}>
              <HeatmapExampleChart
                className="w-full"
                data={heatmapContributionData}
                gap={HEATMAP_GALLERY_GAP}
                layout="fluid"
                margin={HEATMAP_SCROLL_MARGIN}
              >
                <HeatmapCells />
                <HeatmapXAxis />
                <HeatmapTooltip />
              </HeatmapExampleChart>
            </div>
          </div>
        </div>
        <HeatmapLegend align="center" gap={HEATMAP_GALLERY_GAP} />
      </div>
    </HeatmapExampleShell>
  );
}

function HeatmapGradientLegendGalleryExample() {
  return (
    <HeatmapExampleShell>
      <div className="flex w-full max-w-full flex-col items-stretch gap-2">
        <HeatmapExampleChart
          className="w-full min-w-0"
          data={heatmapContributionDataSixMonths}
          gap={HEATMAP_GALLERY_GAP}
          layout="fluid"
          levelStyles={heatmapPerformanceLevelStyles}
          margin={HEATMAP_GALLERY_MARGIN}
        >
          <HeatmapCells cornerRadius={2} />
          <HeatmapXAxis />
          <HeatmapYAxis labelFormat="initial" tickFilter="odd" />
          <HeatmapTooltip />
        </HeatmapExampleChart>
        <HeatmapLegend
          align="center"
          cellSize={11}
          fontSize={12}
          gap={HEATMAP_GALLERY_GAP}
          labelClassName="text-foreground-muted"
          lessLabel="Faster"
          levelStyles={heatmapPerformanceLevelStyles}
          moreLabel="Slower"
          variant="gradient"
        />
      </div>
    </HeatmapExampleShell>
  );
}

function HeatmapMondayStartGalleryExample() {
  return (
    <HeatmapExampleShell>
      <div className="flex w-full max-w-full flex-col items-stretch gap-2">
        <HeatmapExampleChart
          className="w-full min-w-0"
          data={heatmapContributionDataSixMonths}
          gap={HEATMAP_GALLERY_GAP}
          layout="fluid"
          margin={HEATMAP_GALLERY_MARGIN}
          weekStartDay={1}
        >
          <HeatmapCells
            cornerRadius={2}
            rowOpacity={HEATMAP_WEEKEND_ROW_OPACITY}
          />
          <HeatmapXAxis />
          <HeatmapYAxis
            labelFormat="initial"
            rowOpacity={HEATMAP_WEEKEND_ROW_OPACITY}
            tickFilter="all"
          />
          <HeatmapTooltip />
        </HeatmapExampleChart>
        <HeatmapLegend align="center" gap={HEATMAP_GALLERY_GAP} />
      </div>
    </HeatmapExampleShell>
  );
}

function HeatmapActiveScaleGalleryExample() {
  return (
    <HeatmapExampleShell>
      <div className="flex w-full max-w-full flex-col items-stretch gap-2">
        <HeatmapExampleChart
          className="w-full min-w-0"
          data={heatmapContributionDataSixMonths}
          gap={HEATMAP_ACTIVE_SCALE_GAP}
          layout="fluid"
          margin={HEATMAP_GALLERY_MARGIN}
        >
          <HeatmapCells
            activeScale={HEATMAP_ACTIVE_SCALE}
            cornerRadius={2}
            inactiveOpacity={HEATMAP_ACTIVE_SCALE_INACTIVE_OPACITY}
            inactiveScale={1}
          />
          <HeatmapXAxis />
          <HeatmapYAxis labelFormat="initial" tickFilter="odd" />
          <HeatmapTooltip />
        </HeatmapExampleChart>
        <HeatmapLegend
          activeScale={HEATMAP_ACTIVE_SCALE}
          align="center"
          gap={HEATMAP_ACTIVE_SCALE_GAP}
          inactiveOpacity={HEATMAP_ACTIVE_SCALE_INACTIVE_OPACITY}
          inactiveScale={1}
        />
      </div>
    </HeatmapExampleShell>
  );
}

function ProfitLossLineExample({
  legendHoveredIndex,
  onLegendHoverChange,
}: {
  legendHoveredIndex: number | null;
  onLegendHoverChange: (index: number | null) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <LineExampleChart data={profitLossLineDocsData}>
        <Grid
          highlightRowStroke="var(--foreground)"
          highlightRowStrokeOpacity={0.35}
          highlightRowValues={[0]}
          horizontal
        />
        <Line
          curve={curveLinear}
          dataKey={PROFIT_LOSS_DATA_KEY}
          fadeEdges={false}
          showHighlight={false}
          stroke="transparent"
          strokeWidth={0}
        />
        <ProfitLossLegendHoverProvider hoveredIndex={legendHoveredIndex}>
          <ProfitLossLine dataKey={PROFIT_LOSS_DATA_KEY} />
        </ProfitLossLegendHoverProvider>
        <XAxis />
        <ChartTooltip
          indicatorColor={(point) =>
            profitLossColor((point[PROFIT_LOSS_DATA_KEY] as number) ?? 0)
          }
          rows={(point) => {
            const value = (point[PROFIT_LOSS_DATA_KEY] as number) ?? 0;
            return [
              {
                color: profitLossColor(value),
                label: resolveProfitLossTooltipLabel(""),
                value,
              },
            ];
          }}
        />
      </LineExampleChart>
      <ProfitLossLegend
        align="center"
        hoveredIndex={legendHoveredIndex}
        onHoverChange={onLegendHoverChange}
      />
    </div>
  );
}

function ProfitLossLineExampleWithState() {
  const [legendHoveredIndex, setLegendHoveredIndex] = useState<number | null>(
    null
  );

  return (
    <ProfitLossLineExample
      legendHoveredIndex={legendHoveredIndex}
      onLegendHoverChange={setLegendHoveredIndex}
    />
  );
}

function makeAreaExamples(): ChartExample[] {
  return [
    {
      code: `<AreaChart data={chartData}>
  <Grid horizontal />
  <Area dataKey="desktop" showValue valueLabelMaxCount={5} />
  <Area
    dataKey="mobile"
    fill="var(--chart-line-secondary)"
    showValue
    valueLabelMaxCount={5}
  />
  <XAxis />
  <ChartTooltip />
</AreaChart>`,
      description:
        "Dense 24-month, two-series area with shared, collision-aware value labels",
      footer:
        "Both series share one label count. Resize to see labels adapt to the width and skip collisions.",
      render: () => (
        <AreaExampleChart data={scatterMultiSeriesData}>
          <Grid horizontal />
          <Area dataKey="desktop" showValue valueLabelMaxCount={5} />
          <Area
            dataKey="mobile"
            fill="var(--chart-line-secondary)"
            showValue
            valueLabelMaxCount={5}
          />
          <XAxis />
          <ChartTooltip />
        </AreaExampleChart>
      ),
      title: "Area Chart - Value Labels",
    },
    {
      code: `<AreaChart data={chartData}>
  <Grid horizontal />
  <Area dataKey="desktop" fillOpacity={0.3} strokeWidth={2} />
  <XAxis />
  <ChartTooltip />
</AreaChart>`,
      description: "Default area with gradient fill and smooth curve",
      render: () => (
        <AreaExampleChart data={areaData}>
          <Grid horizontal />
          <Area dataKey="desktop" fillOpacity={0.3} strokeWidth={2} />
          <XAxis />
          <ChartTooltip />
        </AreaExampleChart>
      ),
      title: "Area Chart",
    },
    {
      code: `import { curveStep } from "@visx/curve";

<AreaChart data={chartData}>
  <Grid horizontal />
  <Area dataKey="desktop" curve={curveStep} fillOpacity={0.3} />
  <XAxis />
  <ChartTooltip />
</AreaChart>`,
      description: "Discrete step interpolation between points",
      render: () => (
        <AreaExampleChart data={areaData}>
          <Grid horizontal />
          <Area curve={curveStep} dataKey="desktop" fillOpacity={0.3} />
          <XAxis />
          <ChartTooltip />
        </AreaExampleChart>
      ),
      title: "Area Chart - Step",
    },
    {
      code: `<AreaChart data={chartData}>
  <Grid horizontal />
  <Area
    dataKey="desktop"
    fill="var(--chart-line-primary)"
    fillOpacity={0.3}
  />
  <Area
    dataKey="mobile"
    fill="var(--chart-line-secondary)"
    fillOpacity={0.3}
  />
  <XAxis />
  <ChartTooltip />
</AreaChart>`,
      description: "Layered areas comparing desktop and mobile",
      render: () => (
        <AreaExampleChart data={areaData}>
          <Grid horizontal />
          <Area
            dataKey="desktop"
            fill="var(--chart-line-primary)"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Area
            dataKey="mobile"
            fill="var(--chart-line-secondary)"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <XAxis />
          <ChartTooltip />
        </AreaExampleChart>
      ),
      title: "Area Chart - Stacked",
    },
    {
      code: `<AreaChart data={chartData}>
  <Area
    dataKey="desktop"
    fillOpacity={0.5}
    gradientToOpacity={0.05}
    strokeWidth={2}
  />
  <ChartTooltip />
</AreaChart>`,
      description: "Solid fill with gradientToOpacity control",
      render: () => (
        <AreaExampleChart data={areaData}>
          <Area
            dataKey="desktop"
            fillOpacity={0.5}
            gradientToOpacity={0.05}
            strokeWidth={2}
          />
          <ChartTooltip />
        </AreaExampleChart>
      ),
      title: "Area Chart - Gradient",
    },
    {
      code: `<AreaChart data={chartData}>
  <Area
    dataKey="desktop"
    fillOpacity={0.5}
    showLine={false}
  />
  <XAxis />
  <ChartTooltip />
</AreaChart>`,
      description: "Softer look with the stroke line hidden",
      render: () => (
        <AreaExampleChart data={areaData}>
          <Area dataKey="desktop" fillOpacity={0.5} showLine={false} />
          <XAxis />
          <ChartTooltip />
        </AreaExampleChart>
      ),
      title: "Area Chart - No Stroke",
    },
    {
      code: `<AreaChart data={chartData}>
  <Grid horizontal />
  <Area
    dataKey="desktop"
    fadeEdges
    fillOpacity={0.3}
    strokeWidth={2}
  />
  <XAxis />
  <ChartTooltip />
</AreaChart>`,
      description: "Area fill fades at the left and right edges",
      render: () => (
        <AreaExampleChart data={areaData}>
          <Grid horizontal />
          <Area dataKey="desktop" fadeEdges fillOpacity={0.3} strokeWidth={2} />
          <XAxis />
          <ChartTooltip />
        </AreaExampleChart>
      ),
      title: "Area Chart - Fade Edges",
    },
    {
      code: `import { AreaChartLoading } from "./_charts";

<AreaChartLoading
  gridShimmerSync
  label="Loading"
  stroke="var(--foreground)"
  strokeOpacity={0.5}
/>
// Uses curveNatural for the loading pulse path`,
      description:
        "Shimmering grid, pulsing foreground segment, and shimmer label while data loads",
      footer:
        "Uses @bklit/shimmering-text for the label — installed with @bklit/area-chart",
      render: () => <AreaChartLoadingExample />,
      title: "Area Chart - Loading",
    },
    {
      code: `<AreaChartLoading loadingStyle="sweep" />`,
      description:
        "Diagonal shimmer sweeping across the skeleton area while data loads",
      footer:
        'Set loadingStyle="sweep" on Area or AreaChartLoading; defaults to the traveling pulse.',
      render: () => <AreaChartLoadingExample loadingStyle="sweep" />,
      title: "Area Chart - Loading (Sweep)",
    },
    {
      code: `<AreaChart data={chartData}>
  <Grid horizontal />
  <Area dataKey="desktop" fillOpacity={0.3} strokeWidth={2} />
  <SegmentBackground />
  <SegmentLineFrom />
  <SegmentLineTo />
  <XAxis />
  <ChartTooltip />
</AreaChart>`,
      description: "Click and drag to select a range",
      footer: "Click and drag on the chart to select a segment",
      render: () => (
        <AreaExampleChart data={areaData}>
          <Grid horizontal />
          <Area dataKey="desktop" fillOpacity={0.3} strokeWidth={2} />
          <SegmentBackground />
          <SegmentLineFrom />
          <SegmentLineTo />
          <XAxis />
          <ChartTooltip />
        </AreaExampleChart>
      ),
      title: "Area Chart - Segment Selection",
    },
    {
      code: `<AreaChart data={chartData}>
  <PatternLines
    height={6}
    id="area-pattern"
    orientation={["diagonal"]}
    stroke="var(--chart-1)"
    strokeWidth={1}
    width={6}
  />
  <PatternArea dataKey="desktop" fill="url(#area-pattern)" />
  <Area dataKey="desktop" fillOpacity={0} strokeWidth={2} />
  <XAxis />
  <ChartTooltip />
</AreaChart>`,
      description: "Diagonal line pattern fill instead of gradient",
      render: () => (
        <AreaExampleChart data={areaData}>
          <PatternLines
            height={6}
            id="area-example-pattern"
            orientation={["diagonal"]}
            stroke="var(--chart-1)"
            strokeWidth={1}
            width={6}
          />
          <Grid horizontal />
          <PatternArea dataKey="desktop" fill="url(#area-example-pattern)" />
          <Area dataKey="desktop" fillOpacity={0} strokeWidth={2} />
          <XAxis />
          <ChartTooltip />
        </AreaExampleChart>
      ),
      title: "Area Chart - Pattern",
    },
    {
      code: `<AreaChart data={chartData} xDataKey="date">
  <Grid horizontal />
  <Area
    dataKey="visitors"
    fill="var(--chart-line-primary)"
    fillOpacity={0.35}
    showMarkers
    markers={{ radius: 5, ringGap: 2, strokeWidth: 2 }}
  />
  <XAxis tickMode="data" />
  <ChartTooltip />
</AreaChart>`,
      description:
        "Scatter-style ring markers at each point — same styling as Scatter",
      render: () => (
        <AreaExampleChart data={weeklyVisitorsCast} xDataKey="date">
          <Grid horizontal />
          <Area
            dataKey="visitors"
            fill="var(--chart-line-primary)"
            fillOpacity={0.35}
            showMarkers
            stroke="var(--chart-line-primary)"
          />
          <XAxis tickMode="data" />
          <ChartTooltip />
        </AreaExampleChart>
      ),
      title: "Area Chart - Series Markers",
    },
    {
      code: `<AreaChart data={chartData} xDataKey="date">
  <Grid horizontal />
  <Area
    dataKey="visitors"
    dashArray="6,4"
    dashFromIndex={5}
    fill="var(--chart-line-primary)"
    fillOpacity={0.35}
    stroke="var(--chart-line-primary)"
  />
  <XAxis tickMode="data" />
  <ChartTooltip />
</AreaChart>`,
      description:
        "Solid stroke through yesterday, dashed projection for the in-progress day",
      footer:
        "dashFromIndex is inclusive — the stroke dashes from that data row through the end",
      render: () => (
        <AreaExampleChart data={weeklyVisitorsCast} xDataKey="date">
          <Grid horizontal />
          <Area
            dashArray="6,4"
            dashFromIndex={weeklyVisitorsDashFromIndex}
            dataKey="visitors"
            fill="var(--chart-line-primary)"
            fillOpacity={0.35}
            stroke="var(--chart-line-primary)"
          />
          <XAxis tickMode="data" />
          <ChartTooltip />
        </AreaExampleChart>
      ),
      title: "Area Chart - Dashed Tail",
    },
    {
      code: `<AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 40, left: 56 }}>
  <Grid horizontal />
  <Area dataKey="desktop" fillOpacity={0.3} strokeWidth={2} />
  <Area dataKey="mobile" fill="var(--chart-2)" fillOpacity={0.3} strokeWidth={2} />
  <YAxis yAxisId="left" />
  <XAxis />
  <ChartTooltip />
</AreaChart>`,
      description:
        "Both series share the left scale with explicit Y-axis labels",
      render: () => (
        <AreaExampleChart data={areaData} margin={chartMarginLeftYAxis}>
          <Grid horizontal />
          <Area dataKey="desktop" fillOpacity={0.3} strokeWidth={2} />
          <Area
            dataKey="mobile"
            fill="var(--chart-2)"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <YAxis yAxisId="left" />
          <XAxis />
          <ChartTooltip />
        </AreaExampleChart>
      ),
      title: "Area Chart - Left Y axis",
    },
    {
      code: `<AreaChart data={chartData} margin={{ top: 8, right: 56, bottom: 40, left: 56 }}>
  <Grid horizontal />
  <Area dataKey="desktop" yAxisId="left" fillOpacity={0.3} strokeWidth={2} />
  <Area dataKey="mobile" yAxisId="right" fill="var(--chart-2)" fillOpacity={0.3} strokeWidth={2} />
  <YAxis yAxisId="left" />
  <YAxis yAxisId="right" orientation="right" />
  <XAxis />
  <ChartTooltip />
</AreaChart>`,
      description: "Independent left and right scales (biaxial)",
      render: () => (
        <AreaExampleChart data={areaData} margin={chartMarginBiaxialYAxis}>
          <Grid horizontal />
          <Area
            dataKey="desktop"
            fillOpacity={0.3}
            strokeWidth={2}
            yAxisId="left"
          />
          <Area
            dataKey="mobile"
            fill="var(--chart-2)"
            fillOpacity={0.3}
            strokeWidth={2}
            yAxisId="right"
          />
          <YAxis yAxisId="left" />
          <YAxis orientation="right" yAxisId="right" />
          <XAxis />
          <ChartTooltip />
        </AreaExampleChart>
      ),
      title: "Area Chart - Left and right Y axes",
    },
    ...makeCartesianBackgroundExamples({
      chartClose: "</AreaChart>",
      chartOpen:
        "<AreaChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData}>",
      render: (background) => (
        <AreaExampleChart data={areaData}>
          {background}
          <Area dataKey="desktop" fillOpacity={0.3} strokeWidth={2} />
          <XAxis />
          <ChartTooltip />
        </AreaExampleChart>
      ),
      seriesSnippet: `<Area dataKey="desktop" fillOpacity={0.3} strokeWidth={2} />
  <XAxis />
  <ChartTooltip />`,
      titlePrefix: "Area Chart",
    }),
    ...makeCartesianReferenceAreaExamples({
      chartClose: "</AreaChart>",
      chartOpen:
        "<AreaChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData}>",
      render: (referenceArea) => (
        <AreaExampleChart data={areaData}>
          {referenceArea}
          <Area dataKey="desktop" fillOpacity={0.3} strokeWidth={2} />
          <XAxis />
          <ChartTooltip />
        </AreaExampleChart>
      ),
      seriesSnippet: `<Area dataKey="desktop" fillOpacity={0.3} strokeWidth={2} />
  <XAxis />
  <ChartTooltip />`,
      titlePrefix: "Area Chart",
    }),
    ...makeCartesianTrendLineExamples({
      chartClose: "</AreaChart>",
      chartOpen:
        "<AreaChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData}>",
      chromeSnippet: `<XAxis />
  <ChartTooltip />`,
      dataKey: "desktop",
      render: (trendLine) => (
        <AreaExampleChart data={areaData}>
          <Grid horizontal />
          <Area dataKey="desktop" fillOpacity={0.3} strokeWidth={2} />
          {trendLine}
          <XAxis />
          <ChartTooltip />
        </AreaExampleChart>
      ),
      seriesSnippet:
        '<Area dataKey="desktop" fillOpacity={0.3} strokeWidth={2} />',
      titlePrefix: "Area Chart",
    }),
  ];
}

function makeBarExamples(): ChartExample[] {
  return [
    {
      code: `<BarChart data={chartData} xDataKey="month">
  <Grid horizontal />
  <Bar dataKey="orders" showValue />
  <BarXAxis />
  <ChartTooltip />
</BarChart>`,
      description: "Order totals with automatic in-bar value labels",
      footer:
        "Auto orientation keeps labels horizontal when they fit, rotates them in narrow bars and hides values that fit neither way.",
      render: () => (
        <BarExampleChart data={barValueLabelData} xDataKey="month">
          <Grid horizontal />
          <Bar dataKey="orders" showValue />
          <BarXAxis />
          <ChartTooltip />
        </BarExampleChart>
      ),
      title: "Bar Chart - Value Labels",
    },
    {
      code: `<BarChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData} xDataKey="month">
  <Grid horizontal />
  <Bar dataKey="desktop" lineCap="round" />
  <BarXAxis />
  <ChartTooltip />
</BarChart>`,
      description: "Default vertical bar chart with rounded caps",
      render: () => (
        <BarExampleChart data={barData} xDataKey="month">
          <Grid horizontal />
          <Bar dataKey="desktop" lineCap="round" />
          <BarXAxis />
          <ChartTooltip />
        </BarExampleChart>
      ),
      title: "Bar Chart",
    },
    {
      code: `// Shortcut for <BarChart status="loading" />
<BarChartLoading />`,
      description:
        "Diagonal shimmer sweeping across placeholder bars while data loads",
      footer:
        'Set status="loading" on BarChart, or use the BarChartLoading shortcut.',
      render: () => <BarChartLoadingExample />,
      title: "Bar Chart - Loading",
    },
    {
      code: `<BarChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData} xDataKey="month">
  <Grid horizontal />
  <BarDepthBack dataKey="desktop" color="var(--chart-1)" />
  <Bar dataKey="desktop" fill="var(--chart-1)" perspective />
  <BarDepthFront dataKey="desktop" />
  <BarXAxis />
  <ChartTooltip showCrosshair={false} showDots={false} />
  <BarLineIndicator data={chartData} valueKey="desktop" xKey="month" />
</BarChart>`,
      description:
        "Glass-block bars with perspective side + top faces and a custom line indicator",
      footer: "Hover over bars to see the animated line indicator",
      render: () => (
        <BarExampleChart data={barData} xDataKey="month">
          <Grid horizontal />
          <BarDepthBack color="var(--chart-1)" dataKey="desktop" />
          <Bar dataKey="desktop" fill="var(--chart-1)" perspective />
          <BarDepthFront dataKey="desktop" />
          <BarXAxis />
          <ChartTooltip showCrosshair={false} showDots={false} />
          <BarLineIndicator data={barData} valueKey="desktop" xKey="month" />
        </BarExampleChart>
      ),
      title: "Bar Chart - 3D Depth",
    },
    {
      code: `<BarDepthProvider
  segmentsAccessor={(d) => [
    { value: d.desktop, color: "var(--chart-1)" },
    { value: d.mobile, color: "var(--chart-3)" },
  ]}
>
  <BarChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData} xDataKey="month" stacked>
    <Grid horizontal />
    <BarDepthBack dataKey="desktop" />
    <Bar dataKey="desktop" fill="var(--chart-1)" perspective />
    <Bar dataKey="mobile" fill="var(--chart-3)" perspective />
    <BarDepthFront dataKey="desktop" />
    <BarXAxis />
    <ChartTooltip showCrosshair={false} showDots={false} />
  </BarChart>
</BarDepthProvider>`,
      description: "Stacked depth bars split into per-segment side faces",
      render: () => (
        <BarDepthProvider
          segmentsAccessor={(d) => [
            { color: "var(--chart-1)", value: d.desktop as number },
            { color: "var(--chart-3)", value: d.mobile as number },
          ]}
        >
          <BarExampleChart data={barStackedData} stacked xDataKey="month">
            <Grid horizontal />
            <BarDepthBack dataKey="desktop" />
            <Bar dataKey="desktop" fill="var(--chart-1)" perspective />
            <Bar dataKey="mobile" fill="var(--chart-3)" perspective />
            <BarDepthFront dataKey="desktop" />
            <BarXAxis />
            <ChartTooltip showCrosshair={false} showDots={false} />
          </BarExampleChart>
        </BarDepthProvider>
      ),
      title: "Bar Chart - 3D Stacked",
    },
    {
      code: `<BarChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData} xDataKey="month">
  <Grid horizontal />
  <Bar dataKey="desktop" fill="var(--chart-1)" lineCap="round" />
  <Bar dataKey="mobile" fill="var(--chart-3)" lineCap="round" />
  <BarXAxis />
  <ChartTooltip />
</BarChart>`,
      description: "Grouped bars comparing two metrics",
      render: () => (
        <BarExampleChart data={barStackedData} xDataKey="month">
          <Grid horizontal />
          <Bar dataKey="desktop" fill="var(--chart-1)" lineCap="round" />
          <Bar dataKey="mobile" fill="var(--chart-3)" lineCap="round" />
          <BarXAxis />
          <ChartTooltip />
        </BarExampleChart>
      ),
      title: "Bar Chart - Multiple Series",
    },
    {
      code: `<BarChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData} xDataKey="month" stacked stackGap={3}>
  <Grid horizontal />
  <Bar dataKey="desktop" fill="var(--chart-1)" lineCap="butt" stackGap={3} />
  <Bar dataKey="mobile" fill="var(--chart-3)" lineCap="butt" stackGap={3} />
  <BarXAxis />
  <ChartTooltip />
</BarChart>`,
      description: "Stacked bars with gap between segments",
      render: () => (
        <BarExampleChart
          data={barStackedData}
          stacked
          stackGap={3}
          xDataKey="month"
        >
          <Grid horizontal />
          <Bar
            dataKey="desktop"
            fill="var(--chart-1)"
            lineCap="butt"
            stackGap={3}
          />
          <Bar
            dataKey="mobile"
            fill="var(--chart-3)"
            lineCap="butt"
            stackGap={3}
          />
          <BarXAxis />
          <ChartTooltip />
        </BarExampleChart>
      ),
      title: "Bar Chart - Stacked",
    },
    {
      code: `<BarChart
  data={chartData}
  xDataKey="browser"
  orientation="horizontal"
  margin={{ top: 8, right: 8, bottom: 40, left: 80 }}
  aspectRatio="4 / 3"
>
  <Grid horizontal={false} vertical fadeVertical />
  <Bar dataKey="users" lineCap={4} />
  <BarYAxis />
  <ChartTooltip showCrosshair={false} />
</BarChart>`,
      description: "Horizontal orientation with y-axis labels",
      previewLayout: "cartesian",
      render: () => (
        <BarExampleChart
          aspectRatio="4 / 3"
          data={barHorizontalData}
          margin={{ left: 80 }}
          orientation="horizontal"
          xDataKey="browser"
        >
          <Grid fadeVertical horizontal={false} vertical />
          <Bar dataKey="users" lineCap={4} />
          <BarYAxis />
          <ChartTooltip showCrosshair={false} />
        </BarExampleChart>
      ),
      title: "Bar Chart - Horizontal",
    },
    {
      code: `<BarChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData} xDataKey="month">
  <Grid horizontal highlightRowValues={[0]} />
  <Bar dataKey="profit" lineCap={4} />
  <BarXAxis />
  <ChartTooltip />
</BarChart>`,
      data: barProfitLossDataSnippet,
      description:
        "Monthly profit and loss — bars grow up or down from a highlighted zero line",
      render: () => (
        <BarExampleChart data={barProfitLossData} xDataKey="month">
          <Grid highlightRowValues={[0]} horizontal />
          <Bar dataKey="profit" lineCap={4} />
          <BarXAxis />
          <ChartTooltip />
        </BarExampleChart>
      ),
      title: "Bar Chart - Positive & Negative",
    },
    {
      code: `<BarChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={dailyData} xDataKey="day" barGap={0.1}>
  <Grid horizontal />
  <Bar dataKey="value" lineCap="butt" />
  <BarXAxis maxLabels={6} />
  <ChartTooltip />
</BarChart>`,
      description: "60 days of data with narrow gaps",
      render: () => (
        <BarExampleChart barGap={0.1} data={barDailyData} xDataKey="day">
          <Grid horizontal />
          <Bar dataKey="value" lineCap="butt" />
          <BarXAxis maxLabels={6} />
          <ChartTooltip />
        </BarExampleChart>
      ),
      title: "Bar Chart - Dense Data",
    },
    {
      code: `<BarChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData} xDataKey="month">
  <LinearGradient
    from="hsl(217, 91%, 60%)"
    id="barGradient"
    to="hsl(280, 87%, 65%)"
  />
  <Grid horizontal />
  <Bar
    dataKey="revenue"
    fill="url(#barGradient)"
    lineCap={4}
    stroke="hsl(217, 91%, 60%)"
  />
  <BarXAxis />
  <ChartTooltip />
</BarChart>`,
      description: "Linear gradient fill from blue to purple",
      render: () => (
        <BarExampleChart data={barRevenueData} xDataKey="month">
          <LinearGradient
            from="hsl(217, 91%, 60%)"
            id="bar-example-gradient"
            to="hsl(280, 87%, 65%)"
          />
          <Grid horizontal />
          <Bar
            dataKey="revenue"
            fill="url(#bar-example-gradient)"
            lineCap={4}
            stroke="hsl(217, 91%, 60%)"
          />
          <BarXAxis />
          <ChartTooltip />
        </BarExampleChart>
      ),
      title: "Bar Chart - Gradient",
    },
    {
      code: `<BarChart
  data={chartData}
  xDataKey="month"
  margin={{ top: 8, right: 8, bottom: 40, left: 8 }}
  squareSnap={{ squareGap: 3, groupGap: 4 }}
>
  <PatternLines
    id="shape-track-pattern"
    height={6}
    width={6}
    orientation={["diagonal"]}
    stroke="var(--chart-grid)"
    strokeWidth={1}
  />
  <BarColumnTrack
    fill="url(#shape-track-pattern)"
    opacity={0.65}
    squareGap={3}
    squareRadius={0.25}
    groupGap={4}
  />
  <PatternLines
    id="shape-desktop-pattern"
    height={6}
    width={6}
    orientation={["diagonal"]}
    stroke="var(--chart-5)"
    strokeWidth={1}
  />
  <BarSquares
    dataKey="desktop"
    fill="url(#shape-desktop-pattern)"
    squareGap={3}
    squareRadius={0.25}
    groupGap={4}
    stroke="var(--chart-5)"
  />
  <BarSquares
    dataKey="mobile"
    fill="var(--chart-1)"
    useGradient
    gradientStops={[
      { offset: 0, color: "var(--chart-1)" },
      { offset: 25, color: "var(--chart-2)" },
      { offset: 50, color: "var(--chart-3)" },
      { offset: 75, color: "var(--chart-4)" },
      { offset: 100, color: "var(--chart-5)" },
    ]}
    squareGap={3}
    squareRadius={0.25}
    groupGap={4}
    stroke="var(--chart-5)"
  />
  <BarXAxis />
  <ChartTooltip
    showCrosshair={false}
    dotVariant="ring"
    dotScale={1.05}
    dotColor="oklch(1 0.002 186.385 / 0.7)"
  />
</BarChart>`,
      description:
        "Discrete square columns with per-series gradient, diagonal column tracks, and ring crosshair indicators",
      footer:
        "Use squareSnap on BarChart so ring indicators align with square columns.",
      render: () => (
        <BarExampleChart
          data={barStackedData}
          squareSnap={{ groupGap: 4, squareGap: 3 }}
          xDataKey="month"
        >
          {renderPatternPreset("diagonal", "bar-shape-track-pattern", {
            color: barShapeTrackPatternColor,
          })}
          <BarColumnTrack
            fill="url(#bar-shape-track-pattern)"
            groupGap={4}
            opacity={0.65}
            squareGap={3}
            squareRadius={0.25}
          />
          {renderPatternPreset("diagonal", "bar-shape-desktop-pattern", {
            color: barShapePatternColor,
          })}
          <BarSquares
            dataKey="desktop"
            fill="url(#bar-shape-desktop-pattern)"
            groupGap={4}
            squareGap={3}
            squareRadius={0.25}
            stroke={barShapePatternColor}
          />
          <BarSquares
            dataKey="mobile"
            fill="var(--chart-1)"
            gradientStops={barShapeGradientStops}
            groupGap={4}
            squareGap={3}
            squareRadius={0.25}
            stroke="var(--chart-5)"
            useGradient
          />
          <BarXAxis />
          <ChartTooltip
            dotColor="oklch(1 0.002 186.385 / 0.7)"
            dotScale={1.05}
            dotVariant="ring"
            showCrosshair={false}
          />
        </BarExampleChart>
      ),
      title: "Bar Chart - Shape & Gradient",
    },
    {
      code: `<BarChart
  data={chartData}
  xDataKey="month"
  margin={{ top: 8, right: 8, bottom: 40, left: 8 }}
  squareSnap={{ squareGap: 3, groupGap: 4 }}
>
  <PatternLines
    id="shape-squircle-track"
    height={6}
    width={6}
    orientation={["diagonal"]}
    stroke="var(--chart-grid)"
    strokeWidth={1}
  />
  <BarColumnTrack
    fill="url(#shape-squircle-track)"
    opacity={0.65}
    squareGap={3}
    squareRadius={0.5}
    groupGap={4}
  />
  <PatternLines
    id="shape-squircle-desktop"
    height={6}
    width={6}
    orientation={["diagonal"]}
    stroke="var(--chart-5)"
    strokeWidth={1}
  />
  <BarSquares
    dataKey="desktop"
    fill="url(#shape-squircle-desktop)"
    squareGap={3}
    squareRadius={0.5}
    groupGap={4}
    stroke="var(--chart-5)"
  />
  <BarSquares
    dataKey="mobile"
    fill="var(--chart-1)"
    squareGap={3}
    squareRadius={0.5}
    groupGap={4}
  />
  <BarXAxis />
  <ChartTooltip
    showCrosshair={false}
    dotVariant="ring"
    dotRadiusFraction={0.5}
    dotStrokeWidth={1}
    dotColor="oklch(1 0.002 186.385 / 0.7)"
  />
</BarChart>`,
      description:
        "Fully rounded square columns with a squircle ring indicator snapped to each bar",
      render: () => (
        <BarExampleChart
          data={barStackedData}
          squareSnap={{ groupGap: 4, squareGap: 3 }}
          xDataKey="month"
        >
          {renderPatternPreset("diagonal", "bar-shape-squircle-track", {
            color: barShapeTrackPatternColor,
          })}
          <BarColumnTrack
            fill="url(#bar-shape-squircle-track)"
            groupGap={4}
            opacity={0.65}
            squareGap={3}
            squareRadius={0.5}
          />
          {renderPatternPreset("diagonal", "bar-shape-squircle-desktop", {
            color: barShapePatternColor,
          })}
          <BarSquares
            dataKey="desktop"
            fill="url(#bar-shape-squircle-desktop)"
            groupGap={4}
            squareGap={3}
            squareRadius={0.5}
            stroke={barShapePatternColor}
          />
          <BarSquares
            dataKey="mobile"
            fill="var(--chart-1)"
            groupGap={4}
            squareGap={3}
            squareRadius={0.5}
          />
          <BarXAxis />
          <ChartTooltip
            dotColor="oklch(1 0.002 186.385 / 0.7)"
            dotRadiusFraction={0.5}
            dotStrokeWidth={1}
            dotVariant="ring"
            showCrosshair={false}
          />
        </BarExampleChart>
      ),
      title: "Bar Chart - Shape Squircle Ring",
    },
    {
      code: `<BarChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData} xDataKey="month">
  <PatternLines
    height={8}
    id="barPattern"
    orientation={["diagonal"]}
    stroke="var(--chart-1)"
    strokeWidth={2}
    width={8}
  />
  <Grid horizontal />
  <Bar
    dataKey="revenue"
    fill="url(#barPattern)"
    lineCap={4}
    stroke="var(--chart-1)"
  />
  <BarXAxis />
  <ChartTooltip />
</BarChart>`,
      description: "Diagonal line pattern fill",
      render: () => (
        <BarExampleChart data={barRevenueData} xDataKey="month">
          <PatternLines
            height={8}
            id="bar-example-pattern"
            orientation={["diagonal"]}
            stroke="var(--chart-1)"
            strokeWidth={2}
            width={8}
          />
          <Grid horizontal />
          <Bar
            dataKey="revenue"
            fill="url(#bar-example-pattern)"
            lineCap={4}
            stroke="var(--chart-1)"
          />
          <BarXAxis />
          <ChartTooltip />
        </BarExampleChart>
      ),
      title: "Bar Chart - Pattern",
    },
    {
      code: `<BarChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData} xDataKey="month" barGap={0}>
  <LinearGradient
    from="var(--chart-3)"
    id="noGapGradient"
    to="transparent"
  />
  <Grid horizontal />
  <Bar
    dataKey="revenue"
    fill="url(#noGapGradient)"
    lineCap="butt"
    stroke="var(--chart-3)"
  />
  <BarXAxis />
  <ChartTooltip showCrosshair={false} showDots={false} />
  <BarLineIndicator data={chartData} valueKey="revenue" xKey="month" />
</BarChart>`,
      description: "Zero gap with gradient and animated line indicator",
      footer: "Hover over bars to see the animated line indicator",
      render: () => (
        <BarExampleChart barGap={0} data={barRevenueData} xDataKey="month">
          <LinearGradient
            from="var(--chart-3)"
            id="bar-example-nogap-gradient"
            to="transparent"
          />
          <Grid horizontal />
          <Bar
            dataKey="revenue"
            fill="url(#bar-example-nogap-gradient)"
            lineCap="butt"
            stroke="var(--chart-3)"
          />
          <BarXAxis />
          <ChartTooltip showCrosshair={false} showDots={false} />
          <BarLineIndicator
            data={barRevenueData}
            valueKey="revenue"
            xKey="month"
          />
        </BarExampleChart>
      ),
      title: "Bar Chart - No Gap",
    },
    {
      code: `<BarChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData} xDataKey="month">
  <Grid horizontal />
  <Bar dataKey="revenue" lineCap="round" />
  <BarXAxis />
  <ChartTooltip
    rows={(point) => [
      {
        color: "var(--chart-line-primary)",
        label: "Revenue",
        value: \`$\${(point.revenue as number)?.toLocaleString()}\`,
      },
    ]}
  />
</BarChart>`,
      description: "Formatted currency values in tooltip",
      render: () => (
        <BarExampleChart data={barRevenueData} xDataKey="month">
          <Grid horizontal />
          <Bar dataKey="revenue" lineCap="round" />
          <BarXAxis />
          <ChartTooltip
            rows={(point) => [
              {
                color: "var(--chart-line-primary)",
                label: "Revenue",
                value: `$${(point.revenue as number)?.toLocaleString()}`,
              },
            ]}
          />
        </BarExampleChart>
      ),
      title: "Bar Chart - Custom Tooltip",
    },
    {
      code: `<BarChart data={chartData} xDataKey="month" margin={{ top: 8, right: 8, bottom: 40, left: 56 }}>
  <Grid horizontal />
  <Bar dataKey="desktop" lineCap="round" />
  <Bar dataKey="mobile" fill="var(--chart-3)" lineCap="round" />
  <YAxis yAxisId="left" />
  <BarXAxis />
  <ChartTooltip />
</BarChart>`,
      description:
        "Grouped vertical bars with a single left value scale and Y-axis labels",
      render: () => (
        <BarExampleChart
          data={barStackedData}
          margin={chartMarginLeftYAxis}
          xDataKey="month"
        >
          <Grid horizontal />
          <Bar dataKey="desktop" lineCap="round" />
          <Bar dataKey="mobile" fill="var(--chart-3)" lineCap="round" />
          <YAxis yAxisId="left" />
          <BarXAxis />
          <ChartTooltip />
        </BarExampleChart>
      ),
      title: "Bar Chart - Left Y axis",
    },
    {
      code: `<BarChart data={chartData} xDataKey="month" margin={{ top: 8, right: 56, bottom: 40, left: 56 }}>
  <Grid horizontal />
  <Bar dataKey="desktop" yAxisId="left" lineCap="round" />
  <Bar dataKey="mobile" yAxisId="right" fill="var(--chart-3)" lineCap="round" />
  <YAxis yAxisId="left" />
  <YAxis yAxisId="right" orientation="right" />
  <BarXAxis />
  <ChartTooltip />
</BarChart>`,
      description: "Independent left and right value scales (biaxial)",
      render: () => (
        <BarExampleChart
          data={barStackedData}
          margin={chartMarginBiaxialYAxis}
          xDataKey="month"
        >
          <Grid horizontal />
          <Bar dataKey="desktop" lineCap="round" yAxisId="left" />
          <Bar
            dataKey="mobile"
            fill="var(--chart-3)"
            lineCap="round"
            yAxisId="right"
          />
          <YAxis yAxisId="left" />
          <YAxis orientation="right" yAxisId="right" />
          <BarXAxis />
          <ChartTooltip />
        </BarExampleChart>
      ),
      title: "Bar Chart - Left and right Y axes",
    },
    ...makeCartesianBackgroundExamples({
      chartClose: "</BarChart>",
      chartOpen:
        '<BarChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData} xDataKey="month">',
      render: (background) => (
        <BarExampleChart data={barStackedData} xDataKey="month">
          {background}
          <Bar dataKey="desktop" lineCap="round" />
          <BarXAxis />
          <ChartTooltip showCrosshair={false} />
        </BarExampleChart>
      ),
      seriesSnippet: `<Bar dataKey="desktop" lineCap="round" />
  <BarXAxis />
  <ChartTooltip showCrosshair={false} />`,
      titlePrefix: "Bar Chart",
    }),
    ...makeCartesianReferenceAreaExamples({
      chartClose: "</BarChart>",
      chartOpen:
        '<BarChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData} xDataKey="month">',
      render: (referenceArea) => (
        <BarExampleChart data={barStackedData} xDataKey="month">
          {referenceArea}
          <Bar dataKey="desktop" lineCap="round" />
          <BarXAxis />
          <ChartTooltip showCrosshair={false} />
        </BarExampleChart>
      ),
      seriesSnippet: `<Bar dataKey="desktop" lineCap="round" />
  <BarXAxis />
  <ChartTooltip showCrosshair={false} />`,
      titlePrefix: "Bar Chart",
      y1: 4200,
      y2: 5000,
    }),
    ...makeCartesianTrendLineExamples({
      chartClose: "</BarChart>",
      chartOpen:
        '<BarChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData} xDataKey="month">',
      chromeSnippet: `<BarXAxis />
  <ChartTooltip showCrosshair={false} />`,
      dataKey: "desktop",
      render: (trendLine) => (
        <BarExampleChart data={barStackedData} xDataKey="month">
          <Grid horizontal />
          <Bar dataKey="desktop" lineCap="round" />
          {trendLine}
          <BarXAxis />
          <ChartTooltip showCrosshair={false} />
        </BarExampleChart>
      ),
      seriesSnippet: '<Bar dataKey="desktop" lineCap="round" />',
      titlePrefix: "Bar Chart",
    }),
    {
      code: `<BarChart
  data={chartData}
  xDataKey="browser"
  orientation="horizontal"
  margin={{ top: 8, right: 8, bottom: 40, left: 80 }}
  aspectRatio="4 / 3"
>
  <Grid horizontal={false} vertical fadeVertical />
  <Bar dataKey="users" lineCap={4} />
  <TrendLine dataKey="users" stroke="var(--chart-1)" />
  <BarYAxis />
  <ChartTooltip showCrosshair={false} />
</BarChart>`,
      description: "Trend line through horizontal bar centers",
      footer: "See /docs/utility/trend-line",
      previewLayout: "cartesian",
      render: () => (
        <BarExampleChart
          aspectRatio="4 / 3"
          data={barHorizontalData}
          margin={{ left: 80 }}
          orientation="horizontal"
          xDataKey="browser"
        >
          <Grid fadeVertical horizontal={false} vertical />
          <Bar dataKey="users" lineCap={4} />
          <TrendLine dataKey="users" stroke="var(--chart-1)" />
          <BarYAxis />
          <ChartTooltip showCrosshair={false} />
        </BarExampleChart>
      ),
      title: "Bar Chart - Horizontal Trend Line",
    },
  ];
}

function makeComposedExamples(): ChartExample[] {
  const dataCast = composedDemoData as unknown as Record<string, unknown>[];
  const stackedCast = composedStackedData as unknown as Record<
    string,
    unknown
  >[];
  const triCast = composedTriSeriesData as unknown as Record<string, unknown>[];

  return [
    {
      code: `<ComposedChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={data} xDataKey="date" aspectRatio="3 / 2" barGap={0} maxBarSize={32}>
  <Grid horizontal />
  <SeriesBar dataKey="units" fill="var(--chart-3)" radius={5} />
  <Line dataKey="revenue" stroke="var(--chart-1)" />
  <ChartTooltip showCrosshair={false} />
  <XAxis numTicks={8} />
</ComposedChart>`,
      description:
        "30 daily points with rounded SeriesBar tops (`radius`) and a smoothed revenue line",
      footer:
        "Dense time series: use numTicks on XAxis so labels stay readable. Ticks snap to data rows by default so crosshair and tooltip align.",
      render: () => (
        <ComposedExampleChart
          aspectRatio="3 / 2"
          barGap={0}
          data={dataCast}
          maxBarSize={32}
          xDataKey="date"
        >
          <Grid horizontal />
          <SeriesBar dataKey="units" fill="var(--chart-3)" radius={5} />
          <Line dataKey="revenue" stroke="var(--chart-1)" />
          <ChartTooltip showCrosshair={false} />
          <XAxis numTicks={8} />
        </ComposedExampleChart>
      ),
      title: "Composed Chart — Bar + line",
    },
    {
      code: `<ComposedChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={data} aspectRatio="3 / 2" barGap={0} maxBarSize={30} xDataKey="date">
  <Grid horizontal />
  <Area dataKey="runRate" fill="#ef4444" fillOpacity={0.22} stroke="#ef4444" strokeWidth={1.5} />
  <SeriesBar dataKey="units" fill="#bef264" radius={6} stroke="#bef264" />
  <Line dataKey="revenue" stroke="#fcd34d" strokeWidth={2.5} />
  <ChartTooltip showCrosshair={false} />
  <XAxis numTicks={8} />
</ComposedChart>`,
      description:
        "Fixed hex accents (tailwind lime-300, amber-300, red-500) with rounded bars",
      render: () => (
        <ComposedExampleChart
          aspectRatio="3 / 2"
          barGap={0}
          data={dataCast}
          maxBarSize={30}
          xDataKey="date"
        >
          <Grid horizontal />
          <Area
            dataKey="runRate"
            fill={COMPOSED_ACCENT_RED}
            fillOpacity={0.22}
            stroke={COMPOSED_ACCENT_RED}
            strokeWidth={1.5}
          />
          <SeriesBar
            dataKey="units"
            fill={COMPOSED_ACCENT_LIME}
            radius={6}
            stroke={COMPOSED_ACCENT_LIME}
          />
          <Line
            dataKey="revenue"
            stroke={COMPOSED_ACCENT_AMBER}
            strokeWidth={2.5}
          />
          <ChartTooltip showCrosshair={false} />
          <XAxis numTicks={8} />
        </ComposedExampleChart>
      ),
      title: "Composed Chart — Lime / amber / red",
    },
    {
      code: `<ComposedChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={data} aspectRatio="3 / 2" stacked stackGap={0} barGap={0} maxBarSize={28}>
  <Grid horizontal />
  <SeriesBar dataKey="direct" fill="var(--chart-3)" />
  <SeriesBar dataKey="partner" fill="var(--chart-5)" />
  <Line dataKey="revenue" stroke="var(--chart-1)" />
  <ChartTooltip showCrosshair={false} />
  <XAxis numTicks={8} />
</ComposedChart>`,
      description:
        "Two stack segments per day with the same 30-day timeline; stackGap={0} for flush stacks",
      render: () => (
        <ComposedExampleChart
          aspectRatio="3 / 2"
          barGap={0}
          data={stackedCast}
          maxBarSize={28}
          stacked
          stackGap={0}
          xDataKey="date"
        >
          <Grid horizontal />
          <SeriesBar dataKey="direct" fill="var(--chart-3)" />
          <SeriesBar dataKey="partner" fill="var(--chart-5)" />
          <Line dataKey="revenue" stroke="var(--chart-1)" />
          <ChartTooltip showCrosshair={false} />
          <XAxis numTicks={8} />
        </ComposedExampleChart>
      ),
      title: "Composed Chart — Stacked SeriesBar + line",
    },
    {
      code: `<ComposedChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={data} aspectRatio="3 / 2" barGap={0} maxBarSize={26}>
  <Grid horizontal />
  <SeriesBar dataKey="units" fill="var(--chart-3)" radius={4} />
  <SeriesBar dataKey="runRate" fill="var(--chart-5)" radius={4} />
  <Line dataKey="revenue" stroke="var(--chart-1)" />
  <ChartTooltip showCrosshair={false} />
  <XAxis numTicks={8} />
</ComposedChart>`,
      description:
        "Two SeriesBar series per day with barGap={0}; rounded tops on both bar series",
      render: () => (
        <ComposedExampleChart
          aspectRatio="3 / 2"
          barGap={0}
          data={dataCast}
          maxBarSize={26}
          xDataKey="date"
        >
          <Grid horizontal />
          <SeriesBar dataKey="units" fill="var(--chart-3)" radius={4} />
          <SeriesBar dataKey="runRate" fill="var(--chart-5)" radius={4} />
          <Line dataKey="revenue" stroke="var(--chart-1)" />
          <ChartTooltip showCrosshair={false} />
          <XAxis numTicks={8} />
        </ComposedExampleChart>
      ),
      title: "Composed Chart — Grouped bars, no gap",
    },
    {
      code: `import { PatternLines } from "./_charts";

<ComposedChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={data} aspectRatio="3 / 2" barGap={0} maxBarSize={22}>
  <PatternLines id="composed-pat-fuchsia" height={6} width={6} orientation={["diagonal"]} stroke="#e879f9" strokeWidth={1} />
  <Grid horizontal />
  <SeriesBar dataKey="units" fill="url(#composed-pat-fuchsia)" stroke="#e879f9" />
  <SeriesBar dataKey="runRate" fill="var(--chart-5)" />
  <Line dataKey="revenue" stroke="var(--chart-1)" />
  <ChartTooltip showCrosshair={false} />
  <XAxis numTicks={8} />
</ComposedChart>`,
      description:
        "One SeriesBar with a fuchsia-400 diagonal pattern, one solid bar on theme colors; revenue line unchanged",
      render: () => (
        <ComposedExampleChart
          aspectRatio="3 / 2"
          barGap={0}
          data={dataCast}
          maxBarSize={22}
          xDataKey="date"
        >
          <PatternLines
            height={6}
            id="composed-pat-fuchsia"
            orientation={["diagonal"]}
            stroke={COMPOSED_PATTERN_FUCHSIA}
            strokeWidth={1}
            width={6}
          />
          <Grid horizontal />
          <SeriesBar
            dataKey="units"
            fill="url(#composed-pat-fuchsia)"
            stroke={COMPOSED_PATTERN_FUCHSIA}
          />
          <SeriesBar dataKey="runRate" fill="var(--chart-5)" />
          <Line dataKey="revenue" stroke="var(--chart-1)" />
          <ChartTooltip showCrosshair={false} />
          <XAxis numTicks={8} />
        </ComposedExampleChart>
      ),
      title: "Composed Chart — Pattern fills",
    },
    {
      code: `<ComposedChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={data} aspectRatio="3 / 2" barGap={0} maxBarSize={20}>
  <Grid horizontal />
  <SeriesBar dataKey="installs" fill="var(--chart-3)" radius={5} />
  <Line dataKey="desktop" stroke="var(--chart-1)" />
  <Line dataKey="mobile" stroke="var(--chart-2)" />
  <ChartTooltip showCrosshair={false} />
  <XAxis numTicks={8} />
</ComposedChart>`,
      description:
        "Installs as daily columns (rounded) with desktop and mobile lines (30-day variation)",
      render: () => (
        <ComposedExampleChart
          aspectRatio="3 / 2"
          barGap={0}
          data={triCast}
          maxBarSize={20}
          xDataKey="date"
        >
          <Grid horizontal />
          <SeriesBar dataKey="installs" fill="var(--chart-3)" radius={5} />
          <Line dataKey="desktop" stroke="var(--chart-1)" />
          <Line dataKey="mobile" stroke="var(--chart-2)" />
          <ChartTooltip showCrosshair={false} />
          <XAxis numTicks={8} />
        </ComposedExampleChart>
      ),
      title: "Composed Chart — Bar + two lines",
    },
    {
      code: `<ComposedChart data={data} xDataKey="date" aspectRatio="3 / 2">
  <Grid horizontal />
  <SeriesBar dataKey="revenue" fill="var(--chart-1)" radius={4} />
  <Area
    dataKey="runRate"
    dashArray="6,4"
    dashFromIndex={4}
    fill="var(--chart-4)"
    fillOpacity={0.3}
    showMarkers
  />
  <Line
    dataKey="runRate"
    dashArray="6,4"
    dashFromIndex={4}
    showMarkers
    stroke="var(--chart-2)"
    strokeWidth={2}
  />
  <ChartTooltip showCrosshair={false} />
  <XAxis tickMode="data" />
</ComposedChart>`,
      description:
        "Ring markers and a dashed projection on the run-rate line and area stroke",
      footer:
        "Use dashFromIndex on Line and Area when projecting an incomplete final period",
      render: () => (
        <ComposedExampleChart
          aspectRatio="3 / 2"
          data={dataCast}
          xDataKey="date"
        >
          <Grid horizontal />
          <SeriesBar dataKey="revenue" fill="var(--chart-1)" radius={4} />
          <Area
            dashArray="6,4"
            dashFromIndex={4}
            dataKey="runRate"
            fill="var(--chart-4)"
            fillOpacity={0.3}
            showMarkers
          />
          <Line
            dashArray="6,4"
            dashFromIndex={4}
            dataKey="runRate"
            showMarkers
            stroke="var(--chart-2)"
            strokeWidth={2}
          />
          <ChartTooltip showCrosshair={false} />
          <XAxis tickMode="data" />
        </ComposedExampleChart>
      ),
      title: "Composed Chart — Markers & dashed tail",
    },
    {
      code: `<ComposedChart data={data} xDataKey="date" margin={{ top: 8, right: 8, bottom: 40, left: 56 }} barGap={0} maxBarSize={32}>
  <Grid horizontal />
  <SeriesBar dataKey="units" fill="var(--chart-3)" radius={4} />
  <Line dataKey="revenue" stroke="var(--chart-1)" />
  <YAxis yAxisId="left" />
  <ChartTooltip showCrosshair={false} />
  <XAxis numTicks={8} />
</ComposedChart>`,
      description:
        "Bars and line share one left value scale with Y-axis labels",
      render: () => (
        <ComposedExampleChart
          barGap={0}
          data={dataCast}
          margin={chartMarginLeftYAxis}
          maxBarSize={32}
          xDataKey="date"
        >
          <Grid horizontal />
          <SeriesBar dataKey="units" fill="var(--chart-3)" radius={4} />
          <Line dataKey="revenue" stroke="var(--chart-1)" />
          <YAxis yAxisId="left" />
          <ChartTooltip showCrosshair={false} />
          <XAxis numTicks={8} />
        </ComposedExampleChart>
      ),
      title: "Composed Chart — Left Y axis",
    },
    {
      code: `<ComposedChart data={data} xDataKey="date" margin={{ top: 8, right: 56, bottom: 40, left: 56 }} barGap={0} maxBarSize={32}>
  <Grid horizontal />
  <SeriesBar dataKey="units" fill="var(--chart-3)" radius={4} />
  <Line dataKey="revenue" yAxisId="right" stroke="var(--chart-1)" />
  <YAxis yAxisId="left" />
  <YAxis yAxisId="right" orientation="right" />
  <ChartTooltip showCrosshair={false} />
  <XAxis numTicks={8} />
</ComposedChart>`,
      description:
        "Units on the left scale, revenue line on the right (biaxial)",
      render: () => (
        <ComposedExampleChart
          barGap={0}
          data={dataCast}
          margin={chartMarginBiaxialYAxis}
          maxBarSize={32}
          xDataKey="date"
        >
          <Grid horizontal />
          <SeriesBar dataKey="units" fill="var(--chart-3)" radius={4} />
          <Line dataKey="revenue" stroke="var(--chart-1)" yAxisId="right" />
          <YAxis yAxisId="left" />
          <YAxis orientation="right" yAxisId="right" />
          <ChartTooltip showCrosshair={false} />
          <XAxis numTicks={8} />
        </ComposedExampleChart>
      ),
      title: "Composed Chart — Left and right Y axes",
    },
    ...makeCartesianBackgroundExamples({
      chartClose: "</ComposedChart>",
      chartOpen:
        '<ComposedChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={data} xDataKey="date">',
      render: (background) => (
        <ComposedExampleChart data={dataCast} xDataKey="date">
          {background}
          <SeriesBar dataKey="units" fill="var(--chart-3)" radius={4} />
          <Line dataKey="revenue" stroke="var(--chart-1)" />
          <ChartTooltip showCrosshair={false} />
          <XAxis numTicks={8} />
        </ComposedExampleChart>
      ),
      seriesSnippet: `<SeriesBar dataKey="units" fill="var(--chart-3)" radius={4} />
  <Line dataKey="revenue" stroke="var(--chart-1)" />
  <ChartTooltip showCrosshair={false} />
  <XAxis numTicks={8} />`,
      titlePrefix: "Composed Chart",
    }),
    ...makeCartesianReferenceAreaExamples({
      chartClose: "</ComposedChart>",
      chartOpen:
        '<ComposedChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={data} xDataKey="date">',
      render: (referenceArea) => (
        <ComposedExampleChart data={dataCast} xDataKey="date">
          {referenceArea}
          <SeriesBar dataKey="units" fill="var(--chart-3)" radius={4} />
          <Line dataKey="revenue" stroke="var(--chart-1)" />
          <ChartTooltip showCrosshair={false} />
          <XAxis numTicks={8} />
        </ComposedExampleChart>
      ),
      seriesSnippet: `<SeriesBar dataKey="units" fill="var(--chart-3)" radius={4} />
  <Line dataKey="revenue" stroke="var(--chart-1)" />
  <ChartTooltip showCrosshair={false} />
  <XAxis numTicks={8} />`,
      titlePrefix: "Composed Chart",
      y1: 95,
      y2: 110,
    }),
    ...makeCartesianTrendLineExamples({
      chartClose: "</ComposedChart>",
      chartOpen:
        '<ComposedChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={data} xDataKey="date">',
      chromeSnippet: `<ChartTooltip showCrosshair={false} />
  <XAxis numTicks={8} />`,
      dataKey: "revenue",
      render: (trendLine) => (
        <ComposedExampleChart data={dataCast} xDataKey="date">
          <Grid horizontal />
          <SeriesBar dataKey="units" fill="var(--chart-3)" radius={4} />
          <Line dataKey="revenue" stroke="var(--chart-2)" />
          {trendLine}
          <ChartTooltip showCrosshair={false} />
          <XAxis numTicks={8} />
        </ComposedExampleChart>
      ),
      seriesSnippet: `<SeriesBar dataKey="units" fill="var(--chart-3)" radius={4} />
  <Line dataKey="revenue" stroke="var(--chart-2)" />`,
      titlePrefix: "Composed Chart",
    }),
  ];
}

function makeComposedHero(): ChartExample {
  return {
    code: `import { curveCatmullRom } from "@visx/curve";

<ComposedChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={data} xDataKey="date" aspectRatio="2 / 1" barGap={0} maxBarSize={32}>
  <Grid horizontal />
  <Area dataKey="runRate" curve={curveCatmullRom.alpha(0.42)} fill="var(--chart-4)" fillOpacity={0.32} />
  <SeriesBar dataKey="units" fill="var(--chart-3)" radius={4} />
  <Line dataKey="revenue" curve={curveCatmullRom.alpha(0.42)} stroke="var(--chart-1)" strokeWidth={2.5} />
  <ChartTooltip showCrosshair={false} />
  <XAxis numTicks={8} />
</ComposedChart>`,
    description:
      "One time axis, one Y scale: combine SeriesBar, Line, and Area. Use the curve menu to swap the shared Line and Area interpolation.",
    footer:
      "Hero uses a Radix Select for the Line and Area `curve` prop (SeriesBar shape is unchanged). See https://visx.airbnb.tech/docs/curve.",
    render: () => <ComposedHeroWithCurveSelect />,
    title: "Composed Chart",
  };
}

function makeLineExamples(): ChartExample[] {
  return [
    {
      code: `import {
  buildProjectionPath,
  LineSeriesTerminalMarker,
  ProjectionLine,
} from "./_charts";

const targetProjectionPath = buildProjectionPath({
  sourceData: chartData,
  seriesKey: "value",
  mode: "target",
  pathDensity: "endpoints",
  horizonPoints: 6,
  endValue: 301,
});

const autoProjectionPath = buildProjectionPath({
  sourceData: chartData,
  seriesKey: "value",
  mode: "auto",
  autoMethod: "lastSegment",
  pathDensity: "endpoints",
  horizonPoints: 6,
});

<LineChart data={chartData}>
  <Grid horizontal />
  <Line dataKey="value" strokeWidth={2} />
  <LineSeriesTerminalMarker dataKey="value" />
  <ProjectionLine
    data={targetProjectionPath}
    strokeDasharray="1,4"
    curveKind="bezier"
    strokeStyle="gradient"
    showEndMarker
  />
  <ProjectionLine
    data={autoProjectionPath}
    strokeDasharray="1,4"
    curveKind="bezier"
    strokeStyle="gradient"
    showEndMarker
  />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
      description:
        "Target and auto forecasts with gradient dashed beziers and a terminal marker",
      footer:
        "See the [Projection Line utility](/docs/utility/projection-line). Projections and brush zoom are not supported together.",
      render: () => <ProjectionLineDemo />,
      title: "Line Chart - Projection",
    },
    {
      code: `import { curveLinear } from "@visx/curve";

<LineChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData}>
  <Grid horizontal />
  <Line dataKey="desktop" curve={curveLinear} strokeWidth={2} />
  <ChartTooltip />
</LineChart>`,
      description: "Straight lines between data points",
      render: () => (
        <LineExampleChart data={lineData}>
          <Grid horizontal />
          <Line curve={curveLinear} dataKey="desktop" strokeWidth={2} />
          <ChartTooltip />
        </LineExampleChart>
      ),
      title: "Line Chart - Linear",
    },
    {
      code: `const markers = [
  { date: new Date(2024, 2, 1), icon: "🚀", title: "v2.0 Launch" },
  { date: new Date(2024, 4, 1), icon: "📈", title: "Marketing Push" },
];

<LineChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData}>
  <Grid horizontal />
  <Line dataKey="desktop" strokeWidth={2} />
  <ChartMarkers items={markers} />
  <ChartTooltip />
</LineChart>`,
      description: "Custom markers to annotate key events",
      render: () => (
        <LineExampleChart data={lineData}>
          <Grid horizontal />
          <Line dataKey="desktop" strokeWidth={2} />
          <ChartMarkers items={lineMarkers} />
          <ChartTooltip />
        </LineExampleChart>
      ),
      title: "Line Chart - Markers",
    },
    {
      code: `<LineChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData}>
  <Grid horizontal />
  <Line dataKey="desktop" strokeWidth={2} />
  <SegmentBackground />
  <SegmentLineFrom />
  <SegmentLineTo />
  <ChartTooltip />
</LineChart>`,
      description: "Click and drag to select a range",
      footer: "Click and drag on the chart to select a segment",
      render: () => (
        <LineExampleChart data={lineData}>
          <Grid horizontal />
          <Line dataKey="desktop" strokeWidth={2} />
          <SegmentBackground />
          <SegmentLineFrom />
          <SegmentLineTo />
          <ChartTooltip />
        </LineExampleChart>
      ),
      title: "Line Chart - Segment Selection",
    },
    {
      code: `<LineChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData}>
  <Grid horizontal />
  <Line dataKey="desktop" stroke="var(--chart-1)" strokeWidth={2} />
  <Line dataKey="mobile" stroke="var(--chart-3)" strokeWidth={2} />
  <ChartTooltip />
</LineChart>`,
      description: "Desktop vs mobile visitors over time",
      render: () => (
        <LineExampleChart data={multiLineData}>
          <Grid horizontal />
          <Line dataKey="desktop" stroke="var(--chart-1)" strokeWidth={2} />
          <Line dataKey="mobile" stroke="var(--chart-3)" strokeWidth={2} />
          <ChartTooltip />
        </LineExampleChart>
      ),
      title: "Line Chart - Multiple Lines",
    },
    {
      code: `<LineChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData}>
  <Grid horizontal />
  <Line dataKey="desktop" strokeWidth={2} />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
      description: "With labeled x-axis dates",
      render: () => (
        <LineExampleChart data={lineData}>
          <Grid horizontal />
          <Line dataKey="desktop" strokeWidth={2} />
          <XAxis />
          <ChartTooltip />
        </LineExampleChart>
      ),
      title: "Line Chart - X Axis",
    },
    {
      code: `<LineChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData}>
  <Grid fadeHorizontal={false} horizontal vertical />
  <Line dataKey="desktop" strokeWidth={2} />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
      description: "With both horizontal grid and x-axis labels",
      footer: "Horizontal grid lines serve as the y-axis reference",
      render: () => (
        <LineExampleChart data={lineData}>
          <Grid fadeHorizontal={false} horizontal vertical />
          <Line dataKey="desktop" strokeWidth={2} />
          <XAxis />
          <ChartTooltip />
        </LineExampleChart>
      ),
      title: "Line Chart - X & Y Axis",
    },
    {
      code: `<LineChart data={chartData} xDataKey="date">
  <Grid horizontal />
  <Line
    dataKey="visitors"
    fadeEdges={false}
    showMarkers
    stroke="var(--chart-line-primary)"
    strokeWidth={2.5}
  />
  <XAxis tickMode="data" />
  <ChartTooltip />
</LineChart>`,
      description:
        "Ring markers at each data point with the same config as Scatter",
      render: () => (
        <LineExampleChart data={weeklyVisitorsCast} xDataKey="date">
          <Grid horizontal />
          <Line
            dataKey="visitors"
            fadeEdges={false}
            showMarkers
            stroke="var(--chart-line-primary)"
            strokeWidth={2.5}
          />
          <XAxis tickMode="data" />
          <ChartTooltip />
        </LineExampleChart>
      ),
      title: "Line Chart - Series Markers",
    },
    {
      code: `import { LineChartLoading } from "./_charts";

<LineChartLoading
  gridShimmerSync
  label="Loading"
  stroke="var(--foreground)"
  strokeOpacity={0.5}
/>
// Uses curveNatural for the loading pulse path`,
      description:
        "Shimmering grid, pulsing foreground segment, and shimmer label while data loads",
      footer:
        "Uses @bklit/shimmering-text for the label — installed with @bklit/line-chart",
      render: () => <LineChartLoadingExample />,
      title: "Line Chart - Loading",
    },
    {
      code: `<LineChartLoading loadingStyle="sweep" />`,
      description:
        "Diagonal shimmer sweeping across the skeleton line while data loads",
      footer:
        'Set loadingStyle="sweep" on Line or LineChartLoading; defaults to the traveling pulse.',
      render: () => <LineChartLoadingExample loadingStyle="sweep" />,
      title: "Line Chart - Loading (Sweep)",
    },
    {
      code: `<LineChart data={chartData} xDataKey="date">
  <Grid horizontal />
  <Line
    dataKey="visitors"
    dashArray="6,4"
    dashFromIndex={5}
    stroke="var(--chart-line-primary)"
    strokeWidth={2.5}
  />
  <XAxis tickMode="data" />
  <ChartTooltip />
</LineChart>`,
      description:
        "Curved dashed segment from a chosen index — useful for incomplete periods",
      footer:
        "The dashed tail follows the same curve and edge fade as the solid stroke",
      render: () => (
        <LineExampleChart data={weeklyVisitorsCast} xDataKey="date">
          <Grid horizontal />
          <Line
            dashArray="6,4"
            dashFromIndex={weeklyVisitorsDashFromIndex}
            dataKey="visitors"
            stroke="var(--chart-line-primary)"
            strokeWidth={2.5}
          />
          <XAxis tickMode="data" />
          <ChartTooltip />
        </LineExampleChart>
      ),
      title: "Line Chart - Dashed Tail",
    },
    {
      code: `<LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 40, left: 56 }}>
  <Grid horizontal />
  <Line dataKey="desktop" strokeWidth={2.5} />
  <Line dataKey="mobile" stroke="var(--chart-2)" strokeWidth={2.5} />
  <YAxis yAxisId="left" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
      description:
        "Both series on the left scale with explicit Y-axis tick labels",
      render: () => (
        <LineExampleChart data={multiLineData} margin={chartMarginLeftYAxis}>
          <Grid horizontal />
          <Line dataKey="desktop" strokeWidth={2.5} />
          <Line dataKey="mobile" stroke="var(--chart-2)" strokeWidth={2.5} />
          <YAxis yAxisId="left" />
          <XAxis />
          <ChartTooltip />
        </LineExampleChart>
      ),
      title: "Line Chart - Left Y axis",
    },
    {
      code: `<LineChart data={chartData} margin={{ top: 8, right: 56, bottom: 40, left: 56 }}>
  <Grid horizontal />
  <Line dataKey="desktop" yAxisId="left" />
  <Line dataKey="mobile" yAxisId="right" stroke="var(--chart-2)" />
  <YAxis yAxisId="left" />
  <YAxis yAxisId="right" orientation="right" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
      description: "Independent left and right scales (biaxial)",
      render: () => (
        <LineExampleChart data={multiLineData} margin={chartMarginBiaxialYAxis}>
          <Grid horizontal />
          <Line dataKey="desktop" yAxisId="left" />
          <Line dataKey="mobile" stroke="var(--chart-2)" yAxisId="right" />
          <YAxis yAxisId="left" />
          <YAxis orientation="right" yAxisId="right" />
          <XAxis />
          <ChartTooltip />
        </LineExampleChart>
      ),
      title: "Line Chart - Left and right Y axes",
    },
    {
      code: `import {
  ProfitLossLine,
  ProfitLossLegend,
  ProfitLossLegendHoverProvider,
  profitLossColor,
  resolveProfitLossTooltipLabel,
} from "./_charts";

<LineChart data={data}>
  <Grid highlightRowValues={[0]} horizontal />
  <Line dataKey="pnl" stroke="transparent" strokeWidth={0} showHighlight={false} />
  <ProfitLossLegendHoverProvider hoveredIndex={legendHoveredIndex}>
    <ProfitLossLine dataKey="pnl" />
  </ProfitLossLegendHoverProvider>
  <XAxis />
  <ChartTooltip
    indicatorColor={(point) => profitLossColor(point.pnl ?? 0)}
    rows={(point) => [{
      label: resolveProfitLossTooltipLabel(""),
      value: point.pnl ?? 0,
      color: profitLossColor(point.pnl ?? 0),
    }]}
  />
</LineChart>`,
      description:
        "Sign-colored segments with a highlighted zero baseline and optional legend hover",
      footer: "Legend below the chart, centered",
      render: () => <ProfitLossLineExampleWithState />,
      title: "Line Chart - Profit/Loss",
    },
    ...makeCartesianBackgroundExamples({
      chartClose: "</LineChart>",
      chartOpen:
        "<LineChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData}>",
      render: (background) => (
        <LineExampleChart data={lineData}>
          {background}
          <Line dataKey="desktop" strokeWidth={2} />
          <XAxis />
          <ChartTooltip />
        </LineExampleChart>
      ),
      seriesSnippet: `<Line dataKey="desktop" strokeWidth={2} />
  <XAxis />
  <ChartTooltip />`,
      titlePrefix: "Line Chart",
    }),
    ...makeCartesianReferenceAreaExamples({
      chartClose: "</LineChart>",
      chartOpen:
        "<LineChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData}>",
      render: (referenceArea) => (
        <LineExampleChart data={buildLineChartDemoData()}>
          {referenceArea}
          <Line dataKey="value" strokeWidth={2} />
          <XAxis />
          <ChartTooltip />
        </LineExampleChart>
      ),
      seriesSnippet: `<Line dataKey="value" strokeWidth={2} />
  <XAxis />
  <ChartTooltip />`,
      titlePrefix: "Line Chart",
      y1: REFERENCE_AREA_DEMO.y1,
      y2: REFERENCE_AREA_DEMO.y2,
    }),
    ...makeCartesianTrendLineExamples({
      chartClose: "</LineChart>",
      chartOpen:
        "<LineChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData}>",
      chromeSnippet: `<XAxis />
  <ChartTooltip />`,
      dataKey: "value",
      render: (trendLine) => (
        <LineExampleChart data={buildLineChartDemoData()}>
          <Grid horizontal />
          <Line dataKey="value" strokeWidth={2} />
          {trendLine}
          <XAxis />
          <ChartTooltip />
        </LineExampleChart>
      ),
      seriesSnippet: '<Line dataKey="value" strokeWidth={2} />',
      titlePrefix: "Line Chart",
    }),
  ];
}

// ---------------------------------------------------------------------------
// Live line chart examples
// ---------------------------------------------------------------------------

function LiveLineBasicDemo() {
  const { data, value } = useLiveData(142.5, 600);
  const formatUsd = useCallback((v: number) => `$${v.toFixed(2)}`, []);
  return (
    <LiveLineExampleChart
      data={data}
      margin={{ left: 28 }}
      style={{ height: 240 }}
      value={value}
      window={30}
    >
      <LiveLine
        dataKey="value"
        formatValue={formatUsd}
        stroke="var(--chart-1)"
      />
      <ChartTooltip
        content={({ point }) => (
          <div className="px-3 py-2.5 text-sm">
            <span className="text-foreground-muted">
              {(point.value as number)?.toFixed(2)}
            </span>
          </div>
        )}
        showDatePill={false}
      />
      <LiveXAxis />
      <LiveYAxis formatValue={formatUsd} position="left" />
    </LiveLineExampleChart>
  );
}

function LiveLineOffsetDemo() {
  const { data, value } = useLiveData(0.002_34, 500);
  const formatSats = useCallback((v: number) => `${v.toFixed(5)} BTC`, []);
  return (
    <LiveLineExampleChart
      data={data}
      exaggerate
      margin={{ left: 36 }}
      nowOffsetUnits={1}
      style={{ height: 220 }}
      value={value}
      window={20}
    >
      <LiveLine
        dataKey="value"
        dotSize={4}
        formatValue={formatSats}
        stroke="var(--chart-3)"
      />
      <ChartTooltip
        content={({ point }) => (
          <div className="px-3 py-2.5 text-sm tabular-nums">
            {formatSats((point.value as number) ?? 0)}
          </div>
        )}
        showDatePill={false}
      />
      <LiveXAxis />
      <LiveYAxis formatValue={formatSats} position="left" />
    </LiveLineExampleChart>
  );
}

const momentumColors: MomentumColors = {
  down: "var(--chart-negative)",
  flat: "var(--muted-foreground)",
  up: "var(--chart-positive)",
};

function LiveLineMomentumDemo() {
  const { data, value } = useLiveData(85, 500);
  const formatUsd = useCallback((v: number) => `$${v.toFixed(2)}`, []);
  return (
    <LiveLineExampleChart
      data={data}
      margin={{ left: 28 }}
      style={{ height: 240 }}
      value={value}
      window={25}
    >
      <LiveLine
        dataKey="value"
        dotSize={5}
        formatValue={formatUsd}
        momentumColors={momentumColors}
      />
      <ChartTooltip
        content={({ point }) => (
          <div className="px-3 py-2.5 text-sm tabular-nums">
            {formatUsd((point.value as number) ?? 0)}
          </div>
        )}
        showDatePill={false}
      />
      <LiveXAxis />
      <LiveYAxis formatValue={formatUsd} position="left" />
    </LiveLineExampleChart>
  );
}

function LiveLineNoFillDemo() {
  const { data, value } = useLiveData(72, 550);
  const formatUsd = useCallback((v: number) => `$${v.toFixed(2)}`, []);
  return (
    <LiveLineExampleChart
      data={data}
      margin={{ left: 28 }}
      style={{ height: 240 }}
      value={value}
      window={28}
    >
      <LiveLine
        dataKey="value"
        fill={false}
        formatValue={formatUsd}
        stroke="var(--chart-1)"
      />
      <ChartTooltip
        content={({ point }) => (
          <div className="px-3 py-2.5 text-sm tabular-nums">
            {formatUsd((point.value as number) ?? 0)}
          </div>
        )}
        showDatePill={false}
      />
      <LiveXAxis />
      <LiveYAxis formatValue={formatUsd} position="left" />
    </LiveLineExampleChart>
  );
}

function makeLiveLineExamples(): ChartExample[] {
  return [
    {
      code: `<LiveLineChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={data} value={value} window={30}>
  <LiveLine dataKey="value" stroke="var(--chart-1)" formatValue={(v) => \`$\${v.toFixed(2)}\`} />
  <ChartTooltip showDatePill={false} content={TooltipContent} />
  <LiveXAxis />
  <LiveYAxis position="left" formatValue={(v) => \`$\${v.toFixed(2)}\`} />
</LiveLineChart>`,
      description: "Streaming data with smooth scroll, live dot, and crosshair",
      render: () => <LiveLineBasicDemo />,
      title: "Live Line Chart",
    },
    {
      code: `<LiveLineChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={data} value={value} window={20} nowOffsetUnits={1}>
  <LiveLine dataKey="value" stroke="var(--chart-3)" formatValue={formatSats} dotSize={4} />
  <LiveXAxis />
  <LiveYAxis position="left" formatValue={formatSats} />
</LiveLineChart>`,
      description: "Leading gap so the line fades at the right edge",
      render: () => <LiveLineOffsetDemo />,
      title: "Live Line - Now Offset",
    },
    {
      code: `const momentumColors = { up: "var(--chart-positive)", down: "var(--chart-negative)", flat: "var(--muted-foreground)" };

<LiveLineChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={data} value={value} window={25}>
  <LiveLine dataKey="value" momentumColors={momentumColors} formatValue={formatUsd} dotSize={5} />
  <LiveXAxis />
  <LiveYAxis position="left" formatValue={formatUsd} />
</LiveLineChart>`,
      description: "Green for increase, red for decrease",
      render: () => <LiveLineMomentumDemo />,
      title: "Live Line - Momentum Colors",
    },
    {
      code: `<LiveLineChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={data} value={value} window={28}>
  <LiveLine dataKey="value" fill={false} stroke="var(--chart-1)" formatValue={formatUsd} />
  <LiveXAxis />
  <LiveYAxis position="left" formatValue={formatUsd} />
</LiveLineChart>`,
      description: "No area fill — simple line and live dot",
      render: () => <LiveLineNoFillDemo />,
      title: "Live Line - Line Only",
    },
    {
      code: `<LiveLineChart margin={{ top: 8, right: 8, bottom: 40, left: 28 }} data={data} value={value} window={30}>
  <Background />
  <LiveLine dataKey="value" stroke="var(--chart-1)" formatValue={formatUsd} />
  <LiveXAxis />
  <LiveYAxis position="left" formatValue={formatUsd} />
</LiveLineChart>`,
      description: "Diagonal pattern fill instead of grid lines",
      render: () => <LiveLineBackgroundDiagonalDemo />,
      title: "Live Line - Pattern Background",
    },
    {
      code: `<LiveLineChart margin={{ top: 8, right: 8, bottom: 40, left: 28 }} data={data} value={value} window={30}>
  <Background pattern="dots" opacity={0.85} />
  <LiveLine dataKey="value" stroke="var(--chart-1)" formatValue={formatUsd} />
  <LiveXAxis />
  <LiveYAxis position="left" formatValue={formatUsd} />
</LiveLineChart>`,
      description: "Dot grid texture with edge fade",
      render: () => <LiveLineBackgroundDotsDemo />,
      title: "Live Line - Dot Grid Background",
    },
    {
      code: `<LiveLineChart margin={{ top: 8, right: 8, bottom: 40, left: 28 }} data={data} value={value} window={30}>
  <ReferenceArea y1={138} y2={148} strokeStyle="dashed" showMarkers />
  <LiveLine dataKey="value" stroke="var(--chart-1)" formatValue={formatUsd} />
  <LiveXAxis />
  <LiveYAxis position="left" formatValue={formatUsd} />
</LiveLineChart>`,
      description: "Target price band with dashed edges and bracket markers",
      footer: "See /docs/utility/reference-area",
      render: () => <LiveLineReferenceBandDemo />,
      title: "Live Line - Reference Band",
    },
    {
      code: `<LiveLineChart margin={{ top: 8, right: 8, bottom: 40, left: 28 }} data={data} value={value} window={30}>
  <ReferenceArea
    y1={138}
    y2={148}
    pattern="diagonal"
    patternColor="var(--chart-foreground-muted)"
    axisLabelColor="var(--chart-1)"
    fillOpacity={0.85}
  />
  <LiveLine dataKey="value" stroke="var(--chart-1)" formatValue={formatUsd} />
  <LiveXAxis />
  <LiveYAxis position="left" formatValue={formatUsd} />
</LiveLineChart>`,
      description: "Pattern fill inside the band with colored Y-axis ticks",
      render: () => <LiveLinePatternReferenceBandDemo />,
      title: "Live Line - Pattern Reference Band",
    },
  ];
}

function LiveLineBackgroundDiagonalDemo() {
  const { data, value } = useLiveData(142.5, 600);
  const formatUsd = useCallback((v: number) => `$${v.toFixed(2)}`, []);
  return (
    <LiveLineExampleChart
      data={data}
      margin={{ left: 28 }}
      style={{ height: 240 }}
      value={value}
      window={30}
    >
      <Background />
      <LiveLine
        dataKey="value"
        formatValue={formatUsd}
        stroke="var(--chart-1)"
      />
      <LiveXAxis />
      <LiveYAxis formatValue={formatUsd} position="left" />
    </LiveLineExampleChart>
  );
}

function LiveLineBackgroundDotsDemo() {
  const { data, value } = useLiveData(142.5, 600);
  const formatUsd = useCallback((v: number) => `$${v.toFixed(2)}`, []);
  return (
    <LiveLineExampleChart
      data={data}
      margin={{ left: 28 }}
      style={{ height: 240 }}
      value={value}
      window={30}
    >
      <Background opacity={0.85} pattern="dots" />
      <LiveLine
        dataKey="value"
        formatValue={formatUsd}
        stroke="var(--chart-1)"
      />
      <LiveXAxis />
      <LiveYAxis formatValue={formatUsd} position="left" />
    </LiveLineExampleChart>
  );
}

function LiveLineReferenceBandDemo() {
  const { data, value } = useLiveData(142.5, 600);
  const formatUsd = useCallback((v: number) => `$${v.toFixed(2)}`, []);
  return (
    <LiveLineExampleChart
      data={data}
      margin={{ left: 28 }}
      style={{ height: 240 }}
      value={value}
      window={30}
    >
      <ReferenceArea showMarkers strokeStyle="dashed" y1={138} y2={148} />
      <LiveLine
        dataKey="value"
        formatValue={formatUsd}
        stroke="var(--chart-1)"
      />
      <LiveXAxis />
      <LiveYAxis formatValue={formatUsd} position="left" />
    </LiveLineExampleChart>
  );
}

function LiveLinePatternReferenceBandDemo() {
  const { data, value } = useLiveData(142.5, 600);
  const formatUsd = useCallback((v: number) => `$${v.toFixed(2)}`, []);
  return (
    <LiveLineExampleChart
      data={data}
      margin={{ left: 28 }}
      style={{ height: 240 }}
      value={value}
      window={30}
    >
      <ReferenceArea
        axisLabelColor="var(--chart-1)"
        fillOpacity={0.85}
        pattern="diagonal"
        patternColor="var(--chart-foreground-muted)"
        y1={138}
        y2={148}
      />
      <LiveLine
        dataKey="value"
        formatValue={formatUsd}
        stroke="var(--chart-1)"
      />
      <LiveXAxis />
      <LiveYAxis formatValue={formatUsd} position="left" />
    </LiveLineExampleChart>
  );
}

function makeLiveLineHero(): ChartExample {
  return {
    code: `<LiveLineChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={data} value={value} window={30}>
  <LiveLine dataKey="value" stroke="var(--chart-line-primary)" formatValue={(v) => \`$\${v.toFixed(2)}\`} />
  <ChartTooltip showDatePill={false} content={TooltipContent} />
  <LiveXAxis />
  <LiveYAxis position="left" formatValue={(v) => \`$\${v.toFixed(2)}\`} />
</LiveLineChart>`,
    description: "Real-time streaming with crosshair and animated axes",
    footer: "Data streams in real time; hover to scrub the crosshair",
    render: () => <LiveLineBasicDemo />,
    title: "Live Line Chart - Interactive",
  };
}

// ---------------------------------------------------------------------------
// Choropleth helpers
// ---------------------------------------------------------------------------

const visitorsByCountry: Record<string, number> = {
  Argentina: 3,
  Australia: 6,
  Brazil: 7,
  Canada: 8,
  France: 9,
  Germany: 17,
  India: 11,
  Indonesia: 2,
  Italy: 6,
  Japan: 4,
  Mexico: 5,
  Netherlands: 5,
  Philippines: 3,
  Poland: 4,
  "South Africa": 4,
  Spain: 3,
  Sweden: 3,
  Thailand: 2,
  "United Kingdom": 12,
  "United States": 18,
};

function getVisitorColor(feat: ChoroplethFeature): string {
  const visitors = visitorsByCountry[feat.properties?.name as string];
  if (!visitors) {
    return "var(--chart-scale-01)";
  }
  if (visitors >= 17) {
    return "var(--chart-1)";
  }
  if (visitors >= 13) {
    return "var(--chart-2)";
  }
  if (visitors >= 9) {
    return "var(--chart-3)";
  }
  if (visitors >= 5) {
    return "var(--chart-4)";
  }
  return "var(--chart-5)";
}

function getVisitorValue(feat: ChoroplethFeature): number | undefined {
  return visitorsByCountry[feat.properties?.name as string];
}

function ChoroplethLoading() {
  return (
    <div className="flex h-[200px] items-center justify-center">
      <div className="animate-pulse text-foreground-muted text-sm">
        Loading map...
      </div>
    </div>
  );
}

function ChoroplethBasic() {
  const { worldData, isLoading } = useWorldDataStandalone();
  if (isLoading || !worldData) {
    return <ChoroplethLoading />;
  }
  return (
    <ChoroplethExampleChart aspectRatio="16 / 9" data={worldData}>
      <ChoroplethGraticule />
      <ChoroplethFeatureComponent fill="var(--chart-3)" />
      <ChoroplethTooltip />
    </ChoroplethExampleChart>
  );
}

function ChoroplethAnalytics() {
  const { worldData, isLoading } = useWorldDataStandalone();
  if (isLoading || !worldData) {
    return <ChoroplethLoading />;
  }
  return (
    <ChoroplethExampleChart aspectRatio="16 / 9" data={worldData}>
      <ChoroplethFeatureComponent getFeatureColor={getVisitorColor} />
      <ChoroplethTooltip
        getFeatureValue={getVisitorValue}
        valueLabel="Visitors"
      />
    </ChoroplethExampleChart>
  );
}

function ChoroplethWithGraticule() {
  const { worldData, isLoading } = useWorldDataStandalone();
  if (isLoading || !worldData) {
    return <ChoroplethLoading />;
  }
  return (
    <ChoroplethExampleChart aspectRatio="16 / 9" data={worldData}>
      <ChoroplethGraticule stroke="rgba(255,255,255,0.15)" />
      <ChoroplethFeatureComponent fill="var(--chart-1)" />
      <ChoroplethTooltip />
    </ChoroplethExampleChart>
  );
}

function getRegionCategory(name: string) {
  const c = name.charAt(0).toUpperCase();
  if ("ABCD".includes(c)) {
    return "americas";
  }
  if ("EFGH".includes(c)) {
    return "europe";
  }
  if ("IJKLM".includes(c)) {
    return "asia";
  }
  if ("NOPQR".includes(c)) {
    return "africa";
  }
  return "oceania";
}

function ChoroplethPattern() {
  const { worldData, isLoading } = useWorldDataStandalone();
  if (isLoading || !worldData) {
    return <ChoroplethLoading />;
  }

  return (
    <ChoroplethExampleChart aspectRatio="16 / 9" data={worldData}>
      <ChoroplethFeatureComponent
        getFeaturePattern={(feat) => {
          const name = feat.properties?.name;
          return name ? `choro-p-${getRegionCategory(name as string)}` : null;
        }}
        patterns={
          <>
            <PatternLines
              height={6}
              id="choro-p-americas"
              orientation={["diagonal"]}
              stroke="var(--chart-1)"
              strokeWidth={2}
              width={6}
            />
            <PatternLines
              height={6}
              id="choro-p-europe"
              orientation={["diagonal"]}
              stroke="var(--chart-2)"
              strokeWidth={2}
              width={6}
            />
            <PatternLines
              height={6}
              id="choro-p-asia"
              orientation={["diagonal"]}
              stroke="var(--chart-3)"
              strokeWidth={2}
              width={6}
            />
            <PatternLines
              height={6}
              id="choro-p-africa"
              orientation={["diagonal"]}
              stroke="var(--chart-4)"
              strokeWidth={2}
              width={6}
            />
            <PatternLines
              height={6}
              id="choro-p-oceania"
              orientation={["diagonal"]}
              stroke="var(--chart-5)"
              strokeWidth={2}
              width={6}
            />
          </>
        }
      />
      <ChoroplethTooltip />
    </ChoroplethExampleChart>
  );
}

function RingWithLegend() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const legendItems = ringData.map((d) => ({
    color: d.color || "",
    label: d.label,
    maxValue: d.maxValue,
    value: d.value,
  }));
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="mx-auto w-full max-w-[240px]">
        <RingChart
          data={ringData}
          hoveredIndex={hoveredIndex}
          onHoverChange={setHoveredIndex}
        >
          {ringData.map((item, index) => (
            <Ring index={index} key={item.label} />
          ))}
          <RingCenter defaultLabel="Sessions" />
        </RingChart>
      </div>
      <Legend
        className="w-full"
        hoveredIndex={hoveredIndex}
        items={legendItems}
        onHoverChange={setHoveredIndex}
      >
        <LegendItemComponent className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2 gap-y-0.5">
          <LegendMarker />
          <LegendLabel className="text-xs" />
          <LegendValue className="text-xs" showPercentage />
          <div className="col-span-full">
            <LegendProgress />
          </div>
        </LegendItemComponent>
      </Legend>
    </div>
  );
}

function PieDonutInteractive() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  return (
    <div className={chartExampleRadialShellClassName}>
      <PieChart
        data={pieData}
        hoveredIndex={hoveredIndex}
        innerRadius={60}
        onHoverChange={setHoveredIndex}
      >
        {pieData.map((item, index) => (
          <PieSlice index={index} key={item.label} />
        ))}
        <PieCenter defaultLabel="Total" />
      </PieChart>
    </div>
  );
}

function PieWithLegend() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const legendItems = pieData.map((d) => ({
    color: d.color || "",
    label: d.label,
    value: d.value,
  }));
  return (
    <div className="flex flex-col items-center gap-4">
      <PieChart
        data={pieData}
        hoveredIndex={hoveredIndex}
        innerRadius={55}
        onHoverChange={setHoveredIndex}
      >
        {pieData.map((item, index) => (
          <PieSlice index={index} key={item.label} />
        ))}
        <PieCenter defaultLabel="Browsers" />
      </PieChart>
      <Legend
        className="flex-row flex-wrap justify-center gap-x-4 gap-y-1"
        hoveredIndex={hoveredIndex}
        items={legendItems}
        onHoverChange={setHoveredIndex}
      >
        <LegendItemComponent className="flex items-center gap-1.5">
          <LegendMarker />
          <LegendLabel className="text-xs" />
        </LegendItemComponent>
      </Legend>
    </div>
  );
}

function PieGrowHover() {
  return (
    <div className={chartExampleRadialShellClassName}>
      <PieChart data={pieData}>
        {pieData.map((item, index) => (
          <PieSlice hoverEffect="grow" index={index} key={item.label} />
        ))}
      </PieChart>
    </div>
  );
}

function PieCustomCenter() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = pieData.reduce((s, d) => s + d.value, 0);
  return (
    <div className={chartExampleRadialShellClassName}>
      <PieChart
        data={pieData}
        hoveredIndex={hoveredIndex}
        innerRadius={65}
        onHoverChange={setHoveredIndex}
      >
        {pieData.map((item, index) => (
          <PieSlice index={index} key={item.label} />
        ))}
        <PieCenter>
          {({ value, label, isHovered, data: d }) => (
            <div className="text-center">
              <div
                className="font-bold text-xl"
                style={{ color: isHovered ? d.color : undefined }}
              >
                {value.toLocaleString()}
              </div>
              <div className="text-foreground-muted text-xs">{label}</div>
              {isHovered && (
                <div className="mt-0.5 text-[10px] text-foreground-muted">
                  {((d.value / total) * 100).toFixed(1)}%
                </div>
              )}
            </div>
          )}
        </PieCenter>
      </PieChart>
    </div>
  );
}

const piePatternData: PieData[] = [
  { label: "Category A", value: 35 },
  { label: "Category B", value: 25 },
  { label: "Category C", value: 20 },
  { label: "Category D", value: 20 },
];

const pieGradientData: PieData[] = [
  { label: "Segment A", value: 40 },
  { label: "Segment B", value: 30 },
  { label: "Segment C", value: 30 },
];

function makePieExamples(): ChartExample[] {
  return [
    {
      code: `<PieChart data={pieData} size={200}>
  {pieData.map((item, index) => (
    <PieSlice index={index} key={item.label} />
  ))}
</PieChart>`,
      description: "Basic pie chart with colored slices",
      render: () => (
        <div className={chartExampleRadialShellClassName}>
          <PieChart data={pieData}>
            {pieData.map((item, index) => (
              <PieSlice index={index} key={item.label} />
            ))}
          </PieChart>
        </div>
      ),
      title: "Pie Chart",
    },
    {
      code: `<PieChart data={pieData} innerRadius={60} size={200}>
  {pieData.map((item, index) => (
    <PieSlice index={index} key={item.label} />
  ))}
  <PieCenter defaultLabel="Total" />
</PieChart>`,
      description: "Hollow center with animated value display",
      render: () => (
        <div className={chartExampleRadialShellClassName}>
          <PieDonutInteractive />
        </div>
      ),
      title: "Pie Chart - Donut",
    },
    {
      code: `const [hoveredIndex, setHoveredIndex] = useState(null);

<PieChart
  data={pieData}
  hoveredIndex={hoveredIndex}
  innerRadius={55}
  onHoverChange={setHoveredIndex}
  size={180}
>
  {pieData.map((_, i) => <PieSlice index={i} key={i} />)}
  <PieCenter defaultLabel="Browsers" />
</PieChart>
<Legend
  hoveredIndex={hoveredIndex}
  items={legendItems}
  onHoverChange={setHoveredIndex}
>
  <LegendItemComponent>
    <LegendMarker />
    <LegendLabel />
  </LegendItemComponent>
</Legend>`,
      description: "Interactive legend synced with chart hover",
      render: () => (
        <div className={chartExampleRadialShellClassName}>
          <PieWithLegend />
        </div>
      ),
      title: "Pie Chart - Legend",
    },
    {
      code: `<PieChart data={pieData} size={200}>
  <PatternLines height={6} id="pp-1" orientation={["diagonal"]}
    stroke="var(--chart-1)" width={6} />
  <PatternLines height={6} id="pp-2" orientation={["horizontal"]}
    stroke="var(--chart-2)" width={6} />
  <PatternLines height={6} id="pp-3" orientation={["vertical"]}
    stroke="var(--chart-3)" width={6} />
  <PatternLines height={8} id="pp-4" orientation={["diagonalRightToLeft"]}
    stroke="var(--chart-4)" width={8} />
  <PieSlice fill="url(#pp-1)" index={0} />
  <PieSlice fill="url(#pp-2)" index={1} />
  <PieSlice fill="url(#pp-3)" index={2} />
  <PieSlice fill="url(#pp-4)" index={3} />
</PieChart>`,
      description: "Diagonal line patterns for each slice",
      render: () => (
        <div className={chartExampleRadialShellClassName}>
          <PieChart data={piePatternData}>
            <PatternLines
              height={6}
              id="pie-ex-p1"
              orientation={["diagonal"]}
              stroke="var(--chart-1)"
              strokeWidth={1}
              width={6}
            />
            <PatternLines
              height={6}
              id="pie-ex-p2"
              orientation={["horizontal"]}
              stroke="var(--chart-2)"
              strokeWidth={1}
              width={6}
            />
            <PatternLines
              height={6}
              id="pie-ex-p3"
              orientation={["vertical"]}
              stroke="var(--chart-3)"
              strokeWidth={1}
              width={6}
            />
            <PatternLines
              height={8}
              id="pie-ex-p4"
              orientation={["diagonalRightToLeft"]}
              stroke="var(--chart-4)"
              strokeWidth={1}
              width={8}
            />
            <PieSlice fill="url(#pie-ex-p1)" index={0} />
            <PieSlice fill="url(#pie-ex-p2)" index={1} />
            <PieSlice fill="url(#pie-ex-p3)" index={2} />
            <PieSlice fill="url(#pie-ex-p4)" index={3} />
          </PieChart>
        </div>
      ),
      title: "Pie Chart - Patterns",
    },
    {
      code: `<PieChart data={pieData} size={200}>
  <RadialGradient from="#0ea5e9" id="pg-1" to="#06b6d4" />
  <RadialGradient from="#a855f7" id="pg-2" to="#ec4899" />
  <RadialGradient from="#f59e0b" id="pg-3" to="#ef4444" />
  <PieSlice fill="url(#pg-1)" index={0} />
  <PieSlice fill="url(#pg-2)" index={1} />
  <PieSlice fill="url(#pg-3)" index={2} />
</PieChart>`,
      description: "Radial gradient fills on each slice",
      render: () => (
        <div className={chartExampleRadialShellClassName}>
          <PieChart data={pieGradientData}>
            <RadialGradient
              from="#0ea5e9"
              fromOffset="0%"
              id="pie-ex-g1"
              to="#06b6d4"
              toOffset="100%"
            />
            <RadialGradient
              from="#a855f7"
              fromOffset="0%"
              id="pie-ex-g2"
              to="#ec4899"
              toOffset="100%"
            />
            <RadialGradient
              from="#f59e0b"
              fromOffset="0%"
              id="pie-ex-g3"
              to="#ef4444"
              toOffset="100%"
            />
            <PieSlice fill="url(#pie-ex-g1)" index={0} />
            <PieSlice fill="url(#pie-ex-g2)" index={1} />
            <PieSlice fill="url(#pie-ex-g3)" index={2} />
          </PieChart>
        </div>
      ),
      title: "Pie Chart - Gradients",
    },
    {
      code: `<PieChart data={pieData} size={200}>
  {pieData.map((item, index) => (
    <PieSlice hoverEffect="grow" index={index} key={item.label} />
  ))}
</PieChart>`,
      description: "Slices extend outward on hover instead of translating",
      render: () => (
        <div className={chartExampleRadialShellClassName}>
          <PieGrowHover />
        </div>
      ),
      title: "Pie Chart - Grow Hover",
    },
    {
      code: `<PieChart data={pieData} innerRadius={65} size={200}>
  {pieData.map((_, i) => <PieSlice index={i} key={i} />)}
  <PieCenter>
    {({ value, label, isHovered, data }) => (
      <div className="text-center">
        <div className="font-bold text-xl"
          style={{ color: isHovered ? data.color : undefined }}>
          {value.toLocaleString()}
        </div>
        <div className="text-foreground-muted text-xs">{label}</div>
      </div>
    )}
  </PieCenter>
</PieChart>`,
      description: "Render prop for full control over center content",
      render: () => (
        <div className={chartExampleRadialShellClassName}>
          <PieCustomCenter />
        </div>
      ),
      title: "Pie Chart - Custom Center",
    },
    {
      code: `<PieChart data={pieData} innerRadius={55} size={200}>
  <PatternLines height={6} id="dp-1" orientation={["diagonal"]}
    stroke="var(--chart-1)" width={6} />
  <PatternLines height={6} id="dp-2" orientation={["horizontal"]}
    stroke="var(--chart-2)" width={6} />
  <PatternLines height={6} id="dp-3" orientation={["vertical"]}
    stroke="var(--chart-3)" width={6} />
  <PatternLines height={8} id="dp-4" orientation={["diagonalRightToLeft"]}
    stroke="var(--chart-4)" width={8} />
  <PieSlice fill="url(#dp-1)" index={0} />
  <PieSlice fill="url(#dp-2)" index={1} />
  <PieSlice fill="url(#dp-3)" index={2} />
  <PieSlice fill="url(#dp-4)" index={3} />
  <PieCenter defaultLabel="Total" />
</PieChart>`,
      description: "Donut with patterned slices and center label",
      render: () => (
        <div className={chartExampleRadialShellClassName}>
          <PieChart data={piePatternData} innerRadius={55}>
            <PatternLines
              height={6}
              id="donut-ex-p1"
              orientation={["diagonal"]}
              stroke="var(--chart-1)"
              strokeWidth={1}
              width={6}
            />
            <PatternLines
              height={6}
              id="donut-ex-p2"
              orientation={["horizontal"]}
              stroke="var(--chart-2)"
              strokeWidth={1}
              width={6}
            />
            <PatternLines
              height={6}
              id="donut-ex-p3"
              orientation={["vertical"]}
              stroke="var(--chart-3)"
              strokeWidth={1}
              width={6}
            />
            <PatternLines
              height={8}
              id="donut-ex-p4"
              orientation={["diagonalRightToLeft"]}
              stroke="var(--chart-4)"
              strokeWidth={1}
              width={8}
            />
            <PieSlice fill="url(#donut-ex-p1)" index={0} />
            <PieSlice fill="url(#donut-ex-p2)" index={1} />
            <PieSlice fill="url(#donut-ex-p3)" index={2} />
            <PieSlice fill="url(#donut-ex-p4)" index={3} />
            <PieCenter defaultLabel="Total" />
          </PieChart>
        </div>
      ),
      title: "Donut Chart - Patterns",
    },
    {
      code: `<PieChart data={pieData} innerRadius={55} size={200}>
  {pieData.map((item, index) => (
    <PieSlice hoverEffect="grow" index={index} key={item.label} />
  ))}
  <PieCenter defaultLabel="Browsers" />
</PieChart>`,
      description: "Donut with grow effect and center value",
      render: () => (
        <div className={chartExampleRadialShellClassName}>
          <PieChart data={pieData} innerRadius={55}>
            {pieData.map((item, index) => (
              <PieSlice hoverEffect="grow" index={index} key={item.label} />
            ))}
            <PieCenter defaultLabel="Browsers" />
          </PieChart>
        </div>
      ),
      title: "Donut Chart - Grow Hover",
    },
  ];
}

function makeRadarExamples(): ChartExample[] {
  return [
    {
      code: `<RadarChart data={radarData} metrics={metrics} size={250}>
  <RadarGrid />
  <RadarAxis />
  <RadarLabels />
  {radarData.map((item, index) => (
    <RadarArea index={index} key={item.label} />
  ))}
</RadarChart>`,
      description: "Two models compared across five metrics",
      render: () => (
        <div className={chartExampleRadialShellClassName}>
          <RadarChart data={radarDataDual} metrics={radarMetrics5}>
            <RadarGrid />
            <RadarAxis />
            <RadarLabels fontSize={10} offset={16} />
            {radarDataDual.map((item, index) => (
              <RadarArea index={index} key={item.label} />
            ))}
          </RadarChart>
        </div>
      ),
      title: "Radar Chart",
    },
    {
      code: `const metrics = [
  { key: "attack", label: "Attack" },
  { key: "defense", label: "Defense" },
  { key: "magic", label: "Magic" },
];

<RadarChart data={data} metrics={metrics} size={250}>
  <RadarGrid />
  <RadarAxis />
  <RadarLabels />
  {data.map((item, i) => (
    <RadarArea index={i} key={item.label} />
  ))}
</RadarChart>`,
      description: "Three metrics with two contrasting profiles",
      render: () => (
        <div className={chartExampleRadialShellClassName}>
          <RadarChart data={radarDataTriangle} metrics={radarMetrics3}>
            <RadarGrid />
            <RadarAxis />
            <RadarLabels fontSize={10} offset={16} />
            {radarDataTriangle.map((item, index) => (
              <RadarArea index={index} key={item.label} />
            ))}
          </RadarChart>
        </div>
      ),
      title: "Radar Chart - Triangle",
    },
    {
      code: `<RadarChart data={skillsData} metrics={skillMetrics} size={250}>
  <RadarGrid showLabels={false} />
  <RadarLabels />
  {skillsData.map((item, i) => (
    <RadarArea
      index={i}
      key={item.label}
      showGlow={false}
      showPoints={false}
      showStroke={false}
    />
  ))}
</RadarChart>`,
      description: "Six metrics, fill only without stroke or dots",
      render: () => (
        <div className={chartExampleRadialShellClassName}>
          <RadarChart data={radarDataSkills} metrics={radarMetrics6}>
            <RadarGrid showLabels={false} />
            <RadarLabels fontSize={10} offset={16} />
            {radarDataSkills.map((item, index) => (
              <RadarArea
                index={index}
                key={item.label}
                showGlow={false}
                showPoints={false}
                showStroke={false}
              />
            ))}
          </RadarChart>
        </div>
      ),
      title: "Radar Chart - Hexagon",
    },
    {
      code: `<RadarChart data={[data[0]]} metrics={metrics} size={250}>
  <RadarGrid />
  <RadarAxis />
  <RadarLabels />
  <RadarArea index={0} showPoints={false} />
</RadarChart>`,
      description: "One asymmetric profile without corner dots",
      render: () => (
        <div className={chartExampleRadialShellClassName}>
          <RadarChart data={radarDataLopsided} metrics={radarMetrics5}>
            <RadarGrid />
            <RadarAxis />
            <RadarLabels fontSize={10} offset={16} />
            <RadarArea index={0} showPoints={false} />
          </RadarChart>
        </div>
      ),
      title: "Radar Chart - Single Series",
    },
    {
      code: `<RadarChart data={data} levels={3} metrics={metrics} size={250}>
  <RadarGrid showLabels={false} />
  <RadarLabels />
  {data.map((item, i) => (
    <RadarArea index={i} key={item.label} showPoints={false} />
  ))}
</RadarChart>`,
      description: "No grid labels, fewer levels, clean look",
      render: () => (
        <div className={chartExampleRadialShellClassName}>
          <RadarChart data={radarDataDual} levels={3} metrics={radarMetrics5}>
            <RadarGrid showLabels={false} />
            <RadarLabels fontSize={10} offset={16} />
            {radarDataDual.map((item, index) => (
              <RadarArea index={index} key={item.label} showPoints={false} />
            ))}
          </RadarChart>
        </div>
      ),
      title: "Radar Chart - Minimal",
    },
    {
      code: `<RadarChart data={data} metrics={metrics} size={250}>
  <RadarGrid />
  <RadarLabels />
  {data.map((item, i) => (
    <RadarArea index={i} key={item.label} />
  ))}
</RadarChart>`,
      description: "No axis lines for a softer appearance",
      render: () => (
        <div className={chartExampleRadialShellClassName}>
          <RadarChart data={radarDataTriangle} metrics={radarMetrics3}>
            <RadarGrid />
            <RadarLabels fontSize={10} offset={16} />
            {radarDataTriangle.map((item, index) => (
              <RadarArea index={index} key={item.label} showGlow={false} />
            ))}
          </RadarChart>
        </div>
      ),
      title: "Radar Chart - Grid Only",
    },
  ];
}

function makeRingExamples(): ChartExample[] {
  return [
    {
      code: `<RingChart data={ringData} size={250}>
  {ringData.map((item, index) => (
    <Ring index={index} key={item.label} />
  ))}
  <RingCenter defaultLabel="Sessions" />
</RingChart>`,
      description: "Multi-ring progress with center value",
      render: () => (
        <div className={chartExampleRadialShellClassName}>
          <RingChart data={ringData}>
            {ringData.map((item, index) => (
              <Ring index={index} key={item.label} />
            ))}
            <RingCenter defaultLabel="Sessions" />
          </RingChart>
        </div>
      ),
      title: "Ring Chart",
    },
    {
      code: `<RingChart data={ringData} size={250}>
  {ringData.map((item, index) => (
    <Ring index={index} key={item.label} lineCap="butt" />
  ))}
  <RingCenter defaultLabel="Sessions" />
</RingChart>`,
      description: "Square ring ends instead of rounded",
      render: () => (
        <div className={chartExampleRadialShellClassName}>
          <RingChart data={ringData}>
            {ringData.map((item, index) => (
              <Ring index={index} key={item.label} lineCap="butt" />
            ))}
            <RingCenter defaultLabel="Sessions" />
          </RingChart>
        </div>
      ),
      title: "Ring Chart - Flat Caps",
    },
    {
      code: `<RingChart data={financeData} ringGap={8} size={250} strokeWidth={18}>
  {financeData.map((item, index) => (
    <Ring index={index} key={item.label} />
  ))}
  <RingCenter defaultLabel="Total" formatOptions={{ notation: "compact" }} prefix="$" />
</RingChart>`,
      description: "Wider stroke with larger gap between rings",
      render: () => (
        <div className={chartExampleRadialShellClassName}>
          <RingChart data={ringFinanceData} ringGap={8} strokeWidth={18}>
            {ringFinanceData.map((item, index) => (
              <Ring index={index} key={item.label} />
            ))}
            <RingCenter
              defaultLabel="Total"
              formatOptions={{ notation: "compact" }}
              prefix="$"
            />
          </RingChart>
        </div>
      ),
      title: "Ring Chart - Thick Rings",
    },
    {
      code: `<RingChart
  data={goalData}
  endAngle={Math.PI / 2}
  size={250}
  startAngle={-Math.PI}
>
  {goalData.map((item, index) => (
    <Ring index={index} key={item.label} />
  ))}
  <RingCenter defaultLabel="Activity" />
</RingChart>`,
      description: "270-degree arc from top-left to bottom-left",
      render: () => (
        <div className={chartExampleRadialShellClassName}>
          <RingChart
            data={ringGoalData}
            endAngle={Math.PI / 2}
            startAngle={-Math.PI}
          >
            {ringGoalData.map((item, index) => (
              <Ring index={index} key={item.label} />
            ))}
            <RingCenter defaultLabel="Activity" />
          </RingChart>
        </div>
      ),
      title: "Ring Chart - Three Quarter",
    },
    {
      code: `<RingChart
  data={ringData}
  endAngle={0}
  size={250}
  startAngle={-Math.PI}
>
  {ringData.map((item, index) => (
    <Ring index={index} key={item.label} />
  ))}
</RingChart>`,
      description: "180-degree arc across the top",
      render: () => (
        <div className={chartExampleRadialShellClassName}>
          <RingChart data={ringData} endAngle={0} startAngle={-Math.PI}>
            {ringData.map((item, index) => (
              <Ring index={index} key={item.label} />
            ))}
            <RingCenter defaultLabel="Sessions" />
          </RingChart>
        </div>
      ),
      title: "Ring Chart - Half Circle",
    },
    {
      code: `const [hoveredIndex, setHoveredIndex] = useState(null);

<RingChart
  data={ringData}
  hoveredIndex={hoveredIndex}
  onHoverChange={setHoveredIndex}
  size={180}
>
  {ringData.map((_, i) => <Ring index={i} key={i} />)}
  <RingCenter defaultLabel="Sessions" />
</RingChart>
<Legend
  hoveredIndex={hoveredIndex}
  items={ringData}
  onHoverChange={setHoveredIndex}
>
  <LegendItemComponent>
    <LegendMarker />
    <LegendLabel />
    <LegendValue showPercentage />
    <LegendProgress />
  </LegendItemComponent>
</Legend>`,
      description: "Interactive legend with progress bars",
      render: () => <RingWithLegend />,
      title: "Ring Chart - Legend",
    },
  ];
}

const gaugeGalleryUsdFormat: ChartStatFlowFormat = {
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
  style: "currency",
};

function makeGaugeHero(): ChartExample {
  return {
    code: `<Gauge
  centerValue={428_000}
  defaultLabel="ARR run rate"
  formatOptions={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
  inactiveFillOpacity={0.4}
  spacing={25}
  value={66}
/>`,
    data: "// Omit width and height for a responsive layout (min-width 300px by default).",
    description:
      "Notch arc with PieCenter-style NumberFlow, theme fills, optional patterns in defs, and separate active / inactive arc gradients when enabled.",
    render: () => (
      <div className={chartExampleGaugeShellClassName}>
        <Gauge
          centerValue={428_000}
          className={chartExampleGaugeClassName}
          defaultLabel="ARR run rate"
          formatOptions={gaugeGalleryUsdFormat}
          inactiveFillOpacity={0.4}
          minWidth={0}
          spacing={25}
          value={66}
        />
      </div>
    ),
    title: "Gauge",
  };
}

function makeGaugeExamples(): ChartExample[] {
  return [
    {
      code: `<Gauge
  centerValue={428_000}
  defaultLabel="ARR run rate"
  endAngle={400}
  formatOptions={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
  inactiveFillOpacity={0.4}
  notchCornerRadius={7}
  spacing={0}
  startAngle={140}
  value={66}
/>`,
      description:
        "No spacing between notches, 7px corner radius, custom sweep from 140° to 400°.",
      render: () => (
        <div className={chartExampleGaugeShellClassName}>
          <Gauge
            centerValue={428_000}
            className={chartExampleGaugeClassName}
            defaultLabel="ARR run rate"
            endAngle={400}
            formatOptions={gaugeGalleryUsdFormat}
            inactiveFillOpacity={0.4}
            minWidth={0}
            notchCornerRadius={7}
            spacing={0}
            startAngle={140}
            value={66}
          />
        </div>
      ),
      title: "Gauge — tight arc, filleted corners",
    },
    {
      code: `<Gauge
  activeGradient={["#a855f7", "#06b6d4"]}
  centerValue={428_000}
  defaultLabel="ARR run rate"
  endAngle={400}
  formatOptions={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
  inactiveFillOpacity={0.4}
  inactiveGradient={["#334155", "#38bdf8"]}
  notchCornerRadius={7}
  spacing={0}
  startAngle={140}
  useGradient
  value={66}
/>`,
      description:
        "Foreground and background notches each get their own hex ramp along the arc (requires useGradient).",
      render: () => (
        <div className={chartExampleGaugeShellClassName}>
          <Gauge
            activeGradient={["#a855f7", "#06b6d4"]}
            centerValue={428_000}
            className={chartExampleGaugeClassName}
            defaultLabel="ARR run rate"
            endAngle={400}
            formatOptions={gaugeGalleryUsdFormat}
            inactiveFillOpacity={0.4}
            inactiveGradient={["#334155", "#38bdf8"]}
            minWidth={0}
            notchCornerRadius={7}
            spacing={0}
            startAngle={140}
            useGradient
            value={66}
          />
        </div>
      ),
      title: "Gauge — dual arc gradients",
    },
    {
      code: `<Gauge
  activeFill="url(#gauge-gallery-ex3-fg)"
  centerValue={1840}
  defaultLabel="Trials converted (30d)"
  endAngle={400}
  formatOptions={{ maximumFractionDigits: 0 }}
  inactiveFill="var(--chart-1)"
  inactiveFillOpacity={0.4}
  notchCornerRadius={7}
  spacing={0}
  startAngle={140}
  value={66}
>
  <PatternLines
    height={6}
    id="gauge-gallery-ex3-fg"
    orientation={["diagonal"]}
    stroke="var(--chart-1)"
    strokeWidth={1}
    width={6}
  />
</Gauge>`,
      description:
        "Diagonal PatternLines on active notches; inactive track uses `chart-1` at 0.4 fill opacity.",
      render: () => (
        <div className={chartExampleGaugeShellClassName}>
          <Gauge
            activeFill="url(#gauge-gallery-ex3-fg)"
            centerValue={1840}
            className={chartExampleGaugeClassName}
            defaultLabel="Trials converted (30d)"
            endAngle={400}
            formatOptions={{ maximumFractionDigits: 0 }}
            inactiveFill="var(--chart-1)"
            inactiveFillOpacity={0.4}
            minWidth={0}
            notchCornerRadius={7}
            spacing={0}
            startAngle={140}
            value={66}
          >
            <PatternLines
              height={6}
              id="gauge-gallery-ex3-fg"
              orientation={["diagonal"]}
              stroke="var(--chart-1)"
              strokeWidth={1}
              width={6}
            />
          </Gauge>
        </div>
      ),
      title: "Gauge — pattern foreground, dim solid track",
    },
    {
      code: `<Gauge
  centerValue={12}
  defaultLabel="Active squads"
  endAngle={270}
  formatOptions={{ maximumFractionDigits: 0 }}
  inactiveFillOpacity={0.4}
  spacing={60}
  startAngle={90}
  totalNotches={33}
  value={66}
/>`,
      description:
        "Fewer notches, wide spacing, sharp corners, 90° → 270° sweep — reads like a progress ring segment.",
      render: () => (
        <div className={chartExampleGaugeShellClassName}>
          <Gauge
            centerValue={12}
            className={chartExampleGaugeClassName}
            defaultLabel="Active squads"
            endAngle={270}
            formatOptions={{ maximumFractionDigits: 0 }}
            inactiveFillOpacity={0.4}
            minWidth={0}
            spacing={60}
            startAngle={90}
            totalNotches={33}
            value={66}
          />
        </div>
      ),
      title: "Gauge — sparse ring, quarter sweep",
    },
    {
      code: `<Gauge
  centerValue={12}
  defaultLabel="Active squads"
  endAngle={360}
  formatOptions={{ maximumFractionDigits: 0 }}
  inactiveFillOpacity={0.4}
  spacing={60}
  startAngle={180}
  totalNotches={33}
  value={66}
/>`,
      description:
        "Same notch layout as the sparse ring example, but the arc runs 180° → 360° (lower semicircle emphasis).",
      render: () => (
        <div className={chartExampleGaugeShellClassName}>
          <Gauge
            centerValue={12}
            className={chartExampleGaugeClassName}
            defaultLabel="Active squads"
            endAngle={360}
            formatOptions={{ maximumFractionDigits: 0 }}
            inactiveFillOpacity={0.4}
            minWidth={0}
            spacing={60}
            startAngle={180}
            totalNotches={33}
            value={66}
          />
        </div>
      ),
      title: "Gauge — same density, bottom half sweep",
    },
    {
      code: `<Gauge
  centerValue={12}
  defaultLabel="Active squads"
  endAngle={450}
  formatOptions={{ maximumFractionDigits: 0 }}
  inactiveFillOpacity={0.4}
  spacing={60}
  startAngle={270}
  totalNotches={33}
  value={66}
/>`,
      description:
        "Same spacing and notch count as the quarter sweep, rotated so the gap sits on the opposite side of the ring.",
      render: () => (
        <div className={chartExampleGaugeShellClassName}>
          <Gauge
            centerValue={12}
            className={chartExampleGaugeClassName}
            defaultLabel="Active squads"
            endAngle={450}
            formatOptions={{ maximumFractionDigits: 0 }}
            inactiveFillOpacity={0.4}
            minWidth={0}
            spacing={60}
            startAngle={270}
            totalNotches={33}
            value={66}
          />
        </div>
      ),
      title: "Gauge — flipped sweep (270° → 450°)",
    },
    {
      code: `<Gauge
  centerValue={428_000}
  defaultLabel="ARR run rate"
  formatOptions={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
  inactiveFillOpacity={0.4}
  notchCornerRadius={8}
  notchLengthPercent={100}
  spacing={25}
  value={66}
/>`,
      description:
        "Default notch length with an 8px corner radius — smooth joints without going fully pill-shaped.",
      render: () => (
        <div className={chartExampleGaugeShellClassName}>
          <Gauge
            centerValue={428_000}
            className={chartExampleGaugeClassName}
            defaultLabel="ARR run rate"
            formatOptions={gaugeGalleryUsdFormat}
            inactiveFillOpacity={0.4}
            minWidth={0}
            notchCornerRadius={8}
            notchLengthPercent={100}
            spacing={25}
            value={66}
          />
        </div>
      ),
      title: "Gauge — soft fillets, full depth",
    },
    {
      code: `<Gauge
  centerValue={428_000}
  defaultLabel="ARR run rate"
  formatOptions={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
  inactiveFillOpacity={0.4}
  notchCornerRadius={12}
  notchLengthPercent={38}
  spacing={25}
  value={66}
/>`,
      description:
        "Radial depth at 38% with a 12px fillet — stubbier ticks that still read soft at the tips.",
      render: () => (
        <div className={chartExampleGaugeShellClassName}>
          <Gauge
            centerValue={428_000}
            className={chartExampleGaugeClassName}
            defaultLabel="ARR run rate"
            formatOptions={gaugeGalleryUsdFormat}
            inactiveFillOpacity={0.4}
            minWidth={0}
            notchCornerRadius={12}
            notchLengthPercent={38}
            spacing={25}
            value={66}
          />
        </div>
      ),
      title: "Gauge — short notches, bold corners",
    },
    {
      code: `<Gauge
  centerValue={428_000}
  defaultLabel="ARR run rate"
  endAngle={400}
  formatOptions={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
  inactiveFillOpacity={0.4}
  notchCornerRadius={22}
  notchLengthPercent={100}
  spacing={0}
  startAngle={140}
  value={66}
/>`,
      description:
        "Full default depth with a 22px corner radius (geometry-clamped) for a capsule / almost-round look.",
      render: () => (
        <div className={chartExampleGaugeShellClassName}>
          <Gauge
            centerValue={428_000}
            className={chartExampleGaugeClassName}
            defaultLabel="ARR run rate"
            endAngle={400}
            formatOptions={gaugeGalleryUsdFormat}
            inactiveFillOpacity={0.4}
            minWidth={0}
            notchCornerRadius={22}
            notchLengthPercent={100}
            spacing={0}
            startAngle={140}
            value={66}
          />
        </div>
      ),
      title: "Gauge — near-circular notches",
    },
    {
      code: `<Gauge
  orientation="linear"
  value={72}
  totalNotches={72}
  spacing={0}
  notchCornerRadius={3}
  notchLengthPercent={38}
  inactiveFillOpacity={0.4}
  useGradient
/>`,
      description:
        'Horizontal notch bar via orientation="linear" — same fill model as the arc gauge, responsive parent width.',
      render: () => (
        <div className="flex w-full items-center px-4 py-6">
          <Gauge
            inactiveFillOpacity={0.4}
            notchCornerRadius={3}
            notchLengthPercent={38}
            orientation="linear"
            spacing={0}
            totalNotches={72}
            useGradient
            value={72}
          />
        </div>
      ),
      title: "Gauge — linear notch track",
    },
    {
      code: `<Gauge
  orientation="linear"
  value={72}
  centerValue={428_000}
  defaultLabel="ARR run rate"
  labelPlacement="bottom"
  labelAlign="center"
  formatOptions={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
  totalNotches={72}
  spacing={0}
  notchCornerRadius={3}
  inactiveFillOpacity={0.4}
  useGradient
/>`,
      description:
        "Optional centerValue and labelPlacement for linear gauges — same placement model as chart legend.",
      render: () => (
        <div className="flex w-full items-center px-4 py-6">
          <Gauge
            centerValue={428_000}
            defaultLabel="ARR run rate"
            formatOptions={gaugeGalleryUsdFormat}
            inactiveFillOpacity={0.4}
            labelAlign="center"
            labelPlacement="bottom"
            notchCornerRadius={3}
            orientation="linear"
            spacing={0}
            totalNotches={72}
            useGradient
            value={72}
          />
        </div>
      ),
      title: "Gauge — linear with label below",
    },
    {
      code: `<Gauge
  orientation="linear"
  value={72}
  totalNotches={72}
  spacing={0}
  notchCornerRadius={3}
  notchLengthPercent={38}
  inactiveFillOpacity={0.4}
  activeGradient={["#a855f7", "#06b6d4"]}
  inactiveGradient={["#334155", "#38bdf8"]}
  useGradient
/>`,
      description:
        "Active and inactive notches each interpolate along their own hex ramp when useGradient is enabled.",
      render: () => (
        <div className="flex w-full items-center px-4 py-6">
          <Gauge
            activeGradient={["#a855f7", "#06b6d4"]}
            inactiveFillOpacity={0.4}
            inactiveGradient={["#334155", "#38bdf8"]}
            notchCornerRadius={3}
            notchLengthPercent={38}
            orientation="linear"
            spacing={0}
            totalNotches={72}
            useGradient
            value={72}
          />
        </div>
      ),
      title: "Gauge — linear dual gradients",
    },
  ];
}

function makeSankeyExamples(): ChartExample[] {
  return [
    {
      code: `<SankeyChart data={data} ${sankeyLabeledExampleMarginSnippet} nodePadding={24} nodeWidth={16}>
  <SankeyLink />
  <SankeyNode lineCap={4} labelOrientation="vertical" />
  <SankeyTooltip />
</SankeyChart>`,
      description: "User flow with labels and tooltip",
      render: () => (
        <SankeyLabeledExampleChart
          aspectRatio="4 / 3"
          data={sankeyAnalytics}
          nodePadding={24}
          nodeWidth={16}
        >
          <SankeyLink />
          <SankeyNode labelOrientation="vertical" lineCap={4} />
          <SankeyTooltip />
        </SankeyLabeledExampleChart>
      ),
      title: "Sankey Chart",
    },
    {
      code: `<SankeyChart
  data={data}
  margin={{ top: 8, right: 8, bottom: 40, left: 8 }}
  nodePadding={24}
  nodeWidth={16}
>
  <SankeyLink />
  <SankeyNode lineCap={4} showLabels={false} />
  <SankeyTooltip />
</SankeyChart>`,
      description: "Compact diagram without node labels",
      render: () => (
        <SankeyExampleChart
          aspectRatio="4 / 3"
          data={sankeyAnalytics}
          nodePadding={24}
          nodeWidth={16}
        >
          <SankeyLink />
          <SankeyNode lineCap={4} showLabels={false} />
          <SankeyTooltip />
        </SankeyExampleChart>
      ),
      title: "Sankey Chart - No Labels",
    },
    {
      code: `<SankeyChart data={simpleData} ${sankeyLabeledExampleMarginSnippet} nodePadding={20} nodeWidth={12}>
  <SankeyLink strokeOpacity={0.5} />
  <SankeyNode lineCap={3} labelOrientation="vertical" />
  <SankeyTooltip />
</SankeyChart>`,
      description: "Minimal flow with fewer nodes",
      render: () => (
        <SankeyLabeledExampleChart
          aspectRatio="4 / 3"
          data={sankeySimple}
          nodePadding={20}
          nodeWidth={12}
        >
          <SankeyLink strokeOpacity={0.5} />
          <SankeyNode labelOrientation="vertical" lineCap={3} />
          <SankeyTooltip />
        </SankeyLabeledExampleChart>
      ),
      title: "Sankey Chart - Simple",
    },
    {
      code: `<SankeyChart data={data} ${sankeyLabeledExampleMarginSnippet} nodePadding={24} nodeWidth={16}>
  <SankeyLink stroke="var(--chart-3)" strokeOpacity={0.3} useGradient={false} />
  <SankeyNode lineCap={4} labelOrientation="vertical" />
  <SankeyTooltip />
</SankeyChart>`,
      description: "Single-color links instead of gradients",
      render: () => (
        <SankeyLabeledExampleChart
          aspectRatio="4 / 3"
          data={sankeyAnalytics}
          nodePadding={24}
          nodeWidth={16}
        >
          <SankeyLink
            stroke="var(--chart-3)"
            strokeOpacity={0.3}
            useGradient={false}
          />
          <SankeyNode labelOrientation="vertical" lineCap={4} />
          <SankeyTooltip />
        </SankeyLabeledExampleChart>
      ),
      title: "Sankey Chart - Solid Links",
    },
  ];
}

function makeHeatmapExamples(): ChartExample[] {
  return [
    {
      code: `<HeatmapChart data={data} gap={3} layout="fluid">
  <HeatmapCells inactiveOpacity={1} inactiveScale={1} />
  <HeatmapXAxis />
  <HeatmapYAxis />
  <HeatmapTooltip />
</HeatmapChart>
<HeatmapLegend align="center" gap={3} inactiveOpacity={1} inactiveScale={1} />`,
      description:
        "GitHub-style contribution grid with axes and tooltip (six months)",
      render: () => (
        <HeatmapGalleryExample
          activeScale={1}
          inactiveOpacity={1}
          inactiveScale={1}
        />
      ),
      title: "Heatmap Chart",
    },
    {
      code: `<HeatmapChart data={data} gap={3} layout="fluid" levelStyles={levelStyles}>
  <HeatmapCells />
  <HeatmapXAxis />
  <HeatmapYAxis />
  <HeatmapTooltip />
</HeatmapChart>
<HeatmapLegend align="center" gap={3} levelStyles={levelStyles} />

const levelStyles = [
  { color: "var(--chart-scale-01)", fillMode: "solid", pattern: "none" },
  { color: "var(--chart-scale-02)", fillMode: "solid", pattern: "none" },
  {
    color: "var(--chart-scale-03)",
    fillMode: "pattern",
    pattern: "diagonal",
    patternColor: "var(--chart-scale-pattern-color)",
  },
  { color: "var(--chart-scale-04)", fillMode: "solid", pattern: "none" },
  { color: "var(--chart-scale-05)", fillMode: "solid", pattern: "none" },
] as const;`,
      description:
        "Per-level pattern fills shared between chart and legend (six months)",
      render: () => (
        <HeatmapGalleryExample levelStyles={heatmapPatternLevelStyles} />
      ),
      title: "Heatmap Chart - Pattern Levels",
    },
    {
      code: `<HeatmapChart data={data} gap={3} layout="fluid">
  <HeatmapCells />
  <HeatmapSeparator
    groupBy="quarter"
    showLabels
    labelClassName="text-black dark:text-white"
    spacing={12}
    startOffset={14}
    stroke="var(--border)"
    strokeStyle="solid"
  />
  <HeatmapXAxis />
  <HeatmapYAxis tickFilter="odd" labelFormat="initial" />
  <HeatmapTooltip />
</HeatmapChart>
<HeatmapLegend align="center" gap={3} />`,
      description:
        "Calendar quarter separators with a flat solid stroke (six months)",
      render: () => <HeatmapSolidSeparatorGalleryExample />,
      title: "Heatmap Chart - Solid Separators",
    },
    {
      code: `<HeatmapChart data={data} gap={3} layout="fluid">
  <HeatmapCells />
  <HeatmapSeparator
    groupBy="quarter"
    showLabels
    labelClassName="text-black dark:text-white"
    spacing={12}
    startOffset={14}
    strokeStyle="solid"
    stroke="var(--muted)"
    gradient={{
      from: "var(--muted)",
      via: "var(--muted)",
      to: "var(--muted)",
      fromOpacity: 0,
      viaOpacity: 1,
      toOpacity: 0,
    }}
  />
  <HeatmapXAxis />
  <HeatmapYAxis tickFilter="odd" labelFormat="initial" />
  <HeatmapTooltip />
</HeatmapChart>
<HeatmapLegend align="center" gap={3} />`,
      description:
        "Mon / Wed / Fri labels, quarter separators with a vertical fade gradient (six months)",
      render: () => <HeatmapCompactYAxisGalleryExample />,
      title: "Heatmap Chart - Compact Y Axis & Quarter Separators",
    },
    {
      code: `<HeatmapChart data={data} gap={3} layout="fluid">
  <HeatmapCells />
  <HeatmapSeparator
    groupBy="quarter"
    showLabels
    spacing={12}
    startOffset={14}
    strokeStyle="dashed"
    strokeDasharray="3,5"
    stroke="var(--muted)"
    gradient={{
      from: "var(--muted)",
      via: "var(--muted)",
      to: "var(--muted)",
      fromOpacity: 0,
      viaOpacity: 1,
      toOpacity: 0,
    }}
  />
  <HeatmapXAxis />
  <HeatmapTooltip />
</HeatmapChart>
<HeatmapLegend align="center" gap={3} />`,
      description:
        "Quarter separators without a Y axis — dashed lines with vertical fade (six months)",
      render: () => <HeatmapDashedSeparatorGalleryExample />,
      title: "Heatmap Chart - Dashed Separators",
    },
    {
      code: `import { HeatmapChartLoading } from "./_charts";

<HeatmapChartLoading
  data={data}
  gap={3}
  label="Loading contributions"
/>`,
      description:
        "Skeleton grid with cell shimmer while data loads (six months)",
      render: () => <HeatmapLoadingGalleryExample />,
      title: "Heatmap Chart - Loading",
    },
    {
      code: `<HeatmapInteractionProvider>
  <HeatmapInteractionBoundary>
    <div className="flex w-full min-w-0">
      <div className="relative shrink-0" style={{ width: yAxisWidth }}>
        {/* Mon / Wed / Fri labels aligned to row bins */}
      </div>
      <div className="scroll-fade-x no-scrollbar min-w-0 flex-1 overflow-x-auto">
        <div style={{ width: \`\${(data.length / 26) * 100}%\` }}>
          <HeatmapChart
            data={data}
            gap={3}
            layout="fluid"
            margin={{ top: 28, right: 12, bottom: 0, left: 0 }}
          >
            <HeatmapCells />
            <HeatmapXAxis />
            <HeatmapTooltip />
          </HeatmapChart>
        </div>
      </div>
    </div>
    <HeatmapLegend align="center" gap={3} />
  </HeatmapInteractionBoundary>
</HeatmapInteractionProvider>`,
      description:
        "Scroll a full year of contributions with a viewport sized to six months",
      render: () => <HeatmapHorizontalScrollGalleryExample />,
      title: "Heatmap Chart - Horizontal Scroll",
    },
    {
      code: `<HeatmapChart data={data} gap={3} layout="fluid" levelStyles={levelStyles}>
  <HeatmapCells />
  <HeatmapXAxis />
  <HeatmapYAxis tickFilter="odd" labelFormat="initial" />
  <HeatmapTooltip />
</HeatmapChart>
<HeatmapLegend
  align="center"
  variant="gradient"
  lessLabel="Faster"
  moreLabel="Slower"
  fontSize={12}
  labelClassName="text-foreground-muted"
  levelStyles={levelStyles}
  gap={3}
/>`,
      description:
        "Continuous gradient bar legend with custom endpoint labels (six months)",
      render: () => <HeatmapGradientLegendGalleryExample />,
      title: "Heatmap Chart - Gradient Legend",
    },
    {
      code: `import { buildHeatmapRowOpacity } from "./_charts";

const weekendOpacity = buildHeatmapRowOpacity((row) => row >= 5, 0.35);

<HeatmapChart data={data} gap={3} layout="fluid" weekStartDay={1}>
  <HeatmapCells rowOpacity={weekendOpacity} />
  <HeatmapXAxis />
  <HeatmapYAxis
    tickFilter="all"
    labelFormat="initial"
    rowOpacity={weekendOpacity}
  />
  <HeatmapTooltip />
</HeatmapChart>
<HeatmapLegend align="center" gap={3} />`,
      description:
        "Week starts on Monday with M–S labels and faded weekend rows (six months)",
      render: () => <HeatmapMondayStartGalleryExample />,
      title: "Heatmap Chart - Monday Start",
    },
    {
      code: `<HeatmapChart data={data} gap={4} layout="fluid">
  <HeatmapCells
    activeScale={1.1}
    inactiveOpacity={0.45}
    inactiveScale={1}
  />
  <HeatmapXAxis />
  <HeatmapYAxis tickFilter="odd" labelFormat="initial" />
  <HeatmapTooltip />
</HeatmapChart>
<HeatmapLegend
  align="center"
  gap={4}
  activeScale={1.1}
  inactiveOpacity={0.45}
  inactiveScale={1}
/>`,
      description:
        "Enlarge the hovered cell with a slightly larger gap (six months)",
      render: () => <HeatmapActiveScaleGalleryExample />,
      title: "Heatmap Chart - Active Scale Hover",
    },
  ];
}

function makeChoroplethExamples(): ChartExample[] {
  return [
    {
      code: `<ChoroplethChart aspectRatio="16 / 9" data={geojson} margin={{ top: 8, right: 8, bottom: 40, left: 8 }}>
  <ChoroplethGraticule />
  <ChoroplethFeatureComponent fill="var(--chart-3)" />
  <ChoroplethTooltip />
</ChoroplethChart>`,
      description: "World map with single fill color and graticule",
      render: () => <ChoroplethBasic />,
      title: "Choropleth Chart",
    },
    {
      code: `<ChoroplethChart aspectRatio="16 / 9" data={geojson} margin={{ top: 8, right: 8, bottom: 40, left: 8 }}>
  <ChoroplethFeatureComponent getFeatureColor={getVisitorColor} />
  <ChoroplethTooltip
    getFeatureValue={getVisitorValue}
    valueLabel="Visitors"
  />
</ChoroplethChart>`,
      description: "Color scale based on visitor traffic by country",
      render: () => <ChoroplethAnalytics />,
      title: "Choropleth Chart - Analytics",
    },
    {
      code: `<ChoroplethChart aspectRatio="16 / 9" data={geojson} margin={{ top: 8, right: 8, bottom: 40, left: 8 }}>
  <ChoroplethGraticule stroke="rgba(255,255,255,0.15)" />
  <ChoroplethFeatureComponent fill="var(--chart-1)" />
  <ChoroplethTooltip />
</ChoroplethChart>`,
      description: "Visible latitude and longitude grid lines",
      render: () => <ChoroplethWithGraticule />,
      title: "Choropleth Chart - Graticule",
    },
    {
      code: `<ChoroplethChart aspectRatio="16 / 9" data={geojson} margin={{ top: 8, right: 8, bottom: 40, left: 8 }}>
  <ChoroplethFeatureComponent
    patterns={<PatternLines id="p-americas" stroke="var(--chart-1)" ... />}
    getFeaturePattern={(feat) => \`pattern-\${getRegion(feat)}\`}
  />
  <ChoroplethTooltip />
</ChoroplethChart>`,
      description: "Diagonal line patterns colored by region",
      render: () => <ChoroplethPattern />,
      title: "Choropleth Chart - Patterns",
    },
  ];
}

function candlestickIndicatorColor(point: Record<string, unknown>): string {
  const close = (point.close as number) ?? 0;
  const open = (point.open as number) ?? 0;
  return close >= open ? "var(--chart-positive)" : "var(--chart-negative)";
}

function makeCandlestickExamples(): ChartExample[] {
  return [
    {
      code: `<LinearGradient from="var(--color-lime-400)" id="candle-up" to="var(--color-emerald-500)" />
<LinearGradient from="var(--color-yellow-400)" id="candle-down" to="var(--color-red-500)" />
<CandlestickChart data={ohlcData} margin={{ top: 8, right: 8, bottom: 40, left: 8 }} style={{ height: 320 }}>
  <Candlestick
    fadedOpacity={0.25}
    negativeFill="url(#candle-down)"
    positiveFill="url(#candle-up)"
  />
  <ChartTooltip
    content={OHLCTooltipContent}
    indicatorColor={(p) => (p.close >= p.open) ? "var(--chart-positive)" : "var(--chart-negative)"}
    showDots={false}
  />
  <XAxis />
</CandlestickChart>`,
      description:
        "Lime–emerald and yellow–red gradients. Crosshair color matches the focused candle (green/red); no dot.",
      render: () => (
        <CandlestickExampleChart
          data={candlestickOhlcData}
          style={{ height: 320 }}
        >
          <LinearGradient
            from="var(--color-lime-400)"
            id="candlestick-hero-up"
            to="var(--color-emerald-500)"
          />
          <LinearGradient
            from="var(--color-yellow-400)"
            id="candlestick-hero-down"
            to="var(--color-red-500)"
          />
          <Candlestick
            fadedOpacity={0.25}
            negativeFill="url(#candlestick-hero-down)"
            positiveFill="url(#candlestick-hero-up)"
          />
          <ChartTooltip
            content={CandlestickTooltipContent}
            indicatorColor={candlestickIndicatorColor}
            showDots={false}
          />
          <XAxis />
        </CandlestickExampleChart>
      ),
      title: "Candlestick – Tooltip line matches candle",
    },
    {
      code: `<CandlestickChart data={ohlcData} margin={{ top: 8, right: 8, bottom: 40, left: 8 }} style={{ height: 320 }}>
  <Candlestick
    fadedOpacity={0.25}
    negativeFill="var(--chart-3)"
    positiveFill="var(--chart-1)"
  />
  <ChartTooltip content={CandlestickTooltipContent} />
  <XAxis />
</CandlestickChart>`,
      description: "Using --chart-1 and --chart-3 for a stronger contrast",
      render: () => (
        <CandlestickExampleChart
          data={candlestickOhlcData}
          style={{ height: 320 }}
        >
          <Candlestick
            fadedOpacity={0.25}
            negativeFill="var(--chart-3)"
            positiveFill="var(--chart-1)"
          />
          <ChartTooltip content={CandlestickTooltipContent} />
          <XAxis />
        </CandlestickExampleChart>
      ),
      title: "Candlestick – Chart 1 & 3",
    },
    {
      code: `<LinearGradient from="var(--color-lime-400)" id="up" to="var(--color-emerald-500)" />
<LinearGradient from="var(--color-yellow-400)" id="down" to="var(--color-red-500)" />
<CandlestickChart data={ohlcData} margin={{ top: 8, right: 8, bottom: 40, left: 8 }} style={{ height: 320 }}>
  <Candlestick fadedOpacity={0.25} negativeFill="url(#down)" positiveFill="url(#up)" />
  <ChartTooltip content={CandlestickTooltipContent} />
  <XAxis />
</CandlestickChart>`,
      description: "Custom gradients: lime–emerald for up, yellow–red for down",
      render: () => (
        <CandlestickExampleChart
          data={candlestickOhlcData}
          style={{ height: 320 }}
        >
          <LinearGradient
            from="var(--color-lime-400)"
            id="candlestick-lime-emerald"
            to="var(--color-emerald-500)"
          />
          <LinearGradient
            from="var(--color-yellow-400)"
            id="candlestick-yellow-red"
            to="var(--color-red-500)"
          />
          <Candlestick
            fadedOpacity={0.25}
            negativeFill="url(#candlestick-yellow-red)"
            positiveFill="url(#candlestick-lime-emerald)"
          />
          <ChartTooltip content={CandlestickTooltipContent} />
          <XAxis />
        </CandlestickExampleChart>
      ),
      title: "Candlestick – Lime to emerald, yellow to red",
    },
    {
      code: `<CandlestickChart candleWidth={8} data={ohlcData} margin={{ top: 8, right: 8, bottom: 40, left: 8 }} style={{ height: 320 }}>
  <Candlestick
    negativeFill="var(--color-red-500)"
    positiveFill="var(--color-emerald-500)"
  />
  <ChartTooltip content={CandlestickTooltipContent} />
  <XAxis />
</CandlestickChart>`,
      description: "Solid emerald/red fills instead of gradients",
      render: () => (
        <CandlestickExampleChart
          candleWidth={8}
          data={candlestickOhlcData}
          style={{ height: 320 }}
        >
          <Candlestick
            negativeFill="var(--color-red-500)"
            positiveFill="var(--color-emerald-500)"
          />
          <ChartTooltip content={CandlestickTooltipContent} />
          <XAxis />
        </CandlestickExampleChart>
      ),
      title: "Candlestick – Solid colors",
    },
    {
      code: `<CandlestickChart candleGap={0.15} data={ohlcData} margin={{ top: 8, right: 8, bottom: 40, left: 8 }} style={{ height: 320 }}>
  <PatternLines id="candle-up" orientation={["diagonal"]} stroke="rgba(0,0,0,0.35)" ... PatternLines
  >/> id="candle-down" orientation={["diagonal"]} stroke="rgba(0,0,0,0.35)" ... Candlestick
  >/> bodyPatternNegative="url(#candle-down)" bodyPatternPositive="url(#candle-up)" />
  <ChartTooltip content={CandlestickTooltipContent} />
  <XAxis />
</CandlestickChart>`,
      description: "Diagonal pattern overlay on candle bodies",
      render: () => (
        <CandlestickExampleChart
          candleGap={0.15}
          data={candlestickOhlcData}
          style={{ height: 320 }}
        >
          <PatternLines
            height={8}
            id="candle-pattern-up"
            orientation={["diagonal"]}
            stroke="rgba(0,0,0,0.35)"
            strokeWidth={1.5}
            width={8}
          />
          <PatternLines
            height={8}
            id="candle-pattern-down"
            orientation={["diagonal"]}
            stroke="rgba(0,0,0,0.35)"
            strokeWidth={1.5}
            width={8}
          />
          <Candlestick
            bodyPatternNegative="url(#candle-pattern-down)"
            bodyPatternPositive="url(#candle-pattern-up)"
            insideStrokeWidth={1}
          />
          <ChartTooltip content={CandlestickTooltipContent} />
          <XAxis />
        </CandlestickExampleChart>
      ),
      title: "Candlestick – Pattern",
    },
    {
      code: `<CandlestickChart data={ohlcData} margin={{ top: 8, right: 8, bottom: 40, left: 8 }} style={{ height: 320 }}>
  <Candlestick fadedOpacity={0.25} />
  <ChartTooltip content={CandlestickTooltipContent} showCrosshair={false} showDots={false} />
  <XAxis />
</CandlestickChart>`,
      description: "Tooltip box without crosshair or dots",
      render: () => (
        <CandlestickExampleChart
          data={candlestickOhlcData}
          style={{ height: 320 }}
        >
          <Candlestick fadedOpacity={0.25} />
          <ChartTooltip
            content={CandlestickTooltipContent}
            showCrosshair={false}
            showDots={false}
          />
          <XAxis />
        </CandlestickExampleChart>
      ),
      title: "Candlestick – Tooltip only",
    },
    ...makeCartesianBackgroundExamples({
      chartClose: "</CandlestickChart>",
      chartOpen:
        "<CandlestickChart data={ohlcData} margin={{ top: 8, right: 8, bottom: 40, left: 8 }} style={{ height: 320 }}>",
      render: (background) => (
        <CandlestickExampleChart
          data={candlestickOhlcData}
          style={{ height: 320 }}
        >
          {background}
          <Candlestick fadedOpacity={0.25} />
          <ChartTooltip content={CandlestickTooltipContent} />
          <XAxis />
        </CandlestickExampleChart>
      ),
      seriesSnippet: `<Candlestick fadedOpacity={0.25} />
  <ChartTooltip content={CandlestickTooltipContent} />
  <XAxis />`,
      titlePrefix: "Candlestick",
    }),
    ...makeCartesianReferenceAreaExamples({
      chartClose: "</CandlestickChart>",
      chartOpen:
        "<CandlestickChart data={ohlcData} margin={{ top: 8, right: 8, bottom: 40, left: 8 }} style={{ height: 320 }}>",
      render: (referenceArea) => (
        <CandlestickExampleChart
          data={candlestickOhlcData}
          style={{ height: 320 }}
        >
          {referenceArea}
          <Candlestick fadedOpacity={0.25} />
          <ChartTooltip content={CandlestickTooltipContent} />
          <XAxis />
        </CandlestickExampleChart>
      ),
      seriesSnippet: `<Candlestick fadedOpacity={0.25} />
  <ChartTooltip content={CandlestickTooltipContent} />
  <XAxis />`,
      titlePrefix: "Candlestick",
      y1: 98,
      y2: 108,
    }),
  ];
}

function candlestickChartPaletteIndicatorColor(
  point: Record<string, unknown>
): string {
  const close = (point.close as number) ?? 0;
  const open = (point.open as number) ?? 0;
  return close >= open ? "var(--chart-1)" : "var(--chart-5)";
}

function makeCandlestickHero(): ChartExample {
  return {
    code: `<CandlestickChart data={ohlcData} margin={{ top: 8, right: 8, bottom: 40, left: 8 }} style={{ height: 320 }}>
  <Candlestick
    fadedOpacity={0.25}
    negativeFill="var(--chart-5)"
    positiveFill="var(--chart-1)"
  />
  <ChartTooltip
    content={OHLCTooltipContent}
    indicatorColor={(p) => (p.close >= p.open) ? "var(--chart-1)" : "var(--chart-5)"}
    showDots={false}
  />
  <XAxis />
</CandlestickChart>`,
    data: `interface OHLCDataPoint {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}
const ohlcData: OHLCDataPoint[] = [ ... ];`,
    description:
      "Default palette (--chart-1 and --chart-5). The crosshair color follows the focused candle; no dot.",
    render: () => (
      <CandlestickExampleChart
        data={candlestickOhlcData}
        style={{ height: 320 }}
      >
        <Candlestick
          fadedOpacity={0.25}
          negativeFill="var(--chart-5)"
          positiveFill="var(--chart-1)"
        />
        <ChartTooltip
          content={CandlestickTooltipContent}
          indicatorColor={candlestickChartPaletteIndicatorColor}
          showDots={false}
        />
        <XAxis />
      </CandlestickExampleChart>
    ),
    title: "Candlestick Chart – Tooltip line matches candle",
  };
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Hero examples (full-width, richer composition)
// ---------------------------------------------------------------------------

/** Catmull–Rom (α 0.42) for hero curve menu + composed gallery; see https://visx.airbnb.tech/docs/curve */

const HERO_CURVE_OPTIONS = [
  { curve: curveNatural, label: "Natural", value: "natural" },
  { curve: curveMonotoneX, label: "Monotone X", value: "monotoneX" },
  { curve: curveLinear, label: "Linear", value: "linear" },
  { curve: curveStep, label: "Step", value: "step" },
  { curve: curveBasis, label: "Basis", value: "basis" },
  {
    curve: composedHeroSmoothCurve,
    label: "Catmull–Rom",
    value: "catmullRom",
  },
] as const;

const areaHeroData = Array.from({ length: 30 }, (_, i) => ({
  costs: Math.floor(5000 + Math.cos(i / 4) * 2000 + ((i * 7) % 1500)),
  date: new Date(2024, 0, i + 1),
  revenue: Math.floor(8000 + Math.sin(i / 5) * 4000 + ((i * 11) % 2000)),
}));

function ChartHeroCurveToolbar({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (v: string) => void;
}) {
  return (
    // Right inset clears the frame's top-right Replay overlay.
    <div className="flex flex-wrap items-center justify-end gap-2 pr-6 sm:pr-4">
      <span className="text-foreground-muted text-xs">Curve</span>
      <Select
        onValueChange={(v) => {
          if (v != null) {
            onValueChange(v);
          }
        }}
        value={value}
      >
        <SelectTrigger
          aria-label="Chart curve"
          className="w-[min(100%,11rem)] text-xs"
          size="sm"
        >
          <SelectValue placeholder="Curve" />
        </SelectTrigger>
        <SelectPopup alignItemWithTrigger={false}>
          {HERO_CURVE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
    </div>
  );
}

function AreaHeroWithCurveSelect() {
  const [curveId, setCurveId] = useState("monotoneX");
  const curve = useMemo(() => {
    const hit = HERO_CURVE_OPTIONS.find((o) => o.value === curveId);
    return hit?.curve ?? curveMonotoneX;
  }, [curveId]);

  return (
    <div className="space-y-3">
      <ChartHeroCurveToolbar onValueChange={setCurveId} value={curveId} />
      <AreaExampleChart aspectRatio="4 / 1" data={areaHeroData}>
        <Grid horizontal />
        <Area
          curve={curve}
          dataKey="revenue"
          fill="var(--chart-line-primary)"
          fillOpacity={0.3}
          strokeWidth={2}
        />
        <Area
          curve={curve}
          dataKey="costs"
          fill="var(--chart-line-secondary)"
          fillOpacity={0.2}
          strokeWidth={1.5}
        />
        <SegmentBackground />
        <SegmentLineFrom />
        <SegmentLineTo />
        <XAxis />
        <ChartTooltip />
      </AreaExampleChart>
    </div>
  );
}

function ComposedHeroWithCurveSelect() {
  const [curveId, setCurveId] = useState("catmullRom");
  const curve = useMemo(() => {
    const hit = HERO_CURVE_OPTIONS.find((o) => o.value === curveId);
    return hit?.curve ?? composedHeroSmoothCurve;
  }, [curveId]);

  return (
    <div className="space-y-3">
      <ChartHeroCurveToolbar onValueChange={setCurveId} value={curveId} />
      <ComposedExampleChart
        aspectRatio="2 / 1"
        barGap={0}
        data={composedDemoData as unknown as Record<string, unknown>[]}
        maxBarSize={32}
        xDataKey="date"
      >
        <Grid horizontal />
        <Area
          curve={curve}
          dataKey="runRate"
          fill="var(--chart-4)"
          fillOpacity={0.32}
        />
        <SeriesBar dataKey="units" fill="var(--chart-3)" radius={4} />
        <Line
          curve={curve}
          dataKey="revenue"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
        />
        <ChartTooltip showCrosshair={false} />
        <XAxis numTicks={8} />
      </ComposedExampleChart>
    </div>
  );
}

const barHeroData = Array.from({ length: 90 }, (_, i) => {
  const date = new Date(2024, 0, 1);
  date.setDate(date.getDate() + i);
  const baseValue = 50 + Math.sin(i / 7) * 30;
  const variation = ((i * 7) % 37) - 18;
  return {
    day: date.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
    value: Math.floor(baseValue + variation),
  };
});

function makeProfitLossLineExamples(): ChartExample[] {
  return [
    {
      code: `import {
  ProfitLossLine,
  ProfitLossLegend,
  ProfitLossLegendHoverProvider,
  profitLossColor,
  resolveProfitLossTooltipLabel,
} from "./_charts";

<LineChart data={data}>
  <Grid highlightRowValues={[0]} horizontal />
  <Line dataKey="pnl" stroke="transparent" strokeWidth={0} showHighlight={false} />
  <ProfitLossLegendHoverProvider hoveredIndex={legendHoveredIndex}>
    <ProfitLossLine dataKey="pnl" />
  </ProfitLossLegendHoverProvider>
  <XAxis />
  <ChartTooltip
    indicatorColor={(point) => profitLossColor(point.pnl ?? 0)}
    rows={(point) => [{
      label: resolveProfitLossTooltipLabel(""),
      value: point.pnl ?? 0,
      color: profitLossColor(point.pnl ?? 0),
    }]}
  />
</LineChart>
<ProfitLossLegend align="center" />`,
      description:
        "Sign-colored segments with a highlighted zero baseline and legend hover",
      footer: "Legend below the chart, centered",
      render: () => <ProfitLossLineExampleWithState />,
      title: "Profit/Loss Line",
    },
    {
      code: `<LineChart data={data} margin={{ top: 40, right: 40, bottom: 40, left: 56 }}>
  <Grid highlightRowValues={[0]} horizontal />
  <Line dataKey="pnl" stroke="transparent" strokeWidth={0} showHighlight={false} />
  <ProfitLossLine dataKey="pnl" />
  <YAxis yAxisId="left" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
      description:
        "Sign-colored line with a left Y-axis scale and zero baseline",
      render: () => (
        <LineExampleChart
          data={profitLossLineDocsData}
          margin={{ bottom: 40, left: 56, right: 40, top: 40 }}
        >
          <Grid highlightRowValues={[0]} horizontal />
          <Line
            dataKey="pnl"
            showHighlight={false}
            stroke="transparent"
            strokeWidth={0}
          />
          <ProfitLossLine dataKey="pnl" />
          <YAxis yAxisId="left" />
          <XAxis />
          <ChartTooltip
            indicatorColor={(point) =>
              profitLossColor((point.pnl as number) ?? 0)
            }
            rows={(point) => [
              {
                color: profitLossColor((point.pnl as number) ?? 0),
                label: resolveProfitLossTooltipLabel(""),
                value: (point.pnl as number) ?? 0,
              },
            ]}
          />
        </LineExampleChart>
      ),
      title: "Profit/Loss Line - Left Y axis",
    },
    ...makeCartesianBackgroundExamples({
      chartClose: "</LineChart>",
      chartOpen: "<LineChart data={data}>",
      render: (background) => (
        <LineExampleChart data={profitLossLineDocsData}>
          {background}
          <Line
            dataKey="pnl"
            showHighlight={false}
            stroke="transparent"
            strokeWidth={0}
          />
          <ProfitLossLine dataKey="pnl" />
          <XAxis />
          <ChartTooltip
            indicatorColor={(point) =>
              profitLossColor((point.pnl as number) ?? 0)
            }
            rows={(point) => [
              {
                color: profitLossColor((point.pnl as number) ?? 0),
                label: resolveProfitLossTooltipLabel(""),
                value: (point.pnl as number) ?? 0,
              },
            ]}
          />
        </LineExampleChart>
      ),
      seriesSnippet: `<Line dataKey="pnl" stroke="transparent" strokeWidth={0} showHighlight={false} />
  <ProfitLossLine dataKey="pnl" />
  <XAxis />
  <ChartTooltip />`,
      titlePrefix: "Profit/Loss Line",
    }),
    ...makeCartesianReferenceAreaExamples({
      chartClose: "</LineChart>",
      chartOpen: "<LineChart data={data}>",
      render: (referenceArea) => (
        <LineExampleChart data={profitLossLineDocsData}>
          {referenceArea}
          <Line
            dataKey="pnl"
            showHighlight={false}
            stroke="transparent"
            strokeWidth={0}
          />
          <ProfitLossLine dataKey="pnl" />
          <XAxis />
          <ChartTooltip
            indicatorColor={(point) =>
              profitLossColor((point.pnl as number) ?? 0)
            }
            rows={(point) => [
              {
                color: profitLossColor((point.pnl as number) ?? 0),
                label: resolveProfitLossTooltipLabel(""),
                value: (point.pnl as number) ?? 0,
              },
            ]}
          />
        </LineExampleChart>
      ),
      seriesSnippet: `<Line dataKey="pnl" stroke="transparent" strokeWidth={0} showHighlight={false} />
  <ProfitLossLine dataKey="pnl" />
  <XAxis />
  <ChartTooltip />`,
      titlePrefix: "Profit/Loss Line",
      y1: -200,
      y2: 200,
    }),
  ];
}

function makeLineHero(): ChartExample {
  return {
    code: `import { curveCatmullRom } from "@visx/curve";
import {
  Background,
  ChartBrush,
  ChartBrushLayout,
  ChartLegend,
  ChartTooltip,
  Line,
  LineChart,
  XAxis,
} from "./_charts";

<ChartBrushLayout data={chartData} enabled height={72} brushStrip={...}>
  {(brushLayout) => (
    <LineChart data={chartData} xDomain={brushLayout.xDomain} tweenYDomainOnXDomainChange>
      <Background pattern="dots" opacity={0.85} />
      <Line dataKey="desktop" curve={curveCatmullRom} fadeEdges stroke="var(--chart-1)" strokeWidth={2} />
      <Line dataKey="mobile" curve={curveCatmullRom} fadeEdges stroke="var(--chart-2)" strokeWidth={2} />
      <Line dataKey="tablet" curve={curveCatmullRom} fadeEdges stroke="var(--chart-3)" strokeWidth={2} />
      <XAxis />
      <ChartTooltip />
    </LineChart>
  )}
</ChartBrushLayout>`,
    data: `const chartData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2025, 0, 1 + i),
  desktop: Math.round(180 + Math.sin(i / 4.2) * 70 + ((i * 9) % 31)),
  mobile: Math.round(120 + Math.cos(i / 3.8) * 55 + ((i * 5) % 23)),
  tablet: Math.round(150 + Math.sin(i / 5.1 + 1) * 48 + ((i * 7) % 19)),
}));`,
    description:
      "Three Catmull–Rom series on a dot background with a top legend and brush zoom — matches the Studio trio preset.",
    footer:
      "Open the same preset in Studio from the Background docs or paste the share URL from /charts/line-chart.",
    render: () => <LineChartStudioTrioDemo height={540} />,
    title: "Line Chart - Trio with Brush",
  };
}

function makeAreaHero(): ChartExample {
  return {
    code: `import { curveMonotoneX } from "@visx/curve";

<AreaChart aspectRatio="4 / 1" data={chartData}>
  <Grid horizontal />
  <Area curve={curveMonotoneX} dataKey="revenue" fill="var(--chart-line-primary)" fillOpacity={0.3} strokeWidth={2} />
  <Area curve={curveMonotoneX} dataKey="costs" fill="var(--chart-line-secondary)" fillOpacity={0.2} strokeWidth={1.5} />
  <SegmentBackground />
  <SegmentLineFrom />
  <SegmentLineTo />
  <XAxis />
  <ChartTooltip />
</AreaChart>`,
    data: `const chartData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2024, 0, i + 1),
  revenue: Math.floor(8000 + Math.sin(i / 5) * 4000 + ((i * 11) % 2000)),
  costs: Math.floor(5000 + Math.cos(i / 4) * 2000 + ((i * 7) % 1500)),
}));`,
    description:
      "Revenue vs costs over 30 days with segment selection. Use the curve menu to compare @visx/curve on both areas.",
    footer:
      "Click and drag to select a range. Hero curve menu uses the same Area `curve` prop for revenue and costs.",
    render: () => <AreaHeroWithCurveSelect />,
    title: "Area Chart - Interactive",
  };
}

function makeBarHero(): ChartExample {
  return {
    code: `<BarChart aspectRatio="4 / 1" barGap={0.1} data={dailyData} margin={{ top: 8, right: 8, bottom: 40, left: 8 }} xDataKey="day">
  <Grid horizontal />
  <Bar dataKey="value" lineCap="butt" />
  <BarXAxis maxLabels={8} />
  <ChartTooltip />
</BarChart>`,
    data: `const dailyData = Array.from({ length: 90 }, (_, i) => {
  const date = new Date(2024, 0, 1);
  date.setDate(date.getDate() + i);
  return {
    day: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: Math.floor(50 + Math.sin(i / 7) * 30 + ((i * 7) % 37) - 18),
  };
});`,
    description: "Daily activity over the last 90 days",
    render: () => (
      <BarExampleChart
        aspectRatio="4 / 1"
        barGap={0.1}
        data={barHeroData}
        xDataKey="day"
      >
        <Grid horizontal />
        <Bar dataKey="value" lineCap="butt" />
        <BarXAxis maxLabels={8} />
        <ChartTooltip />
      </BarExampleChart>
    ),
    title: "Bar Chart - Interactive",
  };
}

function SankeyHeroInner() {
  return (
    <SankeyLabeledExampleChart
      aspectRatio="5 / 2"
      data={sankeyAnalytics}
      nodePadding={24}
      nodeWidth={16}
    >
      <SankeyLink />
      <SankeyNode labelOrientation="vertical" lineCap={4} />
      <SankeyTooltip />
    </SankeyLabeledExampleChart>
  );
}

function makeSankeyHero(): ChartExample {
  return {
    code: `<SankeyChart data={analyticsData} ${sankeyLabeledExampleMarginSnippet} nodePadding={24} nodeWidth={16}>
  <SankeyLink />
  <SankeyNode lineCap={4} labelOrientation="vertical" />
  <SankeyTooltip />
</SankeyChart>`,
    description: "User flow from source to outcome",
    render: () => <SankeyHeroInner />,
    title: "Sankey Chart - Interactive",
  };
}

function makeHeatmapHero(): ChartExample {
  return {
    code: `<HeatmapChart data={data} gap={3} layout="fluid">
  <HeatmapCells
    cornerRadius={999}
    inactiveOpacity={0.8}
    inactiveScale={0.94}
  />
  <HeatmapSeparator
    groupBy="quarter"
    showLabels
    labelClassName="text-[var(--chart-3)]"
    spacing={12}
    startOffset={14}
    strokeOpacity={0.6}
  />
  <HeatmapXAxis />
  <HeatmapYAxis tickFilter="all" labelFormat="initial" />
  <HeatmapTooltip />
</HeatmapChart>
<HeatmapLegend
  align="center"
  cornerRadius={999}
  gap={3}
  inactiveOpacity={0.8}
  inactiveScale={0.94}
/>`,
    description:
      "Activity grid with circular cells, calendar quarter separators, compact day labels, and synced legend hover",
    render: () => <HeatmapHeroExample />,
    title: "Heatmap Chart - Contributions",
  };
}

function ChoroplethHeroInner() {
  const { worldData, isLoading } = useWorldDataStandalone();
  if (isLoading || !worldData) {
    return <ChoroplethLoading />;
  }
  return (
    <ChoroplethExampleChart aspectRatio="2 / 1" data={worldData}>
      <ChoroplethGraticule />
      <ChoroplethFeatureComponent getFeatureColor={getVisitorColor} />
      <ChoroplethTooltip
        getFeatureValue={getVisitorValue}
        valueLabel="Visitors"
      />
    </ChoroplethExampleChart>
  );
}

function makeChoroplethHero(): ChartExample {
  return {
    code: `<ChoroplethChart aspectRatio="2 / 1" data={geojson} margin={{ top: 8, right: 8, bottom: 40, left: 8 }}>
  <ChoroplethGraticule />
  <ChoroplethFeatureComponent getFeatureColor={getVisitorColor} />
  <ChoroplethTooltip getFeatureValue={getVisitorValue} valueLabel="Visitors" />
</ChoroplethChart>`,
    description: "Visitor traffic by country",
    render: () => <ChoroplethHeroInner />,
    title: "Choropleth Chart - Interactive",
  };
}

// ---------------------------------------------------------------------------
// Funnel chart examples
// ---------------------------------------------------------------------------

const funnelData: FunnelStage[] = [
  { displayValue: "12.4k", label: "Visitors", value: 12_400 },
  { displayValue: "6.8k", label: "Leads", value: 6800 },
  { displayValue: "3.2k", label: "Qualified", value: 3200 },
  { displayValue: "1.5k", label: "Proposals", value: 1500 },
  { displayValue: "620", label: "Closed", value: 620 },
];

const funnelDataColored: FunnelStage[] = [
  { color: "var(--chart-1)", label: "Awareness", value: 4100 },
  { color: "var(--chart-2)", label: "Interest", value: 2957 },
  { color: "var(--chart-3)", label: "Consideration", value: 1084 },
  { color: "var(--chart-4)", label: "Intent", value: 1038 },
  { color: "var(--chart-5)", label: "Purchase", value: 320 },
];

const funnelDataGradient: FunnelStage[] = [
  {
    gradient: [
      { color: "var(--chart-1)", offset: "0%" },
      { color: "var(--chart-2)", offset: "100%" },
    ],
    label: "Awareness",
    value: 4100,
  },
  {
    gradient: [
      { color: "var(--chart-2)", offset: "0%" },
      { color: "var(--chart-3)", offset: "100%" },
    ],
    label: "Interest",
    value: 2957,
  },
  {
    gradient: [
      { color: "var(--chart-3)", offset: "0%" },
      { color: "var(--chart-4)", offset: "100%" },
    ],
    label: "Consideration",
    value: 1084,
  },
  {
    gradient: [
      { color: "var(--chart-4)", offset: "0%" },
      { color: "var(--chart-5)", offset: "100%" },
    ],
    label: "Intent",
    value: 1038,
  },
  {
    gradient: [
      { color: "var(--chart-5)", offset: "0%" },
      { color: "var(--chart-5)", offset: "100%" },
    ],
    label: "Purchase",
    value: 320,
  },
];

function FunnelHeroWithLegend() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const legendItems = funnelData.map((d) => ({
    color: "var(--chart-1)",
    label: d.label,
    value: d.value,
  }));
  return (
    <div className="flex flex-col gap-4">
      <FunnelChart
        className="max-h-[350px]"
        color="var(--chart-1)"
        data={funnelData}
        hoveredIndex={hoveredIndex}
        layers={3}
        onHoverChange={setHoveredIndex}
        orientation="horizontal"
      />
      <Legend
        className="flex-row flex-wrap justify-center gap-x-4 gap-y-1"
        hoveredIndex={hoveredIndex}
        items={legendItems}
        onHoverChange={setHoveredIndex}
      >
        <LegendItemComponent className="flex items-center gap-1.5">
          <LegendMarker />
          <LegendLabel className="text-xs" />
        </LegendItemComponent>
      </Legend>
    </div>
  );
}

function makeFunnelHero(): ChartExample {
  return {
    code: `const [hoveredIndex, setHoveredIndex] = useState(null);

const legendItems = data.map((d) => ({
  label: d.label,
  value: d.value,
  color: "var(--chart-1)",
}));

<FunnelChart
  color="var(--chart-1)"
  data={data}
  hoveredIndex={hoveredIndex}
  layers={3}
  onHoverChange={setHoveredIndex}
/>
<Legend
  hoveredIndex={hoveredIndex}
  items={legendItems}
  onHoverChange={setHoveredIndex}
>
  <LegendItemComponent>
    <LegendMarker />
    <LegendLabel />
  </LegendItemComponent>
</Legend>`,
    data: `const data: FunnelStage[] = [
  { label: "Visitors", value: 12400, displayValue: "12.4k" },
  { label: "Leads", value: 6800, displayValue: "6.8k" },
  { label: "Qualified", value: 3200, displayValue: "3.2k" },
  { label: "Proposals", value: 1500, displayValue: "1.5k" },
  { label: "Closed", value: 620, displayValue: "620" },
];`,
    description:
      "Animated funnel chart with multi-layer halo rings, hover interactions, and an interactive legend.",
    render: () => <FunnelHeroWithLegend />,
    title: "Funnel Chart",
  };
}

function makeFunnelExamples(): ChartExample[] {
  return [
    {
      code: `<FunnelChart
  color="var(--chart-1)"
  data={data}
  layers={3}
  orientation="vertical"
/>`,
      description: "Vertical orientation with top-to-bottom flow",
      render: () => (
        <FunnelChart
          className="max-h-[400px]"
          color="var(--chart-1)"
          data={funnelData}
          layers={3}
          orientation="vertical"
        />
      ),
      title: "Vertical",
    },
    {
      code: `<FunnelChart
  color="var(--chart-1)"
  data={data}
  edges="straight"
  grid={{ bands: false, lines: true }}
  layers={3}
  orientation="vertical"
/>`,
      description: "Combining vertical orientation, straight edges, and grid",
      render: () => (
        <FunnelChart
          className="max-h-[360px]"
          color="var(--chart-1)"
          data={funnelData}
          edges="straight"
          grid={{ bands: false, lines: true }}
          layers={3}
          orientation="vertical"
        />
      ),
      title: "Vertical Straight with Grid",
    },
    {
      code: `<FunnelChart
  color="var(--chart-1)"
  data={data}
  edges="straight"
  layers={3}
  orientation="horizontal"
/>`,
      description: "Sharp geometric edges instead of smooth curves",
      render: () => (
        <FunnelChart
          color="var(--chart-1)"
          data={funnelData}
          edges="straight"
          layers={3}
          orientation="horizontal"
        />
      ),
      title: "Straight Edges",
    },
    {
      code: `<FunnelChart
  data={[
    { label: "Awareness", value: 4100, color: "var(--chart-1)" },
    { label: "Interest", value: 2957, color: "var(--chart-2)" },
    { label: "Consideration", value: 1084, color: "var(--chart-3)" },
    { label: "Intent", value: 1038, color: "var(--chart-4)" },
    { label: "Purchase", value: 320, color: "var(--chart-5)" },
  ]}
  layers={3}
/>`,
      description: "Each segment with its own color from the chart palette",
      render: () => <FunnelChart data={funnelDataColored} layers={3} />,
      title: "Per-Segment Colors",
    },
    {
      code: `<FunnelChart
  data={[
    {
      label: "Awareness",
      value: 4100,
      gradient: [
        { offset: "0%", color: "var(--chart-1)" },
        { offset: "100%", color: "var(--chart-2)" },
      ],
    },
    // ... more segments
  ]}
  layers={3}
/>`,
      description: "Linear gradients flowing between chart palette colors",
      render: () => <FunnelChart data={funnelDataGradient} layers={3} />,
      title: "Gradient Segments",
    },
    {
      code: `<FunnelChart
  color="var(--chart-3)"
  data={data}
  layers={3}
  renderPattern={(id, color) => (
    <PatternLines
      background={color}
      height={8}
      id={id}
      orientation={["diagonal"]}
      stroke="rgba(255,255,255,0.35)"
      strokeWidth={2}
      width={8}
    />
  )}
/>`,
      description:
        "Diagonal line pattern on the innermost ring via renderPattern",
      render: () => (
        <FunnelChart
          color="var(--chart-3)"
          data={funnelData}
          layers={3}
          renderPattern={(id, color) => (
            <PatternLines
              background={color}
              height={8}
              id={id}
              orientation={["diagonal"]}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={2}
              width={8}
            />
          )}
        />
      ),
      title: "Pattern Fill",
    },
    {
      code: `<FunnelChart
  color="var(--chart-1)"
  data={data}
  labelAlign="center"
  labelLayout="grouped"
  labelOrientation="vertical"
  layers={3}
/>`,
      description: "Labels stacked together in a compact group",
      render: () => (
        <FunnelChart
          color="var(--chart-1)"
          data={funnelData}
          labelAlign="center"
          labelLayout="grouped"
          labelOrientation="vertical"
          layers={3}
        />
      ),
      title: "Grouped Labels",
    },
    {
      code: `<FunnelChart
  color="var(--chart-1)"
  data={data}
  grid
  layers={3}
/>`,
      description: "Alternating bands and grid lines for easier comparison",
      render: () => (
        <FunnelChart color="var(--chart-1)" data={funnelData} grid layers={3} />
      ),
      title: "Grid Background",
    },
  ];
}

// ---------------------------------------------------------------------------
// Scatter chart examples
// ---------------------------------------------------------------------------

function makeScatterExamples(): ChartExample[] {
  return [
    {
      code: prLocChartSnippet,
      data: prLocDataSnippet,
      description:
        "Lines changed per merged PR by month — `jitter` spreads overlapping PRs with a deterministic offset. Fastlane auto-merges stay under 500 LOC; human-reviewed PRs spread wider. No crosshair by default; tooltips keep the original values",
      render: () => (
        <ScatterExampleChart
          data={prLocData}
          formatXLabel={formatPrMonth}
          jitter={{ x: 0.6 }}
          margin={chartMarginLeftYAxis}
        >
          <Grid
            highlightRowStrokeDasharray="4,4"
            highlightRowValues={[500]}
            horizontal
          />
          <Scatter
            dataKey="fastlane"
            fill={prLocSeries.fastlane.color}
            radius={3}
          />
          <Scatter dataKey="human" fill={prLocSeries.human.color} radius={3} />
          <YAxis formatValue={formatLoc} />
          <XAxis numTicks={12} />
          <ChartTooltip
            content={({ point }) => <PrLocTooltip point={point} />}
          />
        </ScatterExampleChart>
      ),
      title: "Scatter Chart - With Jitter",
    },
    {
      code: `<ScatterChart data={chartData} margin={{ top: 8, right: 8, bottom: 40, left: 8 }}>
  <Grid horizontal />
  <Scatter dataKey="desktop" ringGap={2} strokeWidth={2} />
  <Scatter dataKey="mobile" ringGap={2} strokeWidth={2} />
  <XAxis />
  <ChartTooltip />
</ScatterChart>`,
      description:
        "Offset rings are opt-in — set `strokeWidth` (and optionally `ringGap`) to draw one",
      render: () => (
        <ScatterExampleChart data={multiLineData}>
          <Grid horizontal />
          <Scatter dataKey="desktop" ringGap={2} strokeWidth={2} />
          <Scatter dataKey="mobile" ringGap={2} strokeWidth={2} />
          <XAxis />
          <ChartTooltip />
        </ScatterExampleChart>
      ),
      title: "Scatter Chart - Rings",
    },
    {
      code: `<ScatterChart data={chartData} margin={{ top: 8, right: 8, bottom: 40, left: 8 }}>
  <Grid horizontal />
  <Scatter dataKey="desktop" inactiveMode="blur" />
  <Scatter dataKey="mobile" inactiveMode="blur" />
  <XAxis />
  <ChartTooltip />
</ScatterChart>`,
      description:
        'Opt into blur on non-active points while hovering with `inactiveMode="blur"`',
      render: () => (
        <ScatterExampleChart data={multiLineData}>
          <Grid horizontal />
          <Scatter dataKey="desktop" inactiveMode="blur" />
          <Scatter dataKey="mobile" inactiveMode="blur" />
          <XAxis />
          <ChartTooltip />
        </ScatterExampleChart>
      ),
      title: "Scatter Chart - Blur Inactive",
    },
    {
      code: `<ScatterChart data={chartData} margin={{ top: 8, right: 8, bottom: 40, left: 8 }}>
  <Grid horizontal />
  <Scatter dataKey="desktop" radius={2} ringGap={1} strokeWidth={1} />
  <Scatter dataKey="mobile" radius={2} ringGap={1} strokeWidth={1} />
  <XAxis />
  <ChartTooltip />
</ScatterChart>`,
      description: "Compact markers with a 2px radius and thin 1px rings",
      render: () => (
        <ScatterExampleChart data={multiLineData}>
          <Grid horizontal />
          <Scatter dataKey="desktop" radius={2} ringGap={1} strokeWidth={1} />
          <Scatter dataKey="mobile" radius={2} ringGap={1} strokeWidth={1} />
          <XAxis />
          <ChartTooltip />
        </ScatterExampleChart>
      ),
      title: "Scatter Chart - Small Dots",
    },
    {
      code: `<ScatterChart data={chartData} margin={{ top: 8, right: 8, bottom: 40, left: 8 }}>
  <Grid horizontal />
  <Scatter
    dataKey="desktop"
    outlineWidth={0}
    radius={3}
    ringGap={5}
    strokeWidth={1}
  />
  <Scatter
    dataKey="mobile"
    outlineWidth={0}
    radius={3}
    ringGap={5}
    strokeWidth={1}
  />
  <XAxis />
  <ChartTooltip />
</ScatterChart>`,
      description:
        "1px ring, 3px dot, 5px gap between fill and ring (`outlineWidth={0}`)",
      render: () => (
        <ScatterExampleChart data={multiLineData}>
          <Grid horizontal />
          <Scatter
            dataKey="desktop"
            outlineWidth={0}
            radius={3}
            ringGap={5}
            strokeWidth={1}
          />
          <Scatter
            dataKey="mobile"
            outlineWidth={0}
            radius={3}
            ringGap={5}
            strokeWidth={1}
          />
          <XAxis />
          <ChartTooltip />
        </ScatterExampleChart>
      ),
      title: "Scatter Chart - Wide Ring Gap",
    },
    {
      code: `<ScatterChart data={chartData} margin={{ top: 8, right: 8, bottom: 40, left: 56 }}>
  <Grid horizontal />
  <Scatter dataKey="desktop" />
  <Scatter dataKey="mobile" stroke="var(--chart-2)" />
  <YAxis yAxisId="left" />
  <XAxis />
  <ChartTooltip />
</ScatterChart>`,
      description: "Both series share the left scale with Y-axis value labels",
      render: () => (
        <ScatterExampleChart data={multiLineData} margin={chartMarginLeftYAxis}>
          <Grid horizontal />
          <Scatter dataKey="desktop" />
          <Scatter dataKey="mobile" stroke="var(--chart-2)" />
          <YAxis yAxisId="left" />
          <XAxis />
          <ChartTooltip />
        </ScatterExampleChart>
      ),
      title: "Scatter Chart - Left Y axis",
    },
    {
      code: `<ScatterChart data={chartData} margin={{ top: 8, right: 56, bottom: 40, left: 56 }}>
  <Grid horizontal />
  <Scatter dataKey="desktop" yAxisId="left" />
  <Scatter dataKey="mobile" yAxisId="right" stroke="var(--chart-2)" />
  <YAxis yAxisId="left" />
  <YAxis yAxisId="right" orientation="right" />
  <XAxis />
  <ChartTooltip />
</ScatterChart>`,
      description: "Independent left and right scales (biaxial)",
      render: () => (
        <ScatterExampleChart
          data={multiLineData}
          margin={chartMarginBiaxialYAxis}
        >
          <Grid horizontal />
          <Scatter dataKey="desktop" yAxisId="left" />
          <Scatter dataKey="mobile" stroke="var(--chart-2)" yAxisId="right" />
          <YAxis yAxisId="left" />
          <YAxis orientation="right" yAxisId="right" />
          <XAxis />
          <ChartTooltip />
        </ScatterExampleChart>
      ),
      title: "Scatter Chart - Left and right Y axes",
    },
    ...makeCartesianBackgroundExamples({
      chartClose: "</ScatterChart>",
      chartOpen:
        "<ScatterChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData}>",
      render: (background) => (
        <ScatterExampleChart data={scatterMultiSeriesData}>
          {background}
          <Scatter dataKey="desktop" />
          <XAxis />
          <ChartTooltip />
        </ScatterExampleChart>
      ),
      seriesSnippet: `<Scatter dataKey="desktop" />
  <XAxis />
  <ChartTooltip />`,
      titlePrefix: "Scatter Chart",
    }),
    ...makeCartesianReferenceAreaExamples({
      chartClose: "</ScatterChart>",
      chartOpen:
        "<ScatterChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData}>",
      render: (referenceArea) => (
        <ScatterExampleChart data={scatterMultiSeriesData}>
          {referenceArea}
          <Scatter dataKey="desktop" />
          <XAxis />
          <ChartTooltip />
        </ScatterExampleChart>
      ),
      seriesSnippet: `<Scatter dataKey="desktop" />
  <XAxis />
  <ChartTooltip />`,
      titlePrefix: "Scatter Chart",
      y1: 120,
      y2: 180,
    }),
  ];
}

function makeScatterHero(): ChartExample {
  return {
    code: `<ScatterChart data={chartData} margin={{ top: 8, right: 8, bottom: 40, left: 8 }}>
  <Grid horizontal />
  <Scatter dataKey="desktop" />
  <Scatter dataKey="mobile" />
  <XAxis />
  <ChartTooltip />
</ScatterChart>`,
    data: scatterChartDataSnippet,
    description:
      "Desktop vs mobile over 24 months with hover dimming and crosshair tooltip",
    render: () => (
      <ScatterExampleChart data={scatterMultiSeriesData}>
        <Grid horizontal />
        <Scatter dataKey="desktop" />
        <Scatter dataKey="mobile" />
        <XAxis />
        <ChartTooltip />
      </ScatterExampleChart>
    ),
    title: "Scatter Chart",
  };
}

// ---------------------------------------------------------------------------
// Sunburst chart examples
// ---------------------------------------------------------------------------

function findSunburstNodeById(
  node: SunburstNode,
  id: string,
  parentId: string | null = null
): SunburstNode | null {
  const nodeId = parentId ? `${parentId} / ${node.name}` : node.name;
  if (nodeId === id) {
    return node;
  }
  for (const child of node.children ?? []) {
    const found = findSunburstNodeById(child, id, nodeId);
    if (found) {
      return found;
    }
  }
  return null;
}

function sunburstLegendForFocus(data: SunburstNode, focusId: string) {
  const { arcs, rootId } = buildArcs(data);
  const focusNode = findSunburstNodeById(data, focusId) ?? data;
  const children = focusNode.children ?? [];
  const childValues = children.map((child) => sumValues(child));
  const maxValue = Math.max(...childValues, 1);

  const items: { label: string; value: number; color: string }[] = [];
  const arcIndices: number[] = [];

  for (const child of children) {
    const childId =
      focusId === rootId ? child.name : `${focusId} / ${child.name}`;
    const arc = arcs.find((entry) => entry.id === childId);
    if (!arc) {
      continue;
    }
    items.push({
      color: `var(--chart-${(arc.categoryIndex % 5) + 1})`,
      label: child.name,
      value: sumValues(child),
    });
    arcIndices.push(arc.arcIndex);
  }

  return {
    arcIndices,
    items: items.map((item) => ({ ...item, maxValue })),
  };
}

function SunburstHeroInner() {
  const { arcs, rootId } = useMemo(() => buildArcs(sunburstDemoData), []);
  const [focusId, setFocusId] = useState(rootId);

  useEffect(() => {
    setFocusId(rootId);
  }, [rootId]);

  return (
    <div className={chartExampleSunburstHeroShellClassName}>
      <SunburstChart
        data={sunburstDemoData}
        focusId={focusId}
        onFocusChange={setFocusId}
        size={460}
      >
        <SunburstBreadcrumb>
          <SunburstDrillBreadcrumb />
        </SunburstBreadcrumb>
        {arcs.map((arc) => (
          <SunburstSegment index={arc.arcIndex} key={arc.id} />
        ))}
        <SunburstCenter />
        <SunburstLabels />
        <SunburstHint />
      </SunburstChart>
    </div>
  );
}

function SunburstPatternsExample() {
  const { arcs } = useMemo(() => buildArcs(sunburstDemoData), []);
  const patternedInnerArcs = arcs.filter(
    (arc) => arc.depth === 1 && arc.categoryIndex % 2 === 0
  );

  return (
    <div className={chartExampleRadialShellClassName}>
      <SunburstChart data={sunburstDemoData} size={320}>
        {patternedInnerArcs.map((arc) => (
          <PatternLines
            height={6}
            id={`sb-ex-inner-${arc.arcIndex}`}
            key={`sb-ex-inner-def-${arc.arcIndex}`}
            orientation={["diagonal"]}
            stroke={`var(--chart-${(arc.categoryIndex % 5) + 1})`}
            strokeWidth={1}
            width={6}
          />
        ))}
        {arcs.map((arc) => {
          const fill =
            arc.depth === 1 && arc.categoryIndex % 2 === 0
              ? `url(#sb-ex-inner-${arc.arcIndex})`
              : undefined;
          return (
            <SunburstSegment fill={fill} index={arc.arcIndex} key={arc.id} />
          );
        })}
        <SunburstCenter />
      </SunburstChart>
    </div>
  );
}

function SunburstWithLegend() {
  const { arcs, rootId } = useMemo(() => buildArcs(sunburstDemoData), []);
  const [focusId, setFocusId] = useState(rootId);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [legendHoveredIndex, setLegendHoveredIndex] = useState<number | null>(
    null
  );

  const legendResult = useMemo(
    () => sunburstLegendForFocus(sunburstDemoData, focusId),
    [focusId]
  );

  const legendIndexByArc = useMemo(() => {
    const map = new Map<number, number>();
    for (const [legendIndex, arcIndex] of legendResult.arcIndices.entries()) {
      map.set(arcIndex, legendIndex);
    }
    return map;
  }, [legendResult.arcIndices]);

  useEffect(() => {
    setFocusId(rootId);
  }, [rootId]);

  useEffect(() => {
    if (legendHoveredIndex != null) {
      const arcIndex = legendResult.arcIndices[legendHoveredIndex];
      if (arcIndex != null) {
        setHoveredIndex(arcIndex);
      }
      return;
    }
    setHoveredIndex((current) =>
      current != null && legendIndexByArc.has(current) ? null : current
    );
  }, [legendHoveredIndex, legendResult.arcIndices, legendIndexByArc]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset hover when drill focus changes
  useEffect(() => {
    setHoveredIndex(null);
    setLegendHoveredIndex(null);
  }, [focusId]);

  const handleArcHoverChange = useCallback(
    (arcIndex: number | null) => {
      setHoveredIndex(arcIndex);
      if (arcIndex == null) {
        setLegendHoveredIndex(null);
        return;
      }
      setLegendHoveredIndex(legendIndexByArc.get(arcIndex) ?? null);
    },
    [legendIndexByArc]
  );

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <SunburstChart
        data={sunburstDemoData}
        focusId={focusId}
        hoveredIndex={hoveredIndex}
        onFocusChange={setFocusId}
        onHoverChange={handleArcHoverChange}
        size={280}
      >
        {arcs.map((arc) => (
          <SunburstSegment index={arc.arcIndex} key={arc.id} />
        ))}
        <SunburstCenter />
      </SunburstChart>
      <Legend
        className="flex-row flex-wrap justify-center gap-x-4 gap-y-1"
        hoveredIndex={legendHoveredIndex}
        items={legendResult.items}
        onHoverChange={setLegendHoveredIndex}
        title="Categories"
      >
        <LegendItemComponent className="flex items-center gap-1.5">
          <LegendMarker />
          <LegendLabel className="text-xs" />
          <LegendValue className="text-xs" showPercentage />
        </LegendItemComponent>
      </Legend>
    </div>
  );
}

function makeSunburstHero(): ChartExample {
  return {
    code: `<SunburstChart data={data} size={460}>
  <SunburstBreadcrumb>
    <SunburstDrillBreadcrumb />
  </SunburstBreadcrumb>
  {arcs.map((arc) => (
    <SunburstSegment index={arc.arcIndex} key={arc.id} />
  ))}
  <SunburstCenter />
  <SunburstLabels />
  <SunburstHint />
</SunburstChart>`,
    description: "Hierarchical revenue breakdown with drill-down zoom",
    render: () => <SunburstHeroInner />,
    title: "Sunburst Chart - Interactive",
  };
}

function makeSunburstExamples(): ChartExample[] {
  return [
    {
      code: `<SunburstChart data={data} size={320}>
  <PatternLines id="inner-product" orientation={["diagonal"]}
    stroke="var(--chart-1)" width={6} height={6} />
  <PatternLines id="inner-partners" orientation={["diagonal"]}
    stroke="var(--chart-3)" width={6} height={6} />
  <SunburstSegment index={0} fill="url(#inner-product)" />
  <SunburstSegment index={2} fill="url(#inner-partners)" />
  <SunburstCenter />
</SunburstChart>`,
      description:
        "Diagonal stripes on alternating inner-ring segments (Product & Partners)",
      render: () => <SunburstPatternsExample />,
      title: "Sunburst Chart - Patterns",
    },
    {
      code: `const { items, arcIndices } = legendForFocus(data, focusId);

<SunburstChart
  data={data}
  focusId={focusId}
  hoveredIndex={hoveredIndex}
  onFocusChange={setFocusId}
  onHoverChange={setHoveredIndex}
>
  {arcs.map((arc) => (
    <SunburstSegment index={arc.arcIndex} key={arc.id} />
  ))}
  <SunburstCenter />
</SunburstChart>
<Legend hoveredIndex={legendIndex} items={items} onHoverChange={setLegendIndex}>
  <LegendItemComponent>
    <LegendMarker />
    <LegendLabel />
    <LegendValue showPercentage />
  </LegendItemComponent>
</Legend>`,
      description: "Legend synced to the current focus level and chart hover",
      render: () => <SunburstWithLegend />,
      title: "Sunburst Chart - Legend",
    },
  ];
}

const sparklineDataSnippet = `const data = Array.from({ length: 24 }, (_, i) => ({
  day: \`Day \${i + 1}\`,
  value: Math.round(4200 + 40 * i + Math.sin(i * 0.7) * 500),
}));`;

function makeSparklineHero(): ChartExample {
  return {
    code: `function KpiCard({ label, data }) {
  const hover = useSparklineHover<Point>();
  const shown = hover.datum ?? data.at(-1);
  return (
    <div className="rounded-xl border p-4">
      <span>{label}</span>
      <span>{formatter.format(shown.value)}</span>
      <AreaSparkline data={data} dataKey="value" height={40} {...hover.sparklineProps} />
    </div>
  );
}`,
    data: sparklineDataSnippet,
    description:
      "useSparklineHover drives the headline number: hover a sparkline to read any point, leave to fall back to the latest value.",
    footer: "Line, area, and bar sparklines with a shared hover hook",
    render: () => <SparklineKpiCardsExample />,
    title: "Sparkline - KPI cards",
  };
}

function makeSparklineExamples(): ChartExample[] {
  return [
    {
      code: `<LineSparkline data={data} dataKey="value" height={56} />`,
      data: sparklineDataSnippet,
      description:
        "Fills its parent width; hover shows a dashed crosshair and dot.",
      render: () => <SparklineLineExample />,
      title: "Sparkline - Line",
    },
    {
      code: `<AreaSparkline data={data} dataKey="value" height={56} />`,
      data: sparklineDataSnippet,
      description: "Area fill fades from the line to the baseline.",
      render: () => <SparklineAreaExample fill="gradient" />,
      title: "Sparkline - Area gradient",
    },
    {
      code: `<AreaSparkline
  color="var(--chart-2)"
  data={data}
  dataKey="value"
  fill="solid"
  fillOpacity={0.2}
  height={56}
/>`,
      data: sparklineDataSnippet,
      description: "Flat fill at a custom opacity.",
      render: () => <SparklineAreaExample fill="solid" />,
      title: "Sparkline - Area solid",
    },
    {
      code: `<BarSparkline
  barGap={2}
  barRadius={2}
  color="var(--chart-3)"
  data={data}
  dataKey="value"
  height={56}
/>`,
      data: sparklineDataSnippet,
      description:
        "Rounded bars with a gap; non-hovered bars dim while hovering.",
      render: () => <SparklineBarExample />,
      title: "Sparkline - Bar",
    },
    {
      code: `const hover = useSparklineHover<Point>();
const shown = hover.datum ?? data.at(-1);

<span>{shown.day} · {shown.value}</span>
<BarSparkline data={data} dataKey="value" height={56} {...hover.sparklineProps} />`,
      data: `const data = Array.from({ length: 20 }, (_, i) => ({
  day: \`Day \${i + 1}\`,
  value: Math.round(Math.sin(i * 0.9) * 420 + Math.cos(i * 2.3) * 180 + 40),
}));`,
      description:
        "Bars grow from zero, so profit and loss read above and below the baseline.",
      render: () => <SparklineNegativeBarsExample />,
      title: "Sparkline - Negative bars",
    },
    {
      code: `<LineSparkline crosshair="dashed" data={data} dataKey="value" height={48} />
<LineSparkline crosshair="solid" data={data} dataKey="value" height={48} />
<LineSparkline crosshair="gradient" data={data} dataKey="value" height={48} />`,
      data: sparklineDataSnippet,
      description: "Dashed (default), solid, and gradient hover guides.",
      render: () => <SparklineCrosshairsExample />,
      title: "Sparkline - Crosshair styles",
    },
    {
      code: `<LineSparkline data={data} dataKey="value" height={48} />
<LineSparkline
  data={data}
  dataKey="value"
  height={48}
  springConfig={{ stiffness: 600, damping: 45 }}
/>
<LineSparkline data={data} dataKey="value" height={48} hoverTransition={false} />`,
      data: sparklineDataSnippet,
      description:
        "The crosshair and dot spring between points by default. Tune it with springConfig, or set hoverTransition={false} to snap.",
      render: () => <SparklineHoverFeelExample />,
      title: "Sparkline - Hover feel",
    },
    {
      code: `const hover = useSparklineHover<Row>();

<AreaSparkline
  data={data}
  dataKey="value"
  hoverTransition={false}
  {...hover.sparklineProps}
/>
<BarSparkline
  data={data}
  dataKey="value"
  hoverTransition={false}
  {...hover.sparklineProps}
/>`,
      data: sparklineDataSnippet,
      description:
        "Synced area and bars with hoverTransition={false}: the crosshair and dot jump straight to each point, while the series fade and bar focus still animate.",
      render: () => <SparklineNoSpringExample />,
      title: "Sparkline - No spring",
    },
    {
      code: `<LineSparkline
  color="var(--chart-4)"
  curve="natural"
  data={data}
  dataKey="value"
  endDot
  height={40}
  interactive={false}
/>`,
      data: sparklineDataSnippet,
      description:
        "Static trend next to a stat: endDot marks the latest value and interactive={false} skips pointer tracking.",
      render: () => <SparklineEndDotExample />,
      title: "Sparkline - End dot",
    },
    {
      code: `<AreaSparkline
  color="var(--chart-5)"
  curve="step"
  data={data}
  dataKey="value"
  endDot
  height={56}
  yDomain={[0]}
/>`,
      data: `const data = [5, 5, 5, 8, 8, 8, 8, 12, 12, 10, 10, 15, 15, 15, 20, 20, 18, 25]
  .map((value, i) => ({ day: \`Week \${i + 1}\`, value }));`,
      description:
        "Step curve for discrete levels (seats, plan tiers), anchored at zero with yDomain.",
      render: () => <SparklineStepExample />,
      title: "Sparkline - Step",
    },
    {
      code: `const hover = useSparklineHover();

{series.map((s) => (
  <div key={s.label}>
    <span>{s.label}</span>
    <LineSparkline
      color={s.color}
      data={s.data}
      dataKey="value"
      height={28}
      {...hover.sparklineProps}
    />
    <span>{s.data[hover.index ?? s.data.length - 1].value}</span>
  </div>
))}`,
      data: sparklineDataSnippet,
      description:
        "One useSparklineHover shared by every row: hovering any sparkline moves them all.",
      render: () => <SparklineSyncedExample />,
      title: "Sparkline - Synced hover",
    },
    {
      code: `<td>
  <LineSparkline
    color={change >= 0 ? "var(--chart-positive)" : "var(--chart-negative)"}
    data={row.data}
    dataKey="value"
    height={24}
    strokeWidth={1.5}
    width={120}
  />
</td>`,
      data: sparklineDataSnippet,
      description:
        "Fixed-width sparklines inline in a table, coloured by direction.",
      render: () => <SparklineTableExample />,
      title: "Sparkline - Table",
    },
    {
      code: `{series.map((data, i) => {
  const Component = [AreaSparkline, LineSparkline, BarSparkline][i % 3];
  return (
    <Component
      color={\`var(--chart-\${(i % 5) + 1})\`}
      data={data}
      dataKey="value"
      height={24}
      key={i}
    />
  );
})}`,
      description:
        "64 sparklines sharing a single ResizeObserver, with no per-instance animation runtime.",
      render: () => <SparklineDenseGridExample />,
      title: "Sparkline - Dense grid",
    },
  ];
}

// ---------------------------------------------------------------------------
// Docs demos (bklit-ui apps/web/components/docs/*-demo.tsx)
// ---------------------------------------------------------------------------

/** Extra gallery entries appended after each page's own examples. */
const docsDemoExamples: Partial<Record<string, ChartExample[]>> = {
  "area-chart": [
    {
      code: docsDemoCode.AreaChartBrushDemo,
      description:
        "See the Brush utility docs for `ChartBrushLayout` and `ChartBrush` props.",
      render: () => <AreaChartBrushDemo />,
      title: "Area Chart - Brush zoom",
    },
    {
      code: docsDemoCode.AreaChartPatternDemo,
      description:
        "Demo component `AreaChartPatternDemo` from the bklit-ui docs.",
      render: () => <AreaChartPatternDemo />,
      title: "Area Chart - Pattern",
    },
    {
      code: docsDemoCode.AreaChartYDomainDemo,
      description:
        'Drive loading and ready from your data layer with a single `AreaChart` — one `Grid`, one `Area`, no component swap. Set `status="loading"` while fetching; switch to `"ready"` when data resolves.',
      render: () => <AreaChartYDomainDemo />,
      title: "Area Chart - Loading state",
    },
    {
      code: docsDemoCode.AreaTooltipDemo,
      description:
        "Custom tooltip rows for revenue and costs via the `ChartTooltip` `rows` prop.",
      render: () => <AreaTooltipPreview />,
      title: "Area Chart - Tooltip rows",
    },
  ],
  axis: [
    {
      code: docsDemoCode.AxisBothDemo,
      description: "Value labels for the vertical axis in line and area charts",
      render: () => <AxisBothDemo />,
      title: "Axis - Both",
    },
    {
      code: docsDemoCode.AxisXOnlyDemo,
      description:
        "Date labels for the horizontal axis in line and area charts",
      render: () => <AxisXOnlyDemo />,
      title: "Axis - X only",
    },
    {
      code: docsDemoCode.AxisYOnlyDemo,
      description: "Demo component `AxisYOnlyDemo` from the bklit-ui docs.",
      render: () => <AxisYOnlyDemo />,
      title: "Axis - Y only",
    },
  ],
  background: [
    {
      code: docsDemoCode.BackgroundDiagonalDemo,
      description:
        "Pattern fill for the plot area when grid lines are hidden — presets, edge fade, and enter animation",
      render: () => <BackgroundDiagonalDemo />,
      title: "Background - Diagonal (default)",
    },
    {
      code: docsDemoCode.BackgroundDotsDemo,
      description:
        "Demo component `BackgroundDotsDemo` from the bklit-ui docs.",
      render: () => <BackgroundDotsDemo />,
      title: "Background - Dot grid",
    },
    {
      code: docsDemoCode.BackgroundCrossDemo,
      description:
        "Demo component `BackgroundCrossDemo` from the bklit-ui docs.",
      render: () => <BackgroundCrossDemo />,
      title: "Background - Cross",
    },
    {
      code: docsDemoCode.BackgroundNoFadeDemo,
      description:
        "Demo component `BackgroundNoFadeDemo` from the bklit-ui docs.",
      render: () => <BackgroundNoFadeDemo />,
      title: "Background - No edge fade",
    },
  ],
  band: [
    {
      code: docsDemoCode.BandRangeAreaDemo,
      description:
        "A `Band` on its own is a range area chart: a filled area between a per-row low and high, with no centre line. The y-axis scales to the band, and the tooltip shows the range for the hovered date.",
      render: () => <BandRangeAreaDemo />,
      title: "Band - Range area",
    },
    {
      code: docsDemoCode.BandRangeComboDemo,
      description:
        "Use one `Band` per series and give each the same colour as its `Line` — for example each team's min / max around its average. The tooltip lists every line value and every band range for the hovered date. `strokeWidth={0}` drops the band edges so only the lines are stroked.",
      render: () => <BandRangeComboDemo />,
      title: "Band - Range area + line combo",
    },
    {
      code: docsDemoCode.BandRangeDemo,
      description:
        "Shade a range between two per-row values — min/max, a confidence interval, or Bollinger bands — with `Band`. Place it before your `Line`s; it reveals and morphs with them and extends the y-domain to fit both edges. Use `withBollingerBands` to derive the edges from a series.",
      render: () => <BandRangeDemo />,
      title: "Band - Band",
    },
    {
      code: docsDemoCode.BandBollingerDemo,
      description:
        "`withBollingerBands` adds a rolling simple moving average (SMA) ± `multiplier` standard deviations to each row. Rows before the window fills get `null` for all three keys, which `Band` renders as a gap (pass `minPeriods: 1` to start at the first row instead).",
      render: () => <BandBollingerDemo />,
      title: "Band - Bollinger bands",
    },
    {
      code: docsDemoCode.BandFillTypeDemo,
      description:
        '`fillType` switches between a flat `"solid"` fill, a vertical `"gradient"` (from `fillOpacity` at the upper edge to `gradientToOpacity` at the lower edge), and a `"pattern"` fill using the `Background` presets.',
      render: () => <BandFillTypeDemo />,
      title: "Band - Fill types",
    },
    {
      code: docsDemoCode.BandFadeEdgesDemo,
      description:
        "`fadeEdges` fades the fill and strokes to transparent. Horizontal fades span the plot width; vertical fades span the band's own pixel height. `fadeSize` sets how much of that width or height each fade covers.",
      render: () => <BandFadeEdgesDemo />,
      title: "Band - Faded edges",
    },
    {
      code: docsDemoCode.BandEdgeStrokesDemo,
      description:
        "Both edges share `stroke`, `strokeWidth`, `strokeDasharray`, and `strokeOpacity`. Override one edge with `upperStroke` / `lowerStroke`, or pass `false` to hide it.",
      render: () => <BandEdgeStrokesDemo />,
      title: "Band - Edge strokes",
    },
  ],
  "bar-chart": [
    {
      code: docsDemoCode.BarChartStackedDemo,
      description:
        "Demo component `BarChartStackedDemo` from the bklit-ui docs.",
      render: () => <BarChartStackedDemo />,
      title: "Bar Chart - Stacked",
    },
    {
      code: docsDemoCode.BarChartHorizontalDemo,
      description:
        "Demo component `BarChartHorizontalDemo` from the bklit-ui docs.",
      render: () => <BarChartHorizontalDemo />,
      title: "Bar Chart - Horizontal",
    },
    {
      code: docsDemoCode.BarChart90DaysDemo,
      description:
        "Demo component `BarChart90DaysDemo` from the bklit-ui docs.",
      render: () => <BarChart90DaysDemo />,
      title: "Bar Chart - 90 days",
    },
    {
      code: docsDemoCode.BarChartGradientDemo,
      description:
        "Demo component `BarChartGradientDemo` from the bklit-ui docs.",
      render: () => <BarChartGradientDemo />,
      title: "Bar Chart - Gradient",
    },
    {
      code: docsDemoCode.BarChartPatternDemo,
      description:
        "Demo component `BarChartPatternDemo` from the bklit-ui docs.",
      render: () => <BarChartPatternDemo />,
      title: "Bar Chart - Pattern",
    },
    {
      code: docsDemoCode.BarChartStackedWithLegendDemo,
      description:
        "Demo component `BarChartStackedWithLegendDemo` from the bklit-ui docs.",
      render: () => <BarChartStackedWithLegendDemo />,
      title: "Bar Chart - Stacked with legend",
    },
    {
      code: docsDemoCode.BarChartNarrowGapsDemo,
      description:
        "Demo component `BarChartNarrowGapsDemo` from the bklit-ui docs.",
      render: () => <BarChartNarrowGapsDemo />,
      title: "Bar Chart - Narrow gaps",
    },
    {
      code: docsDemoCode.BarChartCustomTooltipDemo,
      description:
        "Demo component `BarChartCustomTooltipDemo` from the bklit-ui docs.",
      render: () => <BarChartCustomTooltipDemo />,
      title: "Bar Chart - Custom tooltip",
    },
    {
      code: docsDemoCode.BarChartNoGapGradientDemo,
      description:
        "Demo component `BarChartNoGapGradientDemo` from the bklit-ui docs.",
      render: () => <BarChartNoGapGradientDemo />,
      title: "Bar Chart - No gap gradient",
    },
    {
      code: docsDemoCode.BarChartLoadingDemo,
      description:
        'Local preview for the bar chart loading skeleton (status="loading").',
      render: () => <BarChartLoadingDemo />,
      title: "Bar Chart - Loading state",
    },
    {
      code: docsDemoCode.BarChartProfitLossDemo,
      description:
        '`BarChart` handles positive and negative values. While every value is zero or above, the value axis starts at `0`; once any value is negative, the domain stretches to include it and bars grow up or down from the zero line (or left / right for `orientation="horizontal"`). Use `Grid highlightRowValues={[0]}` to draw a visible zero line.',
      render: () => <BarChartProfitLossDemo />,
      title: "Bar Chart - Negative values",
    },
  ],
  "candlestick-chart": [
    {
      code: docsDemoCode.CandlestickChartDemo,
      description:
        "A composable OHLC candlestick chart with gradients, patterns, tooltips, and hover interactions",
      render: () => <CandlestickChartDemo />,
      title: "Candlestick Chart - Overview",
    },
  ],
  "choropleth-chart": [
    {
      code: docsDemoCode.ChoroplethDemo,
      description:
        "A composable geographic map chart for visualizing data across regions with interactive tooltips, zoom controls, and pattern support",
      render: () => <ChoroplethDemo />,
      title: "Choropleth Chart - Overview",
    },
    {
      code: docsDemoCode.ChoroplethAnalyticsDemo,
      description:
        "Demo component `ChoroplethAnalyticsDemo` from the bklit-ui docs.",
      render: () => <ChoroplethAnalyticsDemo />,
      title: "Choropleth Chart - Analytics",
    },
    {
      code: docsDemoCode.ChoroplethLinesPatternDemo,
      description:
        "Demo component `ChoroplethLinesPatternDemo` from the bklit-ui docs.",
      render: () => <ChoroplethLinesPatternDemo />,
      title: "Choropleth Chart - Lines pattern",
    },
    {
      code: docsDemoCode.ChoroplethZoomDemo,
      description:
        "Demo component `ChoroplethZoomDemo` from the bklit-ui docs.",
      render: () => <ChoroplethZoomDemo />,
      title: "Choropleth Chart - Zoom",
    },
  ],
  "custom-indicator": [
    {
      code: docsDemoCode.CustomIndicatorDemo,
      description:
        "Demo component `CustomIndicatorDemo` from the bklit-ui docs.",
      render: () => <CustomIndicatorDemo />,
      title: "Custom Indicator - Overview",
    },
  ],
  "date-highlights": [
    {
      code: docsDemoCode.WeekendsLineDemo,
      description:
        "Shade weekend days behind the series on date x axes — diagonal stripes or a solid fill, configurable weekend days, and zoom-aware rendering",
      render: () => <WeekendsLineDemo />,
      title: "Date Highlights - Weekends line",
    },
    {
      code: docsDemoCode.DeadlineLineDemo,
      description:
        "Due-date marker for date x axes — a vertical line with a striped, gradient, or solid region to its right that fades out",
      render: () => <DeadlineLineDemo />,
      title: "Date Highlights - Deadline line",
    },
    {
      code: docsDemoCode.DateHighlightsLineDemo,
      description:
        "Shade weekends with `Weekends` and mark a due date with `Deadline` — a line at the date plus a striped region that fades out to the right. Both render behind the series and only draw what is inside the visible x-domain, so they work with brush zoom.",
      render: () => <DateHighlightsLineDemo />,
      title: "Date Highlights - Line",
    },
    {
      code: docsDemoCode.DeadlineFillTypesDemo,
      description:
        "Demo component `DeadlineFillTypesDemo` from the bklit-ui docs.",
      render: () => <DeadlineFillTypesDemo />,
      title: "Date Highlights - Deadline fill types",
    },
    {
      code: docsDemoCode.DateHighlightsBrushDemo,
      description:
        "Bands are recomputed from the visible domain, so zooming in reveals weekends that were too narrow to draw at full range.",
      render: () => <DateHighlightsBrushDemo />,
      title: "Date Highlights - Brush",
    },
    {
      code: docsDemoCode.DateHighlightsAreaDemo,
      description:
        "Add `Weekends` to shade Saturday and Sunday, and `Deadline` to mark a due date with a fading region. Both sit behind the areas and follow brush zoom.",
      render: () => <DateHighlightsAreaDemo />,
      title: "Date Highlights - Area",
    },
    {
      code: docsDemoCode.DateHighlightsComposedDemo,
      description:
        "`Weekends` shades the weekend columns and `Deadline` marks a due date. With `SeriesBar` columns at midnight, `Weekends` centres each band on its column automatically; pass `utc` when your dates are UTC-anchored (like `composedDemoData`).",
      render: () => <DateHighlightsComposedDemo />,
      title: "Date Highlights - Composed",
    },
    {
      code: docsDemoCode.DateHighlightsBarDemo,
      description:
        'With daily rows whose x value is a `Date` (or a `"YYYY-MM-DD"` string), `Weekends` shades the weekend columns and `Deadline` marks a due date at the left edge of its column. Pass `dateKey` if the date lives in a different field than the x key.',
      render: () => <DateHighlightsBarDemo />,
      title: "Date Highlights - Bar",
    },
  ],
  "gauge-chart": [
    {
      code: docsDemoCode.GaugeChartDemo,
      description:
        "Notch-based radial or linear gauge with optional center label, theme fills, patterns, arc gradients, and responsive sizing",
      render: () => <GaugeChartDemo />,
      title: "Gauge - Overview",
    },
  ],
  grid: [
    {
      code: docsDemoCode.GridHorizontalDemo,
      description:
        "The most common configuration with horizontal reference lines.",
      render: () => <GridHorizontalDemo />,
      title: "Grid - Horizontal Only (Default)",
    },
    {
      code: docsDemoCode.GridVerticalDemo,
      description: "Use vertical grid lines to emphasize time intervals.",
      render: () => <GridVerticalDemo />,
      title: "Grid - Vertical Only",
    },
    {
      code: docsDemoCode.GridBothDemo,
      description:
        "Display a full grid for detailed reference. Turn off `fadeHorizontal` so the rows run edge to edge like the columns (vertical lines don't fade by default).",
      render: () => <GridBothDemo />,
      title: "Grid - Both Horizontal and Vertical",
    },
    {
      code: docsDemoCode.GridSolidDemo,
      description: "Remove the dash pattern for solid grid lines.",
      render: () => <GridSolidDemo />,
      title: "Grid - Solid Lines",
    },
    {
      code: docsDemoCode.GridNoFadeDemo,
      description: "Disable the edge fade effect for sharp line endings.",
      render: () => <GridNoFadeDemo />,
      title: "Grid - Without Edge Fade",
    },
    {
      code: docsDemoCode.GridHideEdgeLinesDemo,
      description:
        "Omit the outermost horizontal or vertical grid lines — useful when the chart border already provides a frame.",
      render: () => <GridHideEdgeLinesDemo />,
      title: "Grid - Hide edge lines",
    },
    {
      code: docsDemoCode.GridDenseDemo,
      description:
        "Increase the number of grid lines for more granular reference.",
      render: () => <GridDenseDemo />,
      title: "Grid - Dense Grid",
    },
  ],
  legend: [
    {
      code: docsDemoCode.LegendSimpleDemo,
      description: "Demo component `LegendSimpleDemo` from the bklit-ui docs.",
      render: () => <LegendSimpleDemo />,
      title: "Legend - Simple Legend",
    },
    {
      code: docsDemoCode.LegendProgressDemo,
      description:
        "A composable legend component for charts with progress bars, markers, and customizable layouts",
      render: () => <LegendProgressDemo />,
      title: "Legend - With Progress Bars",
    },
    {
      code: docsDemoCode.LegendHorizontalDemo,
      description:
        "Demo component `LegendHorizontalDemo` from the bklit-ui docs.",
      render: () => <LegendHorizontalDemo />,
      title: "Legend - Horizontal Layout",
    },
  ],
  "line-chart": [
    {
      code: docsDemoCode.LineChartBrushDemo,
      description:
        "Use `ChartBrushLayout` and `ChartBrush` the same way as on `AreaChart`. See the Brush utility docs for full API reference. The brush strip typically shows simplified `Line` series; the main chart receives `xDomain`, `xDomainSlotCount`, and `tweenYDomainOnXDomainChange` for live zoom and y-domain tweening.",
      render: () => <LineChartBrushDemo />,
      title: "Line Chart - Brush zoom",
    },
    {
      code: docsDemoCode.LineChartDateRangeDemo,
      description:
        "When your data changes (e.g. filtering by date range, refreshing from an API), the chart automatically updates smoothly without replaying the enter animation. The y-domain tweens to the new scale via `yDomainTween` (enabled by default).",
      render: () => <LineChartDateRangeDemo />,
      title: "Line Chart - Updating data smoothly",
    },
    {
      code: docsDemoCode.LineChartLoadingDemo,
      description:
        "Demo component `LineChartLoadingDemo` from the bklit-ui docs.",
      render: () => <LineChartLoadingDemo />,
      title: "Line Chart - Loading",
    },
    {
      code: docsDemoCode.LineChartYDomainDemo,
      description:
        'Drive loading and ready from your data layer with a single `LineChart` — one `Grid`, one `Line`, no component swap. Set `status="loading"` while fetching; switch to `"ready"` when data resolves.',
      render: () => <LineChartYDomainDemo />,
      title: "Line Chart - Loading state",
    },
    {
      code: docsDemoCode.ProfitLossLineDemo,
      description:
        "Sign-colored line segments for profit and loss on a shared zero baseline",
      render: () => <ProfitLossLineDemo />,
      title: "Line Chart - Profit/Loss line",
    },
    {
      code: docsDemoCode.ProjectionLineGradientDemo,
      description: "Projection line with a gradient stroke.",
      render: () => <ProjectionLineGradientDemo />,
      title: "Line Chart - Gradient stroke",
    },
  ],
  "live-line-chart": [
    {
      code: docsDemoCode.LiveLineChartDemo,
      description:
        "Real-time streaming line chart with smooth scrolling, crosshair, and animated axes",
      render: () => <LiveLineChartDemo />,
      title: "Live Line Chart - Overview",
    },
  ],
  markers: [
    {
      code: docsDemoCode.MarkersDemo,
      description:
        "Three markers share a date, so the middle badge shows a count and fans out on hover. The first marker links out, and the last uses a custom `color`.",
      render: () => <MarkersDemo />,
      title: "Markers - Rich markers with radial menu",
    },
    {
      code: docsDemoCode.MarkersCompactDemo,
      description:
        "Demo component `MarkersCompactDemo` from the bklit-ui docs.",
      render: () => <MarkersCompactDemo />,
      title: "Markers - Compact badges without guide lines",
    },
    {
      code: docsDemoCode.DiamondMarkersDemo,
      description:
        "`ChartMarkers` always draws a circular badge. For a minimal annotation — a small diamond above the plot with a dashed guide — write your own layer with `useChart`. `xScale` maps the marker date to a pixel, and `innerHeight` is the plot height. Any SVG you return renders in the chart's plot space, so negative `y` sits in the top margin. Set the static `__isPostOverlay` flag on the component (the same flag `LineSeriesTerminalMarker` uses) so the layer renders outside the series reveal clip; otherwise the glyph above the plot top is clipped.",
      render: () => <DiamondMarkersDemo />,
      title: "Markers - Simple custom marker",
    },
  ],
  "pie-chart": [
    {
      code: docsDemoCode.PieChartDemo,
      description: "Main demo with interactive legend",
      render: () => <PieChartDemo />,
      title: "Pie Chart - Overview",
    },
    {
      code: docsDemoCode.PieChartBasicDemo,
      description: "Basic pie chart without legend",
      render: () => <PieChartBasicDemo />,
      title: "Pie Chart - Basic",
    },
    {
      code: docsDemoCode.PieChartDonutDemo,
      description: "Donut chart with center content",
      render: () => <PieChartDonutDemo />,
      title: "Pie Chart - Donut",
    },
    {
      code: docsDemoCode.PieChartDonutLegendDemo,
      description: "Donut chart with interactive legend",
      render: () => <PieChartDonutLegendDemo />,
      title: "Pie Chart - Donut legend",
    },
    {
      code: docsDemoCode.PieChartPatternsDemo,
      description: "Pie chart with patterns",
      render: () => <PieChartPatternsDemo />,
      title: "Pie Chart - Patterns",
    },
    {
      code: docsDemoCode.PieChartGradientsDemo,
      description: "Pie chart with gradients",
      render: () => <PieChartGradientsDemo />,
      title: "Pie Chart - Gradients",
    },
    {
      code: docsDemoCode.PieChartHoverEffectDemo,
      description: "Hover effect demo with selector",
      render: () => <PieChartHoverEffectDemo />,
      title: "Pie Chart - Hover effect",
    },
    {
      code: docsDemoCode.PieChartCustomCenterDemo,
      description: "Donut with custom center content",
      render: () => <PieChartCustomCenterDemo />,
      title: "Pie Chart - Custom center",
    },
  ],
  "radar-chart": [
    {
      code: docsDemoCode.RadarChartDemo,
      description:
        "A composable multi-series radar chart with animated polygons, hover interactions, and customizable metrics",
      render: () => <RadarChartDemo />,
      title: "Radar Chart - Overview",
    },
    {
      code: docsDemoCode.RadarChartBasicDemo,
      description:
        "Demo component `RadarChartBasicDemo` from the bklit-ui docs.",
      render: () => <RadarChartBasicDemo />,
      title: "Radar Chart - Basic",
    },
    {
      code: docsDemoCode.RadarChartMinimalDemo,
      description:
        "Demo component `RadarChartMinimalDemo` from the bklit-ui docs.",
      render: () => <RadarChartMinimalDemo />,
      title: "Radar Chart - Minimal",
    },
  ],
  "reference-area": [
    {
      code: docsDemoCode.ReferenceAreaBandDemo,
      description:
        "Demo component `ReferenceAreaBandDemo` from the bklit-ui docs.",
      render: () => <ReferenceAreaBandDemo />,
      title: "Reference Area - Dashed band with markers",
    },
    {
      code: docsDemoCode.ReferenceAreaPatternDemo,
      description:
        "Shaded Y band for target ranges and thresholds on cartesian charts — solid or pattern fill, dashed edges, and Y-axis tick coloring",
      render: () => <ReferenceAreaPatternDemo />,
      title: "Reference Area - Pattern fill with axis labels",
    },
    {
      code: docsDemoCode.ReferenceAreaMarkersDemo,
      description:
        "Demo component `ReferenceAreaMarkersDemo` from the bklit-ui docs.",
      render: () => <ReferenceAreaMarkersDemo />,
      title: "Reference Area - Colored markers",
    },
  ],
  "ring-chart": [
    {
      code: docsDemoCode.RingChartDemo,
      description:
        "A composable multi-ring progress chart with animated arcs, hover interactions, and a reusable legend component",
      render: () => <RingChartDemo />,
      title: "Ring Chart - Overview",
    },
    {
      code: docsDemoCode.RingChartBasicDemo,
      description:
        "Demo component `RingChartBasicDemo` from the bklit-ui docs.",
      render: () => <RingChartBasicDemo />,
      title: "Ring Chart - Basic",
    },
    {
      code: docsDemoCode.RingChartCustomColorsDemo,
      description:
        "Demo component `RingChartCustomColorsDemo` from the bklit-ui docs.",
      render: () => <RingChartCustomColorsDemo />,
      title: "Ring Chart - Custom colors",
    },
  ],
  "sankey-chart": [
    {
      code: docsDemoCode.SankeyPatternDemo,
      description: "Demo component `SankeyPatternDemo` from the bklit-ui docs.",
      render: () => <SankeyPatternDemo />,
      title: "Sankey Chart - Pattern",
    },
    {
      code: docsDemoCode.SankeyNoLabelsDemo,
      description:
        "Demo component `SankeyNoLabelsDemo` from the bklit-ui docs.",
      render: () => <SankeyNoLabelsDemo />,
      title: "Sankey Chart - No labels",
    },
  ],
  "scatter-chart": [
    {
      code: docsDemoCode.ScatterChartDemo,
      description:
        "A composable time-series scatter chart with hover dimming, optional offset rings, jitter, and animated enter",
      render: () => <ScatterChartDemo />,
      title: "Scatter Chart - Overview",
    },
    {
      code: docsDemoCode.ScatterJitterDemo,
      description:
        "When many rows share the same date (a strip plot), points stack on top of each other. Pass `jitter` to `ScatterChart` to spread them horizontally (and optionally vertically). Offsets are seeded and deterministic — no `Math.random` — so points never jump between renders or SSR/hydration. Hover snaps to the nearest jittered point, the tooltip shows the original values, and `ChartTooltip` hides its crosshair line by default (it would mark a date, not the hovered point — pass `showCrosshair` to opt back in).",
      render: () => <ScatterJitterDemo />,
      title: "Scatter Chart - Scatter with Jitter",
    },
  ],
  segment: [
    {
      code: docsDemoCode.SegmentDemo,
      description: "Demo component `SegmentDemo` from the bklit-ui docs.",
      render: () => <SegmentDemo />,
      title: "Segment - Overview",
    },
  ],
  sparkline: [
    {
      code: docsDemoCode.SparklineDemo,
      description:
        "Tiny line, area and bar charts built for density — one path per chart, a shared resize observer, lightweight enter animations and a minimal hover crosshair",
      render: () => <SparklineDemo />,
      title: "Sparkline - Overview",
    },
    {
      code: docsDemoCode.SparklineCrosshairDemo,
      description:
        "Demo component `SparklineCrosshairDemo` from the bklit-ui docs.",
      render: () => <SparklineCrosshairDemo />,
      title: "Sparkline - Crosshair styles",
    },
    {
      code: docsDemoCode.SparklineHoverFeelDemo,
      description:
        "The crosshair and dot spring between points with the same spring as the main charts' tooltip. Pass only the values you want to change to `springConfig` — higher `stiffness` feels snappier, lower `damping` bouncier — or set `hoverTransition={false}` to snap straight to each point. The series fade and highlight still animate either way. Reduced motion always snaps.",
      render: () => <SparklineHoverFeelDemo />,
      title: "Sparkline - Hover feel",
    },
    {
      code: docsDemoCode.SparklineSyncedDemo,
      description:
        "`useSparklineHover` lifts hover state out of the chart. Spread `sparklineProps` onto a sparkline and read `datum` or `index`:",
      render: () => <SparklineSyncedDemo />,
      title: "Sparkline - Hovered values",
    },
    {
      code: docsDemoCode.SparklineGridDemo,
      description:
        "Each sparkline renders a single `<path>` (bars included), animates with the Web Animations API, and only the hovered instance re-renders. 200 instances:",
      render: () => <SparklineGridDemo />,
      title: "Sparkline - Many on one page",
    },
  ],
  "sunburst-chart": [
    {
      code: docsDemoCode.SunburstChartDemo,
      description:
        "A composable hierarchical sunburst chart with drill-down zoom, animated segments, breadcrumb navigation, and legend sync",
      render: () => <SunburstChartDemo />,
      title: "Sunburst Chart - Overview",
    },
  ],
  tooltip: [
    {
      code: docsDemoCode.TooltipDefaultDemo,
      description: "Full-featured tooltip with crosshair, dots, and date pill.",
      render: () => <TooltipDefaultDemo />,
      title: "Tooltip - Default Tooltip",
    },
    {
      code: docsDemoCode.TooltipCrosshairOnlyDemo,
      description:
        "Minimal tooltip with just the crosshair line and tooltip box.",
      render: () => <TooltipCrosshairOnlyDemo />,
      title: "Tooltip - Crosshair Only",
    },
    {
      code: docsDemoCode.TooltipMinimalDemo,
      description: "Just the tooltip content box, no visual indicators.",
      render: () => <TooltipMinimalDemo />,
      title: "Tooltip - Minimal (Box Only)",
    },
    {
      code: docsDemoCode.TooltipCustomRowsDemo,
      description:
        "Use the `rows` prop to customize row labels and value formatting.",
      render: () => <TooltipCustomRowsDemo />,
      title: "Tooltip - Custom Row Labels",
    },
    {
      code: docsDemoCode.TooltipBarChartDemo,
      description:
        "The tooltip adapts to bar charts, showing category names instead of dates. Inside `BarChart` the crosshair line is hidden by default (only the hover dots and panel show); pass `showCrosshair` to bring it back.",
      render: () => <TooltipBarChartDemo />,
      title: "Tooltip - With Bar Chart",
    },
    {
      code: docsDemoCode.TooltipSolidCrosshairDemo,
      description:
        'Remove vertical fade with `indicatorFadeEdges="none"` for a flat crosshair line.',
      render: () => <TooltipSolidCrosshairDemo />,
      title: "Tooltip - Solid crosshair",
    },
    {
      code: docsDemoCode.TooltipCrosshairFadeTopDemo,
      description:
        "Fade the crosshair from the top, bottom, both ends, or not at all. Use `indicatorFadeLength` to control how far the fade extends (percentage of chart height).",
      render: () => <TooltipCrosshairFadeTopDemo />,
      title: "Tooltip - Crosshair fade",
    },
    {
      code: docsDemoCode.TooltipDashedCrosshairDemo,
      description: "Pass an SVG dash pattern to `indicatorDasharray`.",
      render: () => <TooltipDashedCrosshairDemo />,
      title: "Tooltip - Dashed crosshair",
    },
    {
      code: docsDemoCode.TooltipMatchCrosshairDemo,
      description:
        "By default the tooltip panel eases independently with `damping={20}`. Set `matchCrosshair` to lock the panel to the crosshair spring.",
      render: () => <TooltipMatchCrosshairDemo />,
      title: "Tooltip - Match crosshair",
    },
    {
      code: docsDemoCode.TooltipPanelDampingDemo,
      description:
        "The default panel uses `damping={20}` without any props. Increase `damping` for heavier lag, or set `damping={0}` for instant follow.",
      render: () => <TooltipPanelDampingDemo />,
      title: "Tooltip - Panel damping",
    },
    {
      code: docsDemoCode.TooltipCustomContentDemo,
      description:
        "Use the `content` prop for complete control over the tooltip layout.",
      render: () => <TooltipCustomContentDemo />,
      title: "Tooltip - Fully Custom Content",
    },
  ],
  "trend-line": [
    {
      code: docsDemoCode.TrendLineDemo,
      description:
        "Primary preview: switch between dashed, solid, and gradient strokes.",
      render: () => <TrendLineDemo />,
      title: "Trend Line - Overview",
    },
    {
      code: docsDemoCode.TrendLineDashedDemo,
      description:
        "Demo component `TrendLineDashedDemo` from the bklit-ui docs.",
      render: () => <TrendLineDashedDemo />,
      title: "Trend Line - Dashed (default)",
    },
    {
      code: docsDemoCode.TrendLineSolidDemo,
      description:
        "Demo component `TrendLineSolidDemo` from the bklit-ui docs.",
      render: () => <TrendLineSolidDemo />,
      title: "Trend Line - Solid",
    },
    {
      code: docsDemoCode.TrendLineGradientDemo,
      description:
        "The gradient runs along the line from `gradientStart` to `gradientEnd`.",
      render: () => <TrendLineGradientDemo />,
      title: "Trend Line - Gradient",
    },
    {
      code: docsDemoCode.TrendLineFadeEdgesDemo,
      description:
        'Fade one or both ends with `fadeEdges` (`true`, `"left"`, or `"right"`). The fade follows the line direction and composes with dashed and gradient strokes.',
      render: () => <TrendLineFadeEdgesDemo />,
      title: "Trend Line - Fade edges",
    },
    {
      code: docsDemoCode.TrendLineAreaDemo,
      description: "Demo component `TrendLineAreaDemo` from the bklit-ui docs.",
      render: () => <TrendLineAreaDemo />,
      title: "Trend Line - Area chart",
    },
    {
      code: docsDemoCode.TrendLineBarDemo,
      description: "Demo component `TrendLineBarDemo` from the bklit-ui docs.",
      render: () => <TrendLineBarDemo />,
      title: "Trend Line - Bar chart",
    },
    {
      code: docsDemoCode.TrendLineHorizontalBarDemo,
      description:
        "Demo component `TrendLineHorizontalBarDemo` from the bklit-ui docs.",
      render: () => <TrendLineHorizontalBarDemo />,
      title: "Trend Line - Horizontal bar chart",
    },
    {
      code: docsDemoCode.TrendLineComposedDemo,
      description: "Add one `TrendLine` per series you want to fit.",
      render: () => <TrendLineComposedDemo />,
      title: "Trend Line - Composed chart",
    },
  ],
};

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

interface RegistryEntry {
  factory: () => ChartExample[];
  hero?: () => ChartExample;
  notice?: string;
  previewLayout?: ChartExamplePreviewLayout;
}

const chartExamplesRegistry: Record<string, RegistryEntry> = {
  "area-chart": {
    factory: makeAreaExamples,
    hero: makeAreaHero,
    previewLayout: "time-series",
  },
  // Utility pages: only the docs demos (appended in `getChartExamples`).
  axis: { factory: noExamples, previewLayout: "time-series" },
  background: { factory: noExamples, previewLayout: "time-series" },
  band: { factory: noExamples, previewLayout: "time-series" },
  "bar-chart": {
    factory: makeBarExamples,
    hero: makeBarHero,
    previewLayout: "time-series",
  },
  "candlestick-chart": {
    factory: makeCandlestickExamples,
    hero: makeCandlestickHero,
    previewLayout: "time-series",
  },
  "choropleth-chart": {
    factory: makeChoroplethExamples,
    hero: makeChoroplethHero,
    previewLayout: "wide",
  },
  "composed-chart": {
    factory: makeComposedExamples,
    hero: makeComposedHero,
    previewLayout: "time-series",
  },
  "custom-indicator": { factory: noExamples, previewLayout: "time-series" },
  "date-highlights": { factory: noExamples, previewLayout: "time-series" },
  "funnel-chart": {
    factory: makeFunnelExamples,
    hero: makeFunnelHero,
    previewLayout: "funnel",
  },
  "gauge-chart": {
    factory: makeGaugeExamples,
    hero: makeGaugeHero,
    previewLayout: "compact",
  },
  grid: { factory: noExamples, previewLayout: "time-series" },
  "heatmap-chart": {
    factory: makeHeatmapExamples,
    hero: makeHeatmapHero,
    previewLayout: "heatmap",
  },
  legend: { factory: noExamples },
  "line-chart": {
    factory: makeLineExamples,
    hero: makeLineHero,
    previewLayout: "time-series",
  },
  "live-line-chart": {
    factory: makeLiveLineExamples,
    hero: makeLiveLineHero,
    previewLayout: "time-series",
  },
  markers: { factory: noExamples, previewLayout: "time-series" },
  "pie-chart": { factory: makePieExamples, previewLayout: "compact" },
  "profit-loss-line": {
    factory: makeProfitLossLineExamples,
    previewLayout: "time-series",
  },
  "radar-chart": { factory: makeRadarExamples, previewLayout: "compact" },
  "reference-area": { factory: noExamples, previewLayout: "time-series" },
  "ring-chart": { factory: makeRingExamples, previewLayout: "compact" },
  "sankey-chart": {
    factory: makeSankeyExamples,
    hero: makeSankeyHero,
    notice:
      "The Sankey chart is in pre-alpha and is being actively developed. APIs may change.",
    previewLayout: "wide",
  },
  "scatter-chart": { factory: makeScatterExamples, hero: makeScatterHero },
  segment: { factory: noExamples, previewLayout: "time-series" },
  sparkline: {
    factory: makeSparklineExamples,
    hero: makeSparklineHero,
    previewLayout: "inline",
  },
  "sunburst-chart": {
    factory: makeSunburstExamples,
    hero: makeSunburstHero,
    previewLayout: "compact",
  },
  tooltip: { factory: noExamples, previewLayout: "time-series" },
  "trend-line": { factory: noExamples, previewLayout: "time-series" },
};

function noExamples(): ChartExample[] {
  return [];
}

/** A page's own examples followed by its docs demos. */
function getChartExamples(chartSlug: string, entry: RegistryEntry) {
  return [...entry.factory(), ...(docsDemoExamples[chartSlug] ?? [])];
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

const chartsPageContentClassName = "w-full px-4 sm:px-6";

/** Every gallery variation: each chart type's hero plus its example cards. */
export function chartExampleVariationCount(): number {
  return Object.entries(chartExamplesRegistry).reduce(
    (total, [slug, entry]) =>
      total + getChartExamples(slug, entry).length + (entry.hero ? 1 : 0),
    0
  );
}

export function ChartExamplesGrid({ chartSlug }: { chartSlug: string }) {
  const entry = chartExamplesRegistry[chartSlug];

  if (!entry) {
    return (
      <div className="py-24 text-center text-foreground-muted">
        Chart type not found.
      </div>
    );
  }

  const examples = getChartExamples(chartSlug, entry);
  const hero = entry.hero?.();
  const anchorIds = createChartGalleryAnchorIds([
    ...(hero ? [hero.title] : []),
    ...examples.map((example) => example.title),
  ]);
  const heroAnchorId = hero ? anchorIds[0] : undefined;
  const exampleAnchorIds = hero ? anchorIds.slice(1) : anchorIds;
  const anchors: ChartGalleryAnchor[] = [
    ...(hero && heroAnchorId
      ? [
          {
            featured: true,
            id: heroAnchorId,
            label: chartGalleryAnchorLabel(hero.title),
          },
        ]
      : []),
    ...examples.map((example, index) => ({
      id: exampleAnchorIds[index] ?? "",
      label: chartGalleryAnchorLabel(example.title),
    })),
  ];

  return (
    <section className="chart-playground relative w-full">
      <div
        className={cn(
          chartsPageContentClassName,
          "grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,4fr)] lg:gap-10"
        )}
      >
        <ChartGallerySidebar anchors={anchors} />

        <div className="flex min-w-0 flex-col gap-6 lg:gap-8">
          {entry.notice ? (
            <div className="rounded-xl border bg-background px-4 py-3 text-foreground-muted text-sm shadow-xs/5">
              {entry.notice}
            </div>
          ) : null}

          {hero ? (
            <FeaturedChartHero
              anchorId={heroAnchorId}
              chartSlug={chartSlug}
              code={hero.code}
              data={hero.data}
              description={hero.description}
              footer={hero.footer}
              previewLayout={entry.previewLayout}
              title={hero.title}
            >
              {hero.render()}
            </FeaturedChartHero>
          ) : null}

          {examples.map((example, index) => (
            <ChartExampleCard
              anchorId={exampleAnchorIds[index]}
              chartSlug={chartSlug}
              code={example.code}
              data={example.data}
              description={example.description}
              footer={example.footer}
              key={exampleAnchorIds[index]}
              previewLayout={example.previewLayout ?? entry.previewLayout}
              title={example.title}
            >
              {example.render()}
            </ChartExampleCard>
          ))}
        </div>
      </div>
    </section>
  );
}
