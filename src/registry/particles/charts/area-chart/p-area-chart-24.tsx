"use client";

import { Area } from "@/registry/charts/area";
import { AreaChart } from "@/registry/charts/area-chart";
import { Grid } from "@/registry/charts/grid";
import { PatternArea } from "@/registry/charts/pattern-area";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";
import { PatternLines } from "@/registry/charts/visx-pattern";
import { XAxis } from "@/registry/charts/x-axis";

const chartData = [
  { date: new Date(2024, 0, 1), desktop: 186 },
  { date: new Date(2024, 1, 1), desktop: 305 },
  { date: new Date(2024, 2, 1), desktop: 237 },
  { date: new Date(2024, 3, 1), desktop: 73 },
  { date: new Date(2024, 4, 1), desktop: 209 },
  { date: new Date(2024, 5, 1), desktop: 214 },
];

export function Particle() {
  return (
    <div className="w-full">
      <AreaChart data={chartData}>
        <PatternLines
          height={6}
          id="area-doc-pattern"
          orientation={["diagonal"]}
          stroke="var(--color-chart-1)"
          strokeWidth={1}
          width={6}
        />
        <Grid horizontal />
        <PatternArea dataKey="desktop" fill="url(#area-doc-pattern)" />
        <Area dataKey="desktop" fillOpacity={0} strokeWidth={2} />
        <XAxis />
        <ChartTooltip />
      </AreaChart>
    </div>
  );
}
