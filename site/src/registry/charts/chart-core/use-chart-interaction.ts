"use client";

import type { scaleLinear, scaleTime } from "@visx/scale";
import type {
  BandConfig,
  LineConfig,
  Margin,
  TooltipData,
} from "./chart-context";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { localPoint } from "@visx/event";
import { bisector } from "d3-array";

import {
  type ScatterJitterOffsets,
  scatterJitterOffset,
} from "./scatter-jitter";
import { useScheduledTooltip } from "./use-scheduled-tooltip";
import { normalizeYAxisId } from "./y-axis-scales";

type ScaleTime = ReturnType<typeof scaleTime<number>>;
type ScaleLinear = ReturnType<typeof scaleLinear<number>>;
type Datum = Record<string, unknown>;
type ChartPointerEvent =
  | React.MouseEvent<SVGGElement>
  | React.TouchEvent<SVGGElement>;

export interface ChartSelection {
  active: boolean;
  endIndex: number;
  endX: number;
  startIndex: number;
  startX: number;
}

interface UseChartInteractionParams {
  /** `<Band>` configs — edge y-positions for tooltip dots. */
  bands?: BandConfig[];
  canInteract: boolean;
  data: Datum[];
  /**
   * Scatter jitter offsets. When set, hover resolves to the nearest jittered
   * point in 2D instead of the nearest x column.
   */
  jitter?: ScatterJitterOffsets | null;
  lines: LineConfig[];
  margin: Margin;
  xAccessor: (d: Datum) => Date;
  xScale: ScaleTime;
  yScale: ScaleLinear;
  yScales: Record<string, ScaleLinear>;
}

interface ChartInteractionResult {
  clearSelection: () => void;
  interactionHandlers: {
    onMouseMove?: (event: React.MouseEvent<SVGGElement>) => void;
    onMouseLeave?: () => void;
    onMouseDown?: (event: React.MouseEvent<SVGGElement>) => void;
    onMouseUp?: () => void;
    onTouchStart?: (event: React.TouchEvent<SVGGElement>) => void;
    onTouchMove?: (event: React.TouchEvent<SVGGElement>) => void;
    onTouchEnd?: () => void;
  };
  interactionStyle: React.CSSProperties;
  selection: ChartSelection | null;
  setTooltipData: React.Dispatch<React.SetStateAction<TooltipData | null>>;
  tooltipData: TooltipData | null;
}

interface ChartPoint {
  x: number;
  y: number;
}

interface JitteredPoint extends ChartPoint {
  dataKey: string;
  index: number;
}

/** Pixel y per line dataKey, plus band edge keys (line keys win on collisions). */
function resolveYPositions(
  d: Datum,
  lines: LineConfig[],
  bands: BandConfig[] | undefined,
  yScales: Record<string, ScaleLinear>,
  yScale: ScaleLinear
): Record<string, number> {
  const yPositions: Record<string, number> = {};
  const place = (key: string, yAxisId: string | number | undefined) => {
    const value = d[key];
    if (typeof value === "number") {
      const axisScale = yScales[normalizeYAxisId(yAxisId)] ?? yScale;
      yPositions[key] = axisScale(value) ?? 0;
    }
  };
  for (const band of bands ?? []) {
    if (band.showInTooltip) {
      place(band.upperKey, band.yAxisId);
      place(band.lowerKey, band.yAxisId);
    }
  }
  // Lines last so they win when a band edge shares a line's key.
  for (const line of lines) {
    place(line.dataKey, line.yAxisId);
  }
  return yPositions;
}

/**
 * Hover, drag-to-select and pinch-to-select for x-based charts. The tooltip
 * snaps to the nearest x column, or with `jitter` to the nearest point.
 */
