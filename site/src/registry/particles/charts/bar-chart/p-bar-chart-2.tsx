"use client";

import { Bar } from "@/registry/charts/bar-chart/bar";
import { BarChart } from "@/registry/charts/bar-chart/bar-chart";
import { BarXAxis } from "@/registry/charts/bar-chart/bar-x-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";

const barValueLabelData = [
  { month: "Jan", orders: 720 },
  { month: "Feb", orders: 640 },
  { month: "Mar", orders: 810 },
  { month: "Apr", orders: 580 },
  { month: "May", orders: 930 },
  { month: "Jun", orders: 700 },
  { month: "Jul", orders: 880 },
  { month: "Aug", orders: 760 },
  { month: "Sep", orders: 1010 },
  { month: "Oct", orders: 860 },
  { month: "Nov", orders: 1120 },
  { month: "Dec", orders: 970 },
];

export function Particle() {
  return (
    <BarChart
      data={barValueLabelData}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
      xDataKey="month"
    >
      <Grid horizontal />
      <Bar dataKey="orders" showValue />
      <BarXAxis />
      <ChartTooltip />
    </BarChart>
  );
}
