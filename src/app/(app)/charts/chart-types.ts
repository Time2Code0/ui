export const isChartSlug = (
  slug: string
): slug is (typeof chartTypes)[number]["slug"] =>
  chartTypes.some((chart) => chart.slug === slug);

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
  { label: "Sankey Chart", slug: "sankey-chart" },
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
