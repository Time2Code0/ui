"use client";

import { Grid } from "@/registry/charts/grid";
import { Scatter } from "@/registry/charts/scatter";
import { ScatterChart } from "@/registry/charts/scatter-chart";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";
import { XAxis } from "@/registry/charts/x-axis";

const multiLineData = [
  { date: new Date(2024, 0, 1), desktop: 186, mobile: 80 },
  { date: new Date(2024, 1, 1), desktop: 305, mobile: 200 },
  { date: new Date(2024, 2, 1), desktop: 237, mobile: 120 },
  { date: new Date(2024, 3, 1), desktop: 73, mobile: 190 },
  { date: new Date(2024, 4, 1), desktop: 209, mobile: 130 },
  { date: new Date(2024, 5, 1), desktop: 214, mobile: 140 },
];

export function Particle() {
  return (
    <ScatterChart
      data={multiLineData}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
    >
      <Grid horizontal />
      <Scatter dataKey="desktop" inactiveMode="blur" />
      <Scatter dataKey="mobile" inactiveMode="blur" />
      <XAxis />
      <ChartTooltip />
    </ScatterChart>
  );
}
