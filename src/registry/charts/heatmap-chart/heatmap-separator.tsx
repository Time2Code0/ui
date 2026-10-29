"use client";

import type { ReactElement, ReactNode } from "react";
import type { HeatmapColumn } from "./heatmap-context";
import type {
  HeatmapSeparatorGroupBy,
  HeatmapSeparatorLayout,
  HeatmapSeparatorParsedConfig,
} from "./heatmap-utils";

import {
  Children,
  isValidElement,
  memo,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "cn";

import {
  getChartChildName,
  resolveChartChildElement,
} from "../chart-utils/chart-children";
import { useHeatmap } from "./heatmap-context";
import {
  buildHeatmapSeparatorGradientStops,
  getHeatmapSeparatorLineY,
  getHeatmapSeparatorX,
  type HeatmapSeparatorGradient,
  type HeatmapSeparatorStrokeStyle,
  resolveHeatmapSeparatorLayout,
  resolveHeatmapSeparatorStrokeDasharray,
} from "./heatmap-utils";

/** Marker for reliably identifying {@link HeatmapSeparator} in chart child trees. */
export const HEATMAP_SEPARATOR_MARKER = "__isHeatmapSeparator" as const;

export interface HeatmapSeparatorProps {
  /** Additional class name for each separator group. */
  className?: string;
  /**
   * Insert a separator before every Nth column (e.g. 4 = divide every four weeks).
   * Used when `groupBy="every"`. When omitted, uses `columnSeparators` from
   * {@link HeatmapChart} or a sibling {@link HeatmapSeparator} parsed for layout.
   */
  every?: number;
  /**
   * Vertical stroke gradient aligned to each line's span.
   * Use matching `from`/`via`/`to` colors with fading opacities to soften the
   * top and bottom (e.g. `{ fromOpacity: 0, viaOpacity: 1, toOpacity: 0 }`).
   */
  gradient?: HeatmapSeparatorGradient;
  /**
   * Group columns by fixed interval (`every`) or calendar quarter (`quarter`).
   * @default "every"
   */
  groupBy?: "every" | "quarter";
  /** Additional class name for quarter labels */
  labelClassName?: string;
  /** Format quarter group labels. @default Q{n} */
  labelFormat?: (quarter: number, startDate: Date) => string;
  /**
   * Distance below the separator line top to place quarter labels.
   * `0` aligns labels with the line top.
   * @default 0
   */
  labelOffset?: number;
  /** Half-width of the line band in pixels (line is centered). @default 0 */
  paddingX?: number;
  /** Inset from the bottom of the plot in pixels. @default 0 */
  paddingY?: number;
  /** Draw Q1–Q4 labels at the start of each quarter group. @default false */
  showLabels?: boolean;
  /**
   * Extra horizontal gap between column groups in pixels (shifts cells apart).
   * Parsed from this component by {@link HeatmapChart} for layout.
   * @default 0
   */
  spacing?: number;
  /**
   * Distance from the chart container top to the line start, in pixels.
   * Use to align with {@link HeatmapXAxis} labels (e.g. `14`). The line always
   * extends to the plot bottom. Defaults to the plot top (`margin.top`).
   */
  startOffset?: number;
  /** Line stroke color when `gradient` is omitted. @default color-mix(in oklab, var(--color-foreground) 10%, transparent) */
  stroke?: string;
  /** Dash pattern when `strokeStyle="dashed"`. @default "4,4" */
  strokeDasharray?: string;
  /** Multiplier applied to solid strokes or gradient stop opacities. @default 1 */
  strokeOpacity?: number;
  /** Solid or dashed separator line. @default "solid" */
  strokeStyle?: HeatmapSeparatorStrokeStyle;
  /** Line stroke width in pixels. @default 1 */
  strokeWidth?: number;
}

export const HeatmapSeparator = memo(function HeatmapSeparator({
  className,
  paddingX = 0,
  paddingY = 0,
  startOffset,
  labelOffset = 0,
  showLabels = false,
  labelFormat = (quarter) => `Q${quarter}`,
  labelClassName,
  strokeStyle = "solid",
  strokeDasharray,
  stroke = "color-mix(in oklab, var(--color-foreground) 10%, transparent)",
  gradient,
  strokeWidth = 1,
  strokeOpacity = 1,
}: HeatmapSeparatorProps) {
  const { gap, innerHeight, margin, separatorLayout, xScale, containerRef } =
    useHeatmap();

  const [mounted, setMounted] = useState(false);
  const reactId = useId().replace(/:/g, "");
  const gradientId = `heatmap-separator-gradient-${reactId}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  const separators = useMemo(() => {
    if (!separatorLayout) {
      return [];
    }

    return separatorLayout.atColumns.map((columnIndex) => ({
      columnIndex,
      x: getHeatmapSeparatorX(columnIndex, gap, separatorLayout, xScale),
    }));
  }, [gap, separatorLayout, xScale]);

  const labels = useMemo(() => {
    if (!(showLabels && separatorLayout?.groups.length)) {
      return [];
    }

    return separatorLayout.groups.map((group) => ({
      key: `${group.year}-Q${group.quarter}-${group.startColumnIndex}`,
      label: labelFormat(group.quarter, group.startDate),
      x: margin.left + xScale(group.startColumnIndex),
    }));
  }, [labelFormat, margin.left, separatorLayout, showLabels, xScale]);

  if (!separatorLayout) {
    return null;
  }

  const { y1: lineY1, y2: lineY2 } = getHeatmapSeparatorLineY({
    innerHeight,
    marginTop: margin.top,
    paddingY,
    startOffset,
  });

  const separatorTop = startOffset ?? margin.top;
  const labelTop = separatorTop + labelOffset;
  const resolvedStroke = gradient ? `url(#${gradientId})` : stroke;
  const resolvedStrokeDasharray = resolveHeatmapSeparatorStrokeDasharray(
    strokeStyle,
    strokeDasharray
  );
  const gradientStops = gradient
    ? buildHeatmapSeparatorGradientStops(gradient, strokeOpacity)
    : null;

  const container = containerRef.current;
  const labelPortal =
    mounted && container && labels.length > 0
      ? createPortal(
          labels.map((tick) => (
            <div
              className="pointer-events-none absolute"
              key={tick.key}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                left: tick.x,
                top: labelTop,
                width: 0,
              }}
            >
              <span
                className={cn(
                  "whitespace-nowrap text-foreground-muted text-xs",
                  labelClassName
                )}
              >
                {tick.label}
              </span>
            </div>
          )),
          container
        )
      : null;

  if (separators.length === 0) {
    return labelPortal;
  }

  return (
    <>
      {gradientStops ? (
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id={gradientId}
            x1={0}
            x2={0}
            y1={lineY1}
            y2={lineY2}
          >
            {gradientStops.map((stop) => (
              <stop
                key={stop.offset}
                offset={stop.offset}
                stopColor={stop.color}
                stopOpacity={stop.opacity}
              />
            ))}
          </linearGradient>
        </defs>
      ) : null}
      <g>
        {separators.map((separator) => (
          <g
            className={cn(className)}
            key={separator.columnIndex}
            transform={`translate(${separator.x}, 0)`}
          >
            {paddingX > 0 ? (
              <rect
                fill="transparent"
                height={lineY2 - lineY1}
                width={paddingX * 2}
                x={-paddingX}
                y={lineY1}
              />
            ) : null}
            <line
              stroke={resolvedStroke}
              strokeDasharray={resolvedStrokeDasharray}
              strokeOpacity={gradient ? undefined : strokeOpacity}
              strokeWidth={strokeWidth}
              x1={0}
              x2={0}
              y1={lineY1}
              y2={lineY2}
            />
          </g>
        ))}
      </g>
      {labelPortal}
    </>
  );
});

