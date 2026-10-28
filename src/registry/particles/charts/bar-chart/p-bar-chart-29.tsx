"use client";

import { Bar } from "@/registry/charts/bar";
import { BarChart } from "@/registry/charts/bar-chart";
import { BarXAxis } from "@/registry/charts/bar-x-axis";
import { Grid } from "@/registry/charts/grid";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";

// Generate consistent daily data (using seed-like approach)
const dailyData = Array.from({ length: 90 }, (_, i) => {
  const date = new Date(2026, 0, 1);
  date.setDate(date.getDate() + i);
  // Use a deterministic pattern instead of Math.random()
  const baseValue = 50 + Math.sin(i / 7) * 30;
  const variation = ((i * 7) % 37) - 18; // Pseudo-random variation
  return {
    day: date.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
    value: Math.floor(baseValue + variation),
  };
});

export function Particle() {
  return (
    <div className="w-full">
      <BarChart barGap={0.1} data={dailyData} xDataKey="day">
        <Grid horizontal />
        <Bar dataKey="value" lineCap="butt" />
        <BarXAxis maxLabels={8} />
        <ChartTooltip />
      </BarChart>
    </div>
  );
}
