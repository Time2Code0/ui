"use client";

import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons";

import { ChoroplethChart } from "@/registry/charts/choropleth-chart/choropleth-chart";
import {
  choroplethCssVars,
  useChoroplethZoom,
} from "@/registry/charts/choropleth-chart/choropleth-context";
import { ChoroplethFeature as ChoroplethFeatureComponent } from "@/registry/charts/choropleth-chart/choropleth-feature";
import { ChoroplethTooltip } from "@/registry/charts/choropleth-chart/choropleth-tooltip";
import { useWorldDataStandalone } from "@/registry/charts/choropleth-chart/use-world-data";
import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";

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
    <ChoroplethChart aspectRatio="16 / 9" data={worldData} zoomEnabled>
      <ChoroplethFeatureComponent fill={choroplethCssVars.scale03} />
      <ChoroplethTooltip />
      <PreviewZoomControls />
    </ChoroplethChart>
  );
}
