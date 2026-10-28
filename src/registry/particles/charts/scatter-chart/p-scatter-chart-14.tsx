"use client";

import { Grid } from "@/registry/charts/grid";
import { Scatter } from "@/registry/charts/scatter";
import { ScatterChart } from "@/registry/charts/scatter-chart";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";
import { TooltipContent } from "@/registry/charts/tooltip/tooltip-content";
import { XAxis } from "@/registry/charts/x-axis";
import { YAxis } from "@/registry/charts/y-axis";

interface PrLocRow {
  date: Date;
  fastlane?: number;
  human?: number;
  [key: string]: unknown;
}

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 48_271) % 2_147_483_647;
    return state / 2_147_483_647;
  };
}

function buildPrLocData(seed = 42): PrLocRow[] {
  const random = seededRandom(seed);
  const rows: PrLocRow[] = [];
  for (let month = 0; month < 12; month++) {
    const date = new Date(2025, month, 1);
    const fastlaneCount = 15 + Math.floor(random() * 16);
    for (let i = 0; i < fastlaneCount; i++) {
      const r = random();
      // r² skews toward small diffs: 10–490 LOC
      rows.push({ date, fastlane: Math.round(10 + r * r * 480) });
    }
    const humanCount = 15 + Math.floor(random() * 16);
    for (let i = 0; i < humanCount; i++) {
      const r = random();
      const isOutlier = random() < 0.06;
      rows.push({
        date,
        human: Math.round(
          isOutlier ? 1500 + r * 1000 : 40 + r * Math.sqrt(r) * 1160
        ),
      });
    }
  }
  return rows;
}

const prLocData = buildPrLocData();

const shortMonthFmt = new Intl.DateTimeFormat("en-US", { month: "short" });

const formatPrMonth = (date: Date) => shortMonthFmt.format(date);

const prLocSeries = {
  fastlane: { color: "var(--color-chart-1)", label: "Fastlane (auto-merged)" },
  human: { color: "var(--color-chart-2)", label: "Human reviewed" },
} as const;

const formatLoc = (value: number) =>
  value >= 1000 ? `${value / 1000}k` : String(value);

const locFmt = new Intl.NumberFormat("en-US");

const monthYearFmt = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

function PrLocTooltip({ point }: { point: Record<string, unknown> }) {
  const rows = (["fastlane", "human"] as const).flatMap((key) => {
    const value = point[key];
    return typeof value === "number"
      ? [
          {
            color: prLocSeries[key].color,
            label: prLocSeries[key].label,
            value: `${locFmt.format(value)} LOC`,
          },
        ]
      : [];
  });
  return (
    <TooltipContent
      rows={rows}
      title={monthYearFmt.format(point.date as Date)}
    />
  );
}

export function Particle() {
  return (
    <div className="w-full">
      <ScatterChart
        data={prLocData}
        formatXLabel={formatPrMonth}
        jitter={{ x: 0.6 }}
        margin={{ bottom: 40, left: 56, right: 40, top: 40 }}
      >
        <Grid
          highlightRowStrokeDasharray="4,4"
          highlightRowValues={[500]}
          horizontal
        />
        <Scatter
          dataKey="fastlane"
          fill={prLocSeries.fastlane.color}
          radius={3}
        />
        <Scatter dataKey="human" fill={prLocSeries.human.color} radius={3} />
        <YAxis formatValue={formatLoc} />
        <XAxis numTicks={12} />
        <ChartTooltip content={({ point }) => <PrLocTooltip point={point} />} />
      </ScatterChart>
    </div>
  );
}
