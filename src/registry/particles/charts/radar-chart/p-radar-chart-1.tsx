"use client";

import type { RadarData, RadarMetric } from "@/registry/charts/radar-context";

import { RadarArea } from "@/registry/charts/radar-area";
import { RadarAxis } from "@/registry/charts/radar-axis";
import { RadarChart } from "@/registry/charts/radar-chart";
import { RadarGrid } from "@/registry/charts/radar-grid";
import { RadarLabels } from "@/registry/charts/radar-labels";

const radarDataDual: RadarData[] = [
  {
    color: "var(--color-chart-1)",
    label: "Model A",
    values: {
      comfort: 92,
      efficiency: 70,
      reliability: 78,
      safety: 88,
      speed: 85,
    },
  },
  {
    color: "var(--color-chart-3)",
    label: "Model B",
    values: {
      comfort: 65,
      efficiency: 88,
      reliability: 90,
      safety: 75,
      speed: 72,
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
      <RadarChart data={radarDataDual} metrics={radarMetrics5}>
        <RadarGrid />
        <RadarAxis />
        <RadarLabels fontSize={10} offset={16} />
        {radarDataDual.map((item, index) => (
          <RadarArea index={index} key={item.label} />
        ))}
      </RadarChart>
    </div>
  );
}
