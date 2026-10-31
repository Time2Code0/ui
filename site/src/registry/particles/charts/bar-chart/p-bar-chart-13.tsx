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

const barShapeGradientStops = [
  { color: "var(--color-chart-1)", offset: 0 },
  { color: "var(--color-chart-2)", offset: 25 },
  { color: "var(--color-chart-3)", offset: 50 },
  { color: "var(--color-chart-4)", offset: 75 },
  { color: "var(--color-chart-5)", offset: 100 },
];

export function Particle() {
  return (
    <BarChart
      data={barStackedData}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
      squareSnap={{ groupGap: 4, squareGap: 3 }}
      xDataKey="month"
    >
      {renderPatternPreset("diagonal", "bar-shape-track-pattern", {
        color: barShapeTrackPatternColor,
      })}
      <BarColumnTrack
        fill="url(#bar-shape-track-pattern)"
        groupGap={4}
        opacity={0.65}
        squareGap={3}
        squareRadius={0.25}
      />
      {renderPatternPreset("diagonal", "bar-shape-desktop-pattern", {
        color: barShapePatternColor,
      })}
      <BarSquares
        dataKey="desktop"
        fill="url(#bar-shape-desktop-pattern)"
        groupGap={4}
        squareGap={3}
        squareRadius={0.25}
        stroke={barShapePatternColor}
      />
      <BarSquares
        dataKey="mobile"
        fill="var(--color-chart-1)"
        gradientStops={barShapeGradientStops}
        groupGap={4}
        squareGap={3}
        squareRadius={0.25}
        stroke="var(--color-chart-5)"
        useGradient
      />
      <BarXAxis />
      <ChartTooltip
        dotColor="oklch(1 0.002 186.385 / 0.7)"
        dotScale={1.05}
        dotVariant="ring"
        showCrosshair={false}
      />
    </BarChart>
  );
}
