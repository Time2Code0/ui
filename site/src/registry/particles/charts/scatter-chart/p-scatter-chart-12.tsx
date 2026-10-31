"use client";

import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { ReferenceArea } from "@/registry/charts/chart-reference-area/reference-area";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { Scatter } from "@/registry/charts/scatter-chart/scatter";
import { ScatterChart } from "@/registry/charts/scatter-chart/scatter-chart";

/** 24 months — desktop vs mobile for scatter hero and gallery examples */
const scatterMultiSeriesData = Array.from({ length: 24 }, (_, i) => ({
  date: new Date(2023, i, 1),
  desktop: Math.floor(140 + Math.sin(i / 3) * 90 + ((i * 11) % 40)),
  mobile: Math.floor(70 + Math.cos(i / 2.5) * 55 + ((i * 7) % 35)),
}));

export function Particle() {
  return (
    <ScatterChart
      data={scatterMultiSeriesData}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
    >
      <ReferenceArea
        axisLabelColor="var(--color-chart-1)"
        fillOpacity={0.85}
        pattern="diagonal"
        patternColor="var(--color-foreground-muted)"
        y1={120}
        y2={180}
      />
      <Scatter dataKey="desktop" />
      <XAxis />
      <ChartTooltip />
    </ScatterChart>
  );
}
