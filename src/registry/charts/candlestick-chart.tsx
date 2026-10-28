"use client";

import type { Transition } from "motion/react";

import { memo, type ReactNode, useCallback, useMemo, useRef } from "react";

import { scaleLinear, scaleTime } from "@visx/scale";
import { cn } from "cn";

import { partitionChartChildren } from "./chart-children";
import { ChartProvider, type LineConfig, type Margin } from "./chart-context";
import { shortDateFmt } from "./chart-formatters";
import { ParentSize } from "./chart-parent-size";
import { DEFAULT_CHART_LIFECYCLE } from "./chart-phase";
import {
  decimateOhlcData,
  maxRenderPointsForWidth,
} from "./decimate-time-series";
import { extractReferenceAreaConfigs } from "./reference-area-config";
import { useChartInteraction } from "./use-chart-interaction";
import { useRevealReplay } from "./use-reveal-replay";
import { wrapSingleYScale } from "./y-axis-scales";

export interface OHLCDataPoint {
  close: number;
  date: Date;
  high: number;
  low: number;
  open: number;
}

export interface CandlestickChartProps {
  /** Animation duration in milliseconds. @default 1500 */
  animationDuration?: number;
  /** Aspect ratio as "width / height". @default "2 / 1" */
  aspectRatio?: string;
  /** Gap between candles as fraction of slot width (0–1). Ignored when candleWidth is set. @default 0.2 */
  candleGap?: number;
  /** Fixed candle body width in pixels. If set, overrides candleGap. */
  candleWidth?: number;
  /** Child components (Candlestick, Grid, XAxis, YAxis, ChartTooltip, etc.) */
  children: ReactNode;
  /** Additional class name for the container */
  className?: string;
  /** OHLC data array */
  data: OHLCDataPoint[];
  /** Motion enter transition (spring or cubic-bezier tween). */
  enterTransition?: Transition;
  /** Chart margins */
  margin?: Partial<Margin>;
  /** Signature of motion URL state — triggers enter replay when it changes. @internal */
  revealSignature?: string;
  /** Inline styles for the container (e.g. { height: 320 }) */
  style?: React.CSSProperties;
  /** Key in data for the x-axis (date). @default "date" */
  xDataKey?: string;
  /** When set, xScale uses this domain instead of deriving from data. Use with brush so main chart and strip share the same scale. */
  xDomain?: [Date, Date];
  /** When xDomain is set, use this as the number of slots for scale padding (e.g. full data length). */
  xDomainSlotCount?: number;
}

const DEFAULT_MARGIN: Margin = { bottom: 40, left: 40, right: 40, top: 40 };

interface ChartInnerProps {
  animationDuration: number;
  candleGap: number;
  candleWidthProp?: number;
  children: ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
  data: Record<string, unknown>[];
  enterTransition?: Transition;
  height: number;
  margin: Margin;
  revealSignature?: string;
  width: number;
  xDataKey: string;
  xDomain?: [Date, Date];
  xDomainSlotCount?: number;
}

function ChartInner(props: ChartInnerProps) {
  const { width, height } = props;
  if (width < 10 || height < 10) {
    return null;
  }
  return <ChartCore {...props} />;
}

