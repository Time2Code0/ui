"use client";

import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Band } from "@/registry/charts/chart-band/band";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { Line } from "@/registry/charts/line-chart/line";
import { LineChart } from "@/registry/charts/line-chart/line-chart";

const BAND_DEMO_POINT_COUNT = 24;

function bandDemoValue(index: number): number {
  const trend = 4.2 * index;
  const swell = Math.sin(index / 3.6) * 22;
  const ripple = Math.cos(index / 1.45) * 11;
  const jitter = Math.sin(index / 0.62) * 6;
  return Math.round(140 + trend + swell + ripple + jitter);
}

/**
 * Line + per-row min/max (Recharts BandedChart style). The spread varies
 * smoothly and asymmetrically so it reads like a real range.
 */
const rangeData = Array.from({ length: BAND_DEMO_POINT_COUNT }, (_, i) => {
  const value = bandDemoValue(i);
  return {
    date: new Date(2024, 0, i + 1),
    value,
    valueLower: Math.round(
      value - value * 0.12 * (0.75 + 0.25 * Math.cos(i / 2.6))
    ),
    valueUpper: Math.round(
      value + value * 0.12 * (0.75 + 0.25 * Math.sin(i / 1.9))
    ),
  };
});

export function Particle() {
  return (
    <div className="w-full">
      <LineChart data={rangeData}>
        <Grid horizontal />
        <Band
          fill="var(--color-chart-1)"
          label="range"
          lowerKey="valueLower"
          strokeOpacity={0.4}
          upperKey="valueUpper"
        />
        <Line dataKey="value" stroke="var(--color-chart-1)" />
        <XAxis />
        <ChartTooltip />
      </LineChart>
    </div>
  );
}
