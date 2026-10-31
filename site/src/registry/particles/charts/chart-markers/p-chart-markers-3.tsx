"use client";

import { Area } from "@/registry/charts/area-chart/area";
import { AreaChart } from "@/registry/charts/area-chart/area-chart";
import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import {
  chartCssVars,
  useChart,
} from "@/registry/charts/chart-core/chart-context";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";

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

interface DiamondMarker {
  date: Date;
  title: string;
}

function isSameDay(a: unknown, b: Date) {
  const date = a instanceof Date ? a : new Date(a as string | number);
  return date.toDateString() === b.toDateString();
}

function DiamondMarkers({
  items,
  size = 8,
  y = -12,
}: {
  items: DiamondMarker[];
  /** Diamond width/height in px. */
  size?: number;
  /** Diamond center relative to the top of the plot (negative = above). */
  y?: number;
}) {
  const { xScale, innerHeight, tooltipData, isLoaded } = useChart();
  const half = size / 2;

  return (
    <g
      style={{
        opacity: isLoaded ? 1 : 0,
        pointerEvents: "none",
        transition: "opacity 300ms ease-out",
      }}
    >
      {items.map((marker) => {
        const x = xScale(marker.date) ?? 0;
        const active = tooltipData
          ? isSameDay(tooltipData.point.date, marker.date)
          : false;
        return (
          <g key={marker.date.toISOString()} transform={`translate(${x}, 0)`}>
            <line
              stroke={chartCssVars.markerBorder}
              strokeDasharray="4,4"
              strokeOpacity={active ? 1 : 0.7}
              x1={0}
              x2={0}
              y1={y + half + 4}
              y2={innerHeight}
            />
            <rect
              fill={chartCssVars.foregroundMuted}
              height={size}
              transform={`translate(0, ${y}) rotate(45)`}
              width={size}
              x={-half}
              y={-half}
            />
          </g>
        );
      })}
    </g>
  );
}

const diamondMarkers: DiamondMarker[] = [
  { date: dayAt(4), title: "Deploy" },
  { date: dayAt(9), title: "Pricing change" },
];

function DiamondTooltipContent({ items }: { items: DiamondMarker[] }) {
  const { tooltipData } = useChart();
  const active = tooltipData
    ? items.filter((m) => isSameDay(tooltipData.point.date, m.date))
    : [];
  if (active.length === 0) {
    return null;
  }
  return (
    <div className="mt-2 space-y-1 border-foreground-muted border-t pt-2">
      {active.map((m) => (
        <div
          className="flex items-center gap-2 text-foreground text-sm"
          key={m.title}
        >
          <span
            aria-hidden
            className="size-2 rotate-45"
            style={{ background: chartCssVars.foregroundMuted }}
          />
          {m.title}
        </div>
      ))}
    </div>
  );
}

export function Particle() {
  return (
    <div className="w-full">
      <AreaChart data={chartData}>
        <Grid horizontal />
        <Area
          dataKey="value"
          fill="var(--color-chart-1)"
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <DiamondMarkers items={diamondMarkers} />
        <XAxis />
        <ChartTooltip>
          <DiamondTooltipContent items={diamondMarkers} />
        </ChartTooltip>
      </AreaChart>
    </div>
  );
}
