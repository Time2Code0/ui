"use client";

import {
  FunnelChart,
  type FunnelStage,
} from "@/registry/charts/funnel-chart/funnel-chart";

const funnelDataColored: FunnelStage[] = [
  { color: "var(--color-chart-1)", label: "Awareness", value: 4100 },
  { color: "var(--color-chart-2)", label: "Interest", value: 2957 },
  { color: "var(--color-chart-3)", label: "Consideration", value: 1084 },
  { color: "var(--color-chart-4)", label: "Intent", value: 1038 },
  { color: "var(--color-chart-5)", label: "Purchase", value: 320 },
];

export function Particle() {
  return <FunnelChart data={funnelDataColored} layers={3} />;
}
