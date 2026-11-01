# Overlays and add-ons

Install each with `npx time2code add <item>`, then read the installed file for the full prop list. All cartesian overlays are **children of the root chart**. Paths are relative to `@/components/charts/`.

## Legend: `chart-legend`

Standalone (outside the chart). Composable: define one item layout and it maps over `items` (`{ label, value, maxValue?, color }[]`).

```tsx
import {
  Legend,
  LegendItem,
  LegendLabel,
  LegendMarker,
  LegendValue,
} from "@/components/charts/chart-legend/legend";

const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

<RingChart data={data} hoveredIndex={hoveredIndex} onHoverChange={setHoveredIndex}>…</RingChart>
<Legend hoveredIndex={hoveredIndex} items={data} onHoverChange={setHoveredIndex}>
  <LegendItem className="flex items-center gap-3">
    <LegendMarker />
    <LegendLabel className="flex-1" />
    <LegendValue />
  </LegendItem>
</Legend>
```

`LegendProgress` adds a bar against `maxValue`. `ChartLegend` (`chart-legend/chart-legend`) is a simpler, non-composable legend for series names.

## Markers: `chart-markers`

Event callouts on a time axis. `ChartMarkers` is a **sibling** of `ChartTooltip`, not a child of it; the hover content for markers goes **inside** `ChartTooltip`.

### Incorrect

```tsx
<ChartTooltip>
  <ChartMarkers items={markers} />
</ChartTooltip>
```

### Correct

```tsx
import {
  ChartMarkers,
  MarkerTooltipContent,
  useActiveMarkers,
} from "@/components/charts/chart-markers/chart-markers";
import type { ChartMarker } from "@/components/charts/chart-markers/marker-group";

const markers: ChartMarker[] = [
  { date: new Date("2025-01-05"), icon: "🚀", title: "v1.2.0", description: "New animations" },
];

<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="users" />
  <ChartMarkers items={markers} />
  <XAxis />
  <ChartTooltip>
    <ActiveMarkers markers={markers} />
  </ChartTooltip>
</LineChart>

// MarkerTooltipContent renders whatever it is given, so filter to the hovered date first
function ActiveMarkers({ markers }: { markers: ChartMarker[] }) {
  const active = useActiveMarkers(markers);
  return active.length ? <MarkerTooltipContent markers={active} /> : null;
}
```

## Reference area: `chart-reference-area`

Horizontal band between two Y values (target range, threshold). Renders behind series.

```tsx
<ReferenceArea showMarkers strokeStyle="dashed" y1={160} y2={220} />
```

Omit `y1`/`y2` to extend to the plot edge. Also: `x1`/`x2`, `fill`, `fillOpacity`, `pattern`, `axisLabelColor` (tints Y ticks inside the band), `yAxisId`. Works in line, area, bar, scatter, candlestick, composed and live charts.

## Projection line (in `line-chart`)

Dashed forecast from the last data row into the future. Build the path with `buildProjectionPath` (`mode: "auto" | "target" | "manual"`) from `time-series-chart/projection-utils`.

```tsx
import { LineSeriesTerminalMarker } from "@/components/charts/line-chart/line-series-terminal-marker";
import { ProjectionLine } from "@/components/charts/line-chart/projection-line";
import { buildProjectionPath } from "@/components/charts/time-series-chart/projection-utils";

const path = buildProjectionPath({ endValue: 301, horizonPoints: 6, mode: "target", seriesKey: "value", sourceData: data });

<LineChart data={data}>
  <Line dataKey="value" />
  <LineSeriesTerminalMarker dataKey="value" />
  <ProjectionLine data={path} showEndMarker strokeDasharray="1,4" />
  <XAxis />
</LineChart>
```

For a dashed tail on **existing** data (an incomplete period), use `Line` `dashFromIndex` instead. Projection and brush zoom don't work together.

## Band: `chart-band`

Shaded range between two per-row keys (min/max, confidence interval, Bollinger) inside `LineChart`, `AreaChart` or `ComposedChart`. Place it **before** the series. It reveals and morphs with the lines and extends the y-domain; `ChartTooltip` adds a `low – high` row (`label`) unless `showInTooltip={false}`. `null` edge values become gaps.

```tsx
<LineChart data={data}> {/* rows: { date, value, valueUpper, valueLower } */}
  <Grid horizontal />
  <Band lowerKey="valueLower" upperKey="valueUpper" />
  <Line dataKey="value" />
  <XAxis />
</LineChart>
```

- **Range area chart:** a `Band` with no `Line`; the y-axis fits the band.
- **Range plus line:** one `Band` per series with the same `fill` as its `Line` (`strokeWidth={0}` drops the edges).
- Props: `fill` (default `var(--color-chart-1)`), `fillType` (`"solid" | "gradient" | "pattern"`), `fillOpacity`, `pattern`, `stroke`, `strokeWidth`, `strokeDasharray`, `upperStroke` / `lowerStroke` (`false` hides one), `fadeEdges`, `curve`, `yAxisId`, `label`, `showInTooltip`.

