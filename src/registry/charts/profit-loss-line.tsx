"use client";

import type { CurveFactory } from "d3-shape";

import { useCallback, useId, useMemo } from "react";

import { curveLinear } from "@visx/curve";
import { LinePath } from "@visx/shape";

import { useChart, useChartStable } from "./chart-context";
import {
  type FadeEdges,
  fadeGradientStops,
  resolveFadeSides,
} from "./fade-edges";
import { useProfitLossLegendHover } from "./profit-loss-legend-hover";
import { splitProfitLossSegments } from "./profit-loss-segments";

/** Semantic trend colors from the base success / destructive tokens. */
export const PROFIT_LOSS_POSITIVE_COLOR = "var(--color-success-foreground)";
export const PROFIT_LOSS_NEGATIVE_COLOR = "var(--color-destructive-foreground)";

const LEGEND_DIM_OPACITY = 0.25;

export function profitLossColor(value: number) {
  return value >= 0 ? PROFIT_LOSS_POSITIVE_COLOR : PROFIT_LOSS_NEGATIVE_COLOR;
}

export const PROFIT_LOSS_TOOLTIP_LABEL_FALLBACK = "Profit/Loss";

export function resolveProfitLossTooltipLabel(label: string) {
  const trimmed = label.trim();
  return trimmed || PROFIT_LOSS_TOOLTIP_LABEL_FALLBACK;
}

export interface ProfitLossLineProps {
  /** Curve function. @default curveLinear */
  curve?: CurveFactory;
  /** Key in data for y values */
  dataKey: string;
  /**
   * Fade the line stroke toward transparent at the chart edges.
   * @default false
   */
  fadeEdges?: FadeEdges;
  /** Color for loss segments @default var(--color-destructive-foreground) */
  negativeColor?: string;
  /** Color for profit segments @default var(--color-success-foreground) */
  positiveColor?: string;
  /** Line width @default 2.5 */
  strokeWidth?: number;
  /** Key in data for x values @default "date" */
  xDataKey?: string;
}

function segmentLegendIndex(isPositive: boolean) {
  return isPositive ? 0 : 1;
}

export function ProfitLossLine({
  dataKey,
  xDataKey = "date",
  strokeWidth = 2.5,
  positiveColor = PROFIT_LOSS_POSITIVE_COLOR,
  negativeColor = PROFIT_LOSS_NEGATIVE_COLOR,
  curve = curveLinear,
  fadeEdges = false,
}: ProfitLossLineProps) {
  const { tooltipData } = useChart();
  const { hoveredIndex } = useProfitLossLegendHover();
  const { renderData, xScale, yScale, xAccessor, innerWidth } =
    useChartStable();
  const reactId = useId();
  const fadeSides = resolveFadeSides(fadeEdges);
  const fadeStops = fadeSides.any ? fadeGradientStops(fadeSides) : null;
  const positiveGradientId = `profit-loss-gradient-pos-${dataKey}-${reactId}`;
  const negativeGradientId = `profit-loss-gradient-neg-${dataKey}-${reactId}`;

  const focusedLegendIndex = useMemo(() => {
    if (hoveredIndex !== null) {
      return hoveredIndex;
    }
    if (!tooltipData) {
      return null;
    }
    const value = tooltipData.point[dataKey];
    if (typeof value !== "number") {
      return null;
    }
    return segmentLegendIndex(value >= 0);
  }, [dataKey, hoveredIndex, tooltipData]);

  const segments = useMemo(
    () =>
      splitProfitLossSegments({
        data: renderData,
        dataKey,
        xAccessor,
        xDataKey,
      }),
    [dataKey, renderData, xAccessor, xDataKey]
  );

  const getX = useCallback(
    (d: Record<string, unknown>) => xScale(xAccessor(d)) ?? 0,
    [xAccessor, xScale]
  );

  const getY = useCallback(
    (d: Record<string, unknown>) => {
      const value = d[dataKey];
      return typeof value === "number" ? (yScale(value) ?? 0) : 0;
    },
    [dataKey, yScale]
  );

  return (
    <>
      {fadeStops ? (
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id={positiveGradientId}
            x1={0}
            x2={innerWidth}
            y1={0}
            y2={0}
          >
            {fadeStops.map((stop) => (
              <stop
                key={stop.offset}
                offset={stop.offset}
                style={{
                  stopColor: positiveColor,
                  stopOpacity: stop.opacity,
                }}
              />
            ))}
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id={negativeGradientId}
            x1={0}
            x2={innerWidth}
            y1={0}
            y2={0}
          >
            {fadeStops.map((stop) => (
              <stop
                key={stop.offset}
                offset={stop.offset}
                style={{
                  stopColor: negativeColor,
                  stopOpacity: stop.opacity,
                }}
              />
            ))}
          </linearGradient>
        </defs>
      ) : null}
      {segments.map((segment) => {
        const isDimmed =
          focusedLegendIndex !== null &&
          focusedLegendIndex !== segmentLegendIndex(segment.isPositive);
        const firstPoint = segment.data[0];
        const lastPoint = segment.data.at(-1);
        const segmentKey = `${dataKey}-${segment.isPositive ? "pos" : "neg"}-${String(firstPoint?.[xDataKey])}-${String(lastPoint?.[xDataKey])}`;
        const stroke = segment.isPositive ? positiveColor : negativeColor;
        const segmentStroke = fadeStops
          ? `url(#${segment.isPositive ? positiveGradientId : negativeGradientId})`
          : stroke;

        return (
          <g
            key={segmentKey}
            opacity={isDimmed ? LEGEND_DIM_OPACITY : 1}
            style={{ transition: "opacity 0.2s ease-in-out" }}
          >
            <LinePath
              curve={curve}
              data={segment.data}
              stroke={segmentStroke}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={strokeWidth}
              x={getX}
              y={getY}
            />
          </g>
        );
      })}
    </>
  );
}

ProfitLossLine.displayName = "ProfitLossLine";
