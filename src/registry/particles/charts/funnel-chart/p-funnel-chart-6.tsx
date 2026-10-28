"use client";

import { FunnelChart, type FunnelStage } from "@/registry/charts/funnel-chart";

const funnelDataGradient: FunnelStage[] = [
  {
    gradient: [
      { color: "var(--color-chart-1)", offset: "0%" },
      { color: "var(--color-chart-2)", offset: "100%" },
    ],
    label: "Awareness",
    value: 4100,
  },
  {
    gradient: [
      { color: "var(--color-chart-2)", offset: "0%" },
      { color: "var(--color-chart-3)", offset: "100%" },
    ],
    label: "Interest",
    value: 2957,
  },
  {
    gradient: [
      { color: "var(--color-chart-3)", offset: "0%" },
      { color: "var(--color-chart-4)", offset: "100%" },
    ],
    label: "Consideration",
    value: 1084,
  },
  {
    gradient: [
      { color: "var(--color-chart-4)", offset: "0%" },
      { color: "var(--color-chart-5)", offset: "100%" },
    ],
    label: "Intent",
    value: 1038,
  },
  {
    gradient: [
      { color: "var(--color-chart-5)", offset: "0%" },
      { color: "var(--color-chart-5)", offset: "100%" },
    ],
    label: "Purchase",
    value: 320,
  },
];

export function Particle() {
  return <FunnelChart data={funnelDataGradient} layers={3} />;
}
