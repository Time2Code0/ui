"use client";

import type { LineConfig } from "./chart-context";

import { type ReactElement, type ReactNode, useMemo } from "react";

import { getChartChildName, walkChartChildren } from "./chart-children";
import { Line, type LineProps } from "./line";
import {
  TimeSeriesChart,
  type TimeSeriesChartProps,
} from "./time-series-chart-shell";

export type LineChartProps = TimeSeriesChartProps;

/** Series renderers that carry a dataKey but must not drive the shared y-domain. */
const LINE_DOMAIN_EXCLUDED_NAMES = new Set([
  "ProfitLossLine",
  "LineSeriesTerminalMarker",
  "Area",
  "SeriesBar",
  "Scatter",
  "Candlestick",
  "Bar",
  "PatternArea",
  "Band",
  "TrendLine",
]);

function registersLineDomain(
  child: ReactElement,
  props: LineProps | undefined
) {
  if (!props?.dataKey) {
    return false;
  }

  const componentName = getChartChildName(child);
  if (componentName === "Line" || child.type === Line) {
    return true;
  }
  if (LINE_DOMAIN_EXCLUDED_NAMES.has(componentName)) {
    return false;
  }
  // MDX / duplicate bundle instances may not share the same `Line` reference.
  return typeof props.dataKey === "string" && props.dataKey.length > 0;
}

function extractLineConfigs(children: ReactNode): LineConfig[] {
  const configs: LineConfig[] = [];
  walkChartChildren(children, (child) => {
    const props = child.props as LineProps | undefined;
    if (!(registersLineDomain(child, props) && props?.dataKey)) {
      return false;
    }
    configs.push({
      dataKey: props.dataKey,
      stroke: props.stroke || "var(--chart-line-primary)",
      strokeWidth: props.strokeWidth || 2.5,
      yAxisId: props.yAxisId,
    });
    return true;
  });
  return configs;
}

export function LineChart(props: LineChartProps) {
  const lines = useMemo(
    () => extractLineConfigs(props.children),
    [props.children]
  );
  return (
    <TimeSeriesChart {...props} clipPathId="chart-grow-clip" lines={lines} />
  );
}

export { Line, type LineProps } from "./line";
