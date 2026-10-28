"use client";

import { Bar } from "@/registry/charts/bar";
import { BarChart } from "@/registry/charts/bar-chart";
import { BarXAxis } from "@/registry/charts/bar-x-axis";
import { Deadline } from "@/registry/charts/deadline";
import { Grid } from "@/registry/charts/grid";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";
import { Weekends } from "@/registry/charts/weekends";

const START = { day: 1, month: 9, year: 2026 };

function dayDate(index: number): Date {
  return new Date(START.year, START.month, START.day + index);
}

const barDailyData = Array.from({ length: 21 }, (_, index) => ({
  date: dayDate(index),
  issues: Math.round(
    (index % 7 === 3 || index % 7 === 4 ? 2 : 8) +
      Math.abs(Math.sin(index * 1.3)) * 6
  ),
}));

/** Due date: Oct 15, 2026. */
const PROJECT_DUE_DATE = dayDate(14);

export function Particle() {
  return (
    <div className="w-full">
      <BarChart data={barDailyData} xDataKey="date">
        <Grid horizontal />
        <Weekends />
        <Deadline date={PROJECT_DUE_DATE} label="Due" />
        <Bar dataKey="issues" fill="var(--color-chart-1)" lineCap={2} />
        <BarXAxis maxLabels={7} />
        <ChartTooltip />
      </BarChart>
    </div>
  );
}
