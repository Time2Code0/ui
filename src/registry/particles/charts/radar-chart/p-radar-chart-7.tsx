"use client";

import type { LegendItemData } from "@/registry/charts/legend/legend-context";
import type { RadarData, RadarMetric } from "@/registry/charts/radar-context";

import { useState } from "react";

import { Legend } from "@/registry/charts/legend/legend";
import { LegendItem as LegendItemComponent } from "@/registry/charts/legend/legend-item";
import { LegendLabel } from "@/registry/charts/legend/legend-label";
import { LegendMarker } from "@/registry/charts/legend/legend-marker";
import { LegendValue } from "@/registry/charts/legend/legend-value";
import { RadarArea } from "@/registry/charts/radar-area";
import { RadarAxis } from "@/registry/charts/radar-axis";
import { RadarChart } from "@/registry/charts/radar-chart";
import { RadarGrid } from "@/registry/charts/radar-grid";
import { RadarLabels } from "@/registry/charts/radar-labels";

// Campaign data with normalized values (0-100)
const campaignData: RadarData[] = [
  {
    color: "#3b82f6",
    label: "Google Search",
    values: {
      bounceInverse: 65,
      conversionRate: 75,
      engagement: 72,
      pagesPerSession: 68,
      sessionDuration: 70,
    },
  },
  {
    color: "#f59e0b",
    label: "Display Ads",
    values: {
      bounceInverse: 88,
      conversionRate: 30,
      engagement: 85,
      pagesPerSession: 45,
      sessionDuration: 40,
    },
  },
  {
    color: "#10b981",
    label: "Newsletter",
    values: {
      bounceInverse: 42,
      conversionRate: 88,
      engagement: 45,
      pagesPerSession: 90,
      sessionDuration: 92,
    },
  },
  {
    color: "#ec4899",
    label: "Social",
    values: {
      bounceInverse: 78,
      conversionRate: 55,
      engagement: 95,
      pagesPerSession: 35,
      sessionDuration: 25,
    },
  },
];

// Campaign performance metrics
const metrics: RadarMetric[] = [
  { key: "engagement", label: "Engagement" },
  { key: "pagesPerSession", label: "Pages/Session" },
  { key: "sessionDuration", label: "Session Duration" },
  { key: "conversionRate", label: "Conversion" },
  { key: "bounceInverse", label: "Retention" },
];

export function Particle() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Convert radar data to legend items
  const legendItems: LegendItemData[] = campaignData.map((d, index) => ({
    color: d.color ?? `var(--color-chart-${index + 1})`,
    label: d.label,
    maxValue: 100,
    value: Object.values(d.values).reduce((a, b) => a + b, 0) / metrics.length,
  }));

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col items-center justify-center gap-8 lg:w-auto lg:flex-row lg:gap-12">
      {/* Chart */}
      <RadarChart
        className="w-full max-w-[400px] lg:w-[400px] lg:shrink-0"
        data={campaignData}
        hoveredIndex={hoveredIndex}
        metrics={metrics}
        onHoverChange={setHoveredIndex}
      >
        <RadarGrid />
        <RadarAxis />
        <RadarLabels interactive />
        {campaignData.map((item, index) => (
          <RadarArea index={index} key={item.label} />
        ))}
      </RadarChart>

      {/* Legend */}
      <Legend
        hoveredIndex={hoveredIndex}
        items={legendItems}
        onHoverChange={setHoveredIndex}
        title="Campaign Performance"
      >
        <LegendItemComponent className="flex items-center gap-3">
          <LegendMarker />
          <LegendLabel className="flex-1" />
          <LegendValue formatValue={(v) => `${v.toFixed(0)}%`} />
        </LegendItemComponent>
      </Legend>
    </div>
  );
}
