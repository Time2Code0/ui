"use client";

import { Background } from "@/registry/charts/background";
import { Line } from "@/registry/charts/line";
import { LineChart } from "@/registry/charts/line-chart";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";
import { XAxis } from "@/registry/charts/x-axis";

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
