"use client";

import { Bar } from "@/registry/charts/bar";
import { BarChart } from "@/registry/charts/bar-chart";
import { BarYAxis } from "@/registry/charts/bar-y-axis";
import { Grid } from "@/registry/charts/grid";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";
import { TrendLine } from "@/registry/charts/trend-line";

const horizontalBarData = [
  { browser: "Chrome", users: 820 },
  { browser: "Safari", users: 640 },
  { browser: "Firefox", users: 520 },
  { browser: "Edge", users: 410 },
  { browser: "Opera", users: 220 },
];

export function Particle() {
  return (
    <div className="w-full">
      <BarChart
        aspectRatio="4 / 3"
        data={horizontalBarData}
        margin={{ left: 80 }}
        orientation="horizontal"
        xDataKey="browser"
      >
        <Grid fadeVertical horizontal={false} vertical />
        <Bar dataKey="users" lineCap={4} />
        <TrendLine dataKey="users" stroke="var(--color-chart-1)" />
        <BarYAxis />
        <ChartTooltip showCrosshair={false} />
      </BarChart>
    </div>
  );
}
