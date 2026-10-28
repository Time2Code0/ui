"use client";

import { Grid } from "@/registry/charts/grid";
import { Scatter } from "@/registry/charts/scatter";
import { ScatterChart } from "@/registry/charts/scatter-chart";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";
import { XAxis } from "@/registry/charts/x-axis";
import { YAxis } from "@/registry/charts/y-axis";

const multiLineData = [
  { date: new Date(2024, 0, 1), desktop: 186, mobile: 80 },
  { date: new Date(2024, 1, 1), desktop: 305, mobile: 200 },
  { date: new Date(2024, 2, 1), desktop: 237, mobile: 120 },
  { date: new Date(2024, 3, 1), desktop: 73, mobile: 190 },
  { date: new Date(2024, 4, 1), desktop: 209, mobile: 130 },
  { date: new Date(2024, 5, 1), desktop: 214, mobile: 140 },
];

/** Room for Y-axis tick labels on the left; default right margin. */
const chartMarginLeftYAxis = {
  bottom: 40,
  left: 56,
  right: 8,
  top: 8,
} as const;

export function Particle() {
  return (
    <ScatterChart data={multiLineData} margin={chartMarginLeftYAxis}>
      <Grid horizontal />
      <Scatter dataKey="desktop" />
      <Scatter dataKey="mobile" stroke="var(--color-chart-2)" />
      <YAxis yAxisId="left" />
      <XAxis />
      <ChartTooltip />
    </ScatterChart>
  );
}
