"use client";

import React, { useEffect } from "react";

import { LinearGradient } from "@visx/gradient";
import { motion, useSpring } from "motion/react";

import { Bar } from "@/registry/charts/bar";
import { BarChart } from "@/registry/charts/bar-chart";
import { BarXAxis } from "@/registry/charts/bar-x-axis";
import { useChart } from "@/registry/charts/chart-context";
import { Grid } from "@/registry/charts/grid";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";

const chartData = [
  { month: "Jan", profit: 4500, revenue: 12_000 },
  { month: "Feb", profit: 5200, revenue: 15_500 },
  { month: "Mar", profit: 3800, revenue: 11_000 },
  { month: "Apr", profit: 7100, revenue: 18_500 },
  { month: "May", profit: 5400, revenue: 16_800 },
  { month: "Jun", profit: 8800, revenue: 21_200 },
];

// Individual animated line for a single bar
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
      style={{
        opacity: animatedOpacity,
        y: animatedY,
      }}
      width={width}
      x={barX}
    />
  );
}

// Custom horizontal line indicator - each bar has its own line that rises on hover
function BarHorizontalLineIndicator({ data }: { data: typeof chartData }) {
  const {
    barScale,
    bandWidth,
    innerHeight,
    margin,
    containerRef,
    hoveredBarIndex,
    yScale,
  } = useChart();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const container = containerRef.current;
  if (!(mounted && container && bandWidth && barScale)) {
    return null;
  }

  const { createPortal } = require("react-dom") as typeof import("react-dom");

  return createPortal(
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-50"
      height="100%"
      width="100%"
    >
      <g transform={`translate(${margin.left},${margin.top})`}>
        {data.map((d, i) => {
          const barX = barScale(d.month) ?? 0;
          const barTopY = yScale(d.revenue) ?? innerHeight;
          const isHovered = hoveredBarIndex === i;

          return (
            <AnimatedBarLine
              barBottomY={innerHeight}
              barTopY={barTopY}
              barX={barX}
              isHovered={isHovered}
              key={d.month}
              width={bandWidth}
            />
          );
        })}
      </g>
    </svg>,
    container
  );
}

export function Particle() {
  return (
    <div className="w-full">
      <BarChart barGap={0} data={chartData} xDataKey="month">
        <LinearGradient
          from="var(--color-chart-3)"
          id="noGapGradient"
          to="transparent"
        />
        <Grid horizontal />
        <Bar
          dataKey="revenue"
          fill="url(#noGapGradient)"
          lineCap="butt"
          stroke="var(--color-chart-3)"
        />
        <BarXAxis />
        <ChartTooltip showCrosshair={false} showDots={false} />
        <BarHorizontalLineIndicator data={chartData} />
      </BarChart>
    </div>
  );
}
