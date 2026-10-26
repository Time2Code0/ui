"use client";

import type { CSSProperties, RefObject } from "react";
import type { Margin } from "@/registry/charts/chart-context";

import { createPortal } from "react-dom";

import {
  useChartPortalContainer,
  useChartStable,
} from "@/registry/charts/chart-context";

/** Fade dimming panes at the outer track ends — matches series edge fade (15%). */
const BRUSH_TRACK_OUTER_FADE = 0.15;

export interface ChartBrushTrackOverlayStyle {
  /** Backdrop blur in px (0–5). Default: 1.5 */
  blurPx?: number;
  /** Fade blur at the outer left/right track ends. Default: true */
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
