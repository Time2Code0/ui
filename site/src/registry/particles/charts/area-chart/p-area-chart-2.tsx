"use client";

import { Area } from "@/registry/charts/area-chart/area";
import { AreaChart } from "@/registry/charts/area-chart/area-chart";
import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";

/** 24 months — desktop vs mobile for scatter hero and gallery examples */
const scatterMultiSeriesData = Array.from({ length: 24 }, (_, i) => ({
  date: new Date(2023, i, 1),
  desktop: Math.floor(140 + Math.sin(i / 3) * 90 + ((i * 11) % 40)),
  mobile: Math.floor(70 + Math.cos(i / 2.5) * 55 + ((i * 7) % 35)),
}));

export function Particle() {
  return (
    <AreaChart
      data={scatterMultiSeriesData}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
    >
      <Grid horizontal />
      <Area dataKey="desktop" showValue valueLabelMaxCount={5} />
      <Area
        dataKey="mobile"
        fill="var(--color-chart-2)"
        showValue
        valueLabelMaxCount={5}
      />
      <XAxis />
      <ChartTooltip />
    </AreaChart>
  );
}
