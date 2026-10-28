"use client";

import type { ReactNode } from "react";

import { cn } from "cn";

import { LineSparkline, useSparklineHover } from "@/registry/charts/sparkline";

interface SparklineGalleryPoint {
  day: string;
  value: number;
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

const compact = new Intl.NumberFormat("en", {
  maximumFractionDigits: 1,
  notation: "compact",
});

export function Particle() {
  const hover = useSparklineHover<SparklineGalleryPoint>();
  const series = [
    { color: "var(--color-chart-1)", data: revenue, label: "Revenue" },
    { color: "var(--color-chart-2)", data: visitors, label: "Visitors" },
    {
      color: "var(--color-chart-3)",
      data: sparklineGalleryData(3, 24, 120, 2),
      label: "Orders",
    },
  ];
  return (
    <GalleryShell className="flex max-w-md flex-col gap-3">
      {series.map((s) => (
        <div
          className="grid grid-cols-[5rem_1fr_4rem] items-center gap-3"
          key={s.label}
        >
          <span className="text-foreground-muted text-xs">{s.label}</span>
          <LineSparkline
            color={s.color}
            data={s.data}
            dataKey="value"
            height={28}
            {...hover.sparklineProps}
          />
          <span className="text-right text-sm tabular-nums">
            {compact.format(
              s.data[hover.index ?? s.data.length - 1]?.value ?? 0
            )}
          </span>
        </div>
      ))}
    </GalleryShell>
  );
}
