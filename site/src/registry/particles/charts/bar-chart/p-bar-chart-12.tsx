"use client";

import { Bar } from "@/registry/charts/bar-chart/bar";
import { BarChart } from "@/registry/charts/bar-chart/bar-chart";
import { BarXAxis } from "@/registry/charts/bar-chart/bar-x-axis";
import { LinearGradient } from "@/registry/charts/chart-gradients/gradients";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";

const barRevenueData = [
  { month: "Jan", revenue: 12_000 },
  { month: "Feb", revenue: 15_500 },
  { month: "Mar", revenue: 11_000 },
  { month: "Apr", revenue: 18_500 },
  { month: "May", revenue: 16_800 },
  { month: "Jun", revenue: 21_200 },
];

export function Particle() {
  return (
    <BarChart
      data={barRevenueData}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
      xDataKey="month"
    >
      <LinearGradient
        from="hsl(217, 91%, 60%)"
        id="bar-example-gradient"
        to="hsl(280, 87%, 65%)"
      />
      <Grid horizontal />
      <Bar
        dataKey="revenue"
        fill="url(#bar-example-gradient)"
        lineCap={4}
        stroke="hsl(217, 91%, 60%)"
      />
      <BarXAxis />
      <ChartTooltip />
    </BarChart>
  );
}