Bollinger: `withBollingerBands(data, { dataKey: "price", period: 20, multiplier: 2 })` from `candlestick-chart/bollinger` adds `priceUpper` / `priceLower` / `priceSma` (`null` during warm-up). Draw the SMA as a zero-height band (`<Band fillOpacity={0} lowerKey="priceSma" lowerStroke={false} strokeDasharray="4,4" upperKey="priceSma" />`); `Line` doesn't skip `null`s.

## Weekends and deadlines: `chart-date-highlights`

`Weekends` shades weekend spans on date x axes (stripes or solid), behind the series. Works in line, area, composed and candlestick charts, and in `BarChart` with `Date` or `"YYYY-MM-DD"` rows (`dateKey` picks the field).

```tsx
<Weekends />                                      {/* Sat + Sun, muted stripes */}
<Weekends fillType="solid" weekendDays={[5, 6]} />
```

`Deadline` marks a due date: a vertical line at `date` plus a fading region to the right (to `endDate` or the plot edge).

```tsx
<Deadline date={new Date(2026, 9, 15)} label="Due Oct 15" />
<Deadline date={due} fadeLength={0.8} fillType="gradient" />
```

## Trend line: `chart-trend-line`

Linear least-squares fit of an existing series, from the first to the last row. Works inside `LineChart`, `AreaChart`, `BarChart` (vertical and horizontal) and `ComposedChart`. It is an overlay, not a series: it doesn't add a bar slot or drive the y-domain. Place it **after** the series it fits.

```tsx
import { TrendLine } from "@/components/charts/chart-trend-line/trend-line";

<BarChart data={data} xDataKey="month">
  <Bar dataKey="revenue" />
  <BarXAxis />
  <TrendLine dataKey="revenue" fadeEdges strokeStyle="gradient" />
</BarChart>
```

`strokeStyle` is `"dashed"` (default), `"solid"` or `"gradient"`; also `stroke`, `strokeWidth`, `fadeEdges`, `animate`, `yAxisId`. It needs at least two numeric points.

## Background: `chart-background`

Textured plot fill instead of (or with) `Grid`: `<Background pattern="diagonal" />`. Presets: `none`, `diagonal`, `horizontal`, `vertical`, `cross`, `dots`, `circles`, `accent`. Edge fades are on by default (`fadeHorizontal`, `fadeVertical`).

## Axes: `chart-axis`

`XAxis` and `YAxis` for line, area, composed, scatter and candlestick charts. None of those charts install `chart-axis`; add it. Dual scales: give series `yAxisId` and render one `YAxis` per id (widen `margin.left`/`margin.right` so labels fit). Bar charts use `BarXAxis` / `BarYAxis` from `bar-chart`.

## Grid: `chart-grid`

`<Grid horizontal />` (also `vertical`, `numTicksRows`, `strokeDasharray`). Highlight a baseline with `highlightRowValues={[0]}`. `shimmer` animates it while loading. Included with line, area and composed charts.

## Brush: `chart-brush`

Time-range zoom for line and area charts: `ChartBrushLayout` renders the main chart and a mini-chart strip, and `ChartBrush` inside the strip drives the selection.

```tsx
import { ChartBrush } from "@/components/charts/chart-brush/chart-brush";
import { ChartBrushLayout } from "@/components/charts/chart-brush/chart-brush-layout";

<ChartBrushLayout
  brushStrip={(layout) => (
    <AreaChart animationDuration={0} data={data} style={{ aspectRatio: "unset", height: "100%" }}>
      <Area animate={false} dataKey="value" fillOpacity={0.15} showHighlight={false} />
      <ChartBrush
        initialSelection={layout.brushSelection ?? undefined}
        onSelectionChange={layout.onBrushSelectionChange}
      />
    </AreaChart>
  )}
  data={data}
  enabled
  height={72}
>
  {(layout) => (
    <AreaChart
      data={data}
      tweenYDomainOnXDomainChange
      xDomain={layout.xDomain}
      xDomainSlotCount={layout.xDomainSlotCount}
    >
      <Grid horizontal />
      <Area dataKey="value" />
      <XAxis />
      <ChartTooltip />
    </AreaChart>
  )}
</ChartBrushLayout>
```

The brush is x-only. See `p-area-chart-23`.

## Segment selection: `chart-segment`

Click-drag range selection on line and area charts. Add any of `SegmentBackground`, `SegmentLineFrom`, `SegmentLineTo` (boundary lines take `variant="dashed" | "solid" | "gradient"`); the series highlights the selected part. Read the selection with `useChart()` inside the chart.

## Profit / loss, 3D bars, stat numbers

- `ProfitLossLine` (in `line-chart`): inside `LineChart`, paired with a transparent `Line` for the same `dataKey`; add `Grid highlightRowValues={[0]}` for the baseline.
- 3D bars (in `bar-chart`): `BarDepthProvider`, `BarDepthBack`, `BarDepthFront` from `bar-chart/bar-depth`.
- `ChartStatFlow` (`chart-center/chart-stat-flow`): animated number for chart centers and stat cards.
