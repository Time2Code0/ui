"use client";

import type { TooltipData } from "../chart-core/chart-context";
import type { ChartSelection } from "../chart-core/use-chart-interaction";

import { type RefObject, useId, useLayoutEffect, useMemo, useRef } from "react";

import { type MotionValue, motion, useSpring } from "motion/react";

import { useChartConfig } from "../chart-core/chart-config-context";
import { useChartHover, useChartStable } from "../chart-core/chart-context";

interface SeriesHighlightLayerProps {
  /** Caller already gated `showHighlight && showLine`; this just routes through. */
  enabled: boolean;
  height: number;
  pathRef: RefObject<SVGPathElement | null>;
  stroke: string;
  strokeWidth: number;
}

/**
 * Self-contained hover-highlight band over a series stroke.
 *
 * Owns the `useHighlightSegment` subscription (which reads both stable + hover
 * context) so the parent <Area> / <Line> can stay on the stable slice. This
 * component still re-renders on hover — that's the price of driving the
 * highlight band — but it's a tiny leaf so the cost is bounded to itself.
 */
export function SeriesHighlightLayer({
  enabled,
  height,
  pathRef,
  stroke,
  strokeWidth,
}: SeriesHighlightLayerProps) {
  const { isLoaded } = useChartStable();
  const { xSpring, widthSpring, isActive } = useHighlightSegment({ enabled });
  return (
    <HighlightSegment
      height={height}
      pathRef={pathRef}
      stroke={stroke}
      strokeWidth={strokeWidth}
      visible={enabled && isActive && isLoaded}
      width={widthSpring}
      x={xSpring}
    />
  );
}

SeriesHighlightLayer.displayName = "SeriesHighlightLayer";

// Hover-highlight overlay: re-strokes the base path `d`, clipped to a vertical
// band whose x/width spring to track the hovered point, so only the segment
// around the dot shows brighter. The band comes from `useHighlightSegment`;
// because the bright stroke reuses the base `d`, it follows whatever curve is
// drawn (see `highlight-segment-bounds.ts` for the band-extent caveat).

interface HighlightSegmentProps {
  /** Plot height — the clip band spans it fully. */
  height: number;
  /** Ref to the rendered base stroke `<path>` — its `d` is re-used verbatim. */
  pathRef: RefObject<SVGPathElement | null>;
  stroke: string;
  strokeWidth: number;
  /** Whether to render (caller gates on showHighlight + active + loaded). */
  visible: boolean;
  /** Spring-eased width of the clip band (px). */
  width: MotionValue<number>;
  /** Spring-eased left edge of the clip band (px). */
  x: MotionValue<number>;
}

function HighlightSegment({
  pathRef,
  visible,
  stroke,
  strokeWidth,
  height,
  x,
  width,
}: HighlightSegmentProps) {
  const clipId = useId();
  const highlightRef = useRef<SVGPathElement>(null);

  // Copy the base stroke's `d` after commit (before paint) instead of reading
  // `pathRef.current` during render — same frame, and it picks up the base
  // path's `d` from this commit rather than the previous one.
  useLayoutEffect(() => {
    if (!visible) {
      return;
    }
    highlightRef.current?.setAttribute(
      "d",
      pathRef.current?.getAttribute("d") || ""
    );
  });

  if (!visible) {
    return null;
  }
  return (
    <>
      <defs>
        <clipPath id={clipId}>
          {/* Bleed by strokeWidth so a stroke at the min/max value keeps its full width. */}
          <motion.rect
            height={height + strokeWidth * 2}
            width={width}
            x={x}
            y={-strokeWidth}
          />
        </clipPath>
      </defs>
      <motion.path
        animate={{ opacity: 1 }}
        clipPath={`url(#${clipId})`}
        exit={{ opacity: 0 }}
        fill="none"
        initial={{ opacity: 0 }}
        ref={highlightRef}
        stroke={stroke}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    </>
  );
}

HighlightSegment.displayName = "HighlightSegment";

// Hover-highlight band for `line.tsx` and `area.tsx`. Computes the segment
// bounds and springs its x/width; `<HighlightSegment>` renders the clipped
// re-stroke. Spring tuning comes from `ChartConfigProvider.highlightSpring`.
// Stable + hover slices are read separately so callers can see the exact
// subscription surface (anything calling this hook will re-render on hover).

