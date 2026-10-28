"use client";

import type { RadarData, RadarMetric } from "@/registry/charts/radar-context";

import { RadarArea } from "@/registry/charts/radar-area";
import { RadarAxis } from "@/registry/charts/radar-axis";
import { RadarChart } from "@/registry/charts/radar-chart";
import { RadarGrid } from "@/registry/charts/radar-grid";
import { RadarLabels } from "@/registry/charts/radar-labels";

export function Particle() {
  // Simpler 3-metric example
  const simpleMetrics: RadarMetric[] = [
    { key: "speed", label: "Speed" },
    { key: "power", label: "Power" },
    { key: "technique", label: "Technique" },
  ];

  const simpleData: RadarData[] = [
    {
      color: "#6366f1",
      label: "Player A",
      values: { power: 70, speed: 85, technique: 90 },
    },
    {
      color: "#f97316",
      label: "Player B",
      values: { power: 95, speed: 65, technique: 60 },
    },
  ];

  return (
    <RadarChart data={simpleData} levels={4} metrics={simpleMetrics} size={300}>
      <RadarGrid showLabels={false} />
      <RadarAxis />
      <RadarLabels fontSize={12} offset={20} />
      {simpleData.map((item, index) => (
        <RadarArea index={index} key={item.label} />
      ))}
    </RadarChart>
  );
}
