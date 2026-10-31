"use client";

import type { LineConfig } from "../chart-core/chart-context";

import {
  Children,
  isValidElement,
  type ReactNode,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";

import { chartCssVars, useChartStable } from "../chart-core/chart-context";
import { getChartChildName } from "../chart-utils/chart-children";
import {
  fadeGradientStops,
  resolveFadeSides,
  viewportFadeGradientAttrs,
} from "../chart-utils/fade-edges";
import { valueLabelFmt } from "../chart-utils/formatters";
import {
  TimeSeriesChart,
  type TimeSeriesChartProps,
} from "../time-series-chart/time-series-chart";
import { Area, type AreaProps } from "./area";
import { PatternArea } from "./pattern-area";

export type AreaChartProps = TimeSeriesChartProps;

function extractAreaConfigs(children: ReactNode): (LineConfig & AreaProps)[] {
  const configs: (LineConfig & AreaProps)[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    const componentName = getChartChildName(child);

    const props = child.props as AreaProps | undefined;
    const isPatternArea =
      componentName === "PatternArea" || child.type === PatternArea;
    // Overlays that carry a dataKey but are not series of their own.
    const isSeriesOverlay =
      componentName === "TrendLine" ||
      componentName === "LineSeriesTerminalMarker";
    const isAreaComponent =
      componentName === "Area" ||
      child.type === Area ||
      (props &&
        typeof props.dataKey === "string" &&
        props.dataKey.length > 0 &&
        !isPatternArea &&
        !isSeriesOverlay);

    if (isAreaComponent && props?.dataKey) {
      configs.push({
        ...props,
        dataKey: props.dataKey,
        stroke: props.stroke || props.fill || "var(--color-chart-1)",
        strokeWidth: props.strokeWidth || 2,
        yAxisId: props.yAxisId,
      });
    }
  });

  return configs;
}

export function AreaChart(props: AreaChartProps) {
  const lines = useMemo(
    () => extractAreaConfigs(props.children),
    [props.children]
  );
  return (
    <TimeSeriesChart {...props} clipPathId="chart-area-grow-clip" lines={lines}>
      {props.children}
      {/* Resolve labels together, above all fills and outside their edge masks. */}
      <AreaValueLabels series={lines} />
    </TimeSeriesChart>
  );
}

/** One final layer keeps later area fills from painting over earlier labels. */
function AreaValueLabels({ series }: { series: AreaProps[] }) {
  const {
    data,
    xScale,
    xAccessor,
    yScale,
    yScales,
    innerWidth,
    innerHeight,
    chartPhase,
  } = useChartStable();
  const layerRef = useRef<SVGGElement>(null);
  const id = useId();
  const labels = useMemo(() => {
    if (!["revealing", "ready", "exitingReady"].includes(chartPhase)) {
      return [];
    }
    const visible = data
      .map((datum, index) => ({ datum, index, x: xScale(xAccessor(datum)) }))
      .filter(({ x }) => Number.isFinite(x) && x >= 0 && x <= innerWidth);
    const visibleSeries = series
      .map((area, seriesIndex) => ({
        area,
        points: visible.filter(
          ({ datum }) =>
            typeof datum[area.dataKey] === "number" &&
            Number.isFinite(datum[area.dataKey])
        ),
        seriesIndex,
      }))
      .filter(({ area }) => area.showValue);
    const counts = visibleSeries.map(({ area, points }) =>
      resolveAreaValueLabelCount(
        points.length,
        innerWidth,
        area.valueLabelMinCount,
        area.valueLabelMaxCount
      )
    );
    const sharedCount = resolveSharedAreaValueLabelCount(counts);
    return visibleSeries.flatMap(({ area, seriesIndex, points }, i) => {
      // Series that resolve to 0 (e.g. `valueLabelMaxCount={0}`) stay hidden;
      // the rest share the smallest non-zero count so labels line up.
      const count = Math.min(sharedCount, counts[i] ?? 0);
      if (count === 0) {
        return [];
      }
      const indices = evenlySpacedLabelIndices(points.length, count);
      return indices.flatMap((position) => {
        const point = position == null ? undefined : points[position];
        if (!point) {
          return [];
        }
        const { datum, index, x } = point;
        const value = datum[area.dataKey] as number;
        const scale = yScales[String(area.yAxisId ?? "left")] ?? yScale;
        const y = scale(value);
        if (!Number.isFinite(y)) {
          return [];
        }
        return [
          {
            index,
            seriesIndex,
            text: area.valueLabelFormatter?.(value) ?? valueLabelFmt(value),
            x,
            y,
          },
        ];
      });
    });
  }, [
    data,
    series,
    xScale,
    xAccessor,
    yScale,
    yScales,
    innerWidth,
    chartPhase,
  ]);

  useLayoutEffect(() => {
    const layer = layerRef.current;
    if (!layer) {
      return;
    }
    let active = true;
    const arrange = () => {
      if (!active) {
        return;
      }
      const elements = Array.from(layer.querySelectorAll("text"));
      const boxes = labels.map((label, index) => {
        const bounds = elements[index]?.getBBox();
        return {
          ...label,
          height: bounds?.height ?? 0,
          width: bounds?.width ?? 0,
        };
      });
      for (const element of elements) {
        element.style.visibility = "hidden";
      }
      for (const box of layoutAreaValueLabels(boxes, innerWidth, innerHeight)) {
        const element = elements[box.source];
        if (!element) {
          continue;
        }
        // Measure at the origin so font ascent, Persian digits and custom formats are respected.
        const bounds = element.getBBox();
        element.setAttribute(
          "transform",
          `translate(${box.x - bounds.x - bounds.width / 2}, ${box.y - bounds.y - bounds.height / 2})`
        );
        element.style.visibility = "visible";
      }
    };
    arrange();
    // Font loading changes Persian glyph widths; remeasure before deciding collisions.
    document.fonts.ready.then(arrange);
    document.fonts.addEventListener("loadingdone", arrange);
    return () => {
      active = false;
      document.fonts.removeEventListener("loadingdone", arrange);
    };
  }, [labels, innerWidth, innerHeight]);

  // Labels are opt-in: charts without `showValue` render no extra layer.
  if (!series.some((area) => area.showValue)) {
    return null;
  }

  return (
    <g pointerEvents="none" ref={layerRef}>
      <defs>
        {series.map(
          (area, index) =>
            area.fadeValueLabels && (
              <g key={area.dataKey}>
                <linearGradient
                  id={`${id}-${index}`}
                  {...viewportFadeGradientAttrs(innerWidth)}
                >
                  {fadeGradientStops(
                    resolveFadeSides(area.fadeEdges ?? false)
                  ).map((stop) => (
                    <stop
                      key={stop.offset}
                      offset={stop.offset}
                      stopColor="white"
                      stopOpacity={stop.opacity}
                    />
                  ))}
                </linearGradient>
                <mask
                  height={innerHeight}
                  id={`${id}-${index}-mask`}
                  maskUnits="userSpaceOnUse"
                  width={innerWidth}
                  x={0}
                  y={0}
                >
                  <rect
                    fill={`url(#${id}-${index})`}
                    height={innerHeight}
                    width={innerWidth}
                  />
                </mask>
              </g>
            )
        )}
      </defs>
      {labels.map((label) => {
        const area = series[label.seriesIndex];
        if (!area) {
          return null;
        }
        return (
          <g
            key={`${label.seriesIndex}-${label.index}`}
            mask={
              area.fadeValueLabels
                ? `url(#${id}-${label.seriesIndex}-mask)`
                : undefined
            }
          >
            <text
              className="font-medium text-[10px]"
              fill={
                area.valueLabelColor ??
                area.stroke ??
                (area.fill?.startsWith("url(") ? undefined : area.fill) ??
                chartCssVars.linePrimary
              }
              style={{
                paintOrder: "stroke",
                stroke: "var(--color-background)",
                strokeWidth: 3,
                visibility: "hidden",
              }}
              x={0}
              y={0}
            >
              {label.text}
            </text>
          </g>
        );
      })}
    </g>
  );
}

