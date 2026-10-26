"use client";

import {
  buildProjectionPath,
  ChartTooltip,
  Grid,
  Line,
  LineChart,
  LineSeriesTerminalMarker,
  ProjectionLine,
  XAxis,
} from "../_charts";
import { buildLineChartDemoData } from "../_data/line-chart-demo-data";

const chartData = buildLineChartDemoData();

const targetProjectionPath = buildProjectionPath({
  endValue: 301,
  horizonPoints: 6,
  mode: "target",
  pathDensity: "endpoints",
  seriesKey: "value",
  sourceData: chartData,
});

const autoProjectionPath = buildProjectionPath({
  autoMethod: "lastSegment",
  horizonPoints: 6,
  mode: "auto",
  pathDensity: "endpoints",
  seriesKey: "value",
  sourceData: chartData,
});

export function ProjectionLineDemo() {
  return (
    <div className="w-full">
      <LineChart data={chartData}>
        <Grid horizontal />
        <Line dataKey="value" stroke="var(--chart-1)" strokeWidth={2} />
        <LineSeriesTerminalMarker
          dataKey="value"
          ringGap={6}
          stroke="var(--chart-1)"
        />
        <ProjectionLine
          curveKind="bezier"
          data={targetProjectionPath}
          gradientEnd="oklch(0.59 0.17 166.38)"
          gradientStart="oklch(0.979 0.037 110.273)"
          showEndMarker
          stroke="var(--chart-3)"
          strokeDasharray="1,4"
          strokeStyle="gradient"
          strokeWidth={2}
        />
        <ProjectionLine
          curveKind="bezier"
          data={autoProjectionPath}
          gradientEnd="oklch(0.849 0.232 16.498)"
          gradientStart="oklch(0.926 0.128 16.866 / 0.73)"
          showEndMarker
          stroke="oklch(0.926 0.128 32.86 / 0.73)"
          strokeDasharray="1,4"
          strokeStyle="gradient"
          strokeWidth={2}
        />
        <XAxis />
        <ChartTooltip />
      </LineChart>
    </div>
  );
}

export function ProjectionLineGradientDemo() {
  return (
    <div className="w-full">
      <LineChart data={chartData}>
        <Grid horizontal />
        <Line dataKey="value" stroke="var(--chart-1)" strokeWidth={2} />
        <LineSeriesTerminalMarker dataKey="value" stroke="var(--chart-1)" />
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
