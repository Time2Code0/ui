"use client";

import type { ChartBrushOverlayHost } from "./chart-brush-track-overlay";

import { useId } from "react";
import { createPortal } from "react-dom";

import {
  useChartPortalContainer,
  useChartStable,
} from "@/registry/charts/chart-context";
import {
  type PatternPresetId,
  type PatternPresetOptions,
  renderPatternPreset,
} from "@/registry/charts/pattern-preset";

export type ChartBrushPatternPreset = PatternPresetId;

export interface ChartBrushSelectionPattern extends PatternPresetOptions {
  color: string;
  opacity?: number;
  preset: ChartBrushPatternPreset;
}

export interface ChartBrushSelectionOverlayProps {
  innerHeight: number;
  innerWidth: number;
  pattern?: ChartBrushSelectionPattern;
  selectionX0: number;
  selectionX1: number;
}

/** Pattern fill between brush handles (`z-[1]`, above blur panes). */
export function ChartBrushSelectionOverlayContent({
  containerRef,
  margin,
  innerWidth,
  innerHeight,
  selectionX0,
  selectionX1,
  pattern,
}: ChartBrushSelectionOverlayProps & ChartBrushOverlayHost) {
  const patternId = useId().replace(/:/g, "");

  const container = useChartPortalContainer(containerRef);
  if (!(container && pattern && pattern.preset !== "none")) {
    return null;
  }

  const x0 = Math.max(0, Math.min(selectionX0, selectionX1, innerWidth));
  const x1 = Math.max(
    x0,
    Math.min(Math.max(selectionX0, selectionX1), innerWidth)
  );
  const selectionWidth = x1 - x0;
  if (selectionWidth <= 0) {
    return null;
  }

  const plotLeft = margin.left;
  const plotTop = margin.top;
  const patternNode = renderPatternPreset(pattern.preset, patternId, {
    color: pattern.color,
    complement: pattern.complement,
    fill: pattern.fill,
    radius: pattern.radius,
    scale: pattern.scale,
    strokeWidth: pattern.strokeWidth,
    tileBackground: pattern.tileBackground,
  });
  if (!patternNode) {
    return null;
  }

  return createPortal(
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1]"
      height="100%"
      width="100%"
    >
      <defs>{patternNode}</defs>
      <rect
        fill={`url(#${patternId})`}
        fillOpacity={pattern.opacity ?? 1}
        height={innerHeight}
        width={selectionWidth}
        x={plotLeft + x0}
        y={plotTop}
      />
    </svg>,
    container
  );
}

export function ChartBrushSelectionOverlay(
  props: ChartBrushSelectionOverlayProps
) {
  const { containerRef, margin } = useChartStable();

  return (
    <ChartBrushSelectionOverlayContent
      {...props}
      containerRef={containerRef}
      margin={margin}
    />
  );
}