export function useChartInteraction({
  xScale,
  yScale,
  yScales,
  data,
  lines,
  bands,
  margin,
  xAccessor,
  canInteract,
  jitter = null,
}: UseChartInteractionParams): ChartInteractionResult {
  const [selection, setSelection] = useState<ChartSelection | null>(null);
  const {
    tooltipData,
    setTooltipData,
    scheduleTooltip,
    clearTooltip,
    resetTooltipDedupe,
  } = useScheduledTooltip<TooltipData>();

  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef<number>(0);
  const lastHoveredRef = useRef<ChartPoint | null>(null);

  const bisectDate = useMemo(
    () => bisector<Datum, Date>((d) => xAccessor(d)).left,
    [xAccessor]
  );

  /** Index of the datum nearest to `pixelX`; -1 when there is no data. */
  const nearestIndexAtX = useCallback(
    (pixelX: number): number => {
      const x0 = xScale.invert(pixelX);
      const index = bisectDate(data, x0, 1);
      const d0 = data[index - 1];
      const d1 = data[index];
      if (!d0) {
        return -1;
      }
      if (d1) {
        const d0Time = xAccessor(d0).getTime();
        const d1Time = xAccessor(d1).getTime();
        if (x0.getTime() - d0Time > d1Time - x0.getTime()) {
          return index;
        }
      }
      return index - 1;
    },
    [xScale, data, xAccessor, bisectDate]
  );

  const resolveTooltipFromX = useCallback(
    (pixelX: number): TooltipData | null => {
      const index = nearestIndexAtX(pixelX);
      const d = data[index];
      if (!d) {
        return null;
      }
      return {
        index,
        point: d,
        x: xScale(xAccessor(d)) ?? 0,
        yPositions: resolveYPositions(d, lines, bands, yScales, yScale),
      };
    },
    [nearestIndexAtX, data, xScale, xAccessor, lines, bands, yScales, yScale]
  );

  /** Jittered pixel positions for every rendered point (only when jitter is on). */
  const jitteredPoints = useMemo<JitteredPoint[]>(() => {
    if (!jitter) {
      return [];
    }
    const points: JitteredPoint[] = [];
    for (const [seriesIndex, line] of lines.entries()) {
      const axisScale = yScales[normalizeYAxisId(line.yAxisId)] ?? yScale;
      for (const [index, d] of data.entries()) {
        const value = d[line.dataKey];
        if (typeof value !== "number") {
          continue;
        }
        const offset = scatterJitterOffset(jitter, index, seriesIndex);
        points.push({
          dataKey: line.dataKey,
          index,
          x: (xScale(xAccessor(d)) ?? 0) + offset.x,
          y: (axisScale(value) ?? 0) + offset.y,
        });
      }
    }
    return points;
  }, [jitter, lines, data, xScale, xAccessor, yScale, yScales]);

  const resolveTooltip = useCallback(
    (point: ChartPoint): TooltipData | null => {
      if (!jitter || jitteredPoints.length === 0) {
        return resolveTooltipFromX(point.x);
      }
      let nearest: JitteredPoint | null = null;
      let nearestDistance = Number.POSITIVE_INFINITY;
      for (const candidate of jitteredPoints) {
        const dx = candidate.x - point.x;
        const dy = candidate.y - point.y;
        const distance = dx * dx + dy * dy;
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = candidate;
        }
      }
      const d = nearest ? data[nearest.index] : undefined;
      if (!(nearest && d)) {
        return null;
      }
      const xPositions: Record<string, number> = {};
      const yPositions: Record<string, number> = {};
      const baseX = xScale(xAccessor(d)) ?? 0;
      for (const [seriesIndex, line] of lines.entries()) {
        const value = d[line.dataKey];
        if (typeof value !== "number") {
          continue;
        }
        const axisScale = yScales[normalizeYAxisId(line.yAxisId)] ?? yScale;
        const offset = scatterJitterOffset(jitter, nearest.index, seriesIndex);
        xPositions[line.dataKey] = baseX + offset.x;
        yPositions[line.dataKey] = (axisScale(value) ?? 0) + offset.y;
      }
      return {
        activeDataKey: nearest.dataKey,
        index: nearest.index,
        point: d,
        x: baseX,
        xPositions,
        yPositions,
      };
    },
    [
      jitter,
      jitteredPoints,
      resolveTooltipFromX,
      data,
      lines,
      xScale,
      xAccessor,
      yScale,
      yScales,
    ]
  );

  /** Pointer position in plot coordinates (margin removed). */
  const getChartPoint = useCallback(
    (event: ChartPointerEvent, touchIndex = 0): ChartPoint | null => {
      const svg = event.currentTarget.ownerSVGElement;
      let point: ChartPoint | null;
      if ("touches" in event) {
        const touch = event.touches[touchIndex];
        if (!(touch && svg)) {
          return null;
        }
        point = localPoint(svg, touch as unknown as MouseEvent);
      } else {
        point = localPoint(event);
      }
      if (!point) {
        return null;
      }
      return { x: point.x - margin.left, y: point.y - margin.top };
    },
    [margin.left, margin.top]
  );

  const hoverAt = useCallback(
    (point: ChartPoint) => {
      lastHoveredRef.current = point;
      const tooltip = resolveTooltip(point);
      if (tooltip) {
        scheduleTooltip(tooltip);
      }
    },
    [resolveTooltip, scheduleTooltip]
  );

  const selectRange = useCallback(
    (fromX: number, toX: number) => {
      const startX = Math.min(fromX, toX);
      const endX = Math.max(fromX, toX);
      setSelection({
        active: true,
        endIndex: Math.max(0, nearestIndexAtX(endX)),
        endX,
        startIndex: Math.max(0, nearestIndexAtX(startX)),
        startX,
      });
    },
    [nearestIndexAtX]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGGElement>) => {
      const point = getChartPoint(event);
      if (!point) {
        return;
      }
      if (isDraggingRef.current) {
        selectRange(dragStartXRef.current, point.x);
        return;
      }
      hoverAt(point);
    },
    [getChartPoint, selectRange, hoverAt]
  );

  const handleMouseLeave = useCallback(() => {
    lastHoveredRef.current = null;
    clearTooltip();
    isDraggingRef.current = false;
    setSelection(null);
  }, [clearTooltip]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<SVGGElement>) => {
      const point = getChartPoint(event);
      if (!point) {
        return;
      }
      isDraggingRef.current = true;
      dragStartXRef.current = point.x;
      clearTooltip();
      setSelection(null);
    },
    [getChartPoint, clearTooltip]
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    setSelection(null);
  }, []);

  /** One finger hovers; two fingers select the range between them. */
  const handleTouch = useCallback(
    (event: React.TouchEvent<SVGGElement>, isStart: boolean) => {
      if (event.touches.length === 1) {
        event.preventDefault();
        const point = getChartPoint(event, 0);
        if (point) {
          hoverAt(point);
        }
      } else if (event.touches.length === 2) {
        event.preventDefault();
        if (isStart) {
          resetTooltipDedupe();
          clearTooltip();
        }
        const first = getChartPoint(event, 0);
        const second = getChartPoint(event, 1);
        if (first && second) {
          selectRange(first.x, second.x);
        }
      }
    },
    [getChartPoint, hoverAt, selectRange, resetTooltipDedupe, clearTooltip]
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<SVGGElement>) => handleTouch(event, true),
    [handleTouch]
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent<SVGGElement>) => handleTouch(event, false),
    [handleTouch]
  );

  const handleTouchEnd = useCallback(() => {
    clearTooltip();
    setSelection(null);
  }, [clearTooltip]);

  const clearSelection = useCallback(() => {
    setSelection(null);
  }, []);

  // Re-anchor tooltip/crosshair when x-scale or visible data changes (e.g. brush zoom commit).
  useEffect(() => {
    if (!canInteract || lastHoveredRef.current === null) {
      return;
    }
    const tooltip = resolveTooltip(lastHoveredRef.current);
    if (tooltip) {
      scheduleTooltip(tooltip, `${tooltip.index}:${Math.round(tooltip.x)}`);
      return;
    }
    clearTooltip();
  }, [canInteract, clearTooltip, resolveTooltip, scheduleTooltip]);

  const interactionHandlers = canInteract
    ? {
        onMouseDown: handleMouseDown,
        onMouseLeave: handleMouseLeave,
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp,
        onTouchEnd: handleTouchEnd,
        onTouchMove: handleTouchMove,
        onTouchStart: handleTouchStart,
      }
    : {};

  const interactionStyle: React.CSSProperties = {
    cursor: canInteract ? "crosshair" : "default",
    touchAction: "none",
  };

  return {
    clearSelection,
    interactionHandlers,
    interactionStyle,
    selection,
    setTooltipData,
    tooltipData,
  };
}
