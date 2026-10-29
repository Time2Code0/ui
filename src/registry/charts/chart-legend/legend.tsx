"use client";

import type { ReactNode } from "react";

import {
  cloneElement,
  createContext,
  isValidElement,
  type ReactElement,
  use,
  useState,
} from "react";

import { Progress } from "@base-ui/react/progress";
import { cn } from "cn";

import { intFmt } from "../chart-utils/formatters";

export interface LegendProps {
  /**
   * Children - should contain a single LegendItem that will be mapped for each item
   */
  children: ReactElement;
  /** Container class name */
  className?: string;
  /** Controlled hover state */
  hoveredIndex?: number | null;
  /** Legend items data */
  items: LegendItemData[];
  /** Hover state change callback */
  onHoverChange?: (index: number | null) => void;
  /** Title shown above the legend */
  title?: string;
  /** Title class name @default "text-sm font-semibold" */
  titleClassName?: string;
}

export function Legend({
  items,
  hoveredIndex: controlledHoveredIndex,
  onHoverChange,
  title,
  titleClassName = "text-sm font-semibold",
  className = "",
  children,
}: LegendProps) {
  const [internalHoveredIndex, setInternalHoveredIndex] = useState<
    number | null
  >(null);

  // Controlled or uncontrolled hover state
  const isControlled = controlledHoveredIndex !== undefined;
  const hoveredIndex = isControlled
    ? controlledHoveredIndex
    : internalHoveredIndex;
  const setHoveredIndex = (index: number | null) => {
    if (isControlled) {
      onHoverChange?.(index);
    } else {
      setInternalHoveredIndex(index);
    }
  };

  const contextValue = {
    hoveredIndex,
    items,
    setHoveredIndex,
  };

  return (
    <LegendProvider value={contextValue}>
      <div className={cn("legend-container flex flex-col gap-2", className)}>
        {title && (
          <h3 className={cn("mb-1 text-foreground", titleClassName)}>
            {title}
          </h3>
        )}
        {items.map((item, index) => {
          const isHovered = hoveredIndex === index;
          const isFaded = hoveredIndex !== null && hoveredIndex !== index;
          const percentage = item.maxValue
            ? (item.value / item.maxValue) * 100
            : 0;

          const itemContext = {
            index,
            isFaded,
            isHovered,
            item,
            percentage,
          };

          // Clone the child element for each item
          if (isValidElement(children)) {
            return (
              <LegendItemProvider key={item.label} value={itemContext}>
                {cloneElement(children)}
              </LegendItemProvider>
            );
          }

          return null;
        })}
      </div>
    </LegendProvider>
  );
}

Legend.displayName = "Legend";

// CSS variable references for legend theming
export const legendCssVars = {
  background: "var(--color-background)",
  foreground: "var(--color-foreground)",
  muted: "var(--color-accent)",
  mutedForeground: "var(--color-foreground-muted)",
  track: "color-mix(in oklab, var(--color-foreground) 10%, transparent)",
};

export interface LegendItemData {
  /** Item color */
  color: string;
  /** Display label */
  label: string;
  /** Maximum value (for progress/percentage calculation) */
  maxValue?: number;
  /** Current value */
  value: number;
}

export interface LegendContextValue {
  /** Currently hovered index */
  hoveredIndex: number | null;
  /** All legend items */
  items: LegendItemData[];
  /** Set hovered index */
  setHoveredIndex: (index: number | null) => void;
}

export interface LegendItemContextValue {
  /** Index of this item */
  index: number;
  /** Whether this item is faded (another item is hovered) */
  isFaded: boolean;
  /** Whether this item is hovered */
  isHovered: boolean;
  /** The current item data */
  item: LegendItemData;
  /** Percentage value (value / maxValue * 100) */
  percentage: number;
}

const LegendContext = createContext<LegendContextValue | null>(null);
const LegendItemContext = createContext<LegendItemContextValue | null>(null);

export function LegendProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: LegendContextValue;
}) {
  return (
    <LegendContext.Provider value={value}>{children}</LegendContext.Provider>
  );
}

export function LegendItemProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: LegendItemContextValue;
}) {
  return (
    <LegendItemContext.Provider value={value}>
      {children}
    </LegendItemContext.Provider>
  );
}

export function useLegend(): LegendContextValue {
  const context = use(LegendContext);
  if (!context) {
    throw new Error("useLegend must be used within a <Legend> component.");
  }
  return context;
}

export function useLegendItem(): LegendItemContextValue {
  const context = use(LegendItemContext);
  if (!context) {
    throw new Error(
      "useLegendItem must be used within a <LegendItem> component."
    );
  }
  return context;
}

export interface LegendItemProps {
  /**
   * Children components (LegendMarker, LegendLabel, LegendValue, LegendProgress)
   */
  children: ReactNode;
  /** Container class name */
  className?: string;
}

export function LegendItem({ className = "", children }: LegendItemProps) {
  const { setHoveredIndex } = useLegend();
  const { index, isHovered } = useLegendItem();

  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: Legend item hover interaction
    // biome-ignore lint/a11y/noStaticElementInteractions: Legend item hover interaction
    <div
      className={cn(
        "cursor-pointer rounded-lg px-2 py-1.5 transition-all duration-150 ease-out",
        isHovered && "bg-accent",
        className
      )}
      data-hovered={isHovered ? "" : undefined}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {children}
    </div>
  );
}

LegendItem.displayName = "LegendItem";

export interface LegendLabelProps {
  /** Label class name. @default "text-sm font-medium" */
  className?: string;
}

export function LegendLabel({
  className = "text-sm font-medium",
}: LegendLabelProps) {
  const { item } = useLegendItem();

  return <span className={cn("text-foreground", className)}>{item.label}</span>;
}

LegendLabel.displayName = "LegendLabel";

export interface LegendMarkerProps {
  /** Marker size class. @default "h-2.5 w-2.5" */
  className?: string;
}

export function LegendMarker({ className = "h-2.5 w-2.5" }: LegendMarkerProps) {
  const { item } = useLegendItem();

  // Note: backgroundColor must remain inline style as item.color is dynamic data
  return (
    <div
      className={cn("shrink-0 rounded-full", className)}
      style={{ backgroundColor: item.color }}
    />
  );
}

LegendMarker.displayName = "LegendMarker";

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

export interface LegendProgressProps {
  /** Track height. @default "h-1.5" */
  height?: string;
  /** Indicator class name */
  indicatorClassName?: string;
  /** Track class name */
  trackClassName?: string;
}

export function LegendProgress({
  trackClassName = "",
  indicatorClassName = "",
  height = "h-1.5",
}: LegendProgressProps) {
  const { item } = useLegendItem();

  if (!item.maxValue) {
    return null;
  }

  // Note: item.color must remain inline style as it's dynamic data
  return (
    <Progress.Root max={item.maxValue} value={item.value}>
      <Progress.Track
        className={cn(
          "w-full overflow-hidden rounded-full bg-foreground/10",
          height,
          trackClassName
        )}
      >
        <Progress.Indicator
          className={cn(
            "h-full rounded-full transition-all duration-500",
            indicatorClassName
          )}
          style={{ backgroundColor: item.color }}
        />
      </Progress.Track>
    </Progress.Root>
  );
}

LegendProgress.displayName = "LegendProgress";
