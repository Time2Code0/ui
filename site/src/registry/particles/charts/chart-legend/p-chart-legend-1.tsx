"use client";

import {
  Legend,
  LegendItem as LegendItemComponent,
  LegendLabel,
  LegendMarker,
  LegendProgress,
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
    <div className="w-full max-w-sm">
      <Legend items={sampleData} title="Sessions by Channel">
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
