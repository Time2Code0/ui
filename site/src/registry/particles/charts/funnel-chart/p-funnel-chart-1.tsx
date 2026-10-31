"use client";

import { useState } from "react";

import {
  Legend,
  LegendItem as LegendItemComponent,
  LegendLabel,
  LegendMarker,
} from "@/registry/charts/chart-legend/legend";
import {
  FunnelChart,
  type FunnelStage,
} from "@/registry/charts/funnel-chart/funnel-chart";

const funnelData: FunnelStage[] = [
  { displayValue: "12.4k", label: "Visitors", value: 12_400 },
  { displayValue: "6.8k", label: "Leads", value: 6800 },
  { displayValue: "3.2k", label: "Qualified", value: 3200 },
  { displayValue: "1.5k", label: "Proposals", value: 1500 },
  { displayValue: "620", label: "Closed", value: 620 },
];

export function Particle() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const legendItems = funnelData.map((d) => ({
    color: "var(--color-chart-1)",
    label: d.label,
    value: d.value,
  }));
  return (
    <div className="flex flex-col gap-4">
      <FunnelChart
        className="max-h-[350px]"
        color="var(--color-chart-1)"
        data={funnelData}
        hoveredIndex={hoveredIndex}
        layers={3}
        onHoverChange={setHoveredIndex}
        orientation="horizontal"
      />
      <Legend
        className="flex-row flex-wrap justify-center gap-x-4 gap-y-1"
        hoveredIndex={hoveredIndex}
        items={legendItems}
        onHoverChange={setHoveredIndex}
      >
        <LegendItemComponent className="flex items-center gap-1.5">
          <LegendMarker />
          <LegendLabel className="text-xs" />
        </LegendItemComponent>
      </Legend>
    </div>
  );
}
