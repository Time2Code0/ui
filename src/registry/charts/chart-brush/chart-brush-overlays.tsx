"use client";

import type { BrushHandleRenderProps } from "@visx/brush";
import type { CSSProperties, RefObject } from "react";
import type { Margin } from "../chart-core/chart-context";

import { useId } from "react";
import { createPortal } from "react-dom";

import {
  useChartPortalContainer,
  useChartStable,
} from "../chart-core/chart-context";
import {
  type PatternPresetId,
  type PatternPresetOptions,
  renderPatternPreset,
} from "../chart-patterns/pattern-preset";

/** Fade dimming panes at the outer track ends — matches series edge fade (15%). */
const BRUSH_TRACK_OUTER_FADE = 0.15;

export interface ChartBrushTrackOverlayStyle {
  /** Backdrop blur in px (0–5). @default 1.5 */
  blurPx?: number;
  /** Fade blur at the outer left/right track ends. @default true */
  fadeOuterEdges?: boolean;
}

function outsidePaneStyle(
  edge: "left" | "right",
  style: Required<ChartBrushTrackOverlayStyle>
): CSSProperties {
  const fadeStop = `${BRUSH_TRACK_OUTER_FADE * 100}%`;
  let mask: string | undefined;
  if (style.fadeOuterEdges) {
    mask =
      edge === "left"
        ? `linear-gradient(to right, transparent 0%, black ${fadeStop}, black 100%)`
        : `linear-gradient(to left, transparent 0%, black ${fadeStop}, black 100%)`;
  }

  return {
    backdropFilter: style.blurPx > 0 ? `blur(${style.blurPx}px)` : undefined,
    maskImage: mask,
    pointerEvents: "none",
    WebkitBackdropFilter:
      style.blurPx > 0 ? `blur(${style.blurPx}px)` : undefined,
    WebkitMaskImage: mask,
  };
}

export interface ChartBrushTrackOverlayProps
  extends ChartBrushTrackOverlayStyle {
  innerHeight: number;
  innerWidth: number;
  /** Pixel x of the selection start within the plot area. */
  selectionX0: number;
  /** Pixel x of the selection end within the plot area. */
  selectionX1: number;
}

export interface ChartBrushOverlayHost {
  containerRef: RefObject<HTMLDivElement | null>;
  margin: Margin;
}

export function ChartBrushTrackOverlayContent({
  containerRef,
  margin,
  innerWidth,
  innerHeight,
  selectionX0,
  selectionX1,
  blurPx = 1.5,
  fadeOuterEdges = true,
}: ChartBrushTrackOverlayProps & ChartBrushOverlayHost) {
  const overlayStyle: Required<ChartBrushTrackOverlayStyle> = {
    blurPx: Math.min(5, Math.max(0, blurPx)),
    fadeOuterEdges,
  };

  const container = useChartPortalContainer(containerRef);
  if (!container) {
    return null;
  }

  const x0 = Math.max(0, Math.min(selectionX0, selectionX1, innerWidth));
  const x1 = Math.max(
    x0,
    Math.min(Math.max(selectionX0, selectionX1), innerWidth)
  );
  const leftWidth = Math.max(0, x0);
  const rightWidth = Math.max(0, innerWidth - x1);

  if (leftWidth <= 0 && rightWidth <= 0) {
    return null;
  }

  const plotLeft = margin.left;
  const plotTop = margin.top;

  return createPortal(
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1]"
    >
      {leftWidth > 0 ? (
        <div
          className="absolute"
          style={{
            ...outsidePaneStyle("left", overlayStyle),
            height: innerHeight,
            left: plotLeft,
            top: plotTop,
            width: leftWidth,
          }}
        />
      ) : null}
      {rightWidth > 0 ? (
        <div
          className="absolute"
          style={{
            ...outsidePaneStyle("right", overlayStyle),
            height: innerHeight,
            left: plotLeft + x1,
            top: plotTop,
            width: rightWidth,
          }}
        />
      ) : null}
    </div>,
    container
  );
}

export function ChartBrushTrackOverlay(props: ChartBrushTrackOverlayProps) {
  const { containerRef, margin } = useChartStable();

  return (
    <ChartBrushTrackOverlayContent
      {...props}
      containerRef={containerRef}
      margin={margin}
    />
  );
}

/** Matches shadcn `ResizableHandle` withHandle pill (`h-6 w-1 rounded-lg`). */
const HANDLE_HEIGHT_PX = 24;
const HANDLE_WIDTH_PX = 4;

/**
 * Invisible hit target for visx `BrushHandle` drag interaction.
 * Visible pills render in `ChartBrushHandleOverlay` above the blur layer.
 */
function brushHandleCursor(className: string) {
  return className.includes("left") || className.includes("right")
    ? "ew-resize"
    : "ns-resize";
}

export function renderChartBrushHandle({
  x,
  y,
  width,
  height,
  className,
}: BrushHandleRenderProps) {
  return (
    <rect
      className={className}
      fill="transparent"
      height={height}
      style={{ cursor: brushHandleCursor(className) }}
      width={width}
      x={x}
      y={y}
    />
  );
}

export interface ChartBrushHandleOverlayProps {
  innerHeight: number;
  innerWidth: number;
  /** Pixel x of the selection start within the plot area. */
  selectionX0: number;
  /** Pixel x of the selection end within the plot area. */
  selectionX1: number;
}

/** Renders brush resize pills above the outside blur portal (`z-[2]`). */
function ChartBrushHandleOverlayContent({
  containerRef,
  margin,
  innerWidth,
  innerHeight,
  selectionX0,
  selectionX1,
}: ChartBrushHandleOverlayProps & ChartBrushOverlayHost) {
  const container = useChartPortalContainer(containerRef);
  if (!container) {
    return null;
  }

  const x0 = Math.max(0, Math.min(selectionX0, selectionX1, innerWidth));
  const x1 = Math.max(
    x0,
    Math.min(Math.max(selectionX0, selectionX1), innerWidth)
  );
  const edges = x0 === x1 ? [x0] : [x0, x1];

  const plotLeft = margin.left;
  const plotTop = margin.top;
  const handleTop = plotTop + (innerHeight - HANDLE_HEIGHT_PX) / 2;

  return createPortal(
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2]"
    >
      {edges.map((edgeX) => (
        <div
          className="absolute shrink-0 rounded-lg"
          key={edgeX}
          style={{
            backgroundColor:
              "color-mix(in oklab, var(--color-foreground) 10%, transparent)",
            height: HANDLE_HEIGHT_PX,
            left: plotLeft + edgeX - HANDLE_WIDTH_PX / 2,
            top: handleTop,
            width: HANDLE_WIDTH_PX,
          }}
        />
      ))}
    </div>,
    container
  );
}

export function ChartBrushHandleOverlay(props: ChartBrushHandleOverlayProps) {
  const { containerRef, margin } = useChartStable();

  return (
    <ChartBrushHandleOverlayContent
      {...props}
      containerRef={containerRef}
      margin={margin}
    />
  );
}

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
function ChartBrushSelectionOverlayContent({
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
