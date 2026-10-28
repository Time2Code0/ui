"use client";

import type { ReactNode } from "react";

import { cn } from "cn";

import {
  AreaSparkline,
  BarSparkline,
  LineSparkline,
  useSparklineHover,
} from "@/registry/charts/sparkline";

function GalleryShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-2xl px-2 py-6", className)}>
      {children}
    </div>
  );
}

interface SparklineGalleryPoint {
  day: string;
  value: number;
}

const compact = new Intl.NumberFormat("en", {
  maximumFractionDigits: 1,
  notation: "compact",
});

function ChangeBadge({ change }: { change: number }) {
  return (
    <span
      className={cn(
        "text-xs tabular-nums",
        change >= 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-rose-600 dark:text-rose-400"
      )}
    >
      {change >= 0 ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
    </span>
  );
}

function percentChange(data: SparklineGalleryPoint[], value: number) {
  const first = data[0]?.value ?? 0;
  return first === 0 ? 0 : ((value - first) / first) * 100;
}

function KpiCard({
  label,
  data,
  children,
}: {
  label: string;
  data: SparklineGalleryPoint[];
  children: (
    props: ReturnType<typeof useSparklineHover<SparklineGalleryPoint>>
  ) => ReactNode;
}) {
  const hover = useSparklineHover<SparklineGalleryPoint>();
  const shown = hover.datum ?? data.at(-1);
  return (
    <div className="flex min-w-0 flex-col gap-2 rounded-xl border bg-background p-4 shadow-xs/5">
      <div className="flex items-baseline justify-between gap-2 text-foreground-muted text-xs">
        <span>{label}</span>
        <span className="tabular-nums">{shown?.day}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-semibold text-2xl tabular-nums">
          {shown ? compact.format(shown.value) : "—"}
        </span>
        {shown ? (
          <ChangeBadge change={percentChange(data, shown.value)} />
        ) : null}
      </div>
      {children(hover)}
    </div>
  );
}

/** Deterministic wavy series so SSR and client render the same paths. */
function sparklineGalleryData(
  seed: number,
  length = 24,
  base = 100,
  trend = 1.5
): SparklineGalleryPoint[] {
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

const revenue = sparklineGalleryData(1, 24, 4200, 40);

const visitors = sparklineGalleryData(2, 24, 1800, -12);

const orders = sparklineGalleryData(3, 18, 120, 2);

export function Particle() {
  return (
    <GalleryShell className="grid gap-3 sm:grid-cols-3">
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
    </GalleryShell>
  );
}