interface AreaLabelBox {
  height: number;
  index: number;
  width: number;
  x: number;
  y: number;
}

/** Positions are box centers; all series share the same collision space. */
function layoutAreaValueLabels(
  boxes: AreaLabelBox[],
  width: number,
  height: number
) {
  const placed: (AreaLabelBox & { source: number })[] = [];
  const padding = 4;
  const gap = 6;
  const visible = boxes
    .map((box, source) => ({ ...box, source }))
    .filter(
      (box) =>
        [box.index, box.x, box.y, box.width, box.height].every(
          Number.isFinite
        ) &&
        box.x >= 0 &&
        box.x <= width &&
        box.y >= 0 &&
        box.y <= height &&
        box.width > 0 &&
        box.height > 0 &&
        box.width + padding * 2 <= width &&
        box.height + padding * 2 <= height
    );
  const first = Math.min(...visible.map((box) => box.index));
  const last = Math.max(...visible.map((box) => box.index));
  const edge = (index: number) => (index === first || index === last ? 0 : 1);
  // Keep endpoints when possible; place higher series first, regardless of tree order.
  visible.sort(
    (a, b) => edge(a.index) - edge(b.index) || a.x - b.x || a.y - b.y
  );
  for (const box of visible) {
    const x = Math.max(
      padding + box.width / 2,
      Math.min(width - padding - box.width / 2, box.x)
    );
    const offset = box.height / 2 + gap;
    for (const y of [box.y - offset, box.y + offset]) {
      if (
        y - box.height / 2 < padding ||
        y + box.height / 2 > height - padding
      ) {
        continue;
      }
      const collision = placed.some(
        (other) =>
          Math.abs(x - other.x) < (box.width + other.width) / 2 + gap &&
          Math.abs(y - other.y) < (box.height + other.height) / 2 + gap
      );
      if (collision) {
        continue;
      }
      placed.push({ ...box, x, y });
      break;
    }
  }
  return placed;
}

/** Minimum is a preference; collision avoidance still takes priority. */
function resolveAreaValueLabelCount(
  length: number,
  width: number,
  min = 2,
  max?: number
) {
  const minimum = Number.isFinite(min) ? Math.max(0, Math.floor(min)) : 2;
  const maximum =
    max != null && Number.isFinite(max) ? Math.max(0, Math.floor(max)) : length;
  return Math.min(
    length,
    maximum,
    Math.max(minimum, Math.floor(Math.max(0, width) / 48))
  );
}

function resolveSharedAreaValueLabelCount(counts: number[]) {
  const enabledCounts = counts.filter((count) => count > 0);
  return enabledCounts.length ? Math.min(...enabledCounts) : 0;
}

/**
 * Exactly `count` indices (fewer only when `length < count`), spread evenly
 * across `[0, length - 1]` with both endpoints included.
 */
function evenlySpacedLabelIndices(length: number, count: number) {
  const visibleCount = Math.min(Math.max(0, Math.floor(count)), length);
  if (visibleCount === 0) {
    return [];
  }
  if (visibleCount === 1) {
    return [0];
  }
  const lastIndex = length - 1;
  return Array.from({ length: visibleCount }, (_, index) =>
    Math.round((index * lastIndex) / (visibleCount - 1))
  );
}
