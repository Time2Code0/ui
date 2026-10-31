"use client";

import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Background } from "@/registry/charts/chart-background/background";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { Line } from "@/registry/charts/line-chart/line";
import { LineChart } from "@/registry/charts/line-chart/line-chart";

const lineData = [
  { date: new Date(2024, 0, 1), desktop: 186 },
  { date: new Date(2024, 1, 1), desktop: 305 },
  { date: new Date(2024, 2, 1), desktop: 237 },
  { date: new Date(2024, 3, 1), desktop: 73 },
  { date: new Date(2024, 4, 1), desktop: 209 },
  { date: new Date(2024, 5, 1), desktop: 214 },
];

export function Particle() {
  return (
    <LineChart
      data={lineData}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
    >
      <Background opacity={0.85} pattern="dots" />
      <Line dataKey="desktop" strokeWidth={2} />
      <XAxis />
      <ChartTooltip />
    </LineChart>
  );
}
