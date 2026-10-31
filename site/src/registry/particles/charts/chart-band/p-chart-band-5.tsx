"use client";

import { useState } from "react";

import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Band, type BandFillType } from "@/registry/charts/chart-band/band";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { Line } from "@/registry/charts/line-chart/line";
import { LineChart } from "@/registry/charts/line-chart/line-chart";
import { RadioGroupPrimitive, RadioPrimitive } from "@/registry/ui/radio-group";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control";

const FILL_TYPES: { value: BandFillType; label: string }[] = [
  { label: "Solid", value: "solid" },
  { label: "Gradient", value: "gradient" },
  { label: "Pattern", value: "pattern" },
];

const BAND_DEMO_POINT_COUNT = 24;

function bandDemoValue(index: number): number {
  const trend = 4.2 * index;
  const swell = Math.sin(index / 3.6) * 22;
  const ripple = Math.cos(index / 1.45) * 11;
  const jitter = Math.sin(index / 0.62) * 6;
  return Math.round(140 + trend + swell + ripple + jitter);
}

/**
 * Line + per-row min/max (Recharts BandedChart style). The spread varies
 * smoothly and asymmetrically so it reads like a real range.
 */
const rangeData = Array.from({ length: BAND_DEMO_POINT_COUNT }, (_, i) => {
  const value = bandDemoValue(i);
  return {
    date: new Date(2024, 0, i + 1),
    value,
    valueLower: Math.round(
      value - value * 0.12 * (0.75 + 0.25 * Math.cos(i / 2.6))
    ),
    valueUpper: Math.round(
      value + value * 0.12 * (0.75 + 0.25 * Math.sin(i / 1.9))
    ),
  };
});

export function Particle() {
  const [fillType, setFillType] = useState<BandFillType>("gradient");

  return (
    <div className="w-full space-y-4">
      <SegmentedControl
        aria-label="Band fill type"
        render={
          <RadioGroupPrimitive
            onValueChange={(value) => setFillType(value as BandFillType)}
            value={fillType}
          />
        }
      >
        {FILL_TYPES.map((option) => (
          <SegmentedControlItem
            key={option.value}
            render={<RadioPrimitive.Root value={option.value} />}
          >
            {option.label}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
      <LineChart data={rangeData}>
        <Grid horizontal />
        <Band
          fill="var(--color-chart-1)"
          fillOpacity={fillType === "gradient" ? 0.4 : 0.15}
          fillType={fillType}
          lowerKey="valueLower"
          pattern="diagonal"
          patternOpacity={0.6}
          strokeOpacity={0.5}
          upperKey="valueUpper"
        />
        <Line dataKey="value" stroke="var(--color-chart-1)" strokeWidth={2} />
        <XAxis />
        <ChartTooltip />
      </LineChart>
    </div>
  );
}
