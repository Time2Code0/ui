"use client";

import { Area } from "@/registry/charts/area";
import { AreaChart } from "@/registry/charts/area-chart";
import { Grid } from "@/registry/charts/grid";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";
import { TrendLine } from "@/registry/charts/trend-line";
import { XAxis } from "@/registry/charts/x-axis";

const areaData = [
  { date: new Date("2024-01-01"), desktop: 186 },
  { date: new Date("2024-02-01"), desktop: 305 },
  { date: new Date("2024-03-01"), desktop: 237 },
  { date: new Date("2024-04-01"), desktop: 273 },
  { date: new Date("2024-05-01"), desktop: 209 },
  { date: new Date("2024-06-01"), desktop: 314 },
  { date: new Date("2024-07-01"), desktop: 352 },
  { date: new Date("2024-08-01"), desktop: 298 },
];

export function Particle() {
  return (
    <div className="w-full">
      <AreaChart data={areaData}>
        <Grid horizontal />
        <Area dataKey="desktop" fillOpacity={0.3} strokeWidth={2} />
        <TrendLine dataKey="desktop" fadeEdges stroke="var(--color-chart-1)" />
        <XAxis />
        <ChartTooltip />
      </AreaChart>
    </div>
  );
}
