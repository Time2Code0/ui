"use client";

import type {
  RadarData,
  RadarMetric,
} from "@/registry/charts/radar-chart/radar-context";

import { RadarArea } from "@/registry/charts/radar-chart/radar-area";
import { RadarAxis } from "@/registry/charts/radar-chart/radar-axis";
import { RadarChart } from "@/registry/charts/radar-chart/radar-chart";
import { RadarGrid } from "@/registry/charts/radar-chart/radar-grid";
import { RadarLabels } from "@/registry/charts/radar-chart/radar-labels";

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
  return (
    <RadarChart data={campaignData} metrics={metrics} size={350}>
      <RadarGrid />
      <RadarAxis />
      <RadarLabels />
      {campaignData.map((item, index) => (
        <RadarArea index={index} key={item.label} />
      ))}
    </RadarChart>
  );
}
