"use client";

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
  return (
    <FunnelChart
      color="var(--color-chart-1)"
      data={funnelData}
      edges="straight"
      layers={3}
      orientation="horizontal"
    />
  );
}
