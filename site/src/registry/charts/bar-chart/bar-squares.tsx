"use client";

import type { scaleBand } from "@visx/scale";
import type { Transition } from "motion/react";

import { memo, useId, useMemo } from "react";

import { motion } from "motion/react";

import {
  chartCssVars,
  useChart,
  useChartStable,
  useYScale,
} from "../chart-core/chart-context";
import { useChartLegendHover } from "../chart-core/legend-hover";
import {
  type PatternPresetId,
  renderPatternPreset,
} from "../chart-patterns/pattern-preset";
import { transitionWithDelay } from "../chart-utils/animation";

type ScaleBand<Domain extends { toString(): string }> = ReturnType<
  typeof scaleBand<Domain>
>;

export interface GradientStop {
  color: string;
  offset: number;
}

export interface BarSquaresProps {
  /** Enable enter animation @default true */
  animate?: boolean;
  /**
   * Datum key holding a per-column color. When the datum has a string there,
   * it replaces `fill` for that column and solid-fills it (no gradient).
   */
  colorKey?: string;
  /** Key in data for values */
  dataKey: string;
  /** Opacity when another bar is hovered @default 0.3 */
  fadedOpacity?: number;
  /** Fill color, gradient url, or pattern url. @default var(--color-chart-1) */
  fill?: string;
  /** Gradient stops (0–100) when `useGradient` is true */
  gradientStops?: GradientStop[];
  /** Gap between grouped series columns in pixels @default 4 */
  groupGap?: number;
  /** Pattern preset when fill is a pattern (for gradient tinting) */
  patternPreset?: PatternPresetId;
  /** Redistribute gap so columns fit bar height exactly @default false */
  squareFit?: boolean;
  /** Gap between stacked squares in pixels. @default 3 */
  squareGap?: number;
  /** Corner radius as a fraction of square size (0 = flat, 0.5 = circle). @default 0.25 */
  squareRadius?: number;
  /**
   * Override per-column stagger delay (seconds). Spread across the animation duration by default.
   */
  staggerDelay?: number;
  /** Tooltip dot / ring stroke color when fill is gradient/pattern */
  stroke?: string;
  /** Apply bar-spanning gradient from gradientStops @default false */
  useGradient?: boolean;
  /** Y-scale group for biaxial charts. Defaults to the series axis. */
  yAxisId?: string | number;
}

export interface BarColumnTrackProps {
  /** Fill color or pattern url. @default color-mix(in oklab, var(--color-foreground) 10%, transparent) */
  fill?: string;
  /** Match `<BarSquares groupGap>` @default 4 */
  groupGap?: number;
  /** Track opacity @default 0.3 */
  opacity?: number;
  /** Match `<BarSquares squareFit>` @default false */
  squareFit?: boolean;
  /** Match `<BarSquares squareGap>` @default 3 */
  squareGap?: number;
  /** Corner radius fraction (matches squares). @default 0.25 */
  squareRadius?: number;
  /** Match `<BarSquares staggerDelay>` */
  staggerDelay?: number;
}

interface BarSquaresInnerProps extends BarSquaresProps {
  bandWidth: number;
  barScale: ScaleBand<string>;
  barXAccessor: (d: Record<string, unknown>) => string;
}

interface SquareColumnProps {
  animate: boolean;
  animationDuration: number;
  barLengthPx: number;
  baselineY: number;
  enterTransition?: Transition;
  fadedOpacity: number;
  fill: string;
  gradientStops: GradientStop[];
  index: number;
  isFaded: boolean;
  patternPreset?: PatternPresetId;
  revealEpoch: number;
  squareFit: boolean;
  squareGap: number;
  squareRadius: number;
  squareSize: number;
  staggerDelay: number;
  useGradient: boolean;
  x: number;
}

function isPatternFill(fill: string): boolean {
  return fill.startsWith("url(");
}

/** Delay between stacked squares within one column (bottom → top). */
function squareCascadeStepSeconds(
  enterTransition: Transition | undefined,
  animationDurationMs: number,
  squareCount: number
): number {
  if (squareCount <= 1) {
    return 0;
  }
  const durationMs =
    enterTransition?.type === "tween" &&
    typeof enterTransition.duration === "number"
      ? enterTransition.duration * 1000
      : animationDurationMs;
  const cascadeSpreadMs = durationMs * 0.4;
  return cascadeSpreadMs / 1000 / (squareCount - 1);
}

