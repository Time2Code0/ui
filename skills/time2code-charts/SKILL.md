---
name: time2code-charts
description: Install, compose, theme and animate time2code/ui charts (d3 + motion React components in @/components/charts). Use when the user wants a chart, graph or data visualization (line, area, bar, live/streaming line, composed, scatter, candlestick/OHLC, pie, ring/donut, radar, gauge, heatmap, funnel, sankey, sunburst or choropleth/world map), a sparkline for tables, KPI or stat cards, a dashboard or analytics page, or chart tooltips, crosshairs, legends, markers, reference areas, bands, projections, trend lines, brushes, axes or grids, or when code imports from @/components/charts. Use together with the time2code-ui skill, which covers installation, styling and the UI components.
---

# time2code/ui charts

Composable React chart components built on d3 and motion, distributed through the time2code/ui registry. `time2code add` copies the **source** into the project, so the installed files are the source of truth for props.

This skill covers charts only. For the CLI, color tokens, dark mode and the UI components (cards, tabs, selects around a chart), use the **time2code-ui** skill. For complete chart examples, use **time2code-particles** ([references/charts.md](../time2code-particles/references/charts.md)).

## Principles

1. **Install before inventing.** `npx time2code add <item>`. Never hand-roll SVG charts or reimplement a registry piece.
2. **Import from the installed files.** Each item is a directory under `components/charts/`; import each export from the file that defines it (`@/components/charts/line-chart/line-chart`). There are no barrels and no default exports.
3. **Read the installed source.** After `add`, open the files in `components/charts/<item>/` to confirm prop names and defaults.
4. **Compose, don't flatten.** Root chart → `Grid`/`Background` → series → axes → overlays → `ChartTooltip`. See [composition.md](references/composition.md).
5. **Theme with tokens.** `--color-chart-1` … `--color-chart-5`, the base tokens and `chartCssVars`, not hex values. See [theming.md](references/theming.md).

## Installation

```bash
npx time2code add line-chart chart-axis chart-tooltip
```

- Install the chart, then the add-ons you compose into it. **Line, area, composed, scatter and candlestick charts don't include `chart-axis` (`XAxis`, `YAxis`) or `chart-tooltip`**; add them. Bar charts include their own axes (`BarXAxis`, `BarYAxis`) but not `chart-tooltip`.
- The CLI resolves the shared internals (`chart-core`, `chart-utils`, `time-series-chart`, …) and npm dependencies (`d3-*`, `motion`, `@number-flow/react`). Don't install or pin those by hand.
- Files land in `components/charts/<item>/` (under `src/` when the alias points there).
- The chart palette (`chart-1` … `chart-5`) comes with `chart-theme`, which every chart pulls in. It adds the tokens without overwriting existing ones.
- With the shadcn CLI: `npx shadcn@latest add @time2code/line-chart` (see the time2code-ui skill for the namespace setup).

## Imports

Paths are relative to `@/components/charts/`:

