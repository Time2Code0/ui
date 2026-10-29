/** Sequential Less → More scale: an empty tone, then `--color-chart-1` faded into the background. */
export const CHART_SCALE_VARS = [
  "var(--color-accent)",
  "color-mix(in oklab, var(--color-chart-1) 35%, var(--color-background))",
  "color-mix(in oklab, var(--color-chart-1) 55%, var(--color-background))",
  "color-mix(in oklab, var(--color-chart-1) 78%, var(--color-background))",
  "var(--color-chart-1)",
] as const;

export type ChartScaleVars = typeof CHART_SCALE_VARS;

export const chartScaleCssVars = {
  patternColor: "var(--color-background)",
  scale01: CHART_SCALE_VARS[0],
  scale02: CHART_SCALE_VARS[1],
  scale03: CHART_SCALE_VARS[2],
  scale04: CHART_SCALE_VARS[3],
  scale05: CHART_SCALE_VARS[4],
} as const;