function cascadeColumnTransition(
  enterTransition: Transition | undefined,
  animationDurationMs: number,
  columnIndex: number,
  columnStaggerDelay: number,
  squareCount: number
): Transition {
  const cascadeStep = squareCascadeStepSeconds(
    enterTransition,
    animationDurationMs,
    squareCount
  );
  const base = transitionWithDelay(
    enterTransition,
    columnIndex * columnStaggerDelay
  );
  if (squareCount <= 1 || base.type !== "tween") {
    return base;
  }
  const baseDuration =
    typeof base.duration === "number"
      ? base.duration
      : animationDurationMs / 1000;
  return {
    ...base,
    duration: baseDuration + cascadeStep * (squareCount - 1),
  };
}

function SquareColumn({
  x,
  baselineY,
  barLengthPx,
  squareSize,
  squareGap,
  squareRadius,
  squareFit,
  fill,
  useGradient,
  gradientStops,
  patternPreset,
  index,
  isFaded,
  fadedOpacity,
  animate,
  staggerDelay,
  animationDuration,
  enterTransition,
  revealEpoch,
}: SquareColumnProps) {
  const layout = useMemo(
    () =>
      computeSquareColumn({
        barLengthPx,
        fit: squareFit,
        gap: squareGap,
        squareSize,
      }),
    [barLengthPx, squareSize, squareGap, squareFit]
  );

  const rx = squareSize * squareRadius;
  const columnTop = baselineY - layout.columnHeight;
  const gradientId = `bar-squares-gradient-${index}-${revealEpoch}`;
  const patternFill = isPatternFill(fill);
  const patternId = `bar-squares-pattern-${index}-${revealEpoch}`;

  const effectiveFill = useMemo(() => {
    if (useGradient) {
      if (patternFill && patternPreset && patternPreset !== "none") {
        return `url(#${patternId})`;
      }
      return `url(#${gradientId})`;
    }
    return fill;
  }, [useGradient, patternFill, patternPreset, fill, gradientId, patternId]);

  const cascadeStep = squareCascadeStepSeconds(
    enterTransition,
    animationDuration,
    layout.count
  );
  const squareOpacity = isFaded ? fadedOpacity : 1;

  const gradientPatternNode =
    useGradient && patternFill && patternPreset && patternPreset !== "none"
      ? renderPatternPreset(patternPreset, patternId, {
          color: `url(#${gradientId})`,
        })
      : null;

  const gradientDefs = useGradient ? (
    <defs>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id={gradientId}
        x1={0}
        x2={0}
        y1={baselineY}
        y2={columnTop}
      >
        {gradientStops.map((stop) => (
          <stop
            key={`${stop.offset}-${stop.color}`}
            offset={`${stop.offset}%`}
            stopColor={stop.color}
          />
        ))}
      </linearGradient>
      {gradientPatternNode}
    </defs>
  ) : null;

  const squares = layout.positions.map((relY, squareIndex) => {
    const y = columnTop + relY;
    const bottomY = y + squareSize;
    const key = `sq-${index}-${squareIndex}-${revealEpoch}`;

    if (!animate) {
      return (
        <rect
          fill={effectiveFill}
          height={squareSize}
          key={key}
          opacity={squareOpacity}
          rx={rx}
          ry={rx}
          width={squareSize}
          x={x}
          y={y}
        />
      );
    }

    return (
      <motion.rect
        animate={{ attrY: y, height: squareSize, opacity: squareOpacity }}
        fill={effectiveFill}
        height={squareSize}
        initial={{ attrY: bottomY, height: 0, opacity: 1 }}
        key={key}
        rx={rx}
        ry={rx}
        transition={{
          ...transitionWithDelay(
            enterTransition,
            index * staggerDelay + squareIndex * cascadeStep
          ),
          opacity: { duration: 0.15 },
        }}
        width={squareSize}
        x={x}
      />
    );
  });

  return (
    <>
      {gradientDefs}
      {squares}
    </>
  );
}

