"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "cn";

import { useHeatmap } from "./heatmap-context";
import {
  formatHeatmapYAxisLabel,
  getHeatmapDayLabels,
  type HeatmapYAxisLabelFormat,
  type HeatmapYAxisTickFilter,
  resolveHeatmapRowOpacity,
  shouldShowHeatmapYAxisTick,
} from "./heatmap-utils";

export interface HeatmapYAxisProps {
  /** Additional class name for labels */
  className?: string;
  /** Label format — `"initial"` shows the first letter only (Mon → M). @default "full" */
  labelFormat?: HeatmapYAxisLabelFormat;
  /** Per-row label opacity — mirrors {@link HeatmapCells} `rowOpacity`. */
  rowOpacity?: number | readonly number[];
  /** Which row ticks to display (`"odd"` = Mon / Wed / Fri). @default "odd" */
  tickFilter?: HeatmapYAxisTickFilter;
}

export const HeatmapYAxis = memo(function HeatmapYAxis({
  className,
  tickFilter = "odd",
  labelFormat = "full",
  rowOpacity,
}: HeatmapYAxisProps) {
  const { containerRef, margin, binHeight, gap, yScale, weekStartDay } =
    useHeatmap();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const labels = useMemo(
    () =>
      getHeatmapDayLabels(weekStartDay)
        .map((label, row) => ({
          label: formatHeatmapYAxisLabel(label, labelFormat),
          row,
          y: margin.top + yScale(row) + (binHeight - gap) / 2,
        }))
        .filter((tick) => shouldShowHeatmapYAxisTick(tick.row, tickFilter)),
    [binHeight, gap, labelFormat, margin.top, tickFilter, weekStartDay, yScale]
  );

  const container = containerRef.current;
  if (!(mounted && container)) {
    return null;
  }

  return createPortal(
    labels.map((tick) => (
      <div
        className="pointer-events-none absolute"
        key={tick.row}
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "flex-end",
          left: 4,
          top: tick.y,
          transform: "translateY(-50%)",
          width: Math.max(margin.left - 12, 0),
        }}
      >
        <span
          className={cn(
            "whitespace-nowrap text-foreground-muted text-xs",
            className
          )}
          style={{ opacity: resolveHeatmapRowOpacity(tick.row, rowOpacity) }}
        >
          {tick.label}
        </span>
      </div>
    )),
    container
  );
});

HeatmapYAxis.displayName = "HeatmapYAxis";
