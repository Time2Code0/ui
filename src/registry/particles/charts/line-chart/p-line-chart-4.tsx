"use client";

import type { ChartMarker } from "@/registry/charts/chart-markers/marker-group";

import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartMarkers } from "@/registry/charts/chart-markers/chart-markers";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { Line } from "@/registry/charts/line-chart/line";
import { LineChart } from "@/registry/charts/line-chart/line-chart";

const lineData = [
  { date: new Date(2024, 0, 1), desktop: 186 },
  { date: new Date(2024, 1, 1), desktop: 305 },
  { date: new Date(2024, 2, 1), desktop: 237 },
  { date: new Date(2024, 3, 1), desktop: 73 },
  { date: new Date(2024, 4, 1), desktop: 209 },
  { date: new Date(2024, 5, 1), desktop: 214 },
];

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

export function Particle() {
  return (
    <LineChart
      data={lineData}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
    >
      <Grid horizontal />
      <Line dataKey="desktop" strokeWidth={2} />
      <ChartMarkers items={lineMarkers} />
      <ChartTooltip />
    </LineChart>
  );
}