| Import from | Exports |
|---|---|
| `line-chart/line-chart` · `line-chart/line` | `LineChart` · `Line` |
| `line-chart/profit-loss-line` · `line-chart/projection-line` · `line-chart/line-series-terminal-marker` | `ProfitLossLine` · `ProjectionLine` · `LineSeriesTerminalMarker` |
| `area-chart/area-chart` · `area-chart/area` | `AreaChart` · `Area` |
| `bar-chart/bar-chart` · `bar-chart/bar` · `bar-chart/bar-x-axis` · `bar-chart/bar-y-axis` | `BarChart` · `Bar` · `BarXAxis` · `BarYAxis` |
| `bar-chart/bar-depth` | `BarDepthProvider`, `BarDepthBack`, `BarDepthFront` (3D bars) |
| `sparkline/sparkline` | `LineSparkline`, `AreaSparkline`, `BarSparkline`, `useSparklineHover` |
| `composed-chart/composed-chart` · `composed-chart/series-bar` | `ComposedChart` · `SeriesBar` (+ `Line`, `Area` from their charts) |
| `scatter-chart/scatter-chart` · `scatter-chart/scatter` | `ScatterChart` · `Scatter` |
| `candlestick-chart/candlestick-chart` · `candlestick-chart/candlestick` · `candlestick-chart/bollinger` | `CandlestickChart` · `Candlestick` · `withBollingerBands` |
| `live-line-chart/live-line-chart`, `live-line`, `live-x-axis`, `live-y-axis` | `LiveLineChart`, `LiveLine`, `LiveXAxis`, `LiveYAxis` |
| `pie-chart/pie-chart`, `pie-slice`, `pie-center` | `PieChart`, `PieSlice`, `PieCenter` |
| `ring-chart/ring-chart`, `ring`, `ring-center` | `RingChart`, `Ring`, `RingCenter` |
| `radar-chart/radar-chart`, `radar-grid`, `radar-axis`, `radar-labels`, `radar-area` | one component each |
| `gauge-chart/gauge` | `Gauge` |
| `funnel-chart/funnel-chart` | `FunnelChart` |
| `heatmap-chart/heatmap-chart`, `heatmap-cells`, `heatmap-x-axis`, `heatmap-y-axis`, `heatmap-legend`, `heatmap-tooltip`, `heatmap-context` | heatmap parts (`HeatmapInteractionProvider`, `HeatmapInteractionBoundary` from `heatmap-context`) |
| `sankey-chart/sankey-chart`, `sankey-link`, `sankey-node`, `sankey-tooltip` | sankey parts |
| `sunburst-chart/sunburst-chart`, `sunburst-segment`, `sunburst-center`, `sunburst-breadcrumb`, `sunburst-labels`, `sunburst-hint`, `sunburst` (`buildArcs`) | sunburst parts |
| `choropleth-chart/choropleth-chart`, `choropleth-feature`, `choropleth-graticule`, `choropleth-tooltip` | choropleth parts |
| `chart-axis/x-axis` · `chart-axis/y-axis` | `XAxis` · `YAxis` |
| `chart-grid/grid` · `chart-background/background` | `Grid` · `Background` |
| `chart-tooltip/chart-tooltip` | `ChartTooltip` |
| `chart-legend/legend` · `chart-legend/chart-legend` | `Legend`, `LegendItem`, `LegendLabel`, `LegendMarker`, `LegendValue`, `LegendProgress` · `ChartLegend` |
| `chart-markers/chart-markers` · `chart-markers/marker-group` | `ChartMarkers`, `MarkerTooltipContent`, `useActiveMarkers` · `ChartMarker` (type) |
| `chart-reference-area/reference-area` · `chart-trend-line/trend-line` · `chart-band/band` | `ReferenceArea` · `TrendLine` · `Band` |
| `chart-date-highlights/weekends` · `chart-date-highlights/deadline` | `Weekends` · `Deadline` |
| `chart-brush/chart-brush` · `chart-brush/chart-brush-layout` | `ChartBrush` · `ChartBrushLayout` |
| `chart-segment/segment` | `SegmentBackground`, `SegmentLineFrom`, `SegmentLineTo` |
| `chart-gradients/gradients` · `chart-center/chart-stat-flow` | `LinearGradient`, `RadialGradient` · `ChartStatFlow` |
| `chart-core/chart-context` | `chartCssVars`, `useChart`, `TooltipData` |
| `time-series-chart/projection-utils` | `buildProjectionPath` |

```tsx
import { ChartTooltip } from "@/components/charts/chart-tooltip/chart-tooltip";
import { Grid } from "@/components/charts/chart-grid/grid";
import { Line } from "@/components/charts/line-chart/line";
import { LineChart } from "@/components/charts/line-chart/line-chart";
import { XAxis } from "@/components/charts/chart-axis/x-axis";
```

## Critical rules

### Composition → [composition.md](references/composition.md)
- Series, axes, overlays and `ChartTooltip` are **children of the root chart**; they read chart context.
- **One root per chart.** Mixed bars and lines on dates → `ComposedChart` with `SeriesBar` (not `Bar`).
- **`Grid` (or `Background`) first** so series paint above it.
- Live charts use **`LiveLine`**, `LiveXAxis`, `LiveYAxis`, not `Line`/`XAxis`.
- `BarChart` uses **`BarXAxis`** / `BarYAxis` (band scale), not `XAxis`.

