"use client";

import { useEffect, useState } from "react";

import { LinearGradient } from "@visx/gradient";
import { motion, useSpring } from "motion/react";

import { Bar } from "@/registry/charts/bar";
import { BarChart } from "@/registry/charts/bar-chart";
import { BarXAxis } from "@/registry/charts/bar-x-axis";
import { useChart } from "@/registry/charts/chart-context";
import { Grid } from "@/registry/charts/grid";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";

const barRevenueData = [
  { month: "Jan", revenue: 12_000 },
  { month: "Feb", revenue: 15_500 },
  { month: "Mar", revenue: 11_000 },
  { month: "Apr", revenue: 18_500 },
  { month: "May", revenue: 16_800 },
  { month: "Jun", revenue: 21_200 },
];

function AnimatedBarLine({
  barX,
  barTopY,
  barBottomY,
  width,
  isHovered,
}: {
  barX: number;
  barTopY: number;
  barBottomY: number;
  width: number;
  isHovered: boolean;
}) {
  const animatedY = useSpring(barBottomY, { damping: 30, stiffness: 300 });
  const animatedOpacity = useSpring(0, { damping: 30, stiffness: 300 });

  useEffect(() => {
    animatedY.set(isHovered ? barTopY : barBottomY);
    animatedOpacity.set(isHovered ? 1 : 0);
  }, [isHovered, barTopY, barBottomY, animatedY, animatedOpacity]);

  return (
    <motion.rect
      fill="var(--color-foreground)"
      height={2}
      style={{ opacity: animatedOpacity, y: animatedY }}
      width={width}
      x={barX}
    />
  );
}

function BarLineIndicator({
  data,
  valueKey,
  valueKeys,
  xKey,
  stacked = false,
}: {
  data: Record<string, unknown>[];
  valueKey?: string;
  valueKeys?: string[];
  xKey: string;
  stacked?: boolean;
}) {
  const {
    barScale,
    bandWidth,
    innerHeight,
    margin,
    containerRef,
    hoveredBarIndex,
    yScale,
  } = useChart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const container = containerRef.current;
  if (!(mounted && container && bandWidth && barScale)) {
    return null;
  }

  const keys = valueKeys ?? (valueKey ? [valueKey] : []);
  if (keys.length === 0) {
    return null;
  }

  const { createPortal } = require("react-dom") as typeof import("react-dom");

  return createPortal(
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-50 overflow-visible"
      height="100%"
      width="100%"
    >
      <g transform={`translate(${margin.left},${margin.top})`}>
        {data.flatMap((d, i) => {
          const xVal = d[xKey];
          const groupX = barScale(String(xVal)) ?? 0;
          const isHovered = hoveredBarIndex === i;

          if (stacked) {
            const total = keys.reduce(
              (sum, key) => sum + (Number(d[key]) || 0),
              0
            );

            return [
              <AnimatedBarLine
                barBottomY={innerHeight}
                barTopY={yScale(total) ?? innerHeight}
                barX={groupX}
                isHovered={isHovered}
                key={String(xVal)}
                width={bandWidth}
              />,
            ];
          }

          const barCount = keys.length;
          const individualBarWidth = bandWidth / barCount;

          return keys.map((key, barIndex) => {
            const yVal = d[key];
            const barTopY =
              typeof yVal === "number"
                ? (yScale(yVal) ?? innerHeight)
                : innerHeight;

            return (
              <AnimatedBarLine
                barBottomY={innerHeight}
                barTopY={barTopY}
                barX={groupX + barIndex * individualBarWidth}
                isHovered={isHovered}
                key={`${String(xVal)}-${key}`}
                width={individualBarWidth}
              />
            );
          });
        })}
      </g>
    </svg>,
    container
  );
}

export function Particle() {
  return (
    <BarChart
      barGap={0}
      data={barRevenueData}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
      xDataKey="month"
    >
      <LinearGradient
        from="var(--color-chart-3)"
        id="bar-example-nogap-gradient"
        to="transparent"
      />
      <Grid horizontal />
      <Bar
        dataKey="revenue"
        fill="url(#bar-example-nogap-gradient)"
        lineCap="butt"
        stroke="var(--color-chart-3)"
      />
      <BarXAxis />
      <ChartTooltip showCrosshair={false} showDots={false} />
      <BarLineIndicator data={barRevenueData} valueKey="revenue" xKey="month" />
    </BarChart>
  );
}
