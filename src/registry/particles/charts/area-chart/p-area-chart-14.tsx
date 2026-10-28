"use client";

import { Area } from "@/registry/charts/area";
import { AreaChart } from "@/registry/charts/area-chart";
import { Grid } from "@/registry/charts/grid";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";
import { XAxis } from "@/registry/charts/x-axis";

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

const WEEKLY_VISITOR_COUNTS = [820, 940, 880, 1020, 960, 1100, 420] as const;

/** Seven daily rows (Mon–today) for dashed-tail / in-progress period demos. */
function buildWeeklyVisitorsData(
  now: Date = new Date()
): { date: Date; visitors: number; projected?: boolean }[] {
  const today = startOfDay(now);

  return WEEKLY_VISITOR_COUNTS.map((visitors, index) => {
    const offset = index - (WEEKLY_VISITOR_COUNTS.length - 1);
    const date = new Date(today);
    date.setDate(today.getDate() + offset);

    return {
      date,
      projected: offset === 0,
      visitors,
    };
  });
}

const weeklyVisitorsData = buildWeeklyVisitorsData();

const weeklyVisitorsCast = weeklyVisitorsData as unknown as Record<
  string,
  unknown
>[];

/** Index where the dashed projection begins (yesterday → today). */
const weeklyVisitorsDashFromIndex = weeklyVisitorsData.length - 2;

export function Particle() {
  return (
    <AreaChart
      data={weeklyVisitorsCast}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
      xDataKey="date"
    >
      <Grid horizontal />
      <Area
        dashArray="6,4"
        dashFromIndex={weeklyVisitorsDashFromIndex}
        dataKey="visitors"
        fill="var(--color-chart-1)"
        fillOpacity={0.35}
        stroke="var(--color-chart-1)"
      />
      <XAxis tickMode="data" />
      <ChartTooltip />
    </AreaChart>
  );
}
