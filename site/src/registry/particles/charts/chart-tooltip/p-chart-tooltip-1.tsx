"use client";

import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { Line } from "@/registry/charts/line-chart/line";
import { LineChart } from "@/registry/charts/line-chart/line-chart";

const chartData = [
  {
    date: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
    pageviews: 4500,
    users: 1200,
  },
  {
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    pageviews: 5100,
    users: 1450,
  },
  {
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    pageviews: 4900,
    users: 1380,
  },
  {
    date: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
    pageviews: 5800,
    users: 1620,
  },
  {
    date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
    pageviews: 6800,
    users: 1850,
  },
  {
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    pageviews: 6400,
    users: 1750,
  },
  {
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    pageviews: 7800,
    users: 2100,
  },
  {
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    pageviews: 8700,
    users: 2320,
  },
];

export function Particle() {
  return (
    <div className="w-full">
      <LineChart data={chartData}>
        <Grid horizontal />
        <Line dataKey="users" stroke="var(--color-chart-1)" />
        <Line dataKey="pageviews" stroke="var(--color-chart-2)" />
        <XAxis />
        <ChartTooltip />
      </LineChart>
    </div>
  );
}
