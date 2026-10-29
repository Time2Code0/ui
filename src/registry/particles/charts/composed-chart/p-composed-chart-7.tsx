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

/** Desktop / mobile / installs with correlated, smoothed motion. */
const composedTriSeriesData = Array.from(
  { length: COMPOSED_DEMO_DAY_COUNT },
  (_, i) => {
    const desktop = Math.round(
      178 +
        32 * smoothCycle(i, 0.5) +
        10 * Math.sin(i / 15) +
        (i / COMPOSED_DEMO_DAY_COUNT) * 14
    );
    const mobile = Math.round(
      88 + 22 * smoothCycle(i, 1.2) + 8 * Math.cos(i / 14)
    );
    const installs = Math.round(
      (desktop + mobile) * (0.102 + 0.012 * Math.sin(i / 20))
    );
    return {
      date: isoDay(i),
      desktop: Math.max(120, Math.min(260, desktop)),
      installs: Math.max(18, Math.min(48, installs)),
      mobile: Math.max(55, Math.min(145, mobile)),
    };
  }
);

const triCast = composedTriSeriesData as unknown as Record<string, unknown>[];

export function Particle() {
  return (
    <ComposedChart
      aspectRatio="3 / 2"
      barGap={0}
      data={triCast}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
      maxBarSize={20}
      xDataKey="date"
    >
      <Grid horizontal />
      <SeriesBar dataKey="installs" fill="var(--color-chart-3)" radius={5} />
      <Line dataKey="desktop" stroke="var(--color-chart-1)" />
      <Line dataKey="mobile" stroke="var(--color-chart-2)" />
      <ChartTooltip showCrosshair={false} />
      <XAxis numTicks={8} />
    </ComposedChart>
  );
}
