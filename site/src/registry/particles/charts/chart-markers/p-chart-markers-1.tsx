"use client";

import type { ChartMarker } from "@/registry/charts/chart-markers/marker-group";

import { siteConfig } from "@/lib/config";
import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import {
  ChartMarkers,
  MarkerTooltipContent,
  useActiveMarkers,
} from "@/registry/charts/chart-markers/chart-markers";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { Line } from "@/registry/charts/line-chart/line";
import { LineChart } from "@/registry/charts/line-chart/line-chart";

const START = new Date(2024, 0, 1).getTime();

const DAY_MS = 24 * 60 * 60 * 1000;

function dayAt(index: number) {
  return new Date(START + index * DAY_MS);
}

const chartData = Array.from({ length: 14 }, (_, i) => ({
  date: dayAt(i),
  value: Math.floor(
    1200 + i * 55 + Math.sin(i / 1.6) * 260 + Math.cos(i / 0.9) * 90
  ),
}));

/** Rich markers — two share a date, so hovering fans them out radially. */
const richMarkers: ChartMarker[] = [
  {
    date: dayAt(3),
    description: "Major release with new features",
    href: siteConfig.socials.github,
    icon: "🚀",
    target: "_blank",
    title: "v2.0 Launch",
  },
  {
    date: dayAt(8),
    description: "New ad campaign went live",
    icon: "📣",
    title: "Marketing Push",
  },
  {
    date: dayAt(8),
    description: "Fixed tooltip positioning",
    icon: "🐛",
    title: "Bug Fix",
  },
  {
    date: dayAt(8),
    description: "50% faster renders",
    icon: "⚡",
    title: "Performance",
  },
  {
    color: "var(--color-chart-1)",
    date: dayAt(11),
    description: "Updated motion to v12",
    icon: "📦",
    title: "Dependency Update",
  },
];

interface MarkerContentDemoProps {
  markers: ChartMarker[];
}

function MarkerContentDemo({ markers }: MarkerContentDemoProps) {
  const activeMarkers = useActiveMarkers(markers);
  if (activeMarkers.length === 0) {
    return null;
  }
  return <MarkerTooltipContent markers={activeMarkers} />;
}

export function Particle() {
  return (
    <div className="w-full">
      <LineChart data={chartData}>
        <Grid horizontal />
        <Line dataKey="value" strokeWidth={2} />
        <ChartMarkers items={richMarkers} />
        <XAxis />
        <ChartTooltip>
          <MarkerContentDemo markers={richMarkers} />
        </ChartTooltip>
      </LineChart>
    </div>
  );
}
