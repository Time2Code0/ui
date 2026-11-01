# Tooltips

`ChartTooltip` (`@/components/charts/chart-tooltip/chart-tooltip`, item `chart-tooltip`) is a child of a cartesian root (`LineChart`, `AreaChart`, `BarChart`, `ComposedChart`, `ScatterChart`, `CandlestickChart`, `LiveLineChart`). It renders the crosshair, series dots, the date pill and the floating panel. Pie, ring, heatmap, sankey and choropleth have their own tooltips or center stats.

Line, area, bar, composed, scatter and candlestick charts don't install it; run `npx time2code add chart-tooltip`.

## Default

```tsx
<LineChart data={data}>
  <Line dataKey="users" />
  <XAxis />
  <ChartTooltip />
</LineChart>
```

## Props (from `chart-tooltip/chart-tooltip.tsx`)

| Prop | Type | Notes |
|---|---|---|
| `showCrosshair` | `boolean` | off by default inside `BarChart` and in a `ScatterChart` with `jitter` |
| `showDots` | `boolean` | |
| `showDatePill` | `boolean` | set `false` for categorical or live charts |
| `dateLabels` | `string[]` | labels for the date pill instead of the formatted dates |
| `content` | `({ point, index }) => ReactNode` | replaces the built-in rows |
| `rows` | `(point) => { color, label, value }[]` | custom rows in the built-in panel |
| `indicatorColor` | `string \| (point) => string` | crosshair color |
| `indicatorDasharray` | `string` (e.g. `"4,4"`) | dashed crosshair |
| `indicatorFadeEdges`, `indicatorFadeLength` | | fade the crosshair ends |
| `dotVariant` | `"dot" \| "ring"` | |
| `dotSize`, `dotScale`, `dotStrokeWidth`, `dotRadiusFraction`, `dotHaloOpacity`, `dotHaloScale` | `number` | dot tuning |
| `dotColor` | `string \| (point, line) => string` | defaults to the series stroke |
| `matchCrosshair` | `boolean` | |
| `damping`, `springConfig`, `boxSpringConfig` | | motion; `damping={0}` is instant |
| `exit` | `boolean` | fade out on leave |
| `backgroundColor`, `panelStyle`, `className` | | panel styling |
| `children` | `ReactNode` | rendered below the rows (e.g. marker content) |

Check the installed file for defaults.

## Custom rows (keeps the built-in panel)

```tsx
<ChartTooltip
  rows={(point) => [
    { color: "var(--color-chart-1)", label: "Revenue", value: `$${point.revenue}` },
    { color: "var(--color-chart-2)", label: "Costs", value: `$${point.costs}` },
  ]}
/>
```

## Custom content

`content` receives **only** `{ point, index }`; format the date yourself.

### Incorrect

```tsx
<ChartTooltip content={({ point, formattedDate }) => <div>{formattedDate}</div>} />
```

### Correct

```tsx
<ChartTooltip
  content={({ point }) => (
    <div className="rounded-lg border bg-background px-3 py-2 text-foreground text-sm">
      <div className="font-medium">{(point.date as Date).toLocaleDateString()}</div>
      <div className="text-foreground-muted">{point.users as number} users</div>
    </div>
  )}
/>
```

## Dynamic crosshair color

```tsx
<ChartTooltip
  indicatorColor={(point) =>
    (point.close as number) >= (point.open as number)
      ? "var(--color-success-foreground)"
      : "var(--color-destructive-foreground)"
  }
  showDots={false}
/>
```

## Custom indicators

Read hover state from `useChart()` inside the root; don't track the mouse globally.

### Incorrect

```tsx
useEffect(() => {
  window.addEventListener("mousemove", onMove);
}, []);
```

### Correct

```tsx
import { chartCssVars, useChart } from "@/components/charts/chart-core/chart-context";

function CustomIndicator() {
  const { tooltipData, innerHeight } = useChart();
  if (!tooltipData) return null;
  return <rect fill={chartCssVars.crosshair} height={innerHeight} width={2} x={tooltipData.x - 1} />;
}
```

`tooltipData` is `{ point, index, x, yPositions, xPositions? } | null`. Check the installed `chart-core/chart-context.tsx` for the full context value.

Docs: https://ui.time2code.dev/docs/charts/utility/tooltip · https://ui.time2code.dev/docs/charts/utility/custom-indicator · https://ui.time2code.dev/docs/charts/utility/use-chart
