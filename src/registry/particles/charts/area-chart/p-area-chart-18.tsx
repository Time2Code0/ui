"use client";

import { Area } from "@/registry/charts/area";
import { AreaChart } from "@/registry/charts/area-chart";
import { Background } from "@/registry/charts/background";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";
import { XAxis } from "@/registry/charts/x-axis";

const areaData = [
  { date: new Date(2024, 0, 1), desktop: 186, mobile: 80 },
  { date: new Date(2024, 1, 1), desktop: 305, mobile: 200 },
  { date: new Date(2024, 2, 1), desktop: 237, mobile: 120 },
  { date: new Date(2024, 3, 1), desktop: 73, mobile: 190 },
  { date: new Date(2024, 4, 1), desktop: 209, mobile: 130 },
  { date: new Date(2024, 5, 1), desktop: 214, mobile: 140 },
];

export function Particle() {
  return (
    <AreaChart
      data={areaData}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
    >
      <Background opacity={0.85} pattern="dots" />
      <Area dataKey="desktop" fillOpacity={0.3} strokeWidth={2} />
      <XAxis />
      <ChartTooltip />
    </AreaChart>
  );
}
