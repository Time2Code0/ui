"use client";

import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Band } from "@/registry/charts/chart-band/band";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { LineChart } from "@/registry/charts/line-chart/line-chart";

const RANGE_AREA_DEMO_DAY_COUNT = 30;

/** Daily low / high temperatures (°C) — a standalone range area, no centre line. */
const temperatureData = Array.from(
  { length: RANGE_AREA_DEMO_DAY_COUNT },
  (_, i) => {
    const mid = 18 + Math.sin(i / 5.2) * 5 + Math.cos(i / 2.3) * 1.5;
    const spread = 4.5 + Math.sin(i / 3.1 + 1) * 1.8;
    return {
      date: new Date(2024, 5, i + 1),
      high: Math.round(mid + spread),
      low: Math.round(mid - spread),
    };
  }
);

export function Particle() {
  return (
    <div className="w-full">
      <LineChart data={temperatureData}>
        <Grid horizontal />
        <Band
          fill="var(--color-chart-1)"
          fillOpacity={0.3}
          label="Temperature"
          lowerKey="low"
          strokeWidth={1.5}
          upperKey="high"
        />
        <XAxis />
        <ChartTooltip />
      </LineChart>
    </div>
  );
}