interface HighlightSegmentResult {
  isActive: boolean;
  widthSpring: ReturnType<typeof useSpring>;
  xSpring: ReturnType<typeof useSpring>;
}

/**
 * @param enabled set false when there is no stroke to highlight (e.g. an area
 *   with `showLine={false}`); defaults true.
 */
function useHighlightSegment({
  enabled = true,
}: {
  enabled?: boolean;
} = {}): HighlightSegmentResult {
  const { data, xScale, xAccessor } = useChartStable();
  const { tooltipData, selection } = useChartHover();
  const { highlightSpring } = useChartConfig();

  const bounds = useMemo(
    () =>
      enabled
        ? computeSegmentBounds(data, xScale, xAccessor, tooltipData, selection)
        : INACTIVE_SEGMENT,
    [enabled, data, xScale, xAccessor, tooltipData, selection]
  );

  const xSpring = useSpring(0, highlightSpring);
  const widthSpring = useSpring(0, highlightSpring);

  // Jump on inactive→active so the band appears at the hovered point instead
  // of sliding in from x=0; ease on subsequent moves. Driven from a layout
  // effect (not render) so springs update before paint without mutating
  // MotionValues / refs during render.
  const wasActive = useRef(false);
  useLayoutEffect(() => {
    if (bounds.isActive && !wasActive.current) {
      xSpring.jump(bounds.x);
      widthSpring.jump(bounds.width);
    } else {
      xSpring.set(bounds.x);
      widthSpring.set(bounds.width);
    }
    wasActive.current = bounds.isActive;
  }, [bounds, xSpring, widthSpring]);

  return { isActive: bounds.isActive, widthSpring, xSpring };
}

// Pure geometry for the hover-highlight band, split out from the hook so it can
// be unit-tested without React/motion (see __tests__).
//
// The band is the pixel x-range one data point either side of the hovered point:
//   [ xScale(t(idx-1)), xScale(t(idx+1)) ]
// `<HighlightSegment>` then re-strokes the base path clipped to that band, so the
// highlight always traces the line itself. Selecting the band by data index
// assumes x is monotone along the path, which holds for a time series. On a curve
// that overshoots in x (curveNatural, curveBasis) a band edge can land a few
// pixels short, slightly narrowing the bright slice but never detaching it.

interface SegmentBounds {
  isActive: boolean;
  /** Width of the highlight band, in pixels. */
  width: number;
  /** Left edge of the highlight band, in pixels. */
  x: number;
}

const INACTIVE_SEGMENT: SegmentBounds = {
  isActive: false,
  width: 0,
  x: 0,
};

/**
 * The highlight band `{x, width}` in pixel space, from the data + `xScale` plus
 * the current hover/selection. Hover spans one data point either side of the dot
 * (clamped to the ends); an active drag-selection uses the dragged pixel range
 * directly and takes priority over hover.
 */
function computeSegmentBounds(
  data: Record<string, unknown>[],
  xScale: (value: Date) => number | undefined,
  xAccessor: (d: Record<string, unknown>) => Date,
  tooltipData: Pick<TooltipData, "index"> | null | undefined,
  selection:
    | Pick<ChartSelection, "active" | "startX" | "endX">
    | null
    | undefined
): SegmentBounds {
  if (data.length === 0) {
    return INACTIVE_SEGMENT;
  }

  if (selection?.active) {
    const x = Math.min(selection.startX, selection.endX);
    const width = Math.abs(selection.endX - selection.startX);
    return { isActive: true, width, x };
  }

  if (!tooltipData) {
    return INACTIVE_SEGMENT;
  }

  const idx = tooltipData.index;
  const startIdx = Math.max(0, idx - 1);
  const endIdx = Math.min(data.length - 1, idx + 1);
  const startPoint = data[startIdx];
  const endPoint = data[endIdx];
  if (!(startPoint && endPoint)) {
    return INACTIVE_SEGMENT;
  }

  const startX = xScale(xAccessor(startPoint)) ?? 0;
  const endX = xScale(xAccessor(endPoint)) ?? 0;
  return { isActive: true, width: Math.max(0, endX - startX), x: startX };
}
