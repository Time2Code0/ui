"use client";

import type React from "react";

import { memo, useCallback, useMemo, useRef, useState } from "react";

import { chartCssVars, useChartStable } from "../chart-core/chart-context";
import {
  ChartBrushHandleOverlay,
  ChartBrushSelectionOverlay,
  type ChartBrushSelectionPattern,
  ChartBrushTrackOverlay,
  type ChartBrushTrackOverlayStyle,
} from "./chart-brush-overlays";

export interface ChartBrushSelection {
  end: Date;
  start: Date;
}

export interface ChartBrushProps {
  /** Backdrop blur on dimmed track (0–5 px). @default 1.5 */
  blurPx?: number;
  /** Fade dimmed regions at the outer track edges. @default true */
  fadeOuterEdges?: boolean;
  /** Initial selection so the brush overlay is visible on load (e.g. first 50% of range). */
  initialSelection?: ChartBrushSelection | null;
  /** Callback while the selection changes and when it ends. Domain is the selected time range. */
  onSelectionChange?: (domain: ChartBrushSelection | null) => void;
  /** Fill style for the selected region. Defaults to the chart segment style. */
  selectedBoxStyle?: React.SVGProps<SVGRectElement>;
  /** Current selection (e.g. from parent state). When set, a visible selection rect is drawn. */
  selection?: ChartBrushSelection | null;
  /** Optional pattern overlay inside the brush selection window. */
  selectionPattern?: ChartBrushSelectionPattern;
}

type XScale = ReturnType<typeof useChartStable>["xScale"];

/** Selection in plot pixels (`x0 <= x1`). */
interface PixelExtent {
  x0: number;
  x1: number;
}

/** What a drag does: draw a new selection, move it, or resize one edge. */
type BrushDragMode = "select" | "move" | "left" | "right";

interface BrushDrag {
  mode: BrushDragMode;
  /** Client x at pointer down; moves are measured from here. */
  originClientX: number;
  /** Pointer x (plot px) at pointer down. */
  originX: number;
  /** Selection at pointer down (`null` while drawing a new one). */
  start: PixelExtent | null;
}

/** Width of the invisible resize hit areas on each selection edge. */
const HANDLE_SIZE = 8;
/** The selection is widened by this many px on each side before inverting. */
const SAFE_PIXEL = 2;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Selected time range for a pixel extent; `null` when it has no width. */
function extentToSelection(
  extent: PixelExtent | null,
  xScale: XScale
): ChartBrushSelection | null {
  if (!extent || extent.x1 <= extent.x0) {
    return null;
  }
  return {
    end: xScale.invert(extent.x1 + SAFE_PIXEL),
    start: xScale.invert(extent.x0 - SAFE_PIXEL),
  };
}

/** Pixel extent of a selection, clamped to the plot; `null` when empty. */
function selectionToExtent(
  selection: ChartBrushSelection | null | undefined,
  xScale: XScale,
  innerWidth: number
): PixelExtent | null {
  if (!selection) {
    return null;
  }
  const x0 = Math.max(0, xScale(selection.start) ?? 0);
  const x1 = Math.min(innerWidth, xScale(selection.end) ?? innerWidth);
  return x1 > x0 ? { x0, x1 } : null;
}

/** Selection after the pointer moved `dx` px since pointer down. */
function dragExtent(
  { mode, originX, start }: BrushDrag,
  dx: number,
  width: number
): PixelExtent | null {
  if (mode === "select" || !start) {
    const end = clamp(originX + dx, 0, width);
    return { x0: Math.min(originX, end), x1: Math.max(originX, end) };
  }
  if (mode === "move") {
    const offset = clamp(dx, -start.x0, width - start.x1);
    return { x0: start.x0 + offset, x1: start.x1 + offset };
  }
  const edge = clamp((mode === "left" ? start.x0 : start.x1) + dx, 0, width);
  const other = mode === "left" ? start.x1 : start.x0;
  return { x0: Math.min(edge, other), x1: Math.max(edge, other) };
}

interface BrushInteractionProps {
  height: number;
  initialExtent: PixelExtent | null;
  onChange: (extent: PixelExtent | null) => void;
  selectedBoxStyle: React.SVGProps<SVGRectElement>;
  width: number;
}

/**
 * Pointer handling for the brush track: drag the empty track to draw a
 * selection, drag the selection to move it, drag its edges to resize it, and
 * click the track to clear it. Reports every change in plot pixels; the
 * visible chrome comes from the overlays.
 */
