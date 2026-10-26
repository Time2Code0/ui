"use client";

import type { Transition } from "motion/react";

import {
  Children,
  isValidElement,
  memo,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { scaleLinear, scaleTime } from "@visx/scale";
import { cn } from "cn";
import { bisector } from "d3-array";

import {
  isClipExcludedComponent,
  isPostOverlayComponent,
  isUnderlayComponent,
  renderableChartChild,
  resolveChartChildElement,
} from "./chart-child-passthrough";
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
import { wrapSingleYScale } from "./y-axis-scales";

export interface OHLCDataPoint {
  close: number;
  date: Date;
  high: number;
  low: number;
  open: number;
}

export interface CandlestickChartProps {
  /** Animation duration in milliseconds. Default: 1500 */
  animationDuration?: number;
  /** Aspect ratio as "width / height". Default: "2 / 1" */
  aspectRatio?: string;
  /** Gap between candles as fraction of slot width (0–1). Default: 0.2. Ignored when candleWidth is set. */
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
  /** Signature of motion URL state — triggers enter replay when it changes. */
  revealSignature?: string;
  /** Inline styles for the container (e.g. { height: 320 }) */
  style?: React.CSSProperties;
  /** Key in data for the x-axis (date). Default: "date" */
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [revealEpoch, setRevealEpoch] = useState(1);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xAccessor = useCallback(
    (d: Record<string, unknown>): Date => {
      const value = d[xDataKey];
      return value instanceof Date ? value : new Date(value as string | number);
    },
    [xDataKey]
  );

  const bisectDate = useMemo(
    () => bisector<Record<string, unknown>, Date>((d) => xAccessor(d)).left,
    [xAccessor]
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
      { dataKey: "close", stroke: "var(--chart-line-primary)", strokeWidth: 0 },
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

  // Replay the reveal when motion settings change. Adjusted during render
  // ("store previous props in state") instead of setState in an effect, so a
  // replay costs one render rather than a commit plus a cascading re-render.
  const [revealKey, setRevealKey] = useState({
    animationDuration,
    revealSignature,
  });
  if (
    revealKey.animationDuration !== animationDuration ||
    revealKey.revealSignature !== revealSignature
  ) {
    setRevealKey({ animationDuration, revealSignature });
    setRevealEpoch((n) => n + 1);
    setIsLoaded(false);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: revealSignature
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), animationDuration);
    return () => clearTimeout(timer);
  }, [animationDuration, revealSignature]);

  const {
    tooltipData,
    setTooltipData,
    selection,
    clearSelection,
    interactionHandlers,
    interactionStyle,
  } = useChartInteraction({
    bisectDate,
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

  const isDefsComponent = (child: ReactElement): boolean => {
    const displayName =
      (child.type as { displayName?: string })?.displayName ||
      (child.type as { name?: string })?.name ||
      "";
    return (
      displayName.includes("Gradient") ||
      displayName.includes("Pattern") ||
      displayName === "LinearGradient" ||
      displayName === "RadialGradient" ||
      displayName === "Lines" ||
      displayName === "PatternLines"
    );
  };

  const defsChildren: ReactElement[] = [];
  const clipExcludedChildren: ReactElement[] = [];
  const underlayChildren: ReactElement[] = [];
  const preOverlayChildren: ReactElement[] = [];
  const postOverlayChildren: ReactElement[] = [];
  Children.forEach(children, (rawChild) => {
    if (!isValidElement(rawChild)) {
      return;
    }
    const child = renderableChartChild(rawChild);
    const resolvedChild = resolveChartChildElement(rawChild);
    if (isDefsComponent(resolvedChild)) {
      defsChildren.push(child);
    } else if (isPostOverlayComponent(resolvedChild)) {
      postOverlayChildren.push(child);
    } else if (isClipExcludedComponent(resolvedChild)) {
      clipExcludedChildren.push(child);
    } else if (isUnderlayComponent(resolvedChild)) {
      underlayChildren.push(child);
    } else {
      preOverlayChildren.push(child);
    }
  });

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
          {/* Default vertical gradients for positive/negative candles (--chart-positive / --chart-negative) */}
          <linearGradient id="candlestick-positive" x1="0" x2="0" y1="1" y2="0">
            <stop
              offset="0%"
              stopColor="var(--chart-positive, var(--color-emerald-500))"
            />
            <stop
              offset="100%"
              stopColor="var(--chart-positive, var(--color-emerald-500))"
            />
          </linearGradient>
          <linearGradient id="candlestick-negative" x1="0" x2="0" y1="1" y2="0">
            <stop
              offset="0%"
              stopColor="var(--chart-negative, var(--color-red-500))"
            />
            <stop
              offset="100%"
              stopColor="var(--chart-negative, var(--color-red-500))"
            />
          </linearGradient>
          {defsChildren}
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
          {clipExcludedChildren}
          {underlayChildren}
          {preOverlayChildren}
          {postOverlayChildren}
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