### Theming → [theming.md](references/theming.md)
- `var(--color-chart-1)` … `var(--color-chart-5)` for series; `chartCssVars.linePrimary` etc. for roles. Everything else (grid, labels, tooltip, crosshair) uses the base tokens.
- No `dark:` classes on chart SVG; the tokens switch with the mode.

### Tooltips → [tooltips.md](references/tooltips.md)
- `ChartTooltip` `content` receives `({ point, index })`; `rows` returns `{ color, label, value }[]`.
- Custom crosshairs and indicators use `useChart()`, never global mouse listeners.

### Sparklines (`sparkline`)
- `LineSparkline` / `AreaSparkline` / `BarSparkline` are **single elements**: `data` + `dataKey`, no children. Don't build sparklines from `LineChart` with hidden axes.
- Omit `width` to fill the parent; `height` defaults to 32. `color` (default `var(--color-chart-1)`), `curve`, `strokeWidth`, `endDot`; area `fill="gradient" | "solid"` + `fillOpacity`; bar `barGap`, `barRadius`.
- **No tooltip by design.** `const hover = useSparklineHover<Row>()`, spread `hover.sparklineProps` (on several sparklines to sync their crosshairs), and render `hover.datum ?? latest` yourself. `crosshair` (`"dashed"` default, `"solid"`, `"gradient"`, `false`), `dot`, `interactive={false}`, `hoverTransition={false}` to snap, `springConfig` to tune, `dataTransitionDuration` (500ms) for data changes.
- Enter animation is on (`animate`, 900ms) and falls back to a fade under reduced motion.

### Overlays → [overlays.md](references/overlays.md)
- `ChartMarkers` is a **sibling** of `ChartTooltip`; marker hover content goes inside `ChartTooltip` children.
- `TrendLine` fits an existing series' `dataKey`; place it after that series.
- Brush zoom: `ChartBrushLayout` + `ChartBrush` from `chart-brush`.

### Animation and loading → [animation.md](references/animation.md), [loading.md](references/loading.md)
- Default enter: **1100ms**, ease `cubic-bezier(0.85, 0, 0.15, 1)`; bars stagger across ~40% of that.
- Replay with `revealSignature` or a new `key`. Don't change `revealSignature` for data updates; data changes morph on their own.
- `status="loading"` on `LineChart` / `AreaChart` / `BarChart` / `HeatmapChart`: one instance, no component swap.
- Reduced motion is only **partially** handled; see animation.md.

## Catalog

Install with `npx time2code add <item>`. For any chart:

- Docs: `https://ui.time2code.dev/docs/charts/<item>` (add-ons under `/docs/charts/utility/…`); append `.md` for Markdown.
- Gallery: `https://ui.time2code.dev/charts/<item>`.
- Registry JSON: `https://ui.time2code.dev/r/<item>.json`.
- Examples: the `p-<item>-<n>` particles in [time2code-particles](../time2code-particles/references/charts.md).

### Charts

| Item | Use when |
|---|---|
| `line-chart` | Time series, multi-line trends, markers, dashed tails, projections, profit/loss lines |
| `area-chart` | Trends with filled regions, gradient/pattern fills |
| `sparkline` | Tiny inline line/area/bar trends for table cells, KPI and stat cards, dense grids; no axes, grid or tooltip |
| `bar-chart` | Category comparisons: grouped, stacked, horizontal, square-column and 3D bars |
| `composed-chart` | Bars plus lines/areas on one date axis, dual Y axes |
| `live-line-chart` | Streaming values (`{ time: unixSeconds, value }`) |
| `scatter-chart` | Point clouds over time, multiple series |
| `candlestick-chart` | OHLC financial data, Bollinger bands |
| `pie-chart` | Part-to-whole slices, optional center stat |
| `ring-chart` | Concentric progress rings / donut KPIs |
| `radar-chart` | Multi-metric comparison across entities |
| `gauge-chart` | Single value 0–100, arc or linear notched track |
| `heatmap-chart` | Calendar / contribution grids, binned intensity |
| `funnel-chart` | Stage-to-stage conversion |
| `sankey-chart` | Flows between nodes |
| `sunburst-chart` | Hierarchical part-to-whole with drill-down |
| `choropleth-chart` | Geo regions colored by value (world/country maps) |

