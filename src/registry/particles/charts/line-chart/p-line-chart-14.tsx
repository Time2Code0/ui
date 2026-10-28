"use client";

import { Grid } from "@/registry/charts/grid";
import { Line } from "@/registry/charts/line";
import { LineChart } from "@/registry/charts/line-chart";
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

/** Biaxial charts with labels on both sides. */
const chartMarginBiaxialYAxis = {
  bottom: 40,
  left: 56,
  right: 56,
  top: 8,
} as const;

export function Particle() {
  return (
    <LineChart data={multiLineData} margin={chartMarginBiaxialYAxis}>
      <Grid horizontal />
      <Line dataKey="desktop" yAxisId="left" />
      <Line dataKey="mobile" stroke="var(--color-chart-2)" yAxisId="right" />
      <YAxis yAxisId="left" />
      <YAxis orientation="right" yAxisId="right" />
      <XAxis />
      <ChartTooltip />
    </LineChart>
  );
}
