"use client";

import { cn } from "cn";

import { Legend, LegendItem, LegendLabel, LegendMarker } from "./legend/index";
import {
  PROFIT_LOSS_NEGATIVE_COLOR,
  PROFIT_LOSS_POSITIVE_COLOR,
} from "./profit-loss-line";

export const PROFIT_LOSS_LEGEND_ITEMS = [
  { color: PROFIT_LOSS_POSITIVE_COLOR, label: "Profit", value: 0 },
  { color: PROFIT_LOSS_NEGATIVE_COLOR, label: "Loss", value: 0 },
] as const;

export interface ProfitLossLegendProps {
  align?: "start" | "center" | "end";
  className?: string;
  hoveredIndex?: number | null;
  onHoverChange?: (index: number | null) => void;
}

const LEGEND_ALIGN_CLASSES: Record<
  NonNullable<ProfitLossLegendProps["align"]>,
  string
> = {
  center: "justify-center",
  end: "justify-end",
  start: "justify-start",
};

export function ProfitLossLegend({
  hoveredIndex = null,
  onHoverChange,
  align = "start",
  className,
}: ProfitLossLegendProps) {
  return (
    <div
      className={cn(
        "flex w-full shrink-0 px-1 py-2",
        LEGEND_ALIGN_CLASSES[align],
        className
      )}
    >
      <Legend
        className="flex-row flex-wrap gap-4"
        hoveredIndex={hoveredIndex}
        items={[...PROFIT_LOSS_LEGEND_ITEMS]}
        onHoverChange={onHoverChange}
      >
        <LegendItem className="flex items-center gap-2">
          <LegendMarker className="h-2.5 w-2.5" />
          <LegendLabel className="text-xs" />
        </LegendItem>
      </Legend>
    </div>
  );
}
