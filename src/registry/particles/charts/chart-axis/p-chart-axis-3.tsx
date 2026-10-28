"use client";

import { Grid } from "@/registry/charts/grid";
import { Line } from "@/registry/charts/line";
import { LineChart } from "@/registry/charts/line-chart";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";
import { YAxis } from "@/registry/charts/y-axis";

const chartData = [
  { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), value: 1200 },
  { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), value: 1450 },
  { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), value: 1380 },
  { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), value: 1620 },
  { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), value: 1850 },
  { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), value: 1750 },
  { date: new Date(), value: 2100 },
];

export function Particle() {
  return (
    <div className="w-full">
      <LineChart data={chartData} margin={{ left: 50 }}>
        <Grid horizontal />
        <Line dataKey="value" stroke="var(--color-chart-1)" />
        <YAxis />
        <ChartTooltip />
      </LineChart>
    </div>
  );
}
