"use client";

import { ChoroplethChart } from "@/registry/charts/choropleth-chart/choropleth-chart";
import {
  type ChoroplethFeature,
  choroplethCssVars,
} from "@/registry/charts/choropleth-chart/choropleth-context";
import { ChoroplethFeature as ChoroplethFeatureComponent } from "@/registry/charts/choropleth-chart/choropleth-feature";
import { ChoroplethTooltip } from "@/registry/charts/choropleth-chart/choropleth-tooltip";
import { useWorldDataStandalone } from "@/registry/charts/choropleth-chart/use-world-data";

function ChoroplethLoading() {
  return (
    <div className="flex h-[200px] items-center justify-center">
      <div className="animate-pulse text-foreground-muted text-sm">
        Loading map...
      </div>
    </div>
  );
}

const visitorsByCountry: Record<string, number> = {
  Argentina: 3,
  Australia: 6,
  Brazil: 7,
  Canada: 8,
  France: 9,
  Germany: 17,
  India: 11,
  Indonesia: 2,
  Italy: 6,
  Japan: 4,
  Mexico: 5,
  Netherlands: 5,
  Philippines: 3,
  Poland: 4,
  "South Africa": 4,
  Spain: 3,
  Sweden: 3,
  Thailand: 2,
  "United Kingdom": 12,
  "United States": 18,
};

function getVisitorColor(feat: ChoroplethFeature): string {
  const visitors = visitorsByCountry[feat.properties?.name as string];
  if (!visitors) {
    return choroplethCssVars.scale01;
  }
  if (visitors >= 17) {
    return "var(--color-chart-1)";
  }
  if (visitors >= 13) {
    return "var(--color-chart-2)";
  }
  if (visitors >= 9) {
    return "var(--color-chart-3)";
  }
  if (visitors >= 5) {
    return "var(--color-chart-4)";
  }
  return "var(--color-chart-5)";
}

function getVisitorValue(feat: ChoroplethFeature): number | undefined {
  return visitorsByCountry[feat.properties?.name as string];
}

export function Particle() {
  const { worldData, isLoading } = useWorldDataStandalone();
  if (isLoading || !worldData) {
    return <ChoroplethLoading />;
  }
  return (
    <ChoroplethChart
      aspectRatio="16 / 9"
      data={worldData}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
    >
      <ChoroplethFeatureComponent getFeatureColor={getVisitorColor} />
      <ChoroplethTooltip
        getFeatureValue={getVisitorValue}
        valueLabel="Visitors"
      />
    </ChoroplethChart>
  );
}
