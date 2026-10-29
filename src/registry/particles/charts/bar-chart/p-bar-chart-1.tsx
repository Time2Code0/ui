"use client";

import { Bar } from "@/registry/charts/bar-chart/bar";
import { BarChart } from "@/registry/charts/bar-chart/bar-chart";
import { BarXAxis } from "@/registry/charts/bar-chart/bar-x-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";

const barHeroData = Array.from({ length: 90 }, (_, i) => {
  const date = new Date(2024, 0, 1);
  date.setDate(date.getDate() + i);
  const baseValue = 50 + Math.sin(i / 7) * 30;
  const variation = ((i * 7) % 37) - 18;
  return {
    day: date.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
    value: Math.floor(baseValue + variation),
  };
});

export function Particle() {
  return (
    <BarChart
      aspectRatio="4 / 1"
      barGap={0.1}
      data={barHeroData}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
      xDataKey="day"
    >
      <Grid horizontal />
      <Bar dataKey="value" lineCap="butt" />
      <BarXAxis maxLabels={8} />
      <ChartTooltip />
    </BarChart>
  );
}
