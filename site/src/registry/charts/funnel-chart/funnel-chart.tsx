"use client";

import type { Transition } from "motion/react";

import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "cn";
import { motion, useTransform } from "motion/react";

import { useEnterComplete } from "../chart-utils/use-enter-complete";
import { useMountProgress } from "../chart-utils/use-mount-progress";

// ─── Public types ───────────────────────────────────────────────────

export interface FunnelGradientStop {
  color: string;
  offset: string | number;
}

export interface FunnelStage {
  /** Override the chart-level color for this segment */
  color?: string;
  /** Custom display string (overrides formatted value) */
  displayValue?: string;
  /**
   * Apply a linear gradient to this segment.
   * Provide an array of color stops, e.g. `[{ offset: "0%", color: "#8B5CF6" }, { offset: "100%", color: "#3B82F6" }]`.
   * When set, this takes priority over the segment and chart-level `color` for the innermost ring.
   * Outer halo rings use the first stop color as their solid color.
   */
  gradient?: FunnelGradientStop[];
  /** Stage name displayed below the segment */
  label: string;
  /** Numeric value (first item is treated as 100%) */
  value: number;
}

export interface FunnelChartProps {
  /** Additional CSS class */
  className?: string;
  /** Default color for all segments @default var(--color-chart-1) */
  color?: string;
  /** Array of funnel stages */
  data: FunnelStage[];
  /** Edge style for the funnel segments. @default "curved" */
  edges?: "curved" | "straight";
  /** Framer Motion transition for segment enter animation */
  enterTransition?: Transition;
  /** Custom percentage formatter. Rounds to an integer by default. */
  formatPercentage?: (pct: number) => string;
  /** Custom value formatter. Uses locale formatting by default. */
  formatValue?: (value: number) => string;
  /** Gap between segments in pixels. @default 4 */
  gap?: number;
  /**
   * Grid configuration. Pass `true` for default bands + lines, or an object for fine control.
   * @default false
   */
  grid?:
    | boolean
    | {
        /** Show alternating background bands behind each segment. @default true */
        bands?: boolean;
        /** Color of the background bands. @default var(--color-muted) */
        bandColor?: string;
        /** Show grid lines at each gap between segments. @default true */
        lines?: boolean;
        /** Color of the grid lines. @default color-mix(in oklab, var(--color-foreground) 10%, transparent) */
        lineColor?: string;
        /** Opacity of the grid lines. @default 1 */
        lineOpacity?: number;
        /** Width of the grid lines in pixels. @default 1 */
        lineWidth?: number;
      };
  /** Controlled hover state — index of the hovered segment */
  hoveredIndex?: number | null;
  /**
   * Where the label group sits within the segment cell.
   * For horizontal funnel: start=top, end=bottom.
   * For vertical funnel: start=left, end=right.
   * @default "center"
   */
  labelAlign?: "center" | "start" | "end";
  /**
   * Controls how segment labels (value, percentage, stage name) are arranged.
   * - "spread": Value/percentage/label are spread apart (top/center/bottom for horizontal,
   *   left/center/right for vertical).
   * - "grouped": All label items stack together in a tight group.
   *
   * When "grouped", use `labelOrientation` and `labelAlign` for full control.
   * @default "spread"
   */
  labelLayout?: "spread" | "grouped";
  /**
   * Stack direction of the label group. Only applies when `labelLayout="grouped"`.
   * - "vertical": Items stack top-to-bottom. Default for horizontal funnels.
   * - "horizontal": Items stack left-to-right. Default for vertical funnels.
   */
  labelOrientation?: "vertical" | "horizontal";
  /** Number of concentric halo rings per segment @default 3 */
  layers?: number;
  /** Callback when hover state changes */
  onHoverChange?: (index: number | null) => void;
  /** Layout direction @default "horizontal" */
  orientation?: "horizontal" | "vertical";
  /**
   * Render a pattern definition. Receives a unique `id` string per segment
   * and the resolved `color`. Return a `<PatternLines>` (or any chart pattern)
   * inside an SVG `<defs>`. The component will use `fill="url(#id)"` on the
   * innermost ring while keeping outer halo rings as solid color.
   */
  renderPattern?: (id: string, color: string) => ReactNode;
  /** Show stage name labels @default true */
  showLabels?: boolean;
  /** Show percentage badges @default true */
  showPercentage?: boolean;
  /** Show value labels @default true */
  showValues?: boolean;
  /** Stagger delay between segments in seconds. @default 0.12 */
  staggerDelay?: number;
  /** Additional inline styles */
  style?: CSSProperties;
}

