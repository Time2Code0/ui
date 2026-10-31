"use client";

import { Bar } from "@/registry/charts/bar-chart/bar";
import { BarChart } from "@/registry/charts/bar-chart/bar-chart";
import { BarXAxis } from "@/registry/charts/bar-chart/bar-x-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";

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
        <Grid horizontal />
        <Bar dataKey="revenue" fill="var(--color-chart-1)" lineCap="round" />
        <BarXAxis />
        <ChartTooltip
          rows={(point) => [
            {
              color: "var(--color-chart-1)",
              label: "Revenue",
              value: `$${(point.revenue as number)?.toLocaleString()}`,
            },
          ]}
        />
      </BarChart>
    </div>
  );
}
