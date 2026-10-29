"use client";

import {
  memo,
  type RefObject,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

interface SeriesDashTailOverlayProps {
  dashArray: string;
  dashFromIndex?: number;
  data: Record<string, unknown>[];
  innerHeight: number;
  innerWidth: number;
  pathD: string | null;
  pathLength: number;
  stroke: string;
  strokeWidth: number;
  xAccessor: (datum: Record<string, unknown>) => Date | number;
  xScale: (value: Date | number) => number | undefined;
}

function SeriesDashTailOverlayImpl({
  dashFromIndex,
  dashArray,
  data,
  pathD,
  pathLength,
  innerWidth,
  innerHeight,
  stroke,
  strokeWidth,
  xScale,
  xAccessor,
}: SeriesDashTailOverlayProps) {
  const hasDashTail = resolveDashTailBounds(dashFromIndex, data.length);

  const dashStartX = useMemo(() => {
    if (!hasDashTail || dashFromIndex == null) {
      return 0;
    }
    return resolveDashStartX(data, dashFromIndex, xScale, xAccessor);
  }, [hasDashTail, dashFromIndex, data, xScale, xAccessor]);

  // Linear (index-based) approximation of the path length at `dashFromIndex`.
  // A binary search via `getPointAtLength` is exact but costs ~40 ms per series on a 365-point
  // bezier — for charts with ~10 series that synchronously blocks the main
  // thread for ~400 ms on the post-measurement re-render, swallowing the first
  // second of the entrance animation.
  //
  // For evenly-spaced time-series data — the standard case — this is exact at
  // flat regions of the curve and only differs by a pixel or two where the
  // curve has steep y-variation, which is imperceptible at the dash boundary.
  const dashStartLength = useMemo(() => {
    if (!hasDashTail || dashFromIndex == null || pathLength <= 0) {
      return 0;
    }
    return (dashFromIndex / Math.max(1, data.length - 1)) * pathLength;
  }, [hasDashTail, dashFromIndex, data.length, pathLength]);

  if (!hasDashTail || dashFromIndex == null || pathLength <= 0) {
    return null;
  }

  return (
    <DashTailStroke
      dashArray={dashArray}
      dashStartLength={dashStartLength}
      dashStartX={dashStartX}
      innerHeight={innerHeight}
      innerWidth={innerWidth}
      pathD={pathD}
      pathLength={pathLength}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

// All props originate from the chart's stable context slice (data, xScale,
// xAccessor, …) or are mount-stable strings (gradient `url(#…)` ids). Shallow
// compare lets us skip the path-length binary search on every cursor move.
export const SeriesDashTailOverlay = memo(SeriesDashTailOverlayImpl);

interface DashTailStrokeProps {
  dashArray: string;
  /** Path length at which the dashed tail begins. */
  dashStartLength: number;
  /** X coordinate (chart inner space) where the tail clip begins. */
  dashStartX: number;
  innerHeight: number;
  innerWidth: number;
  /** SVG path `d` for the full series (single curved path). */
  pathD: string | null;
  /** Total length of `pathD` in user units. */
  pathLength: number;
  /** Stroke paint — solid color or gradient url. */
  stroke: string;
  strokeWidth: number;
}

function DashTailStroke({
  pathD,
  pathLength,
  dashStartLength,
  dashStartX,
  innerWidth,
  innerHeight,
  stroke,
  strokeWidth,
  dashArray,
}: DashTailStrokeProps) {
  const clipPathId = useId().replace(/:/g, "");

  if (!pathD || pathLength <= 0 || dashStartLength >= pathLength) {
    return null;
  }

  const pad = strokeWidth * 2;
  const tailWidth = Math.max(0, innerWidth - dashStartX + pad);

  return (
    <>
      <defs>
        <clipPath id={clipPathId}>
          <rect
            height={innerHeight + pad}
            width={tailWidth}
            x={dashStartX - strokeWidth}
            y={-strokeWidth}
          />
        </clipPath>
      </defs>
      {/* Solid head — same curved path, gradient/fade preserved */}
      <path
        d={pathD}
        fill="none"
        stroke={stroke}
        strokeDasharray={`${dashStartLength} ${Math.max(1, pathLength - dashStartLength)}`}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      />
      {/* Dashed tail — clipped to x ≥ dashStartX so dashes follow the curve */}
      <path
        clipPath={`url(#${clipPathId})`}
        d={pathD}
        fill="none"
        stroke={stroke}
        strokeDasharray={dashArray}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      />
    </>
  );
}

interface PathStrokeMetrics {
  pathD: string | null;
  pathLength: number;
}

const EMPTY_METRICS: PathStrokeMetrics = { pathD: null, pathLength: 0 };

/**
 * Caller passes the references that drive the rendered path (renderData,
 * innerWidth, etc.) as `deps`. A stringified summary like
 * `${renderData.length}:${innerWidth}` is *not* safe here — same-length
 * in-place mutations of `renderData` keep the summary identical, so the
 * effect would never re-fire and `pathD`/`pathLength` would stay frozen on
 * the previous geometry (the area fill repaints from `renderData` directly
 * and would diverge from the stroke).
 */
export function usePathStrokeMetrics(
  pathRef: RefObject<SVGPathElement | null>,
  deps: readonly unknown[]
): PathStrokeMetrics {
  const [metrics, setMetrics] = useState<PathStrokeMetrics>(EMPTY_METRICS);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) {
      return;
    }
    const d = path.getAttribute("d");
    const len = d ? path.getTotalLength() : 0;
    setMetrics((prev) =>
      prev.pathD === d && prev.pathLength === len
        ? prev
        : { pathD: d, pathLength: len }
    );
  }, deps);

  return metrics;
}

export function resolveDashTailBounds(
  dashFromIndex: number | undefined,
  dataLength: number
): boolean {
  return (
    dashFromIndex != null &&
    dashFromIndex >= 0 &&
    dashFromIndex < dataLength - 1
  );
}

function resolveDashStartX(
  data: Record<string, unknown>[],
  dashFromIndex: number,
  xScale: (value: Date | number) => number | undefined,
  xAccessor: (datum: Record<string, unknown>) => Date | number
): number {
  const dashFromPoint = data[dashFromIndex];
  if (!dashFromPoint) {
    return 0;
  }
  return xScale(xAccessor(dashFromPoint)) ?? 0;
}
