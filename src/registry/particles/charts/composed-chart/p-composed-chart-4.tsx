"use client";

import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { ComposedChart } from "@/registry/charts/composed-chart/composed-chart";
import { SeriesBar } from "@/registry/charts/composed-chart/series-bar";
import { Line } from "@/registry/charts/line-chart/line";

const COMPOSED_DEMO_DAY_COUNT = 30;

/** One slow cycle across the window + light ripples (readable, not “ECG” noise). */
function smoothCycle(i: number, phase: number): number {
  const u = i / (COMPOSED_DEMO_DAY_COUNT - 1);
  return Math.sin(u * Math.PI * 2 + phase);
}

const START_MS = Date.UTC(2024, 0, 1, 12, 0, 0);

/** UTC noon per day so x positions and labels stay stable across time zones. */
const DAY_MS = 86_400_000;

function isoDay(i: number): string {
  return new Date(START_MS + i * DAY_MS).toISOString();
}

/** Same timeline: two stack segments + revenue (smooth totals). */
const composedStackedData = Array.from(
  { length: COMPOSED_DEMO_DAY_COUNT },
  (_, i) => {
    const direct = Math.round(
      18 + 8 * smoothCycle(i, 0.2) + 4 * Math.sin(i / 12)
    );
    const partner = Math.round(
      14 + 6 * smoothCycle(i, 1.4) + 3 * Math.cos(i / 13)
    );
    const revenue = Math.round(
      96 +
        11 * smoothCycle(i, 1.05) +
        5 * Math.sin(i / 17) +
        (i / COMPOSED_DEMO_DAY_COUNT) * 18
    );
    return {
      date: isoDay(i),
      direct: Math.max(8, Math.min(42, direct)),
      partner: Math.max(8, Math.min(36, partner)),
      revenue: Math.max(72, Math.min(155, revenue)),
    };
  }
);

const stackedCast = composedStackedData as unknown as Record<string, unknown>[];

export function Particle() {
  return (
    <ComposedChart
      aspectRatio="3 / 2"
      barGap={0}
      data={stackedCast}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
      maxBarSize={28}
      stacked
      stackGap={0}
      xDataKey="date"
    >
      <Grid horizontal />
      <SeriesBar dataKey="direct" fill="var(--color-chart-3)" />
      <SeriesBar dataKey="partner" fill="var(--color-chart-5)" />
      <Line dataKey="revenue" stroke="var(--color-chart-1)" />
      <ChartTooltip showCrosshair={false} />
      <XAxis numTicks={8} />
    </ComposedChart>
  );
}