const BarSquaresInner = memo(function BarSquaresInner({
  dataKey,
  yAxisId,
  fill = chartCssVars.linePrimary,
  colorKey,
  squareGap = 3,
  squareRadius = 0.25,
  squareFit = false,
  useGradient = false,
  gradientStops = [],
  patternPreset,
  animate = true,
  fadedOpacity = 0.3,
  staggerDelay,
  groupGap = 4,
  barScale,
  bandWidth,
  barXAccessor,
}: BarSquaresInnerProps) {
  const {
    data,
    innerHeight,
    hoveredBarIndex,
    lines,
    orientation,
    stacked,
    animationDuration,
    enterTransition,
    revealEpoch = 0,
  } = useChart();

  const { hoveredIndex: legendHoveredIndex } = useChartLegendHover();
  const uniqueId = useId();

  const isHorizontal = orientation === "horizontal";
  const isUnsupported = isHorizontal || stacked;

  const seriesIndex = useMemo(() => {
    const idx = lines.findIndex((l) => l.dataKey === dataKey);
    return idx >= 0 ? idx : 0;
  }, [lines, dataKey]);

  const seriesConfig = lines[seriesIndex];
  const valueScale = useYScale(yAxisId ?? seriesConfig?.yAxisId);

  const isLegendDimmed =
    legendHoveredIndex !== null && legendHoveredIndex !== seriesIndex;

  const seriesCount = lines.length;
  const squareSize = useMemo(() => {
    if (!bandWidth || seriesCount === 0) {
      return 0;
    }
    const effectiveGroupGap = seriesCount > 1 ? groupGap : 0;
    return (bandWidth - effectiveGroupGap * (seriesCount - 1)) / seriesCount;
  }, [bandWidth, seriesCount, groupGap]);

  const totalAnimDuration = animationDuration || 1100;
  const staggerSpread = totalAnimDuration * 0.4;
  const calculatedStaggerDelay =
    staggerDelay ?? (data.length > 1 ? staggerSpread / 1000 / data.length : 0);

  const baselineY = valueScale(0) ?? innerHeight;
  const stops =
    gradientStops.length >= 2
      ? gradientStops
      : [
          { color: fill, offset: 0 },
          { color: fill, offset: 100 },
        ];

  if (isUnsupported) {
    return null;
  }

  return (
    <g className={`bar-squares-${uniqueId}`}>
      {data.map((d, i) => {
        const value = d[dataKey];
        if (typeof value !== "number" || value <= 0) {
          return null;
        }

        const categoryValue = barXAccessor(d);
        const bandPos = barScale(categoryValue) ?? 0;
        const effectiveGroupGap = seriesCount > 1 ? groupGap : 0;
        const x = bandPos + seriesIndex * (squareSize + effectiveGroupGap);

        const valuePos = valueScale(value) ?? 0;
        const barLengthPx = baselineY - valuePos;

        const isFaded =
          (hoveredBarIndex !== null && hoveredBarIndex !== i) || isLegendDimmed;

        const columnColor = colorKey ? d[colorKey] : undefined;
        const hasColumnColor = typeof columnColor === "string";

        return (
          <SquareColumn
            animate={animate}
            animationDuration={animationDuration || 1100}
            barLengthPx={barLengthPx}
            baselineY={baselineY}
            enterTransition={enterTransition}
            fadedOpacity={fadedOpacity}
            fill={hasColumnColor ? columnColor : fill}
            gradientStops={stops}
            index={i}
            isFaded={isFaded}
            key={`bar-squares-${dataKey}-${categoryValue}`}
            patternPreset={patternPreset}
            revealEpoch={revealEpoch}
            squareFit={squareFit}
            squareGap={squareGap}
            squareRadius={squareRadius}
            squareSize={squareSize}
            staggerDelay={calculatedStaggerDelay}
            useGradient={useGradient && !hasColumnColor}
            x={x}
          />
        );
      })}
    </g>
  );
});

export function BarSquares(props: BarSquaresProps) {
  const { barScale, bandWidth, barXAccessor } = useChartStable();

  if (!(barScale && bandWidth && barXAccessor)) {
    console.warn("BarSquares must be used within a BarChart");
    return null;
  }

  return (
    <BarSquaresInner
      {...props}
      bandWidth={bandWidth}
      barScale={barScale}
      barXAccessor={barXAccessor}
    />
  );
}

