"use client";

import { Bar } from "@/registry/charts/bar-chart/bar";
import { BarChart } from "@/registry/charts/bar-chart/bar-chart";
import { BarXAxis } from "@/registry/charts/bar-chart/bar-x-axis";
import { YAxis } from "@/registry/charts/chart-axis/y-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";

const barStackedData = [
  { desktop: 4000, mobile: 2400, month: "Jan" },
  { desktop: 5000, mobile: 3000, month: "Feb" },
  { desktop: 3500, mobile: 2800, month: "Mar" },
  { desktop: 4200, mobile: 3200, month: "Apr" },
  { desktop: 3800, mobile: 2600, month: "May" },
  { desktop: 5500, mobile: 3800, month: "Jun" },
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
    <BarChart
      data={barStackedData}
      margin={chartMarginLeftYAxis}
      xDataKey="month"
    >
      <Grid horizontal />
      <Bar dataKey="desktop" lineCap="round" />
      <Bar dataKey="mobile" fill="var(--color-chart-3)" lineCap="round" />
      <YAxis yAxisId="left" />
      <BarXAxis />
      <ChartTooltip />
    </BarChart>
  );
}
