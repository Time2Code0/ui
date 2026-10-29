"use client";

import { Bar } from "@/registry/charts/bar-chart/bar";
import { BarChart } from "@/registry/charts/bar-chart/bar-chart";
import { BarXAxis } from "@/registry/charts/bar-chart/bar-x-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";

const barData = [
  { desktop: 186, month: "Jan" },
  { desktop: 305, month: "Feb" },
  { desktop: 237, month: "Mar" },
  { desktop: 73, month: "Apr" },
  { desktop: 209, month: "May" },
  { desktop: 214, month: "Jun" },
];

export function Particle() {
  return (
    <BarChart
      data={barData}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
      xDataKey="month"
    >
      <Grid horizontal />
      <Bar dataKey="desktop" lineCap="round" />
      <BarXAxis />
      <ChartTooltip />
    </BarChart>
  );
}
