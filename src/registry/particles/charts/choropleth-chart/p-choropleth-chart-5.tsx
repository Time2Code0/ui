"use client";

import { ChoroplethChart } from "@/registry/charts/choropleth/choropleth-chart";
import { ChoroplethFeature as ChoroplethFeatureComponent } from "@/registry/charts/choropleth/choropleth-feature";
import { ChoroplethTooltip } from "@/registry/charts/choropleth/choropleth-tooltip";
import { useWorldDataStandalone } from "@/registry/charts/choropleth/use-world-data";
import { PatternLines } from "@/registry/charts/visx-pattern";

function ChoroplethLoading() {
  return (
    <div className="flex h-[200px] items-center justify-center">
      <div className="animate-pulse text-foreground-muted text-sm">
        Loading map...
      </div>
    </div>
  );
}

function getRegionCategory(name: string) {
  const c = name.charAt(0).toUpperCase();
  if ("ABCD".includes(c)) {
    return "americas";
  }
  if ("EFGH".includes(c)) {
    return "europe";
  }
  if ("IJKLM".includes(c)) {
    return "asia";
  }
  if ("NOPQR".includes(c)) {
    return "africa";
  }
  return "oceania";
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
      <ChoroplethFeatureComponent
        getFeaturePattern={(feat) => {
          const name = feat.properties?.name;
          return name ? `choro-p-${getRegionCategory(name as string)}` : null;
        }}
        patterns={
          <>
            <PatternLines
              height={6}
              id="choro-p-americas"
              orientation={["diagonal"]}
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              width={6}
            />
            <PatternLines
              height={6}
              id="choro-p-europe"
              orientation={["diagonal"]}
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              width={6}
            />
            <PatternLines
              height={6}
              id="choro-p-asia"
              orientation={["diagonal"]}
              stroke="var(--color-chart-3)"
              strokeWidth={2}
              width={6}
            />
            <PatternLines
              height={6}
              id="choro-p-africa"
              orientation={["diagonal"]}
              stroke="var(--color-chart-4)"
              strokeWidth={2}
              width={6}
            />
            <PatternLines
              height={6}
              id="choro-p-oceania"
              orientation={["diagonal"]}
              stroke="var(--color-chart-5)"
              strokeWidth={2}
              width={6}
            />
          </>
        }
      />
      <ChoroplethTooltip />
    </ChoroplethChart>
  );
}
