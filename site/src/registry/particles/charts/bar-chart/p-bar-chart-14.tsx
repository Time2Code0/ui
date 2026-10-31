"use client";

import { BarChart } from "@/registry/charts/bar-chart/bar-chart";
import {
  BarColumnTrack,
  BarSquares,
} from "@/registry/charts/bar-chart/bar-squares";
import { BarXAxis } from "@/registry/charts/bar-chart/bar-x-axis";
import { renderPatternPreset } from "@/registry/charts/chart-patterns/pattern-preset";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";

const barStackedData = [
  { desktop: 4000, mobile: 2400, month: "Jan" },
  { desktop: 5000, mobile: 3000, month: "Feb" },
  { desktop: 3500, mobile: 2800, month: "Mar" },
  { desktop: 4200, mobile: 3200, month: "Apr" },
  { desktop: 3800, mobile: 2600, month: "May" },
  { desktop: 5500, mobile: 3800, month: "Jun" },
];

const barShapeTrackPatternColor =
  "color-mix(in oklab, var(--color-foreground) 10%, transparent)";

const barShapePatternColor = "var(--color-chart-5)";

export function Particle() {
  return (
    <BarChart
      data={barStackedData}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
      squareSnap={{ groupGap: 4, squareGap: 3 }}
      xDataKey="month"
    >
      {renderPatternPreset("diagonal", "bar-shape-squircle-track", {
        color: barShapeTrackPatternColor,
      })}
      <BarColumnTrack
        fill="url(#bar-shape-squircle-track)"
        groupGap={4}
        opacity={0.65}
        squareGap={3}
        squareRadius={0.5}
      />
      {renderPatternPreset("diagonal", "bar-shape-squircle-desktop", {
        color: barShapePatternColor,
      })}
      <BarSquares
        dataKey="desktop"
        fill="url(#bar-shape-squircle-desktop)"
        groupGap={4}
        squareGap={3}
        squareRadius={0.5}
        stroke={barShapePatternColor}
      />
      <BarSquares
        dataKey="mobile"
        fill="var(--color-chart-1)"
        groupGap={4}
        squareGap={3}
        squareRadius={0.5}
      />
      <BarXAxis />
      <ChartTooltip
        dotColor="oklch(1 0.002 186.385 / 0.7)"
        dotRadiusFraction={0.5}
        dotStrokeWidth={1}
        dotVariant="ring"
        showCrosshair={false}
      />
    </BarChart>
  );
}
