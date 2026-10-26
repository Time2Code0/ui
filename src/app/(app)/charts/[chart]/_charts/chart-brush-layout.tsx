"use client";

import type { ChartBrushSelection } from "./chart-brush";

import {
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { cn } from "cn";

import { resolveBrushTrackXExtent } from "@/registry/charts/filter-data-by-x-domain";

export interface ChartBrushLayoutState {
  brushSelection: ChartBrushSelection | null;
  onBrushSelectionChange: (selection: ChartBrushSelection | null) => void;
  xDomain: [Date, Date] | undefined;
  xDomainSlotCount: number | undefined;
}

export interface ChartBrushLayoutProps {
  /** Mini chart + brush handles rendered below the main chart when `enabled`. */
  brushStrip?: (layout: ChartBrushLayoutState) => ReactNode;
  children: (layout: ChartBrushLayoutState) => ReactNode;
  className?: string;
  /** Full dataset backing the brush strip and main chart. */
  data: Record<string, unknown>[];
  /** When false, children render without brush zoom state. */
  enabled: boolean;
  /** When true, the main chart area hugs content instead of growing to fill space. */
  fitMainContent?: boolean;
  /** Fixed height of the brush strip in pixels. */
  height: number;
  xDataKey?: string;
  /** Extends the brush track max beyond the last data row (e.g. projection horizon). */
  xExtentMax?: Date;
}

function createXAccessor(xDataKey: string) {
  return (d: Record<string, unknown>): Date => {
    const value = d[xDataKey];
    return value instanceof Date ? value : new Date(value as string | number);
  };
}

export const ChartBrushLayout = memo(function ChartBrushLayout({
  data,
  xDataKey = "date",
  xExtentMax,
  enabled,
  height,
  fitMainContent = false,
  className,
  children,
  brushStrip,
}: ChartBrushLayoutProps) {
  const xAccessor = useMemo(() => createXAccessor(xDataKey), [xDataKey]);
  const fullExtent = useMemo(
    () => resolveBrushTrackXExtent(data, xAccessor, xExtentMax),
    [data, xAccessor, xExtentMax]
  );
  const [brushSelection, setBrushSelection] =
    useState<ChartBrushSelection | null>(null);

  useEffect(() => {
    if (!fullExtent) {
      setBrushSelection(null);
      return;
    }
    setBrushSelection({ end: fullExtent[1], start: fullExtent[0] });
  }, [fullExtent]);

  const handleBrushSelectionChange = useCallback(
    (selection: ChartBrushSelection | null) => {
      if (!selection) {
        if (fullExtent) {
          setBrushSelection({ end: fullExtent[1], start: fullExtent[0] });
        }
        return;
      }
      setBrushSelection(selection);
    },
    [fullExtent]
  );

  const layoutState = useMemo<ChartBrushLayoutState>(
    () => ({
      brushSelection,
      onBrushSelectionChange: handleBrushSelectionChange,
      xDomain:
        enabled && brushSelection
          ? ([brushSelection.start, brushSelection.end] as [Date, Date])
          : undefined,
      xDomainSlotCount: enabled ? data.length : undefined,
    }),
    [brushSelection, data.length, enabled, handleBrushSelectionChange]
  );

  return (
    <div
      className={cn(
        "flex size-full min-h-0 min-w-0 flex-col",
        fitMainContent ? "justify-start gap-1" : "gap-3",
        className
      )}
    >
      <div
        className={cn(
          "min-h-0 min-w-0",
          fitMainContent ? "shrink-0" : "flex-1"
        )}
      >
        {children(layoutState)}
      </div>
      {enabled && brushStrip ? (
        <div className="min-h-0 shrink-0" style={{ height }}>
          {brushStrip(layoutState)}
        </div>
      ) : null}
    </div>
  );
});
