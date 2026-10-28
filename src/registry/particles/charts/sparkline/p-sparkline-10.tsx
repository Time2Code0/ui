"use client";

import type { ReactNode } from "react";

import { cn } from "cn";

import { LineSparkline } from "@/registry/charts/sparkline";

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

const latency = sparklineGalleryData(5, 32, 240, 0);

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

export function Particle() {
  const last = latency.at(-1)?.value ?? 0;
  return (
    <GalleryShell className="flex max-w-md items-center gap-4">
      <div className="flex shrink-0 flex-col">
        <span className="text-foreground-muted text-xs">p95 latency</span>
        <span className="font-semibold text-lg tabular-nums">{last}ms</span>
      </div>
      <LineSparkline
        className="min-w-0 flex-1"
        color="var(--color-chart-4)"
        curve="natural"
        data={latency}
        dataKey="value"
        endDot
        height={40}
        interactive={false}
      />
    </GalleryShell>
  );
}
