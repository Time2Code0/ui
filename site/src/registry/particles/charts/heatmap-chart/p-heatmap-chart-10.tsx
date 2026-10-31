"use client";

import type { ReactNode } from "react";

import { HeatmapCells } from "@/registry/charts/heatmap-chart/heatmap-cells";
import { HeatmapChart } from "@/registry/charts/heatmap-chart/heatmap-chart";
import {
  type HeatmapColumn,
  HeatmapInteractionBoundary,
  HeatmapInteractionProvider,
} from "@/registry/charts/heatmap-chart/heatmap-context";
import { HeatmapLegend } from "@/registry/charts/heatmap-chart/heatmap-legend";
import { HeatmapTooltip } from "@/registry/charts/heatmap-chart/heatmap-tooltip";
import {
  buildHeatmapRowOpacity,
  getHeatmapCalendarRangeStart,
  getHeatmapWeekCount,
  getHeatmapWeekStartAlignedToRange,
  HEATMAP_MONTHS_ONE_YEAR,
  HEATMAP_MONTHS_SIX,
} from "@/registry/charts/heatmap-chart/heatmap-utils";
import { HeatmapXAxis } from "@/registry/charts/heatmap-chart/heatmap-x-axis";
import { HeatmapYAxis } from "@/registry/charts/heatmap-chart/heatmap-y-axis";

function HeatmapExampleShell({ children }: { children: ReactNode }) {
  return (
    <HeatmapInteractionProvider>
      <HeatmapInteractionBoundary>{children}</HeatmapInteractionBoundary>
    </HeatmapInteractionProvider>
  );
}

const HEATMAP_DAYS = 7;

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 16_807 + 0) % 2_147_483_647;
    return (state - 1) / 2_147_483_646;
  };
}

function heatmapContributionCount(
  seed: number,
  week: number,
  day: number,
  dayOfWeek: number
): number {
  const random = seededRandom(seed + week * 1009 + day * 9176);
  const weekRandom = seededRandom(seed + week * 524_287);

  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const weekBusy = weekRandom();
  let burst = 0.85 + weekBusy * 0.3;
  if (weekBusy > 0.78) {
    burst = 1.75;
  } else if (weekBusy < 0.22) {
    burst = 0.28;
  }

  const activityChance = Math.min(
    0.9,
    (isWeekend ? 0.18 : 0.48) * burst + random() * 0.12
  );
  if (random() > activityChance) {
    return 0;
  }

  const level = random();
  if (level < 0.52) {
    return 1;
  }
  if (level < 0.76) {
    return 2;
  }
  if (level < 0.91) {
    return 3;
  }
  return 4;
}

/** GitHub-style contribution grid for docs and gallery demos. */
function getHeatmapDemoData(
  seed = 0,
  calendarMonths: number = HEATMAP_MONTHS_ONE_YEAR
): HeatmapColumn[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rangeStart = getHeatmapCalendarRangeStart(today, calendarMonths);
  const startDate = getHeatmapWeekStartAlignedToRange(rangeStart);
  const weekCount = getHeatmapWeekCount(startDate, today);

  const columns: HeatmapColumn[] = [];
  const cursor = new Date(startDate);

  for (let week = 0; week < weekCount; week++) {
    const bins = Array.from({ length: HEATMAP_DAYS }, (_, day) => {
      const date = new Date(cursor);
      const dayOfWeek = date.getDay();
      cursor.setDate(cursor.getDate() + 1);

      const isOutOfRange =
        date > today || (rangeStart != null && date < rangeStart);

      return {
        bin: day,
        count: isOutOfRange
          ? 0
          : heatmapContributionCount(seed, week, day, dayOfWeek),
        date,
      };
    });

    columns.push({ bin: week, bins });
  }

  return columns;
}

const heatmapContributionDataSixMonths = getHeatmapDemoData(
  0,
  HEATMAP_MONTHS_SIX
);

const HEATMAP_GALLERY_GAP = 3;

const HEATMAP_GALLERY_MARGIN = {
  bottom: 0,
  left: 44,
  right: 12,
  top: 28,
} as const;

const HEATMAP_WEEKEND_ROW_OPACITY = buildHeatmapRowOpacity(
  (row) => row >= 5,
  0.35
);

export function Particle() {
  return (
    <HeatmapExampleShell>
      <div className="flex w-full max-w-full flex-col items-stretch gap-2">
        <HeatmapChart
          className="w-full min-w-0"
          data={heatmapContributionDataSixMonths}
          gap={HEATMAP_GALLERY_GAP}
          layout="fluid"
          margin={HEATMAP_GALLERY_MARGIN}
          weekStartDay={1}
        >
          <HeatmapCells
            cornerRadius={2}
            rowOpacity={HEATMAP_WEEKEND_ROW_OPACITY}
          />
          <HeatmapXAxis />
          <HeatmapYAxis
            labelFormat="initial"
            rowOpacity={HEATMAP_WEEKEND_ROW_OPACITY}
            tickFilter="all"
          />
          <HeatmapTooltip />
        </HeatmapChart>
        <HeatmapLegend align="center" gap={HEATMAP_GALLERY_GAP} />
      </div>
    </HeatmapExampleShell>
  );
}
