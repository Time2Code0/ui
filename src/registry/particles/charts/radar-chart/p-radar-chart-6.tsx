"use client";

import type { RadarData, RadarMetric } from "@/registry/charts/radar-context";

import { RadarArea } from "@/registry/charts/radar-area";
import { RadarChart } from "@/registry/charts/radar-chart";
import { RadarGrid } from "@/registry/charts/radar-grid";
import { RadarLabels } from "@/registry/charts/radar-labels";

const radarDataTriangle: RadarData[] = [
  {
    color: "var(--color-chart-1)",
    label: "Warrior",
    values: { attack: 90, defense: 75, magic: 30 },
  },
  {
    color: "var(--color-chart-4)",
    label: "Mage",
    values: { attack: 35, defense: 40, magic: 95 },
  },
];

const radarMetrics3: RadarMetric[] = [
  { key: "attack", label: "Attack" },
  { key: "defense", label: "Defense" },
  { key: "magic", label: "Magic" },
];

export function Particle() {
  return (
    <div className="mx-auto aspect-square w-full max-w-[min(100%,300px)] sm:max-w-[260px]">
      <RadarChart data={radarDataTriangle} metrics={radarMetrics3}>
        <RadarGrid />
        <RadarLabels fontSize={10} offset={16} />
        {radarDataTriangle.map((item, index) => (
          <RadarArea index={index} key={item.label} showGlow={false} />
        ))}
      </RadarChart>
    </div>
  );
}
