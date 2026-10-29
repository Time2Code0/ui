"use client";

import type { ReactNode } from "react";

import {
  AreaSparkline,
  BarSparkline,
  LineSparkline,
  useSparklineHover,
} from "@/registry/charts/sparkline/sparkline";

interface SparkPoint {
  day: string;
  value: number;
}

const formatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 1,
  notation: "compact",
});

function KpiCard({
  label,
  data,
  children,
}: {
  label: string;
  data: SparkPoint[];
  children: (
    props: ReturnType<typeof useSparklineHover<SparkPoint>>
  ) => ReactNode;
}) {
  const hover = useSparklineHover<SparkPoint>();
  const shown = hover.datum ?? data.at(-1);
  const first = data[0]?.value ?? 0;
  const change = shown ? ((shown.value - first) / first) * 100 : 0;
  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-background p-4">
      <div className="flex items-baseline justify-between gap-2 text-foreground-muted text-xs">
        <span>{label}</span>
        <span className="tabular-nums">{shown?.day}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-semibold text-2xl tabular-nums">
          {shown ? formatter.format(shown.value) : "—"}
        </span>
        <span
          className={
            change >= 0
              ? "text-emerald-600 text-xs tabular-nums dark:text-emerald-400"
              : "text-rose-600 text-xs tabular-nums dark:text-rose-400"
          }
        >
          {change >= 0 ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
        </span>
      </div>
      {children(hover)}
    </div>
  );
}

/** Deterministic wavy series so SSR and client render the same paths. */
function makeSparkData(
  seed: number,
  length = 24,
  base = 100,
  trend = 1.5
): SparkPoint[] {
  return Array.from({ length }, (_, i) => ({
    day: `Day ${i + 1}`,
    value: Math.round(
      base +
        trend * i +
        Math.sin(i * 0.7 + seed) * base * 0.12 +
        Math.cos(i * 1.9 + seed * 2) * base * 0.06
    ),
  }));
}

const revenue = makeSparkData(1, 24, 4200, 40);

const visitors = makeSparkData(2, 24, 1800, -12);

const orders = makeSparkData(3, 18, 120, 2);

export function Particle() {
  return (
    <div className="grid w-full max-w-2xl gap-3 py-4 sm:grid-cols-3">
      <KpiCard data={revenue} label="Revenue">
        {(hover) => (
          <AreaSparkline
            data={revenue}
            dataKey="value"
            height={40}
            {...hover.sparklineProps}
          />
        )}
      </KpiCard>
      <KpiCard data={visitors} label="Visitors">
        {(hover) => (
          <LineSparkline
            color="var(--color-chart-2)"
            data={visitors}
            dataKey="value"
            endDot
            height={40}
            {...hover.sparklineProps}
          />
        )}
      </KpiCard>
      <KpiCard data={orders} label="Orders">
        {(hover) => (
          <BarSparkline
            color="var(--color-chart-3)"
            data={orders}
            dataKey="value"
            height={40}
            {...hover.sparklineProps}
          />
        )}
      </KpiCard>
    </div>
  );
}
