"use client";

import { Bar } from "@/registry/charts/bar";
import { BarChart } from "@/registry/charts/bar-chart";
import { BarXAxis } from "@/registry/charts/bar-x-axis";
import { Grid } from "@/registry/charts/grid";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";
import { PatternLines } from "@/registry/charts/visx-pattern";

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
      <PatternLines
        height={8}
        id="bar-example-pattern"
        orientation={["diagonal"]}
        stroke="var(--color-chart-1)"
        strokeWidth={2}
        width={8}
      />
      <Grid horizontal />
      <Bar
        dataKey="revenue"
        fill="url(#bar-example-pattern)"
        lineCap={4}
        stroke="var(--color-chart-1)"
      />
      <BarXAxis />
      <ChartTooltip />
    </BarChart>
  );
}
