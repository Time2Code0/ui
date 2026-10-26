"use client";

import type { ChoroplethFeature } from "../_charts";

import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";

import {
  ChoroplethChart,
  ChoroplethFeatureComponent,
  ChoroplethTooltip,
  useChoroplethZoom,
} from "../_charts";
import { useWorldDataStandalone } from "../_hooks/use-world-data";

function PreviewZoomControls() {
  const { zoom } = useChoroplethZoom();

  if (!zoom) {
    return null;
  }

  return (
    <div className="absolute right-4 bottom-4 flex flex-col gap-1">
      <Button
        className="size-10 rounded-lg shadow-md"
        onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}
        size="icon"
        variant="secondary"
      >
        <Icon className="size-5" icon={PlusSignIcon} />
      </Button>
      <Button
        className="size-10 rounded-lg shadow-md"
        onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}
        size="icon"
        variant="secondary"
      >
        <Icon className="size-5" icon={MinusSignIcon} />
      </Button>
    </div>
  );
}

export function ChoroplethDemo() {
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
    <ChoroplethChart aspectRatio="16 / 9" data={worldData} zoomEnabled>
      <ChoroplethFeatureComponent fill="var(--chart-scale-03)" />
      <ChoroplethTooltip />
      <PreviewZoomControls />
    </ChoroplethChart>
  );
}

// Sample web analytics data - unique visitors by country (smaller numbers for realistic demo)
const visitorsByCountry: Record<string, number> = {
  Argentina: 3,
  Australia: 6,
  Austria: 1,
  Belgium: 2,
  Brazil: 7,
  Canada: 8,
  Denmark: 1,
  Finland: 1,
  France: 9,
  Germany: 17,
  India: 11,
  Indonesia: 2,
  Ireland: 3,
  Italy: 6,
  Japan: 4,
  Mexico: 5,
  Netherlands: 5,
  "New Zealand": 1,
  Norway: 2,
  Philippines: 3,
  Poland: 4,
  Portugal: 2,
  "South Africa": 4,
  Spain: 3,
  Sweden: 3,
  Switzerland: 2,
  Thailand: 2,
  "United Kingdom": 12,
  "United States": 18,
  Vietnam: 1,
};

// Color scale based on visitor count ranges
function getVisitorColor(feature: ChoroplethFeature): string {
  const name = feature.properties?.name as string;
  const visitors = visitorsByCountry[name];

  if (!visitors) {
    return "var(--chart-scale-01)"; // No data = neutral empty tone
  }

  if (visitors >= 17) {
    return "var(--chart-scale-05)";
  }
  if (visitors >= 9) {
    return "var(--chart-scale-04)";
  }
  if (visitors >= 5) {
    return "var(--chart-scale-03)";
  }
  return "var(--chart-scale-02)";
}

function getVisitorValue(feature: ChoroplethFeature): number | undefined {
  const name = feature.properties?.name as string;
  return visitorsByCountry[name];
}

// Legend items matching the color scale
const legendItems = [
  { color: "var(--chart-scale-01)", label: "No data" },
  { color: "var(--chart-scale-02)", label: "1-4" },
  { color: "var(--chart-scale-03)", label: "5-8" },
  { color: "var(--chart-scale-04)", label: "9-16" },
  { color: "var(--chart-scale-05)", label: "17+" },
];

function AnalyticsZoomControls() {
  const { zoom } = useChoroplethZoom();

  if (!zoom) {
    return null;
  }

  return (
    <div className="absolute right-4 bottom-4 flex flex-col gap-1">
      <Button
        className="size-10 rounded-lg shadow-md"
        onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}
        size="icon"
        variant="secondary"
      >
        <Icon className="size-5" icon={PlusSignIcon} />
      </Button>
      <Button
        className="size-10 rounded-lg shadow-md"
        onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}
        size="icon"
        variant="secondary"
      >
        <Icon className="size-5" icon={MinusSignIcon} />
      </Button>
    </div>
  );
}

export function ChoroplethAnalyticsDemo() {
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
    <ChoroplethChart aspectRatio="16 / 9" data={worldData} zoomEnabled>
      <ChoroplethFeatureComponent getFeatureColor={getVisitorColor} />
      <ChoroplethTooltip
        getFeatureValue={getVisitorValue}
        valueLabel="Unique Visitors"
      />
      <AnalyticsZoomControls />
      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 rounded-lg bg-background/90 p-3 text-xs backdrop-blur-sm">
        <span className="font-medium text-foreground-muted">
          Unique Visitors
        </span>
        {legendItems.map((item) => (
          <div className="flex items-center gap-2" key={item.label}>
            <div
              className="size-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </ChoroplethChart>
  );
}
