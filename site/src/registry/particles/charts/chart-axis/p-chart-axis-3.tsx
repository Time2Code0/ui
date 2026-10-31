"use client";

import { YAxis } from "@/registry/charts/chart-axis/y-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { Line } from "@/registry/charts/line-chart/line";
import { LineChart } from "@/registry/charts/line-chart/line-chart";

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
