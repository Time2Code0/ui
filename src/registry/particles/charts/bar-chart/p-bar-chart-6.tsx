"use client";

import { Bar } from "@/registry/charts/bar";
import { BarChart } from "@/registry/charts/bar-chart";
import {
  BarDepthBack,
  BarDepthFront,
  BarDepthProvider,
} from "@/registry/charts/bar-depth";
import { BarXAxis } from "@/registry/charts/bar-x-axis";
import { Grid } from "@/registry/charts/grid";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";

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
    <BarDepthProvider
      segmentsAccessor={(d) => [
        { color: "var(--color-chart-1)", value: d.desktop as number },
        { color: "var(--color-chart-3)", value: d.mobile as number },
      ]}
    >
      <BarChart
        data={barStackedData}
        margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
        stacked
        xDataKey="month"
      >
        <Grid horizontal />
        <BarDepthBack dataKey="desktop" />
        <Bar dataKey="desktop" fill="var(--color-chart-1)" perspective />
        <Bar dataKey="mobile" fill="var(--color-chart-3)" perspective />
        <BarDepthFront dataKey="desktop" />
        <BarXAxis />
        <ChartTooltip showCrosshair={false} showDots={false} />
      </BarChart>
    </BarDepthProvider>
  );
}
