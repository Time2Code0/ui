"use client";

import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { Line } from "@/registry/charts/line-chart/line";
import { LineChart } from "@/registry/charts/line-chart/line-chart";

const chartData = [
  { date: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), value: 1200 },
  { date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), value: 1450 },
  { date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), value: 1380 },
  { date: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000), value: 1620 },
  { date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000), value: 1850 },
  { date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), value: 1750 },
  { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), value: 2100 },
  { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), value: 2320 },
];

export function Particle() {
  return (
    <div className="w-full">
      <LineChart data={chartData}>
        <Grid horizontal={false} vertical />
        <Line dataKey="value" />
        <XAxis />
        <ChartTooltip />
      </LineChart>
    </div>
  );
}
