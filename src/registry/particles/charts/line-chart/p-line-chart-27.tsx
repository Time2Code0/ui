"use client";

import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { Line } from "@/registry/charts/line-chart/line";
import { LineChart } from "@/registry/charts/line-chart/line-chart";
import { LineSeriesTerminalMarker } from "@/registry/charts/line-chart/line-series-terminal-marker";
import { ProjectionLine } from "@/registry/charts/line-chart/projection-line";
import { buildProjectionPath } from "@/registry/charts/time-series-chart/projection-utils";

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

const chartData = buildLineChartDemoData();

const autoProjectionPath = buildProjectionPath({
  autoMethod: "lastSegment",
  horizonPoints: 6,
  mode: "auto",
  pathDensity: "endpoints",
  seriesKey: "value",
  sourceData: chartData,
});

export function Particle() {
  return (
    <div className="w-full">
      <LineChart data={chartData}>
        <Grid horizontal />
        <Line dataKey="value" stroke="var(--color-chart-1)" strokeWidth={2} />
        <LineSeriesTerminalMarker
          dataKey="value"
          stroke="var(--color-chart-1)"
        />
        <ProjectionLine
          curveKind="bezier"
          data={autoProjectionPath}
          gradientEnd="oklch(0.849 0.232 16.498)"
          gradientStart="oklch(0.926 0.128 16.866 / 0.73)"
          showEndMarker={false}
          stroke="oklch(0.926 0.128 32.86 / 0.73)"
          strokeStyle="gradient"
          strokeWidth={2}
        />
        <XAxis />
        <ChartTooltip />
      </LineChart>
    </div>
  );
}
