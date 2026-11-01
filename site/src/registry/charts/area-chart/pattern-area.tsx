"use client";

import { type CurveFactory, curveMonotoneX } from "d3-shape";

import { useChartStable } from "../chart-core/chart-context";
import { areaPath } from "../chart-core/line-path";

export interface PatternAreaProps {
  /** Curve function. @default curveMonotoneX */
  curve?: CurveFactory;
  /** Key in data to use for y values */
  dataKey: string;
  /** Fill color or pattern URL (e.g. `url(#pattern-id)`) */
  fill: string;
}

/**
 * Filled area using an SVG pattern (`url(#id)`).
 * Pair with `PatternLines` in `AreaChart` children and an `Area` with `fillOpacity={0}` for the stroke line.
 */
export function PatternArea({
  dataKey,
  fill,
  curve = curveMonotoneX,
}: PatternAreaProps) {
  const { renderData, xScale, yScale, xAccessor } = useChartStable();

  return (
    <path
      d={areaPath(renderData, {
        curve,
        x: (d) => xScale(xAccessor(d)) ?? 0,
        y: (d) => {
          const v = d[dataKey];
          return typeof v === "number" ? (yScale(v) ?? 0) : 0;
        },
        yScale,
      })}
      fill={fill}
    />
  );
}

PatternArea.displayName = "PatternArea";
