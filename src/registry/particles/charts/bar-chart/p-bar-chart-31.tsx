"use client";

import { Bar } from "@/registry/charts/bar";
import { BarChart } from "@/registry/charts/bar-chart";
import { BarXAxis } from "@/registry/charts/bar-x-axis";
import { Grid } from "@/registry/charts/grid";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";
import { PatternLines } from "@/registry/charts/visx-pattern";

const chartData = [
  { month: "Jan", profit: 4500, revenue: 12_000 },
  { month: "Feb", profit: 5200, revenue: 15_500 },
  { month: "Mar", profit: 3800, revenue: 11_000 },
  { month: "Apr", profit: 7100, revenue: 18_500 },
  { month: "May", profit: 5400, revenue: 16_800 },
  { month: "Jun", profit: 8800, revenue: 21_200 },
];

export function Particle() {
  return (
    <div className="w-full">
      <BarChart data={chartData} xDataKey="month">
        <PatternLines
          height={8}
          id="barPattern"
          orientation={["diagonal"]}
          stroke="hsl(217, 91%, 60%)"
          strokeWidth={2}
          width={8}
        />
        <Grid horizontal />
        <Bar
          dataKey="revenue"
          fill="url(#barPattern)"
          lineCap={4}
          stroke="hsl(217, 91%, 60%)"
        />
        <BarXAxis />
        <ChartTooltip />
      </BarChart>
    </div>
  );
}