`ProfitLossLine` (one series crossing zero, colored by sign) is part of `line-chart`.

### Add-ons

| Item | What |
|---|---|
| `chart-axis` | `XAxis`, `YAxis` for line, area, composed, scatter and candlestick charts |
| `chart-tooltip` | `ChartTooltip`: crosshair, dots, date pill, panel |
| `chart-grid` | `Grid` (included with line, area and composed) |
| `chart-legend` | `Legend` parts and `ChartLegend` (included with line and composed) |
| `chart-background` | Textured plot fill instead of or with `Grid` |
| `chart-markers` | Event callouts on a time axis |
| `chart-reference-area` | Horizontal band between two Y values (included with bar) |
| `chart-trend-line` | Least-squares trend overlay for line, area, bar and composed charts |
| `chart-band` | Range / confidence / Bollinger band on line, area and composed charts |
| `chart-date-highlights` | `Weekends` shading and `Deadline` markers on date axes |
| `chart-brush` | Time-range brush with a mini-chart strip for zooming line and area charts |
| `chart-segment` | Click-drag range selection on line and area charts (`SegmentBackground`, `SegmentLineFrom`, `SegmentLineTo`; read it with `useChart`) |
| `chart-gradients` | `LinearGradient`, `RadialGradient` SVG defs |
| `chart-patterns` | Pattern presets used by fills, backgrounds and bands (installed with the items that use it) |

Internal items (`chart-core`, `chart-utils`, `chart-theme`, `chart-loading`, `chart-center`, `chart-series`, `chart-series-markers`, `series-bar-layout`, `time-series-chart`, `time-series-data`) come in automatically.

## Workflow

1. Pick the chart by the story the data tells; ask if unclear.
2. Find a matching particle in [time2code-particles](../time2code-particles/references/charts.md) and read it.
3. Install the chart and its add-ons: `npx time2code add <item> chart-axis chart-tooltip …`.
4. **Read the installed source** in `components/charts/<item>/`: exports, prop names, defaults, data shape. Prefer it over memory or docs if they disagree.
5. Compose root → grid → series → axes → overlays → tooltip; import each part from its file.
6. Theme with tokens; check light and dark.
7. Put the chart in UI components from the time2code-ui skill (a `Card`, `Tabs` for ranges, a `Select` for series).

## Quick reference

```tsx
"use client";

import { ChartTooltip } from "@/components/charts/chart-tooltip/chart-tooltip";
import { Grid } from "@/components/charts/chart-grid/grid";
import { Line } from "@/components/charts/line-chart/line";
import { LineChart } from "@/components/charts/line-chart/line-chart";
import { XAxis } from "@/components/charts/chart-axis/x-axis";

const data = [
  { date: new Date("2025-01-01"), users: 1200, sessions: 1800 },
  { date: new Date("2025-02-01"), users: 1350, sessions: 1950 },
];

export function UsersChart() {
  return (
    <LineChart data={data}>
      <Grid horizontal />
      <Line dataKey="users" stroke="var(--color-chart-1)" />
      <Line dataKey="sessions" stroke="var(--color-chart-2)" />
      <XAxis />
      <ChartTooltip />
    </LineChart>
  );
}
```

## References

- [composition.md](references/composition.md): structure, data shapes, sizing, multi-series
- [theming.md](references/theming.md): tokens, `chartCssVars`, dark mode
- [tooltips.md](references/tooltips.md): `ChartTooltip` props, custom content, `useChart`
- [overlays.md](references/overlays.md): legend, markers, reference area, projection, band, trend line, weekends, deadline, background, brush
- [animation.md](references/animation.md): enter timing, replay, live charts, reduced motion
- [loading.md](references/loading.md): `status`, skeletons, loading labels

## Related skills

- **time2code-ui**: installation, the CLI, color tokens, dark mode and the UI components. The primary skill for time2code/ui.
- **time2code-particles**: index of every particle, including 300+ chart examples.
