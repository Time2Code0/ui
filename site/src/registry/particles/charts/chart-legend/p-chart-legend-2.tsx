"use client";

import {
  Legend,
  LegendItem as LegendItemComponent,
  LegendLabel,
  LegendMarker,
  LegendValue,
} from "@/registry/charts/chart-legend/legend";

const sampleData = [
  { color: "#0ea5e9", label: "Organic", maxValue: 5000, value: 4250 },
  { color: "#a855f7", label: "Paid", maxValue: 5000, value: 3120 },
  { color: "#f59e0b", label: "Email", maxValue: 5000, value: 2100 },
  { color: "#10b981", label: "Social", maxValue: 5000, value: 1580 },
];

export function Particle() {
  return (
    <div className="w-full max-w-xs">
      <Legend items={sampleData}>
        <LegendItemComponent className="flex items-center gap-3">
          <LegendMarker />
          <LegendLabel className="flex-1" />
          <LegendValue />
        </LegendItemComponent>
      </Legend>
    </div>
  );
}
