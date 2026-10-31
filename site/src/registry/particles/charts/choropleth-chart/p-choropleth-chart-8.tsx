"use client";

import type { ChoroplethFeature } from "@/registry/charts/choropleth-chart/choropleth-context";

import { PatternLines } from "@/registry/charts/chart-patterns/visx-pattern";
import { ChoroplethChart } from "@/registry/charts/choropleth-chart/choropleth-chart";
import { ChoroplethFeature as ChoroplethFeatureComponent } from "@/registry/charts/choropleth-chart/choropleth-feature";
import { ChoroplethTooltip } from "@/registry/charts/choropleth-chart/choropleth-tooltip";
import { useWorldDataStandalone } from "@/registry/charts/choropleth-chart/use-world-data";

// Categories based on first letter of country name (just for demo purposes)
function getRegionCategory(
  name: string
): "americas" | "europe" | "asia" | "africa" | "oceania" {
  const firstLetter = name.charAt(0).toUpperCase();
  if ("ABCD".includes(firstLetter)) {
    return "americas";
  }
  if ("EFGH".includes(firstLetter)) {
    return "europe";
  }
  if ("IJKLM".includes(firstLetter)) {
    return "asia";
  }
  if ("NOPQR".includes(firstLetter)) {
    return "africa";
  }
  return "oceania";
}

function getLinesPattern(feat: ChoroplethFeature): string | null {
  const name = feat.properties?.name;
  if (!name) {
    return null;
  }
  const category = getRegionCategory(name);
  return `pattern-${category}`;
}

// Diagonal lines pattern demo
const linesPatterns = (
  <>
    <PatternLines
      height={6}
      id="pattern-americas"
      orientation={["diagonal"]}
      stroke="var(--color-chart-1)"
      strokeWidth={2}
      width={6}
    />
    <PatternLines
      height={6}
      id="pattern-europe"
      orientation={["diagonal"]}
      stroke="var(--color-chart-2)"
      strokeWidth={2}
      width={6}
    />
    <PatternLines
      height={6}
      id="pattern-asia"
      orientation={["diagonal"]}
      stroke="var(--color-chart-3)"
      strokeWidth={2}
      width={6}
    />
    <PatternLines
      height={6}
      id="pattern-africa"
      orientation={["diagonal"]}
      stroke="var(--color-chart-4)"
      strokeWidth={2}
      width={6}
    />
    <PatternLines
      height={6}
      id="pattern-oceania"
      orientation={["diagonal"]}
      stroke="var(--color-chart-5)"
      strokeWidth={2}
      width={6}
    />
  </>
);

export function Particle() {
  const { worldData, isLoading } = useWorldDataStandalone();

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center">
        <div className="animate-pulse text-foreground-muted">
          Loading map data...
        </div>
      </div>
    );
  }

  if (!worldData) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center">
        <div className="text-destructive-foreground">
          Failed to load map data
        </div>
      </div>
    );
  }

  return (
    <ChoroplethChart aspectRatio="16 / 9" data={worldData}>
      <ChoroplethFeatureComponent
        getFeaturePattern={getLinesPattern}
        patterns={linesPatterns}
      />
      <ChoroplethTooltip />
    </ChoroplethChart>
  );
}