function BrushInteraction({
  height,
  initialExtent,
  onChange,
  selectedBoxStyle,
  width,
}: BrushInteractionProps) {
  const [extent, setExtent] = useState(initialExtent);
  const extentRef = useRef(initialExtent);
  const dragRef = useRef<BrushDrag | null>(null);

  const update = useCallback(
    (next: PixelExtent | null) => {
      extentRef.current = next;
      setExtent(next);
      onChange(next);
    },
    [onChange]
  );

  const startDrag =
    (mode: BrushDragMode) => (event: React.PointerEvent<SVGRectElement>) => {
      if (event.button !== 0) {
        return;
      }
      const target = event.currentTarget;
      target.setPointerCapture(event.pointerId);
      const isSelect = mode === "select";
      dragRef.current = {
        mode,
        originClientX: event.clientX,
        // Only the track rect spans the plot, so only it maps to plot px.
        originX: isSelect
          ? event.clientX - target.getBoundingClientRect().left
          : 0,
        start: isSelect ? null : extentRef.current,
      };
      if (isSelect) {
        update(null);
      }
    };

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<SVGGElement>) => {
      const drag = dragRef.current;
      if (drag) {
        update(dragExtent(drag, event.clientX - drag.originClientX, width));
      }
    },
    [update, width]
  );

  const endDrag = useCallback(() => {
    if (dragRef.current) {
      dragRef.current = null;
      // Commit: a click on the track without a drag clears the selection.
      onChange(extentRef.current);
    }
  }, [onChange]);

  return (
    <g
      onLostPointerCapture={endDrag}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
    >
      <rect
        fill="transparent"
        height={height}
        onPointerDown={startDrag("select")}
        style={{ cursor: "crosshair" }}
        width={width}
      />
      {extent ? (
        <>
          <rect
            fill="transparent"
            height={height}
            onPointerDown={startDrag("move")}
            width={extent.x1 - extent.x0}
            x={extent.x0}
            {...selectedBoxStyle}
            style={{ cursor: "move", ...selectedBoxStyle.style }}
          />
          {(["right", "left"] as const).map((edge) => (
            <rect
              fill="transparent"
              height={height}
              key={edge}
              onPointerDown={startDrag(edge)}
              style={{ cursor: "ew-resize" }}
              width={HANDLE_SIZE}
              x={(edge === "left" ? extent.x0 : extent.x1) - HANDLE_SIZE / 2}
              y={-HANDLE_SIZE / 2}
            />
          ))}
        </>
      ) : null}
    </g>
  );
}

interface ChartBrushInnerProps extends ChartBrushTrackOverlayStyle {
  initialSelection?: ChartBrushProps["initialSelection"];
  innerHeight: number;
  innerWidth: number;
  onSelectionChange?: ChartBrushProps["onSelectionChange"];
  selectedBoxStyle?: ChartBrushProps["selectedBoxStyle"];
  selectionPattern?: ChartBrushSelectionPattern;
  xScale: XScale;
}

const ChartBrushInner = memo(function ChartBrushInner({
  selectedBoxStyle,
  initialSelection,
  xScale,
  innerWidth,
  innerHeight,
  onSelectionChange,
  blurPx,
  fadeOuterEdges,
  selectionPattern,
}: ChartBrushInnerProps) {
  const initialExtent = useMemo(
    () => selectionToExtent(initialSelection, xScale, innerWidth),
    [initialSelection, xScale, innerWidth]
  );
  const fullExtent = { x0: 0, x1: innerWidth };

  const [pixelExtent, setPixelExtent] = useState(initialExtent ?? fullExtent);

  // Reset the extent when the initial selection / width change — adjusted
  // during render ("store previous props in state"), not setState in an effect.
  const [extentSource, setExtentSource] = useState({
    initialExtent,
    innerWidth,
  });
  if (
    extentSource.initialExtent !== initialExtent ||
    extentSource.innerWidth !== innerWidth
  ) {
    setExtentSource({ initialExtent, innerWidth });
    setPixelExtent(initialExtent ?? fullExtent);
  }

  const handleChange = useCallback(
    (extent: PixelExtent | null) => {
      const selection = extentToSelection(extent, xScale);
      const pixels = selectionToExtent(selection, xScale, innerWidth);
      if (pixels) {
        setPixelExtent(pixels);
      }
      onSelectionChange?.(selection);
    },
    [innerWidth, onSelectionChange, xScale]
  );

  return (
    <g className="chart-brush">
      <ChartBrushTrackOverlay
        blurPx={blurPx}
        fadeOuterEdges={fadeOuterEdges}
        innerHeight={innerHeight}
        innerWidth={innerWidth}
        selectionX0={pixelExtent.x0}
        selectionX1={pixelExtent.x1}
      />
      <ChartBrushSelectionOverlay
        innerHeight={innerHeight}
        innerWidth={innerWidth}
        pattern={selectionPattern}
        selectionX0={pixelExtent.x0}
        selectionX1={pixelExtent.x1}
      />
      <ChartBrushHandleOverlay
        innerHeight={innerHeight}
        innerWidth={innerWidth}
        selectionX0={pixelExtent.x0}
        selectionX1={pixelExtent.x1}
      />
      <BrushInteraction
        height={innerHeight}
        initialExtent={initialExtent}
        key={`brush-${innerWidth}-${innerHeight}`}
        onChange={handleChange}
        selectedBoxStyle={
          selectedBoxStyle ?? {
            fillOpacity: 0,
            stroke: chartCssVars.brushBorder,
            strokeWidth: 1,
          }
        }
        width={innerWidth}
      />
    </g>
  );
});

export function ChartBrush({
  onSelectionChange,
  selectedBoxStyle,
  initialSelection,
  selection: _selection,
  blurPx,
  fadeOuterEdges,
  selectionPattern,
}: ChartBrushProps) {
  const { xScale, innerWidth, innerHeight, isLoaded } = useChartStable();

  if (!isLoaded || innerWidth <= 0 || innerHeight <= 0) {
    return null;
  }

  return (
    <ChartBrushInner
      blurPx={blurPx}
      fadeOuterEdges={fadeOuterEdges}
      initialSelection={initialSelection}
      innerHeight={innerHeight}
      innerWidth={innerWidth}
      onSelectionChange={onSelectionChange}
      selectedBoxStyle={selectedBoxStyle}
      selectionPattern={selectionPattern}
      xScale={xScale}
    />
  );
}

ChartBrush.displayName = "ChartBrush";
