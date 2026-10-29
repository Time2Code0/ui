"use client";

import type { RingData } from "@/registry/charts/ring-chart/ring-context";

import { useState } from "react";

import {
  Legend,
  LegendItem as LegendItemComponent,
  LegendLabel,
  LegendMarker,
  LegendProgress,
  LegendValue,
} from "@/registry/charts/chart-legend/legend";
import { Ring } from "@/registry/charts/ring-chart/ring";
import { RingCenter } from "@/registry/charts/ring-chart/ring-center";
import { RingChart } from "@/registry/charts/ring-chart/ring-chart";

const ringData: RingData[] = [
  {
    color: "var(--color-chart-1)",
    label: "Organic",
    maxValue: 5000,
    value: 4250,
  },
  { color: "var(--color-chart-2)", label: "Paid", maxValue: 5000, value: 3120 },
  {
    color: "var(--color-chart-3)",
    label: "Email",
    maxValue: 5000,
    value: 2100,
  },
  {
    color: "var(--color-chart-4)",
    label: "Social",
    maxValue: 5000,
    value: 1580,
  },
];

export function Particle() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const legendItems = ringData.map((d) => ({
    color: d.color || "",
    label: d.label,
    maxValue: d.maxValue,
    value: d.value,
  }));
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="mx-auto w-full max-w-[240px]">
        <RingChart
          data={ringData}
          hoveredIndex={hoveredIndex}
          onHoverChange={setHoveredIndex}
        >
          {ringData.map((item, index) => (
            <Ring index={index} key={item.label} />
          ))}
          <RingCenter defaultLabel="Sessions" />
        </RingChart>
      </div>
      <Legend
        className="w-full"
        hoveredIndex={hoveredIndex}
        items={legendItems}
        onHoverChange={setHoveredIndex}
      >
        <LegendItemComponent className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2 gap-y-0.5">
          <LegendMarker />
          <LegendLabel className="text-xs" />
          <LegendValue className="text-xs" showPercentage />
          <div className="col-span-full">
            <LegendProgress />
          </div>
        </LegendItemComponent>
      </Legend>
    </div>
  );
}
