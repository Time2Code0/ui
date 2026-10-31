"use client";

import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { Scatter } from "@/registry/charts/scatter-chart/scatter";
import { ScatterChart } from "@/registry/charts/scatter-chart/scatter-chart";

const chartData = Array.from({ length: 24 }, (_, i) => ({
  conversions: Math.floor(70 + Math.cos(i / 2.5) * 55 + ((i * 7) % 35)),
  date: new Date(2023, i, 1),
  sessions: Math.floor(140 + Math.sin(i / 3) * 90 + ((i * 11) % 40)),
}));

export function Particle() {
  return (
    <div className="w-full">
      <ScatterChart data={chartData}>
        <Grid horizontal />
        <Scatter dataKey="sessions" />
        <Scatter dataKey="conversions" />
        <XAxis />
        <ChartTooltip />
      </ScatterChart>
    </div>
  );
}