(HeatmapSeparator as unknown as Record<string, boolean>)[
  HEATMAP_SEPARATOR_MARKER
] = true;

HeatmapSeparator.displayName = "HeatmapSeparator";

function isHeatmapSeparatorElement(child: ReactElement): boolean {
  const resolved = resolveChartChildElement(child);
  const type = resolved.type as { [HEATMAP_SEPARATOR_MARKER]?: boolean };
  return (
    resolved.type === HeatmapSeparator ||
    type[HEATMAP_SEPARATOR_MARKER] === true ||
    getChartChildName(resolved) === "HeatmapSeparator"
  );
}

function readHeatmapSeparatorConfig(
  child: ReactElement
): HeatmapSeparatorParsedConfig | null {
  const props = resolveChartChildElement(child).props as {
    every?: number;
    groupBy?: HeatmapSeparatorGroupBy;
    spacing?: number;
  };
  const groupBy = props.groupBy ?? "every";

  if (groupBy === "quarter") {
    return {
      groupBy: "quarter",
      spacing: props.spacing ?? 0,
    };
  }

  if (props.every == null || props.every <= 0) {
    return null;
  }

  return {
    every: props.every,
    groupBy: "every",
    spacing: props.spacing ?? 0,
  };
}

/** Reads the first {@link HeatmapSeparator} child for separator config. */
function resolveHeatmapSeparatorConfig(
  children: ReactNode,
  chartSeparators?: HeatmapSeparatorParsedConfig | null
): HeatmapSeparatorParsedConfig | null {
  let config: HeatmapSeparatorParsedConfig | null = null;

  const visit = (node: ReactNode) => {
    if (config) {
      return;
    }

    Children.forEach(node, (child) => {
      if (config || !isValidElement(child)) {
        return;
      }

      if (isHeatmapSeparatorElement(child)) {
        config = readHeatmapSeparatorConfig(child);
        return;
      }

      const childProps = child.props as { children?: ReactNode } | undefined;
      if (childProps?.children) {
        visit(childProps.children);
      }
    });
  };

  visit(children);
  return config ?? normalizeHeatmapSeparatorConfig(chartSeparators);
}

function normalizeHeatmapSeparatorConfig(
  config?: HeatmapSeparatorParsedConfig | null
): HeatmapSeparatorParsedConfig | null {
  if (!config) {
    return null;
  }

  if (config.groupBy === "quarter") {
    return {
      groupBy: "quarter",
      spacing: config.spacing ?? 0,
    };
  }

  if (!config.every || config.every <= 0) {
    return null;
  }

  return {
    every: config.every,
    groupBy: "every",
    spacing: config.spacing ?? 0,
  };
}

/** Merges chart prop and child-derived config, then resolves column indices from data. */
export function resolveHeatmapSeparatorConfigWithData(
  children: ReactNode,
  columns: HeatmapColumn[],
  chartSeparators?: HeatmapSeparatorParsedConfig | null
): HeatmapSeparatorLayout | null {
  const config = resolveHeatmapSeparatorConfig(children, chartSeparators);
  return resolveHeatmapSeparatorLayout(config, columns);
}
