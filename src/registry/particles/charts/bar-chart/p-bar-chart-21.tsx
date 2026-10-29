"use client";

import { Bar } from "@/registry/charts/bar-chart/bar";
import { BarChart } from "@/registry/charts/bar-chart/bar-chart";
import { BarXAxis } from "@/registry/charts/bar-chart/bar-x-axis";
import { Background } from "@/registry/charts/chart-background/background";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";

const barStackedData = [
  { desktop: 4000, mobile: 2400, month: "Jan" },
  { desktop: 5000, mobile: 3000, month: "Feb" },
  { desktop: 3500, mobile: 2800, month: "Mar" },
  { desktop: 4200, mobile: 3200, month: "Apr" },
  { desktop: 3800, mobile: 2600, month: "May" },
  { desktop: 5500, mobile: 3800, month: "Jun" },
];

export function Particle() {
  return (
    <BarChart
      data={barStackedData}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
      xDataKey="month"
    >
      <Background opacity={0.85} pattern="dots" />
      <Bar dataKey="desktop" lineCap="round" />
      <BarXAxis />
      <ChartTooltip showCrosshair={false} />
    </BarChart>
  );
}
