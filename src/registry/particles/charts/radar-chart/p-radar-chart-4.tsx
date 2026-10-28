"use client";

import type { RadarData, RadarMetric } from "@/registry/charts/radar-context";

import { RadarArea } from "@/registry/charts/radar-area";
import { RadarAxis } from "@/registry/charts/radar-axis";
import { RadarChart } from "@/registry/charts/radar-chart";
import { RadarGrid } from "@/registry/charts/radar-grid";
import { RadarLabels } from "@/registry/charts/radar-labels";

const radarDataLopsided: RadarData[] = [
  {
    color: "var(--color-chart-2)",
    label: "Product",
    values: {
      comfort: 20,
      efficiency: 90,
      reliability: 40,
      safety: 55,
      speed: 95,
    },
  },
];

const radarMetrics5: RadarMetric[] = [
  { key: "speed", label: "Speed" },
  { key: "reliability", label: "Reliability" },
  { key: "comfort", label: "Comfort" },
  { key: "efficiency", label: "Efficiency" },
  { key: "safety", label: "Safety" },
];

export function Particle() {
  return (
    <div className="mx-auto aspect-square w-full max-w-[min(100%,300px)] sm:max-w-[260px]">
      <RadarChart data={radarDataLopsided} metrics={radarMetrics5}>
        <RadarGrid />
        <RadarAxis />
        <RadarLabels fontSize={10} offset={16} />
        <RadarArea index={0} showPoints={false} />
      </RadarChart>
    </div>
  );
}
