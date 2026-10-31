export type ChartSlug = (typeof chartTypes)[number]["slug"];

export const isChartSlug = (slug: string): slug is ChartSlug =>
  chartTypes.some((chart) => chart.slug === slug);

/**
 * Registry category of a page's particles. Utilities are prefixed so their
 * particles (`p-chart-tooltip-1`, …) don't clash with the ui particles.
 */
export function getChartParticleCategory(slug: ChartSlug) {
  const chart = chartTypes.find((type) => type.slug === slug);
  return chart && "group" in chart ? `chart-${slug}` : slug;
}

export const chartTypes = [
  { label: "Area Chart", slug: "area-chart" },
  { label: "Bar Chart", slug: "bar-chart" },
  { label: "Candlestick Chart", slug: "candlestick-chart" },
  { label: "Choropleth Chart", slug: "choropleth-chart" },
  { label: "Composed Chart", slug: "composed-chart" },
  { label: "Funnel Chart", slug: "funnel-chart" },
  { label: "Gauge", slug: "gauge-chart" },
  { label: "Heatmap Chart", slug: "heatmap-chart" },
  { label: "Line Chart", slug: "line-chart" },
  { label: "Live Line Chart", slug: "live-line-chart" },
  { label: "Pie Chart", slug: "pie-chart" },
  { label: "Radar Chart", slug: "radar-chart" },
  { label: "Ring Chart", slug: "ring-chart" },
  { label: "Scatter Chart", slug: "scatter-chart" },
  {
    label: "Sankey Chart",
    notice:
      "The Sankey chart is in pre-alpha and is being actively developed. APIs may change.",
    slug: "sankey-chart",
  },
  { label: "Sparkline", slug: "sparkline" },
  { label: "Sunburst Chart", slug: "sunburst-chart" },
  // Utilities (docs demos only)
  { group: "utility", label: "Axis", slug: "axis" },
  { group: "utility", label: "Background", slug: "background" },
  { group: "utility", label: "Band", slug: "band" },
  { group: "utility", label: "Custom Indicator", slug: "custom-indicator" },
  { group: "utility", label: "Date Highlights", slug: "date-highlights" },
  { group: "utility", label: "Grid", slug: "grid" },
  { group: "utility", label: "Legend", slug: "legend" },
  { group: "utility", label: "Markers", slug: "markers" },
  { group: "utility", label: "Reference Area", slug: "reference-area" },
  { group: "utility", label: "Segment", slug: "segment" },
  { group: "utility", label: "Tooltip", slug: "tooltip" },
  { group: "utility", label: "Trend Line", slug: "trend-line" },
] as const;