BarSquares.displayName = "BarSquares";

const BarColumnTrackInner = memo(function BarColumnTrackInner({
  fill = chartCssVars.grid,
  opacity = 0.3,
  squareGap = 3,
  squareRadius = 0.25,
  squareFit = false,
  groupGap = 4,
  staggerDelay,
  barScale,
  bandWidth,
  barXAccessor,
}: BarColumnTrackProps & {
  barScale: ScaleBand<string>;
  bandWidth: number;
  barXAccessor: (d: Record<string, unknown>) => string;
}) {
  const {
    data,
    lines,
    orientation,
    stacked,
    hoveredBarIndex,
    animationDuration,
    enterTransition,
    revealEpoch = 0,
  } = useChart();
  const uniqueId = useId();

  const isHorizontal = orientation === "horizontal";
  const isUnsupported = isHorizontal || stacked;
  const seriesCount = lines.length;

  const squareSize = useMemo(() => {
    if (!bandWidth || seriesCount === 0) {
      return 0;
    }
    const effectiveGroupGap = seriesCount > 1 ? groupGap : 0;
    return (bandWidth - effectiveGroupGap * (seriesCount - 1)) / seriesCount;
  }, [bandWidth, seriesCount, groupGap]);

  const totalAnimDuration = animationDuration || 1100;
  const staggerSpread = totalAnimDuration * 0.4;
  const calculatedStaggerDelay =
    staggerDelay ?? (data.length > 1 ? staggerSpread / 1000 / data.length : 0);

  if (isUnsupported) {
    return null;
  }

  const rx = squareSize * squareRadius;
  const effectiveOpacity = hoveredBarIndex === null ? opacity : 0;

  return (
    <g
      className={`bar-column-track-${uniqueId}`}
      style={{ transition: "opacity 0.15s ease-in-out" }}
    >
      {data.map((d, i) => {
        const categoryValue = barXAccessor(d);
        const bandPos = barScale(categoryValue) ?? 0;
        const effectiveGroupGap = seriesCount > 1 ? groupGap : 0;

        return lines.map((line, seriesIndex) => (
          <TrackColumn
            animate
            bandPos={bandPos}
            d={d}
            dataKey={line.dataKey}
            effectiveGroupGap={effectiveGroupGap}
            effectiveOpacity={effectiveOpacity}
            enterTransition={enterTransition}
            fill={fill}
            index={i}
            key={`track-${i}-${line.dataKey}`}
            revealEpoch={revealEpoch}
            rx={rx}
            seriesIndex={seriesIndex}
            squareFit={squareFit}
            squareGap={squareGap}
            squareSize={squareSize}
            staggerDelay={calculatedStaggerDelay}
            yAxisId={line.yAxisId}
          />
        ));
      })}
    </g>
  );
});

function TrackColumn({
  d,
  dataKey,
  yAxisId,
  bandPos,
  seriesIndex,
  effectiveGroupGap,
  squareSize,
  squareGap,
  squareFit,
  fill,
  rx,
  effectiveOpacity,
  index,
  staggerDelay,
  animate,
  enterTransition,
  revealEpoch,
}: {
  d: Record<string, unknown>;
  dataKey: string;
  yAxisId?: string | number;
  bandPos: number;
  seriesIndex: number;
  effectiveGroupGap: number;
  squareSize: number;
  squareGap: number;
  squareFit: boolean;
  fill: string;
  rx: number;
  effectiveOpacity: number;
  index: number;
  staggerDelay: number;
  animate: boolean;
  enterTransition?: Transition;
  revealEpoch: number;
}) {
  const { innerHeight, animationDuration: chartAnimationDuration } = useChart();
  const valueScale = useYScale(yAxisId);
  const value = d[dataKey];

  if (typeof value !== "number" || value <= 0) {
    return null;
  }

  const baselineY = valueScale(0) ?? innerHeight;
  const valuePos = valueScale(value) ?? 0;
  const barLengthPx = baselineY - valuePos;
  const layout = computeSquareColumn({
    barLengthPx,
    fit: squareFit,
    gap: squareGap,
    squareSize,
  });
  const columnTop = baselineY - layout.columnHeight;
  const trackHeight = Math.max(0, columnTop);

  if (trackHeight <= 0 && !animate) {
    return null;
  }

  const x = bandPos + seriesIndex * (squareSize + effectiveGroupGap);
  const enterAnim = cascadeColumnTransition(
    enterTransition,
    chartAnimationDuration || 1100,
    index,
    staggerDelay,
    layout.count
  );
  const animatedHeight = trackHeight > 0 ? trackHeight : 0;

  if (animate) {
    return (
      <motion.rect
        animate={{ height: animatedHeight, y: 0 }}
        fill={fill}
        height={animatedHeight}
        initial={{ height: baselineY, y: 0 }}
        key={`track-${index}-${seriesIndex}-${revealEpoch}`}
        opacity={effectiveOpacity}
        rx={rx}
        ry={rx}
        transition={enterAnim}
        width={squareSize}
        x={x}
      />
    );
  }

  if (trackHeight <= 0) {
    return null;
  }

  return (
    <rect
      fill={fill}
      height={trackHeight}
      opacity={effectiveOpacity}
      rx={rx}
      ry={rx}
      width={squareSize}
      x={x}
      y={0}
    />
  );
}

