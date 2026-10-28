"use client";

import type { ReactNode } from "react";

import { HeatmapCells } from "@/registry/charts/heatmap/heatmap-cells";
import { HeatmapChart } from "@/registry/charts/heatmap/heatmap-chart";
import {
  HEATMAP_DEFAULT_LEVEL_STYLES,
  type HeatmapLevelStyles,
} from "@/registry/charts/heatmap/heatmap-colors";
import {
  type HeatmapColumn,
  HeatmapInteractionBoundary,
  HeatmapInteractionProvider,
} from "@/registry/charts/heatmap/heatmap-context";
import { HeatmapLegend } from "@/registry/charts/heatmap/heatmap-legend";
import { HeatmapTooltip } from "@/registry/charts/heatmap/heatmap-tooltip";
import {
  getHeatmapCalendarRangeStart,
  getHeatmapWeekCount,
  getHeatmapWeekStartAlignedToRange,
  HEATMAP_MONTHS_ONE_YEAR,
  HEATMAP_MONTHS_SIX,
} from "@/registry/charts/heatmap/heatmap-utils";
import { HeatmapXAxis } from "@/registry/charts/heatmap/heatmap-x-axis";
import { HeatmapYAxis } from "@/registry/charts/heatmap/heatmap-y-axis";

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

function HeatmapExampleShell({ children }: { children: ReactNode }) {
  return (
    <HeatmapInteractionProvider>
      <HeatmapInteractionBoundary>{children}</HeatmapInteractionBoundary>
    </HeatmapInteractionProvider>
  );
}

const HEATMAP_GALLERY_MARGIN = {
  bottom: 0,
  left: 44,
  right: 12,
  top: 28,
} as const;

function HeatmapGalleryExample({
  data = heatmapContributionDataSixMonths,
  levelStyles = HEATMAP_DEFAULT_LEVEL_STYLES,
  gap = HEATMAP_GALLERY_GAP,
  cornerRadius = 2,
  inactiveOpacity,
  inactiveScale,
  activeScale,
}: {
  data?: HeatmapColumn[];
  levelStyles?: HeatmapLevelStyles;
  gap?: number;
  cornerRadius?: number;
  inactiveOpacity?: number;
  inactiveScale?: number;
  activeScale?: number;
}) {
  return (
    <HeatmapExampleShell>
      <div className="flex w-full max-w-full flex-col items-stretch gap-2">
        <HeatmapChart
          className="w-full min-w-0"
          data={data}
          gap={gap}
          layout="fluid"
          levelStyles={levelStyles}
          margin={HEATMAP_GALLERY_MARGIN}
        >
          <HeatmapCells
            activeScale={activeScale}
            cornerRadius={cornerRadius}
            inactiveOpacity={inactiveOpacity}
            inactiveScale={inactiveScale}
          />
          <HeatmapXAxis />
          <HeatmapYAxis />
          <HeatmapTooltip />
        </HeatmapChart>
        <HeatmapLegend
          activeScale={activeScale}
          align="center"
          cornerRadius={cornerRadius}
          gap={gap}
          inactiveOpacity={inactiveOpacity}
          inactiveScale={inactiveScale}
          levelStyles={levelStyles}
        />
      </div>
    </HeatmapExampleShell>
  );
}

const heatmapPatternLevelStyles = [
  HEATMAP_DEFAULT_LEVEL_STYLES[0],
  HEATMAP_DEFAULT_LEVEL_STYLES[1],
  {
    ...HEATMAP_DEFAULT_LEVEL_STYLES[2],
    fillMode: "pattern" as const,
    pattern: "diagonal" as const,
    patternColor: "var(--color-background)",
  },
  HEATMAP_DEFAULT_LEVEL_STYLES[3],
  HEATMAP_DEFAULT_LEVEL_STYLES[4],
] as const satisfies HeatmapLevelStyles;

export function Particle() {
  return <HeatmapGalleryExample levelStyles={heatmapPatternLevelStyles} />;
}
