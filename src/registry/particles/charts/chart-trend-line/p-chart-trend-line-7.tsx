"use client";

import { Bar } from "@/registry/charts/bar";
import { BarChart } from "@/registry/charts/bar-chart";
import { BarXAxis } from "@/registry/charts/bar-x-axis";
import { Grid } from "@/registry/charts/grid";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";
import { TrendLine } from "@/registry/charts/trend-line";

const barData = [
  { month: "Jan", revenue: 3200 },
  { month: "Feb", revenue: 4100 },
  { month: "Mar", revenue: 3600 },
  { month: "Apr", revenue: 4800 },
  { month: "May", revenue: 4300 },
  { month: "Jun", revenue: 5400 },
];

export function Particle() {
  return (
    <div className="w-full">
      <BarChart data={barData} xDataKey="month">
        <Grid horizontal />
        <Bar dataKey="revenue" lineCap="round" />
        <TrendLine
          dataKey="revenue"
          gradientEnd="var(--color-chart-1)"
          gradientStart="var(--color-chart-3)"
          strokeStyle="gradient"
        />
        <BarXAxis />
        <ChartTooltip showCrosshair={false} />
      </BarChart>
    </div>
  );
}