// ─── Defaults ───────────────────────────────────────────────────────

import { intFmt } from "../chart-utils/formatters";

const fmtPct = (p: number) => `${Math.round(p)}%`;
const fmtVal = intFmt;

// ─── SVG helpers ────────────────────────────────────────────────────

/**
 * Builds a single segment path for one stage in the funnel.
 * Each segment is a smooth trapezoid-like shape transitioning from
 * the height of the current norm to the next norm.
 */
function hSegmentPath(
  normStart: number,
  normEnd: number,
  segW: number,
  H: number,
  layerScale: number,
  straight = false
) {
  const my = H / 2;
  const h0 = normStart * H * 0.44 * layerScale;
  const h1 = normEnd * H * 0.44 * layerScale;

  if (straight) {
    return `M 0 ${my - h0} L ${segW} ${my - h1} L ${segW} ${my + h1} L 0 ${my + h0} Z`;
  }

  const cx = segW * 0.55;
  const top = `M 0 ${my - h0} C ${cx} ${my - h0}, ${segW - cx} ${my - h1}, ${segW} ${my - h1}`;
  const bot = `L ${segW} ${my + h1} C ${segW - cx} ${my + h1}, ${cx} ${my + h0}, 0 ${my + h0}`;
  return `${top} ${bot} Z`;
}

function vSegmentPath(
  normStart: number,
  normEnd: number,
  segH: number,
  W: number,
  layerScale: number,
  straight = false
) {
  const mx = W / 2;
  const w0 = normStart * W * 0.44 * layerScale;
  const w1 = normEnd * W * 0.44 * layerScale;

  if (straight) {
    return `M ${mx - w0} 0 L ${mx - w1} ${segH} L ${mx + w1} ${segH} L ${mx + w0} 0 Z`;
  }

  const cy = segH * 0.55;
  const left = `M ${mx - w0} 0 C ${mx - w0} ${cy}, ${mx - w1} ${segH - cy}, ${mx - w1} ${segH}`;
  const right = `L ${mx + w1} ${segH} C ${mx + w1} ${segH - cy}, ${mx + w0} ${cy}, ${mx + w0} 0`;
  return `${left} ${right} Z`;
}

// ─── Animated Segment ───────────────────────────────────────────────

function FunnelRing({
  d,
  color,
  fill,
  opacity,
  hovered,
  horizontal,
  ringIndex,
  totalRings,
}: {
  d: string;
  color: string;
  fill?: string;
  opacity: number;
  hovered: boolean;
  horizontal: boolean;
  ringIndex: number;
  totalRings: number;
}) {
  const extraScale = 1 + (ringIndex / Math.max(totalRings - 1, 1)) * 0.12;
  // Rings swell across the flow direction on hover.
  const scale = hovered ? extraScale : 1;

  return (
    <motion.path
      animate={horizontal ? { scaleY: scale } : { scaleX: scale }}
      d={d}
      fill={fill ?? color}
      opacity={opacity}
      style={{ transformOrigin: "center center" }}
      transition={{
        damping: 24 - ringIndex * 3,
        stiffness: 300 - ringIndex * 60,
        type: "spring",
      }}
    />
  );
}

/**
 * One funnel stage: `layers` nested rings from `normStart` to `normEnd`.
 * `length` runs along the flow (width when horizontal, height when vertical)
 * and `cross` across it.
 */
