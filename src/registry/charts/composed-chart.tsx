"use client";

import type { LineConfig } from "./chart-context";

import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useMemo,
} from "react";

import { Area, type AreaProps } from "./area";
import { getChartChildName } from "./chart-children";
import { Line, type LineProps } from "./line";
import { SeriesBar, type SeriesBarProps } from "./series-bar";
import { computeStackOffsets } from "./series-bar-layout";
import {
  TimeSeriesChart,
  type TimeSeriesChartProps,
} from "./time-series-chart-shell";

export interface ComposedChartProps
  extends Pick<
    TimeSeriesChartProps,
    | "animationDuration"
    | "animationEasing"
    | "aspectRatio"
    | "children"
    | "className"
    | "enterTransition"
    | "margin"
    | "onPhaseChange"
    | "revealSignature"
    | "xDataKey"
  > {
  /** Gap between grouped `SeriesBar` series in px. Default: 4 */
  barGap?: number;
  /** Target bar width in px (Recharts-style `barSize`). */
  barSize?: number;
  /** Data array — each row typically has a date and multiple numeric series */
  data: Record<string, unknown>[];
  /** Maximum bar width in px (`maxBarSize`). */
  maxBarSize?: number;
  /** Stack `SeriesBar` segments in child order at each x (line/area are not stacked). */
  stacked?: boolean;
  /** Gap in px between stacked segments. Default: 0 */
  stackGap?: number;
}

function upsertLineConfig(lines: LineConfig[], config: LineConfig): void {
  const index = lines.findIndex((line) => line.dataKey === config.dataKey);
  if (index === -1) {
    lines.push(config);
    return;
  }
  // Area+Line pairs share a dataKey — keep the later config (Line over Area).
  lines[index] = config;
}

function tryAppendSeriesBar(
  child: ReactElement,
  lines: LineConfig[],
  barDataKeys: string[]
): boolean {
  const name = getChartChildName(child);
  if (!(child.type === SeriesBar || name === "SeriesBar")) {
    return false;
  }
  const props = child.props as SeriesBarProps;
  if (!props.dataKey) {
    return true;
  }
  barDataKeys.push(props.dataKey);
  upsertLineConfig(lines, {
    dataKey: props.dataKey,
    stroke: props.stroke || props.fill || "var(--chart-line-primary)",
    strokeWidth: 0,
  });
  return true;
}

function tryAppendLine(child: ReactElement, lines: LineConfig[]): boolean {
  const name = getChartChildName(child);
  if (!(child.type === Line || name === "Line")) {
    return false;
  }
  const props = child.props as LineProps;
  if (props.dataKey) {
    upsertLineConfig(lines, {
      dataKey: props.dataKey,
      stroke: props.stroke || "var(--chart-line-primary)",
      strokeWidth: props.strokeWidth ?? 2.5,
      yAxisId: props.yAxisId,
    });
  }
  return true;
}

function tryAppendArea(child: ReactElement, lines: LineConfig[]): boolean {
  const name = getChartChildName(child);
  if (!(child.type === Area || name === "Area")) {
    return false;
  }
  const props = child.props as AreaProps;
  if (props.dataKey) {
    upsertLineConfig(lines, {
      dataKey: props.dataKey,
      stroke: props.stroke || props.fill || "var(--chart-line-primary)",
      strokeWidth: props.strokeWidth ?? 2,
      yAxisId: props.yAxisId,
    });
  }
  return true;
}

function extractComposedSeries(children: ReactNode): {
  lines: LineConfig[];
  barDataKeys: string[];
} {
  const lines: LineConfig[] = [];
  const barDataKeys: string[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }
    if (tryAppendSeriesBar(child, lines, barDataKeys)) {
      return;
    }
    if (tryAppendLine(child, lines)) {
      return;
    }
    tryAppendArea(child, lines);
  });

  return { barDataKeys, lines };
}

function computeComposedYScaleDomainMax(
  data: Record<string, unknown>[],
  lines: LineConfig[],
  barDataKeys: string[]
): number | undefined {
  const barSet = new Set(barDataKeys);
  let max = 0;
  for (const d of data) {
    let barSum = 0;
    for (const k of barDataKeys) {
      const v = d[k];
      if (typeof v === "number") {
        barSum += v;
      }
    }
    let rowMaxOther = 0;
    for (const line of lines) {
      if (barSet.has(line.dataKey)) {
        continue;
      }
      const v = d[line.dataKey];
      if (typeof v === "number") {
        rowMaxOther = Math.max(rowMaxOther, v);
      }
    }
    max = Math.max(max, barSum, rowMaxOther);
  }
  return max > 0 ? max : undefined;
}

export function ComposedChart({
  barGap = 4,
  barSize,
  maxBarSize,
  stacked = false,
  stackGap = 0,
  ...props
}: ComposedChartProps) {
  const { children, data } = props;
  const { lines, barDataKeys } = useMemo(
    () => extractComposedSeries(children),
    [children]
  );
  const stacksBars = stacked && barDataKeys.length > 0;

  const composedStackOffsets = useMemo(
    () => (stacksBars ? computeStackOffsets(data, barDataKeys) : undefined),
    [data, barDataKeys, stacksBars]
  );

  const yScaleDomainMax = useMemo(
    () =>
      stacksBars
        ? computeComposedYScaleDomainMax(data, lines, barDataKeys)
        : undefined,
    [data, lines, barDataKeys, stacksBars]
  );

  return (
    <TimeSeriesChart
      {...props}
      clipPathId="composed-chart-grow-clip"
      composedBarDataKeys={barDataKeys.length > 0 ? barDataKeys : undefined}
      composedBarGap={barGap}
      composedBarSize={barSize}
      composedMaxBarSize={maxBarSize}
      composedStacked={stacked}
      composedStackGap={stackGap}
      composedStackOffsets={composedStackOffsets}
      lines={lines}
      yScaleDomainMax={yScaleDomainMax}
    />
  );
}

ComposedChart.displayName = "ComposedChart";
