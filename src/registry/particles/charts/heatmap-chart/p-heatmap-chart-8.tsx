"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

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
  getHeatmapCalendarRangeStart,
  getHeatmapWeekCount,
  getHeatmapWeekStartAlignedToRange,
  HEATMAP_MONTHS_ONE_YEAR,
  HEATMAP_MONTHS_SIX,
  HEATMAP_WEEKS_ONE_YEAR,
} from "@/registry/charts/heatmap-chart/heatmap-utils";
import { HeatmapXAxis } from "@/registry/charts/heatmap-chart/heatmap-x-axis";

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

const heatmapContributionData = getHeatmapDemoData();

const HEATMAP_SCROLL_VISIBLE_WEEKS = Math.round(
  (HEATMAP_WEEKS_ONE_YEAR / HEATMAP_MONTHS_ONE_YEAR) * HEATMAP_MONTHS_SIX
);

function getHeatmapScrollBinSize(
  viewportWidth: number,
  columnCount: number,
  visibleWeeks: number,
  marginRight: number
) {
  if (viewportWidth <= 0) {
    return 0;
  }

  const plotWidth = viewportWidth * (columnCount / visibleWeeks) - marginRight;
  return plotWidth / columnCount;
}

const HEATMAP_SCROLL_MARGIN = {
  bottom: 0,
  left: 0,
  right: 12,
  top: 28,
} as const;

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

const HEATMAP_SCROLL_Y_LABELS = [
  { label: "Mon", row: 1 },
  { label: "Wed", row: 3 },
  { label: "Fri", row: 5 },
] as const;

const HEATMAP_GALLERY_GAP = 3;

export function Particle() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const columnCount = heatmapContributionData.length;
  const innerWidthRatio = columnCount / HEATMAP_SCROLL_VISIBLE_WEEKS;

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }

    const updateWidth = () => {
      setViewportWidth(element.clientWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const binSize = getHeatmapScrollBinSize(
    viewportWidth,
    columnCount,
    HEATMAP_SCROLL_VISIBLE_WEEKS,
    HEATMAP_SCROLL_MARGIN.right
  );

  return (
    <HeatmapExampleShell>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full min-w-0">
          <div
            className="relative shrink-0"
            style={{ width: HEATMAP_GALLERY_MARGIN.left }}
          >
            {binSize > 0
              ? HEATMAP_SCROLL_Y_LABELS.map((item) => (
                  <div
                    className="pointer-events-none absolute right-1 flex w-[calc(100%-4px)] items-center justify-end"
                    key={item.label}
                    style={{
                      top:
                        HEATMAP_SCROLL_MARGIN.top +
                        item.row * binSize +
                        (binSize - HEATMAP_GALLERY_GAP) / 2,
                      transform: "translateY(-50%)",
                    }}
                  >
                    <span className="whitespace-nowrap text-foreground-muted text-xs">
                      {item.label}
                    </span>
                  </div>
                ))
              : null}
          </div>
          <div
            className="scroll-fade-x no-scrollbar min-w-0 flex-1 overflow-x-auto overscroll-x-contain"
            ref={scrollRef}
          >
            <div style={{ width: `${innerWidthRatio * 100}%` }}>
              <HeatmapChart
                className="w-full"
                data={heatmapContributionData}
                gap={HEATMAP_GALLERY_GAP}
                layout="fluid"
                margin={HEATMAP_SCROLL_MARGIN}
              >
                <HeatmapCells />
                <HeatmapXAxis />
                <HeatmapTooltip />
              </HeatmapChart>
            </div>
          </div>
        </div>
        <HeatmapLegend align="center" gap={HEATMAP_GALLERY_GAP} />
      </div>
    </HeatmapExampleShell>
  );
}
