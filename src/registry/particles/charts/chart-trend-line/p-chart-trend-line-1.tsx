"use client";

import { type ReactNode, useState } from "react";

import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import {
  TrendLine,
  type TrendLineStrokeStyle,
} from "@/registry/charts/chart-trend-line/trend-line";
import { Line } from "@/registry/charts/line-chart/line";
import { LineChart } from "@/registry/charts/line-chart/line-chart";
import { RadioGroupPrimitive, RadioPrimitive } from "@/registry/ui/radio-group";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control";

const STROKE_STYLES: { value: TrendLineStrokeStyle; label: string }[] = [
  { label: "Dashed", value: "dashed" },
  { label: "Solid", value: "solid" },
  { label: "Gradient", value: "gradient" },
];

const LINE_DEMO_POINT_COUNT = 10;

function trendingLineValue(index: number, seriesIndex = 0): number {
  const base = 120 + seriesIndex * 18;
  const trend = (5.5 + seriesIndex * 1.25) * index;
  const i = index + seriesIndex * 9;
  const swell = Math.sin(i / 4.4 + seriesIndex * 1.2) * (24 + seriesIndex * 3);
  const ripple =
    Math.cos(i / 1.65 + seriesIndex * 0.85) * (16 + seriesIndex * 2);
  const jitter = Math.sin(i / 0.68 + seriesIndex * 2.4) * (10 + seriesIndex);
  const wobble = Math.cos(i / 2.95 + seriesIndex * 1.6) * 7;

  return Math.max(
    10,
    Math.floor(base + trend + swell + ripple + jitter + wobble)
  );
}

function buildLineChartDemoData(
  pointCount = LINE_DEMO_POINT_COUNT
): { date: Date; value: number }[] {
  return Array.from({ length: pointCount }, (_, index) => ({
    date: new Date(2024, 0, index + 1),
    value: trendingLineValue(index),
  }));
}

const lineData = buildLineChartDemoData();

function LineTrendChart({ children }: { children: ReactNode }) {
  return (
    <div className="w-full">
      <LineChart data={lineData}>
        <Grid horizontal />
        <Line dataKey="value" strokeWidth={2} />
        {children}
        <XAxis />
        <ChartTooltip />
      </LineChart>
    </div>
  );
}

/** Primary preview: switch between dashed, solid, and gradient strokes. */
export function Particle() {
  const [strokeStyle, setStrokeStyle] =
    useState<TrendLineStrokeStyle>("dashed");

  return (
    <div className="w-full space-y-4">
      <SegmentedControl
        aria-label="Trend line stroke style"
        render={
          <RadioGroupPrimitive
            onValueChange={(value) =>
              setStrokeStyle(value as TrendLineStrokeStyle)
            }
            value={strokeStyle}
          />
        }
      >
        {STROKE_STYLES.map((option) => (
          <SegmentedControlItem
            key={option.value}
            render={<RadioPrimitive.Root value={option.value} />}
          >
            {option.label}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
      <LineTrendChart>
        <TrendLine
          dataKey="value"
          fadeEdges={strokeStyle === "gradient"}
          gradientEnd="var(--color-chart-1)"
          gradientStart="var(--color-chart-3)"
          stroke="var(--color-chart-1)"
          strokeStyle={strokeStyle}
        />
      </LineTrendChart>
    </div>
  );
}
