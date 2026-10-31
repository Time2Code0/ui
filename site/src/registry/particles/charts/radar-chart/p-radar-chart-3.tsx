"use client";

import type {
  RadarData,
  RadarMetric,
} from "@/registry/charts/radar-chart/radar-context";

import { RadarArea } from "@/registry/charts/radar-chart/radar-area";
import { RadarChart } from "@/registry/charts/radar-chart/radar-chart";
import { RadarGrid } from "@/registry/charts/radar-chart/radar-grid";
import { RadarLabels } from "@/registry/charts/radar-chart/radar-labels";

const radarDataSkills: RadarData[] = [
  {
    color: "var(--color-chart-1)",
    label: "Senior",
    values: { css: 75, js: 95, node: 82, react: 88, sql: 70, ts: 90 },
  },
  {
    color: "var(--color-chart-3)",
    label: "Junior",
    values: { css: 80, js: 70, node: 40, react: 65, sql: 35, ts: 50 },
  },
];

const radarMetrics6: RadarMetric[] = [
  { key: "js", label: "JS" },
  { key: "ts", label: "TS" },
  { key: "react", label: "React" },
  { key: "css", label: "CSS" },
  { key: "node", label: "Node" },
  { key: "sql", label: "SQL" },
];

export function Particle() {
  return (
    <div className="mx-auto aspect-square w-full max-w-[min(100%,300px)] sm:max-w-[260px]">
      <RadarChart data={radarDataSkills} metrics={radarMetrics6}>
        <RadarGrid showLabels={false} />
        <RadarLabels fontSize={10} offset={16} />
        {radarDataSkills.map((item, index) => (
          <RadarArea
            index={index}
            key={item.label}
            showGlow={false}
            showPoints={false}
            showStroke={false}
          />
        ))}
      </RadarChart>
    </div>
  );
}
