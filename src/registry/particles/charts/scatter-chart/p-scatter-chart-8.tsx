"use client";

import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { YAxis } from "@/registry/charts/chart-axis/y-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { Scatter } from "@/registry/charts/scatter-chart/scatter";
import { ScatterChart } from "@/registry/charts/scatter-chart/scatter-chart";

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
    <ScatterChart data={multiLineData} margin={chartMarginBiaxialYAxis}>
      <Grid horizontal />
      <Scatter dataKey="desktop" yAxisId="left" />
      <Scatter dataKey="mobile" stroke="var(--color-chart-2)" yAxisId="right" />
      <YAxis yAxisId="left" />
      <YAxis orientation="right" yAxisId="right" />
      <XAxis />
      <ChartTooltip />
    </ScatterChart>
  );
}
