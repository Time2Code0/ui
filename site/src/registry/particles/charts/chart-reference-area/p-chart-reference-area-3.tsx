"use client";

import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ReferenceArea } from "@/registry/charts/chart-reference-area/reference-area";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
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

const chartData = buildLineChartDemoData();

const REFERENCE_AREA_DEMO = {
  axisLabelColor: "oklch(0.795 0.152 164.722)",
  pattern: "diagonal" as const,
  patternColor: "oklch(0.76 0.144 180.392 / 0.17)",
  patternScale: 0.75,
  patternStrokeWidth: 1.5,
  showMarkers: false,
  stroke: "oklch(0.841 0.142 159.667 / 0.49)",
  /** Upper band on shared trending demo data (~141–200); Studio projection preset uses 250–300 with projections. */
  y1: 160,
  y2: 200,
};

export function Particle() {
  return (
    <div className="w-full">
      <LineChart data={chartData}>
        <Grid horizontal />
        <ReferenceArea
          markerColor="var(--color-chart-1)"
          showMarkers
          stroke="var(--color-chart-1)"
          strokeStyle="dashed"
          y1={REFERENCE_AREA_DEMO.y1}
          y2={REFERENCE_AREA_DEMO.y2}
        />
        <Line dataKey="value" strokeWidth={2} />
        <XAxis />
        <ChartTooltip />
      </LineChart>
    </div>
  );
}
