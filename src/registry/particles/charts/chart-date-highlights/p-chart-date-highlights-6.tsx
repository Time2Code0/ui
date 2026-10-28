"use client";

import { curveCatmullRom } from "@visx/curve";

import { Area } from "@/registry/charts/area";
import { AreaChart } from "@/registry/charts/area-chart";
import { Deadline } from "@/registry/charts/deadline";
import { Grid } from "@/registry/charts/grid";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";
import { Weekends } from "@/registry/charts/weekends";
import { XAxis } from "@/registry/charts/x-axis";

const DAY_COUNT = 22;

const START = { day: 1, month: 9, year: 2026 };

function dayDate(index: number): Date {
  return new Date(START.year, START.month, START.day + index);
}

/** Linear-style project progress: scope, started, completed (cumulative issues). */
const projectProgressData = Array.from({ length: DAY_COUNT }, (_, index) => {
  const u = index / (DAY_COUNT - 1);
  return {
    completed: Math.round(43 * (1 - Math.exp(-u * 2.2))),
    date: dayDate(index),
    scope: Math.round(48 * (1 - Math.exp(-u * 6)) + 2 * u),
    started: Math.round(46 * (1 - Math.exp(-u * 2.6))),
  };
});

/** Due date: Oct 15, 2026. */
const PROJECT_DUE_DATE = dayDate(14);

const smooth = curveCatmullRom.alpha(0.5);

export function Particle() {
  return (
    <div className="w-full">
      <AreaChart data={projectProgressData}>
        <Grid horizontal />
        <Weekends />
        <Deadline date={PROJECT_DUE_DATE} fillType="gradient" />
        <Area
          curve={smooth}
          dataKey="completed"
          fill="var(--color-chart-1)"
          stroke="var(--color-chart-1)"
        />
        <XAxis />
        <ChartTooltip />
      </AreaChart>
    </div>
  );
}
