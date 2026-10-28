"use client";

import { Background } from "@/registry/charts/background";
import { ComposedChart } from "@/registry/charts/composed-chart";
import { Line } from "@/registry/charts/line";
import { SeriesBar } from "@/registry/charts/series-bar";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";
import { XAxis } from "@/registry/charts/x-axis";

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

/** Daily rows: units (bars), revenue + runRate (line / area) — gentle variation. */
const composedDemoData = Array.from(
  { length: COMPOSED_DEMO_DAY_COUNT },
  (_, i) => {
    const units = Math.round(
      46 +
        14 * smoothCycle(i, 0.35) +
        6 * Math.sin(i / 14) +
        (i / COMPOSED_DEMO_DAY_COUNT) * 10
    );
    const revenue = Math.round(
      96 +
        11 * smoothCycle(i, 1.05) +
        5 * Math.sin(i / 17) +
        (i / COMPOSED_DEMO_DAY_COUNT) * 18
    );
    const runRate = Math.round(
      82 +
        9 * smoothCycle(i, 1.9) +
        5 * Math.cos(i / 16) +
        (i / COMPOSED_DEMO_DAY_COUNT) * 8
    );
    return {
      date: isoDay(i),
      revenue: Math.max(72, Math.min(155, revenue)),
      runRate: Math.max(62, Math.min(118, runRate)),
      units: Math.max(18, Math.min(95, units)),
    };
  }
);

const dataCast = composedDemoData as unknown as Record<string, unknown>[];

export function Particle() {
  return (
    <ComposedChart
      data={dataCast}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
      xDataKey="date"
    >
      <Background />
      <SeriesBar dataKey="units" fill="var(--color-chart-3)" radius={4} />
      <Line dataKey="revenue" stroke="var(--color-chart-1)" />
      <ChartTooltip showCrosshair={false} />
      <XAxis numTicks={8} />
    </ComposedChart>
  );
}