function FunnelSegment({
  index,
  normStart,
  normEnd,
  length,
  cross,
  horizontal,
  color,
  layers,
  staggerDelay,
  enterTransition,
  hovered,
  dimmed,
  renderPattern,
  straight,
  gradientStops,
}: {
  index: number;
  normStart: number;
  normEnd: number;
  length: number;
  cross: number;
  horizontal: boolean;
  color: string;
  layers: number;
  staggerDelay: number;
  enterTransition?: Transition;
  hovered: boolean;
  dimmed: boolean;
  renderPattern?: (id: string, color: string) => ReactNode;
  straight: boolean;
  gradientStops?: FunnelGradientStop[];
}) {
  const axis = horizontal ? "h" : "v";
  const patternId = `funnel-${axis}-pattern-${index}`;
  const gradientId = `funnel-${axis}-grad-${index}`;
  const mountProgress = useMountProgress(
    enterTransition,
    index * staggerDelay,
    index
  );
  const enterComplete = useEnterComplete(mountProgress);
  const entranceScaleX = useTransform(mountProgress, [0, 1], [0, 1]);
  const entranceScaleY = useTransform(mountProgress, [0, 1], [0, 1]);

  const width = horizontal ? length : cross;
  const height = horizontal ? cross : length;
  const segmentPath = horizontal ? hSegmentPath : vSegmentPath;
  const rings = Array.from({ length: layers }, (_, l) => {
    const scale = 1 - (l / layers) * 0.35;
    const opacity = 0.18 + (l / (layers - 1 || 1)) * 0.65;
    return {
      d: segmentPath(normStart, normEnd, length, cross, scale, straight),
      opacity,
    };
  });

  const svg = (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full overflow-visible"
      preserveAspectRatio="none"
      role="presentation"
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        {gradientStops && (
          <linearGradient
            id={gradientId}
            x1="0"
            x2={horizontal ? "1" : "0"}
            y1="0"
            y2={horizontal ? "0" : "1"}
          >
            {gradientStops.map((stop) => (
              <stop
                key={`${stop.offset}-${stop.color}`}
                offset={
                  typeof stop.offset === "number"
                    ? `${stop.offset * 100}%`
                    : stop.offset
                }
                stopColor={stop.color}
              />
            ))}
          </linearGradient>
        )}
        {renderPattern?.(patternId, color)}
      </defs>
      {rings.map((r, i) => {
        const isInnermost = i === rings.length - 1;
        let ringFill: string | undefined;
        if (isInnermost && renderPattern) {
          ringFill = `url(#${patternId})`;
        } else if (isInnermost && gradientStops) {
          ringFill = `url(#${gradientId})`;
        }
        return (
          <FunnelRing
            color={color}
            d={r.d}
            fill={ringFill}
            horizontal={horizontal}
            hovered={hovered}
            key={`${axis}-ring-${r.opacity.toFixed(2)}`}
            opacity={r.opacity}
            ringIndex={i}
            totalRings={layers}
          />
        );
      })}
    </svg>
  );

  return (
    <motion.div
      animate={{ opacity: dimmed ? 0.4 : 1 }}
      className="pointer-events-none relative shrink-0 overflow-visible"
      style={{ height, width, zIndex: hovered ? 10 : 1 }}
      transition={{ opacity: { duration: 0.15 } }}
    >
      {/* Drop the entrance transform layer once the grow-in has finished. */}
      {enterComplete ? (
        <div className="absolute inset-0 overflow-visible">{svg}</div>
      ) : (
        <motion.div
          className="absolute inset-0 overflow-visible"
          style={{
            scaleX: entranceScaleX,
            scaleY: entranceScaleY,
            transformOrigin: horizontal ? "left center" : "center top",
          }}
        >
          {svg}
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Label overlay ──────────────────────────────────────────────────

function SegmentLabel({
  stage,
  pct,
  isHorizontal,
  showValues,
  showPercentage,
  showLabels,
  formatPercentage,
  formatValue,
  index,
  staggerDelay,
  layout = "spread",
  orientation,
  align = "center",
}: {
  stage: FunnelStage;
  pct: number;
  isHorizontal: boolean;
  showValues: boolean;
  showPercentage: boolean;
  showLabels: boolean;
  formatPercentage: (p: number) => string;
  formatValue: (v: number) => string;
  index: number;
  staggerDelay: number;
  layout?: "spread" | "grouped";
  orientation?: "vertical" | "horizontal";
  align?: "center" | "start" | "end";
}) {
  const display = stage.displayValue ?? formatValue(stage.value);

  const valueEl = showValues && (
    <span className="whitespace-nowrap font-semibold text-foreground text-sm">
      {display}
    </span>
  );
  const pctEl = showPercentage && (
    <span className="rounded-full bg-foreground px-3 py-1 font-bold text-background text-xs shadow-sm">
      {formatPercentage(pct)}
    </span>
  );
  const labelEl = showLabels && (
    <span className="whitespace-nowrap font-medium text-foreground-muted text-xs">
      {stage.label}
    </span>
  );

  // ── Spread layout (default): items pushed to edges with center element ──
  if (layout === "spread") {
    return (
      <motion.div
        animate={{ opacity: 1 }}
        className={cn(
          "absolute inset-0 flex",
          isHorizontal ? "flex-col items-center" : "flex-row items-center"
        )}
        initial={{ opacity: 0 }}
        transition={{
          delay: index * staggerDelay + 0.25,
          duration: 0.35,
          ease: "easeOut",
        }}
      >
        {isHorizontal ? (
          <>
            <div className="flex h-[16%] items-end justify-center pb-1">
              {valueEl}
            </div>
            <div className="flex flex-1 items-center justify-center">
              {pctEl}
            </div>
            <div className="flex h-[16%] items-start justify-center pt-1">
              {labelEl}
            </div>
          </>
        ) : (
          <>
            <div className="flex w-[16%] items-center justify-end pr-2">
              {valueEl}
            </div>
            <div className="flex flex-1 items-center justify-center">
              {pctEl}
            </div>
            <div className="flex w-[16%] items-center justify-start pl-2">
              {labelEl}
            </div>
          </>
        )}
      </motion.div>
    );
  }

  // ── Grouped layout: items stacked tightly together ──
  const resolvedOrientation =
    orientation ?? (isHorizontal ? "vertical" : "horizontal");
  const isVerticalStack = resolvedOrientation === "vertical";

  // Map align to flexbox alignment on the cross axes
  const justifyMap = {
    center: "justify-center",
    end: "justify-end",
    start: "justify-start",
  } as const;
  const itemsMap = {
    center: "items-center",
    end: "items-end",
    start: "items-start",
  } as const;

  // The outer container uses the chart orientation to position the group,
  // and the inner group uses the label orientation for stacking.
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className={cn(
        "absolute inset-0 flex",
        // For horizontal funnel, align controls vertical placement
        // For vertical funnel, align controls horizontal placement
        isHorizontal
          ? cn("flex-col items-center", justifyMap[align])
          : cn("flex-row items-center", justifyMap[align])
      )}
      initial={{ opacity: 0 }}
      style={{
        padding: isHorizontal ? "8% 0" : "0 8%",
      }}
      transition={{
        delay: index * staggerDelay + 0.25,
        duration: 0.35,
        ease: "easeOut",
      }}
    >
      <div
        className={cn(
          "flex gap-1.5",
          isVerticalStack
            ? cn("flex-col", itemsMap[isHorizontal ? "center" : align])
            : cn("flex-row", itemsMap.center)
        )}
      >
        {valueEl}
        {pctEl}
        {labelEl}
      </div>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────

export function FunnelChart({
  data,
  orientation = "horizontal",
  color = "var(--color-chart-1)",
  layers = 3,
  className,
  style,
  showPercentage = true,
  showValues = true,
  showLabels = true,
  hoveredIndex: hoveredIndexProp,
  onHoverChange,
  formatPercentage = fmtPct,
  formatValue = fmtVal,
  staggerDelay = 0.12,
  enterTransition,
  gap = 4,
  renderPattern,
  edges = "curved",
  labelLayout = "spread",
  labelOrientation,
  labelAlign = "center",
  grid: gridProp = false,
}: FunnelChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [sz, setSz] = useState({ h: 0, w: 0 });
  const [internalHoveredIndex, setInternalHoveredIndex] = useState<
    number | null
  >(null);

  const isControlled = hoveredIndexProp !== undefined;
  const hoveredIndex = isControlled ? hoveredIndexProp : internalHoveredIndex;
  const setHoveredIndex = useCallback(
    (index: number | null) => {
      if (isControlled) {
        onHoverChange?.(index);
      } else {
        setInternalHoveredIndex(index);
      }
    },
    [isControlled, onHoverChange]
  );

  const measure = useCallback(() => {
    if (!ref.current) {
      return;
    }
    const { width: w, height: h } = ref.current.getBoundingClientRect();
    if (w > 0 && h > 0) {
      setSz({ h, w });
    }
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) {
      ro.observe(ref.current);
    }
    return () => ro.disconnect();
  }, [measure]);

  if (!data.length) {
    return null;
  }

  const first = data[0];
  if (!first) {
    return null;
  }
  const max = first.value;
  const n = data.length;
  const norms = data.map((d) => d.value / max);
  const horiz = orientation === "horizontal";
  const { w: W, h: H } = sz;

  const totalGap = gap * (n - 1);
  const segW = (W - (horiz ? totalGap : 0)) / n;
  const segH = (H - (horiz ? 0 : totalGap)) / n;

  // Resolve grid config
  const gridEnabled = gridProp !== false;
  const gridCfg = typeof gridProp === "object" ? gridProp : {};
  const showBands = gridEnabled && (gridCfg.bands ?? true);
  const bandColor = gridCfg.bandColor ?? "var(--color-muted)";
  const showGridLines = gridEnabled && (gridCfg.lines ?? true);
  const gridLineColor =
    gridCfg.lineColor ??
    "color-mix(in oklab, var(--color-foreground) 10%, transparent)";
  const gridLineOpacity = gridCfg.lineOpacity ?? 1;
  const gridLineWidth = gridCfg.lineWidth ?? 1;

  return (
    <div
      className={cn("relative w-full select-none overflow-visible", className)}
      ref={ref}
      style={{
        aspectRatio: horiz ? "2.2 / 1" : "1 / 1.8",
        ...style,
      }}
    >
      {W > 0 && H > 0 && (
        <>
          {/* Grid layer: background bands + grid lines */}
          {gridEnabled && (
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
              role="presentation"
              viewBox={`0 0 ${W} ${H}`}
            >
              {/* Background bands — alternating on even segments */}
              {showBands &&
                data.map((stage, i) => {
                  if (i % 2 !== 0) {
                    return null;
                  }
                  if (horiz) {
                    const x = (segW + gap) * i;
                    return (
                      <rect
                        fill={bandColor}
                        height={H}
                        key={`band-${stage.label}`}
                        width={segW}
                        x={x}
                        y={0}
                      />
                    );
                  }
                  const y = (segH + gap) * i;
                  return (
                    <rect
                      fill={bandColor}
                      height={segH}
                      key={`band-${stage.label}`}
                      width={W}
                      x={0}
                      y={y}
                    />
                  );
                })}
            </svg>
          )}

          {/* Segments container — overflow-visible so hover scale is not clipped */}
          <div
            className={cn(
              "absolute inset-0 flex overflow-visible",
              horiz ? "flex-row" : "flex-col"
            )}
            style={{ gap }}
          >
            {data.map((stage, i) => {
              const normStart = norms[i] ?? 0;
              const normEnd = norms[Math.min(i + 1, n - 1)] ?? 0;
              const firstStop = stage.gradient?.[0];
              const segColor = firstStop
                ? firstStop.color
                : (stage.color ?? color);

              return (
                <FunnelSegment
                  color={segColor}
                  cross={horiz ? H : W}
                  dimmed={hoveredIndex !== null && hoveredIndex !== i}
                  enterTransition={enterTransition}
                  gradientStops={stage.gradient}
                  horizontal={horiz}
                  hovered={hoveredIndex === i}
                  index={i}
                  key={stage.label}
                  layers={layers}
                  length={horiz ? segW : segH}
                  normEnd={normEnd}
                  normStart={normStart}
                  renderPattern={renderPattern}
                  staggerDelay={staggerDelay}
                  straight={edges === "straight"}
                />
              );
            })}
          </div>

          {/* Grid lines — rendered above segments so they're visible */}
          {gridEnabled && showGridLines && (
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
              role="presentation"
              viewBox={`0 0 ${W} ${H}`}
            >
              {Array.from({ length: n - 1 }, (_, i) => {
                const idx = i + 1;
                const gridKey = `grid-${idx}`;
                if (horiz) {
                  const x = segW * idx + gap * i + gap / 2;
                  return (
                    <line
                      key={gridKey}
                      stroke={gridLineColor}
                      strokeOpacity={gridLineOpacity}
                      strokeWidth={gridLineWidth}
                      x1={x}
                      x2={x}
                      y1={0}
                      y2={H}
                    />
                  );
                }
                const y = segH * idx + gap * i + gap / 2;
                return (
                  <line
                    key={gridKey}
                    stroke={gridLineColor}
                    strokeOpacity={gridLineOpacity}
                    strokeWidth={gridLineWidth}
                    x1={0}
                    x2={W}
                    y1={y}
                    y2={y}
                  />
                );
              })}
            </svg>
          )}

          {/* Label overlays — one per segment, positioned over each segment cell.
              These are the hover triggers for each segment. */}
          {data.map((stage, i) => {
            const pct = (stage.value / max) * 100;
            const posStyle: CSSProperties = horiz
              ? {
                  height: H,
                  left: (segW + gap) * i,
                  top: 0,
                  width: segW,
                }
              : {
                  height: segH,
                  left: 0,
                  top: (segH + gap) * i,
                  width: W,
                };

            const isDimmed = hoveredIndex !== null && hoveredIndex !== i;

            return (
              <motion.div
                animate={{ opacity: isDimmed ? 0.4 : 1 }}
                className="absolute cursor-pointer"
                key={`lbl-${stage.label}`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ ...posStyle, zIndex: 20 }}
                transition={{ damping: 24, stiffness: 300, type: "spring" }}
              >
                <SegmentLabel
                  align={labelAlign}
                  formatPercentage={formatPercentage}
                  formatValue={formatValue}
                  index={i}
                  isHorizontal={horiz}
                  layout={labelLayout}
                  orientation={labelOrientation}
                  pct={pct}
                  showLabels={showLabels}
                  showPercentage={showPercentage}
                  showValues={showValues}
                  stage={stage}
                  staggerDelay={staggerDelay}
                />
              </motion.div>
            );
          })}
        </>
      )}
    </div>
  );
}
