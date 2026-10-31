"use client";

import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { Line } from "@/registry/charts/line-chart/line";
import { LineChart } from "@/registry/charts/line-chart/line-chart";

const multiLineData = [
  { date: new Date(2024, 0, 1), desktop: 186, mobile: 80 },
  { date: new Date(2024, 1, 1), desktop: 305, mobile: 200 },
  { date: new Date(2024, 2, 1), desktop: 237, mobile: 120 },
  { date: new Date(2024, 3, 1), desktop: 73, mobile: 190 },
  { date: new Date(2024, 4, 1), desktop: 209, mobile: 130 },
  { date: new Date(2024, 5, 1), desktop: 214, mobile: 140 },
];

export function Particle() {
  return (
    <LineChart
      data={multiLineData}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
    >
      <Grid horizontal />
      <Line dataKey="desktop" stroke="var(--color-chart-1)" strokeWidth={2} />
      <Line dataKey="mobile" stroke="var(--color-chart-3)" strokeWidth={2} />
      <ChartTooltip />
    </LineChart>
  );
}
