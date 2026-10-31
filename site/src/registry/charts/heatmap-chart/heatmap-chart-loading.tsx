"use client";

import type { Margin } from "../chart-core/chart-context";
import type { HeatmapColumn } from "./heatmap-context";

import { useMemo } from "react";

import { HeatmapCells } from "./heatmap-cells";
import { HeatmapChart } from "./heatmap-chart";
import { HeatmapXAxis } from "./heatmap-x-axis";
import { HeatmapYAxis } from "./heatmap-y-axis";

export interface HeatmapChartLoadingProps {
  /** Additional class name for the container */
  className?: string;
  /** Corner radius for each cell. @default 2 */
  cornerRadius?: number;
  /** Target column data used to size the skeleton grid. */
  data: HeatmapColumn[];
  /** Gap between cells in pixels. @default 2 */
  gap?: number;
  /** Centered shimmer label text. @default "Loading" */
  label?: string;
  /** Chart margins */
  margin?: Partial<Margin>;
  /** Visible time range — filters week columns that overlap the domain. */
  xDomain?: [Date, Date];
}

export function HeatmapChartLoading({
  data,
  xDomain,
  margin,
  gap = 2,
  cornerRadius = 2,
  label = "Loading",
  className = "",
}: HeatmapChartLoadingProps) {
  const skeletonData = useMemo(
    () => generateHeatmapSkeletonFromTarget(data),
    [data]
  );

  return (
    <HeatmapChart
      className={className}
      data={skeletonData}
      gap={gap}
      loadingLabel={label}
      margin={margin}
      status="loading"
      xDomain={xDomain}
    >
      <HeatmapCells cornerRadius={cornerRadius} interactive={false} />
      <HeatmapXAxis />
      <HeatmapYAxis />
    </HeatmapChart>
  );
}

/** Placeholder grid with the same week/day shape as target data (all empty cells). */
function generateHeatmapSkeletonFromTarget(
  target: HeatmapColumn[]
): HeatmapColumn[] {
  return target.map((column) => ({
    bin: column.bin,
    bins: column.bins.map((bin) => ({
      bin: bin.bin,
      count: 0,
      date: bin.date,
    })),
  }));
}
