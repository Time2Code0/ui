# Theming

Charts read time2code/ui's color tokens (see the styling rules in the time2code-ui skill). There are no chart-specific tokens besides the series palette.

## Tokens

- **Series palette:** `--color-chart-1` … `--color-chart-5`, as `var(--color-chart-1)` in props or `text-chart-1`/`fill-chart-1` classes. `chart-1` is the default for single-series charts, and `chart-5` is black in light mode and white in dark mode.
- **Everything else uses the base tokens:** grid lines, tracks and borders are `foreground` at 10% (`color-mix(in oklab, var(--color-foreground) 10%, transparent)`), labels are `foreground-muted`, the crosshair is `foreground`, the tooltip panel is `background`.
- **Up / down:** `ProfitLossLine` uses `var(--color-success-foreground)` and `var(--color-destructive-foreground)`. Use the same tokens for positive/negative values in candlesticks, scatter colors and tooltip text.
- **Intensity scales (heatmap, choropleth):** `CHART_SCALE_VARS` / `chartScaleCssVars` from `chart-utils/color-scale`, five steps from `accent` to `chart-1`.

## Where the palette comes from

`chart-theme` (installed with every chart) adds `chart-1` … `chart-5` to the project's stylesheet without overwriting existing values:

- Installed with the CLI, the values sit in `:root` / `.dark` as `--chart-1` … `--chart-5`, mapped to `--color-chart-1` … in `@theme inline`.
- Projects from `npx time2code create` define `--color-chart-1` … in `@theme`, with dark overrides in `.dark`.

To change the palette, edit the value where the project defines it. Always reference `var(--color-chart-N)` in components, never `var(--chart-N)`.

## Use `chartCssVars`

`chartCssVars` (from `@/components/charts/chart-core/chart-context`) gives typed CSS values for chart roles.

### Incorrect

```tsx
<line stroke="var(--chart-crosshair)" />   {/* undefined token, renders black */}
<Line dataKey="users" stroke="#3b82f6" />  {/* ignores the theme and dark mode */}
```

### Correct

```tsx
import { chartCssVars } from "@/components/charts/chart-core/chart-context";

<line stroke={chartCssVars.crosshair} />
<Line dataKey="users" stroke={chartCssVars.linePrimary} />
```

Keys: `background`, `foreground`, `foregroundMuted`, `label`, `linePrimary` (`chart-1`), `lineSecondary` (`chart-2`), `crosshair`, `grid`, `indicatorColor`, `markerBackground`, `markerBorder`, `markerForeground`, `badgeBackground`, `badgeForeground`, `segmentBackground`, `segmentLine`, `brushBorder`, `tooltipBackground`.

Pie, ring, radar, sankey, sunburst and choropleth have their own objects (`pieCssVars`, `ringCssVars`, `radarCssVars`, …) in their context files, built from the same tokens. The legend uses `legendCssVars` from `chart-legend/legend`.

Use hex or oklch literals only for explicit brand colors, and prefer adding them as tokens.

## Dark mode

The tokens switch with the `.dark` class. Don't put `dark:` classes on chart SVG elements; if a color must differ in dark mode, make it a token with a `.dark` value.

## Tooltip and custom content surfaces

The tooltip panel uses `bg-background` with a border and shadow. For custom `content`, use the same tokens (`bg-background text-foreground`, `text-foreground-muted` for secondary text) so it matches the rest of the UI.
