"use client";

import { ChoroplethChart } from "@/registry/charts/choropleth-chart/choropleth-chart";
import { ChoroplethFeature as ChoroplethFeatureComponent } from "@/registry/charts/choropleth-chart/choropleth-feature";
import { ChoroplethGraticule } from "@/registry/charts/choropleth-chart/choropleth-graticule";
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
      <ChoroplethGraticule />
      <ChoroplethFeatureComponent fill="var(--color-chart-3)" />
      <ChoroplethTooltip />
    </ChoroplethChart>
  );
}
