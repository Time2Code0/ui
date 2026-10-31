"use client";

import type { LegendItemData } from "@/registry/charts/chart-legend/legend";
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

// Sample session data
const sessionsData: RingData[] = [
  { color: "#0ea5e9", label: "Organic", maxValue: 5000, value: 4250 },
  { color: "#a855f7", label: "Paid", maxValue: 5000, value: 3120 },
  { color: "#f59e0b", label: "Email", maxValue: 5000, value: 2100 },
  { color: "#10b981", label: "Social", maxValue: 5000, value: 1580 },
  { color: "#ef4444", label: "Referral", maxValue: 5000, value: 1050 },
  { color: "#6366f1", label: "Direct", maxValue: 5000, value: 747 },
];

export function Particle() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Convert ring data to legend items
  const legendItems: LegendItemData[] = sessionsData.map((d) => ({
    color: d.color || "",
    label: d.label,
    maxValue: d.maxValue,
    value: d.value,
  }));

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col items-center justify-center gap-8 lg:w-auto lg:flex-row lg:gap-12">
      {/* Chart */}
      <RingChart
        data={sessionsData}
        hoveredIndex={hoveredIndex}
        onHoverChange={setHoveredIndex}
        size={320}
      >
        {sessionsData.map((item, index) => (
          <Ring index={index} key={item.label} />
        ))}
        <RingCenter defaultLabel="Total Sessions" />
      </RingChart>

      {/* Composable Legend */}
      <Legend
        hoveredIndex={hoveredIndex}
        items={legendItems}
        onHoverChange={setHoveredIndex}
        title="Sessions by Channel"
      >
        <LegendItemComponent className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1">
          <LegendMarker />
          <LegendLabel />
          <LegendValue showPercentage />
          <div className="col-span-full">
            <LegendProgress />
          </div>
        </LegendItemComponent>
      </Legend>
    </div>
  );
}
