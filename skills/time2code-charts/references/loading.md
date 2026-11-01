# Loading states

## One chart, driven by `status`

`LineChart`, `AreaChart`, `BarChart` and `HeatmapChart` take `status: "loading" | "ready"` (default `"ready"`). While loading, the chart plots generated skeleton data; when it flips to `"ready"` it choreographs the hand-off (pulse exits → label fades → y-domain tween → clip reveal).

### Incorrect

```tsx
// Swapping components loses the hand-off animation and causes a layout jump
{isLoading ? <Skeleton className="h-64" /> : <LineChart data={data}>…</LineChart>}
```

### Correct

```tsx
<LineChart data={data ?? []} loadingLabel="Loading revenue" status={isLoading ? "loading" : "ready"}>
  <Grid horizontal shimmer />
  <Line dataKey="revenue" loadingStyle="pulse" />
  <XAxis />
  <ChartTooltip />
</LineChart>
```

- `loadingLabel` (line, area, heatmap; `""` hides it) renders a centered shimmer label. `BarChart` has no label prop.
- `Line`: `loadingStyle: "pulse" | "sweep"`, `loadingStroke`, `loadingStrokeOpacity`, `loading={false}` to opt out. `Area`: `loading`, `loadingPulseMode`.
- `Grid`: `shimmer`, `shimmerStroke`, `shimmerLength`, `shimmerSpeed`, `loadingStroke`.
- `BarChart status="loading"` needs no data or children; it renders a bar skeleton.

## Placeholders without a chart

When there is no chart yet (e.g. a route-level `loading.tsx`), use the components installed with each chart: `LineChartLoading` (`line-chart/line-chart-loading`), `AreaChartLoading` (`area-chart/area-chart-loading`), `BarChartLoading` (`bar-chart/bar-chart-loading`), `HeatmapChartLoading` (`heatmap-chart/heatmap-chart-loading`). Prefer the `status` prop when the real chart is already mounted.

## Other charts

Pie, ring, radar, gauge, funnel, sankey, sunburst, choropleth, scatter, candlestick, composed, live line and sparklines have no `status` prop. Render a `Skeleton` (time2code-ui) of the same size, or delay mounting until data arrives (their enter animation then plays).
