"use client";

import type { LineConfig } from "./chart-context";

import { Children, isValidElement, type ReactNode, useMemo } from "react";

import { Area, type AreaProps } from "./area";
import { AreaValueLabels } from "./area-value-labels";
import { getChartChildName } from "./chart-children";
import { PatternArea } from "./pattern-area";
import {
  TimeSeriesChart,
  type TimeSeriesChartProps,
} from "./time-series-chart-shell";

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
        stroke: props.stroke || props.fill || "var(--chart-line-primary)",
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

export { Area, type AreaProps } from "./area";
