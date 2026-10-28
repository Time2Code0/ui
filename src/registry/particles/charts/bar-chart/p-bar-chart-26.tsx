"use client";

import { Bar } from "@/registry/charts/bar";
import { BarChart } from "@/registry/charts/bar-chart";
import { BarYAxis } from "@/registry/charts/bar-y-axis";
import { Grid } from "@/registry/charts/grid";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";
import { TrendLine } from "@/registry/charts/trend-line";

const barHorizontalData = [
  { browser: "Chrome", users: 275 },
  { browser: "Safari", users: 200 },
  { browser: "Firefox", users: 187 },
  { browser: "Edge", users: 173 },
  { browser: "Other", users: 90 },
];

export function Particle() {
  return (
    <BarChart
      aspectRatio="4 / 3"
      data={barHorizontalData}
      margin={{ bottom: 40, left: 80, right: 8, top: 20 }}
      orientation="horizontal"
      xDataKey="browser"
    >
      <Grid fadeVertical horizontal={false} vertical />
      <Bar dataKey="users" lineCap={4} />
      <TrendLine dataKey="users" stroke="var(--color-chart-1)" />
      <BarYAxis />
      <ChartTooltip showCrosshair={false} />
    </BarChart>
  );
}
