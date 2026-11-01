# Chart composition

Charts are composable: a root chart owns data, scales and hover state through React context, and everything else is a child that reads that context. Import paths below are relative to `@/components/charts/`; use the project's alias.

## Root and children

### Incorrect

```tsx
// Children outside the root have no chart context
<div className="h-80">
  <Line dataKey="users" />
  <XAxis />
</div>
```

### Correct

```tsx
import { ChartTooltip } from "@/components/charts/chart-tooltip/chart-tooltip";
import { Grid } from "@/components/charts/chart-grid/grid";
import { Line } from "@/components/charts/line-chart/line";
import { LineChart } from "@/components/charts/line-chart/line-chart";
import { XAxis } from "@/components/charts/chart-axis/x-axis";

<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="users" />
  <XAxis />
  <ChartTooltip />
</LineChart>
```

## Child order

`Grid` or `Background` → series → axes → overlays (`ReferenceArea`, `ProjectionLine`, `TrendLine`, `ChartMarkers`, segment parts) → `ChartTooltip`. Grid first so series paint above it.

## Which pieces go with which root

| Root | Series | X axis | Notes |
|---|---|---|---|
| `LineChart` | `Line` | `XAxis` | `XAxis`/`YAxis` need `chart-axis`, `ChartTooltip` needs `chart-tooltip` |
| `AreaChart` | `Area` | `XAxis` | same as line |
| `BarChart` | `Bar` | `BarXAxis` / `BarYAxis` | categorical band scale; `xDataKey` is the category key |
| `ComposedChart` | `SeriesBar`, `Line`, `Area` | `XAxis` | `SeriesBar` aligns bars to dates, **not** `Bar` |
| `ScatterChart` | `Scatter` | `XAxis` | colors default to `chart-1…5` in child order; `inactiveMode="blur"` blurs instead of dimming; `jitter` on the root spreads points that share a date; `formatXLabel` formats axis labels |
| `CandlestickChart` | `Candlestick` | `XAxis` | |
| `LiveLineChart` | `LiveLine` | `LiveXAxis`, `LiveYAxis` | never `Line` / `XAxis` |
| `PieChart` | `PieSlice` per item | none | `PieCenter` for a center stat |
| `RingChart` | `Ring` per item | none | `RingCenter` |
| `RadarChart` | `RadarArea` per item | none | `RadarGrid`, `RadarAxis`, `RadarLabels` |
| `HeatmapChart` | `HeatmapCells` | `HeatmapXAxis`, `HeatmapYAxis` | wrap in `HeatmapInteractionProvider`; `HeatmapLegend`, `HeatmapTooltip` |
| `SankeyChart` | `SankeyLink`, `SankeyNode` | none | `SankeyTooltip` |
| `ChoroplethChart` | `ChoroplethFeature` | none | `ChoroplethGraticule`, `ChoroplethTooltip` |
| `SunburstChart` | `SunburstSegment` per arc (`buildArcs`) | none | `SunburstCenter`, `SunburstBreadcrumb`, `SunburstLabels`, `SunburstHint` |
| `Gauge`, `FunnelChart` | standalone | none | configured by props |

Mixing line and bar? Use **one** `ComposedChart`, not two stacked roots.

## Data shapes

- **Line / area / scatter / composed:** an array of objects with a `Date` under `xDataKey` (default `"date"`) and a number for each `dataKey`.
- **Bar:** an array of objects; set `xDataKey` to the category field (`"month"`).
- **Candlestick:** `{ date, open, high, low, close }`.
- **Live line:** `data: { time: unixSeconds, value }[]` **and** `value` (latest value) on the root; `window` is in seconds. Append and trim (`prev.slice(-500)`) instead of rebuilding.
- **Pie:** `{ label, value, color? }[]`. **Ring / legend:** `{ label, value, maxValue?, color }[]`.
- **Radar:** `metrics: { key, label }[]` + `data: { label, color, values: Record<key, number> }[]`.
- **Funnel:** `{ label, value, displayValue? }[]`.
- **Sankey:** `{ nodes: { name, category? }[], links: { source, target, value }[] }` (indices).
- **Choropleth:** a GeoJSON `FeatureCollection` (e.g. `topojson.feature(...)`).
- **Heatmap:** columns `{ bin, bins: { bin, count, date }[] }[]` (one column per week).
- **Sunburst:** a tree `{ name, value?, children? }`.

When unsure, read the installed root component's `Props` interface; it is authoritative.

## Sizing

Cartesian roots (line, area, bar, composed, scatter, candlestick) default to `aspectRatio="2 / 1"`. In cards, set `aspectRatio` or give the parent a size (`className="h-60"`). Pie, ring and radar take `size`; `Gauge` fills its parent when `width`/`height` are omitted.

## Multi-series

One series child per `dataKey`. Tell them apart with `stroke`/`fill` set to `var(--color-chart-1)` … `var(--color-chart-5)` (see [theming.md](theming.md)). Add a legend (see [overlays.md](overlays.md)) when there are two or more series.

## Around the chart

Charts render only the plot. Put titles, range pickers and stats in UI components from the time2code-ui skill: a `Card` with `CardHeader`/`CardPanel`, `Tabs` or `ToggleGroup` for ranges, `Select` for the series. Mark chart components `"use client"`.
