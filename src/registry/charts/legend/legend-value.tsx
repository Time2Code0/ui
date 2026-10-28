"use client";

import { cn } from "cn";

import { intFmt } from "../chart-formatters";
import { useLegendItem } from "./legend-context";

export interface LegendValueProps {
  /** Value class name. @default "text-sm tabular-nums" */
  className?: string;
  /** Format function for percentage. @default (p) => `${p.toFixed(0)}%` */
  formatPercentage?: (percentage: number) => string;
  /**
   * Format function for the value. Defaults to integer locale formatting.
   * @default (value) => value.toLocaleString()
   */
  formatValue?: (value: number) => string;
  /** Percentage class name. @default "text-xs tabular-nums" */
  percentageClassName?: string;
  /** Show percentage alongside value. @default false */
  showPercentage?: boolean;
}

export function LegendValue({
  className = "text-sm tabular-nums",
  showPercentage = false,
  percentageClassName = "text-xs tabular-nums",
  formatValue = intFmt,
  formatPercentage = (p) => `${p.toFixed(0)}%`,
}: LegendValueProps) {
  const { item, percentage } = useLegendItem();

  return (
    <span
      className={cn("flex items-center gap-2 text-foreground-muted", className)}
    >
      <span>{formatValue(item.value)}</span>
      {showPercentage && item.maxValue && (
        <span className={percentageClassName}>
          {formatPercentage(percentage)}
        </span>
      )}
    </span>
  );
}

LegendValue.displayName = "LegendValue";
