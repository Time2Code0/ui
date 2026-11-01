"use client";

import { curveCatmullRom } from "d3-shape";

import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Deadline } from "@/registry/charts/chart-date-highlights/deadline";
import { Weekends } from "@/registry/charts/chart-date-highlights/weekends";
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

const composedDueDate = composedDemoData[21]?.date ?? "2024-01-22";

export function Particle() {
  return (
    <div className="w-full">
      <ComposedChart
        aspectRatio="2 / 1"
        barGap={0}
        data={composedDemoData}
        maxBarSize={24}
        xDataKey="date"
      >
        <Grid horizontal />
        <Weekends utc />
        <Deadline date={composedDueDate} label="Quarter close" />
        <SeriesBar dataKey="units" fill="var(--color-chart-3)" radius={3} />
        <Line
          curve={curveCatmullRom.alpha(0.42)}
          dataKey="revenue"
          stroke="var(--color-chart-1)"
        />
        <ChartTooltip showCrosshair={false} />
        <XAxis numTicks={8} />
      </ComposedChart>
    </div>
  );
}
