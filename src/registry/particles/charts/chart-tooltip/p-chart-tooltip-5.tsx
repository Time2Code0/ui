"use client";

import { Bar } from "@/registry/charts/bar";
import { BarChart } from "@/registry/charts/bar-chart";
import { BarXAxis } from "@/registry/charts/bar-x-axis";
import { Grid } from "@/registry/charts/grid";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";

const barData = [
  { month: "Jan", revenue: 12_000 },
  { month: "Feb", revenue: 15_500 },
  { month: "Mar", revenue: 11_000 },
  { month: "Apr", revenue: 18_500 },
  { month: "May", revenue: 16_800 },
  { month: "Jun", revenue: 21_200 },
];

export function Particle() {
  return (
    <div className="w-full">
      <BarChart data={barData} xDataKey="month">
        <Grid horizontal />
        <Bar dataKey="revenue" fill="var(--color-chart-1)" lineCap="round" />
        <BarXAxis />
        <ChartTooltip
          rows={(point) => [
            {
              color: "var(--color-chart-1)",
              label: "Revenue",
              value: `$${((point.revenue as number) ?? 0).toLocaleString()}`,
            },
          ]}
        />
      </BarChart>
    </div>
  );
}
