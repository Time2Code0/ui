"use client";

import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Background } from "@/registry/charts/chart-background/background";
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
      <Background opacity={0.85} pattern="dots" />
      <Scatter dataKey="desktop" />
      <XAxis />
      <ChartTooltip />
    </ScatterChart>
  );
}