export function BarColumnTrack(props: BarColumnTrackProps) {
  const { barScale, bandWidth, barXAccessor } = useChartStable();

  if (!(barScale && bandWidth && barXAccessor)) {
    console.warn("BarColumnTrack must be used within a BarChart");
    return null;
  }

  return (
    <BarColumnTrackInner
      {...props}
      bandWidth={bandWidth}
      barScale={barScale}
      barXAccessor={barXAccessor}
    />
  );
}

BarColumnTrack.displayName = "BarColumnTrack";

interface SquareColumnLayout {
  /** Quantized column height in pixels */
  columnHeight: number;
  /** Number of squares in the column */
  count: number;
  /** Effective gap between squares (may differ when fit mode redistributes) */
  gap: number;
  /** Top-left Y of each square, bottom square first (relative to bar top at 0) */
  positions: number[];
  squareSize: number;
}

export interface SquareColumnInput {
  /** Raw bar length in pixels (baseline − value) */
  barLengthPx: number;
  /** When true, redistribute gap so column height matches barLengthPx exactly */
  fit?: boolean;
  /** Gap between stacked squares in pixels */
  gap: number;
  /** Square width/height — typically equals bar width */
  squareSize: number;
}

/** Quantize bar length into a stack of square cells. */
function computeSquareColumn({
  barLengthPx,
  squareSize,
  gap,
  fit = false,
}: SquareColumnInput): SquareColumnLayout {
  if (barLengthPx <= 0 || squareSize <= 0) {
    return { columnHeight: 0, count: 0, gap, positions: [], squareSize };
  }

  if (fit) {
    const count = Math.max(
      1,
      Math.floor((barLengthPx + gap) / (squareSize + gap))
    );
    const effectiveGap =
      count > 1
        ? Math.max(0, (barLengthPx - count * squareSize) / (count - 1))
        : 0;
    const step = squareSize + effectiveGap;
    const columnHeight = barLengthPx;
    const positions: number[] = [];

    for (let i = 0; i < count; i++) {
      positions.push(columnHeight - squareSize - i * step);
    }

    return {
      columnHeight,
      count,
      gap: effectiveGap,
      positions,
      squareSize,
    };
  }

  const step = squareSize + gap;
  const count = Math.max(1, Math.round(barLengthPx / step));
  const columnHeight = count * squareSize + Math.max(0, count - 1) * gap;

  const positions: number[] = [];
  for (let i = 0; i < count; i++) {
    const offsetFromBottom = i * step;
    positions.push(columnHeight - squareSize - offsetFromBottom);
  }

  return { columnHeight, count, gap, positions, squareSize };
}

/** Y center of the topmost square in a vertical column. */
export function topSquareCenterY({
  baselineY,
  barLengthPx,
  squareSize,
  gap,
  fit = false,
}: SquareColumnInput & { baselineY: number }): number {
  const {
    count,
    squareSize: size,
    columnHeight,
  } = computeSquareColumn({
    barLengthPx,
    fit,
    gap,
    squareSize,
  });

  if (count === 0) {
    return baselineY;
  }

  const topY = baselineY - columnHeight;
  return topY + size / 2;
}