const ChartCore = memo(function ChartCore({
  width,
  height,
  data,
  xDataKey,
  margin,
  animationDuration,
  enterTransition,
  revealSignature = "",
  candleGap,
  candleWidthProp,
  xDomain,
  xDomainSlotCount,
  children,
  containerRef,
}: ChartInnerProps) {
  const { isLoaded, revealEpoch } = useRevealReplay({
    delayMs: animationDuration,
    replayKey: [animationDuration, revealSignature],
  });

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xAccessor = useCallback(
    (d: Record<string, unknown>): Date => {
      const value = d[xDataKey];
      return value instanceof Date ? value : new Date(value as string | number);
    },
    [xDataKey]
  );

  const slotCount =
    xDomain && xDomainSlotCount != null ? xDomainSlotCount : data.length;
  const slotWidth = innerWidth / Math.max(slotCount, 1);
  const xScale = useMemo(() => {
    const minTime = xDomain
      ? xDomain[0].getTime()
      : Math.min(...data.map((d) => xAccessor(d).getTime()));
    const maxTime = xDomain
      ? xDomain[1].getTime()
      : Math.max(...data.map((d) => xAccessor(d).getTime()));
    const padding = slotWidth / 2;
    return scaleTime({
      domain: [minTime, maxTime],
      range: [padding, innerWidth - padding],
    });
  }, [innerWidth, data, xAccessor, slotWidth, xDomain]);

  const yScale = useMemo(() => {
    let minVal = Number.POSITIVE_INFINITY;
    let maxVal = Number.NEGATIVE_INFINITY;
    for (const d of data) {
      const low = d.low as number | undefined;
      const high = d.high as number | undefined;
      if (typeof low === "number" && low < minVal) {
        minVal = low;
      }
      if (typeof high === "number" && high > maxVal) {
        maxVal = high;
      }
    }
    if (minVal === Number.POSITIVE_INFINITY) {
      minVal = 0;
    }
    if (maxVal === Number.NEGATIVE_INFINITY) {
      maxVal = 100;
    }
    const padding = (maxVal - minVal) * 0.05 || 1;
    return scaleLinear({
      domain: [minVal - padding, maxVal + padding],
      nice: true,
      range: [innerHeight, 0],
    });
  }, [innerHeight, data]);

  const columnWidth = slotWidth;
  const bandWidth = candleWidthProp ?? slotWidth * (1 - candleGap);

  const lines: LineConfig[] = useMemo(
    () => [
      { dataKey: "close", stroke: "var(--color-chart-1)", strokeWidth: 0 },
    ],
    []
  );

  const renderData = useMemo(
    () => decimateOhlcData(data, maxRenderPointsForWidth(innerWidth)),
    [data, innerWidth]
  );

  const dateLabels = useMemo(
    () => data.map((d) => shortDateFmt.format(xAccessor(d))),
    [data, xAccessor]
  );

  const {
    tooltipData,
    setTooltipData,
    selection,
    clearSelection,
    interactionHandlers,
    interactionStyle,
  } = useChartInteraction({
    canInteract: isLoaded,
    data,
    lines,
    margin,
    xAccessor,
    xScale,
    yScale,
    yScales: wrapSingleYScale(yScale),
  });

  const hoveredCandleIndex = tooltipData?.index ?? null;

  const layers = partitionChartChildren(children);

  const referenceAreas = useMemo(
    () => extractReferenceAreaConfigs(children),
    [children]
  );

  const yScales = useMemo(() => wrapSingleYScale(yScale), [yScale]);

  const contextValue = {
    ...DEFAULT_CHART_LIFECYCLE,
    animationDuration,
    bandWidth,
    clearSelection,
    columnWidth,
    containerRef,
    data,
    dateLabels,
    enterTransition,
    height,
    hoveredCandleIndex,
    innerHeight,
    innerWidth,
    isLoaded,
    lines,
    margin,
    referenceAreas,
    renderData,
    revealEpoch,
    selection: selection ?? null,
    setTooltipData,
    tooltipData,
    width,
    xAccessor,
    xScale,
    yScale,
    yScales,
  };

  return (
    <ChartProvider value={contextValue}>
      <svg
        aria-hidden="true"
        className="overflow-visible"
        height={height}
        width={width}
      >
        <defs>
          {/* Default vertical gradients for positive/negative candles (success / destructive foreground) */}
          <linearGradient id="candlestick-positive" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stopColor="var(--color-success-foreground)" />
            <stop offset="100%" stopColor="var(--color-success-foreground)" />
          </linearGradient>
          <linearGradient id="candlestick-negative" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stopColor="var(--color-destructive-foreground)" />
            <stop
              offset="100%"
              stopColor="var(--color-destructive-foreground)"
            />
          </linearGradient>
          {layers.defs}
        </defs>
        <rect fill="transparent" height={height} width={width} x={0} y={0} />
        <g
          {...interactionHandlers}
          style={interactionStyle}
          transform={`translate(${margin.left},${margin.top})`}
        >
          <rect
            fill="transparent"
            height={innerHeight}
            width={innerWidth}
            x={0}
            y={0}
          />
          {layers.clipExcluded}
          {layers.underlay}
          {layers.series}
          {layers.postOverlay}
        </g>
      </svg>
    </ChartProvider>
  );
});

export function CandlestickChart({
  data,
  xDataKey = "date",
  margin: marginProp,
  animationDuration = 1100,
  enterTransition,
  revealSignature,
  aspectRatio = "2 / 1",
  className = "",
  style,
  candleGap = 0.2,
  candleWidth,
  xDomain,
  xDomainSlotCount,
  children,
}: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const margin = { ...DEFAULT_MARGIN, ...marginProp };
  const dataAsRecords = data as unknown as Record<string, unknown>[];

  return (
    <div
      className={cn("relative w-full", className)}
      ref={containerRef}
      style={{ aspectRatio, touchAction: "none", ...style }}
    >
      <ParentSize debounceTime={10}>
        {({ width, height }) => (
          <ChartInner
            animationDuration={animationDuration}
            candleGap={candleGap}
            candleWidthProp={candleWidth}
            containerRef={containerRef}
            data={dataAsRecords}
            enterTransition={enterTransition}
            height={height}
            margin={margin}
            revealSignature={revealSignature}
            width={width}
            xDataKey={xDataKey}
            xDomain={xDomain}
            xDomainSlotCount={xDomainSlotCount}
          >
            {children}
          </ChartInner>
        )}
      </ParentSize>
    </div>
  );
}

CandlestickChart.displayName = "CandlestickChart";
