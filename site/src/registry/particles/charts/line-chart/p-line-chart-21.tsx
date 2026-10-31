"use client";

import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { TrendLine } from "@/registry/charts/chart-trend-line/trend-line";
import { Line } from "@/registry/charts/line-chart/line";
import { LineChart } from "@/registry/charts/line-chart/line-chart";

const LINE_DEMO_POINT_COUNT = 10;

function trendingLineValue(index: number, seriesIndex = 0): number {
  const base = 120 + seriesIndex * 18;
  const trend = (5.5 + seriesIndex * 1.25) * index;
  const i = index + seriesIndex * 9;
  const swell = Math.sin(i / 4.4 + seriesIndex * 1.2) * (24 + seriesIndex * 3);
  const ripple =
    Math.cos(i / 1.65 + seriesIndex * 0.85) * (16 + seriesIndex * 2);
  const jitter = Math.sin(i / 0.68 + seriesIndex * 2.4) * (10 + seriesIndex);
  const wobble = Math.cos(i / 2.95 + seriesIndex * 1.6) * 7;

  return Math.max(
    10,
    Math.floor(base + trend + swell + ripple + jitter + wobble)
  );
}

function buildLineChartDemoData(
  pointCount = LINE_DEMO_POINT_COUNT
): { date: Date; value: number }[] {
  return Array.from({ length: pointCount }, (_, index) => ({
    date: new Date(2024, 0, index + 1),
    value: trendingLineValue(index),
  }));
}

export function Particle() {
  return (
    <LineChart
      data={buildLineChartDemoData()}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
    >
      <Grid horizontal />
      <Line dataKey="value" strokeWidth={2} />
      <TrendLine
        dataKey="value"
        fadeEdges
        gradientEnd="var(--color-chart-1)"
        gradientStart="var(--color-chart-3)"
        strokeStyle="gradient"
        strokeWidth={2.5}
      />
      <XAxis />
      <ChartTooltip />
    </LineChart>
  );
}
