"use client";

import { Band } from "@/registry/charts/band";
import { Grid } from "@/registry/charts/grid";
import { Legend } from "@/registry/charts/legend/legend";
import { LegendItem as LegendItemComponent } from "@/registry/charts/legend/legend-item";
import { LegendLabel } from "@/registry/charts/legend/legend-label";
import { LegendMarker } from "@/registry/charts/legend/legend-marker";
import { Line } from "@/registry/charts/line";
import { LineChart } from "@/registry/charts/line-chart";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";
import { XAxis } from "@/registry/charts/x-axis";

const BAND_DEMO_POINT_COUNT = 24;

/** Two teams: per-day min / max and the average inside it. */
const teamData = Array.from({ length: BAND_DEMO_POINT_COUNT }, (_, i) => {
  const teamA = 34 + Math.sin(i / 3.4) * 9 + i * 0.6;
  const teamB = 62 + Math.cos(i / 4.1) * 10 - i * 0.4;
  const spreadA = 6 + Math.sin(i / 2.2) * 2;
  const spreadB = 8 + Math.cos(i / 2.7) * 3;
  return {
    date: new Date(2024, 0, i + 1),
    teamA: Math.round(teamA),
    teamAMax: Math.round(teamA + spreadA * 1.2),
    teamAMin: Math.round(teamA - spreadA),
    teamB: Math.round(teamB),
    teamBMax: Math.round(teamB + spreadB),
    teamBMin: Math.round(teamB - spreadB * 1.1),
  };
});

/** One legend entry per series — each band shares its line's colour. */
const TEAM_LEGEND_ITEMS = [
  { color: "var(--color-chart-1)", label: "Team A", value: 0 },
  { color: "var(--color-chart-3)", label: "Team B", value: 0 },
];

export function Particle() {
  return (
    <div className="w-full">
      <LineChart data={teamData}>
        <Grid horizontal />
        <Band
          fill="var(--color-chart-1)"
          fillOpacity={0.18}
          label="Team A range"
          lowerKey="teamAMin"
          strokeWidth={0}
          upperKey="teamAMax"
        />
        <Band
          fill="var(--color-chart-3)"
          fillOpacity={0.18}
          label="Team B range"
          lowerKey="teamBMin"
          strokeWidth={0}
          upperKey="teamBMax"
        />
        <Line dataKey="teamA" stroke="var(--color-chart-1)" strokeWidth={2} />
        <Line dataKey="teamB" stroke="var(--color-chart-3)" strokeWidth={2} />
        <XAxis />
        <ChartTooltip />
      </LineChart>
      <Legend
        className="flex-row justify-center gap-6"
        items={TEAM_LEGEND_ITEMS}
      >
        <LegendItemComponent className="flex items-center gap-2">
          <LegendMarker />
          <LegendLabel />
        </LegendItemComponent>
      </Legend>
    </div>
  );
}
