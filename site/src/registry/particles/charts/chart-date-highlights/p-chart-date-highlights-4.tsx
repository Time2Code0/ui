"use client";

import { curveCatmullRom } from "d3-shape";

import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Deadline } from "@/registry/charts/chart-date-highlights/deadline";
import { Line } from "@/registry/charts/line-chart/line";
import { LineChart } from "@/registry/charts/line-chart/line-chart";

const fillTypes = ["pattern", "gradient", "solid"] as const;

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
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {fillTypes.map((fillType) => (
        <div className="flex flex-col gap-1" key={fillType}>
          <span className="font-mono text-foreground-muted text-xs">
            fillType="{fillType}"
          </span>
          <LineChart
            aspectRatio="3 / 2"
            data={projectProgressData}
            margin={{ bottom: 32, left: 16, right: 16, top: 16 }}
          >
            <Deadline date={PROJECT_DUE_DATE} fillType={fillType} />
            <Line
              curve={smooth}
              dataKey="completed"
              stroke="var(--color-chart-1)"
            />
            <XAxis numTicks={3} />
          </LineChart>
        </div>
      ))}
    </div>
  );
}
