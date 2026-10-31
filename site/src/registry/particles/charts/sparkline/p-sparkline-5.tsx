"use client";

import type { ReactNode } from "react";

import { cn } from "cn";

import { BarSparkline } from "@/registry/charts/sparkline/sparkline";

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

const orders = sparklineGalleryData(3, 18, 120, 2);

export function Particle() {
  return (
    <GalleryShell className="max-w-md">
      <BarSparkline
        barGap={2}
        barRadius={2}
        color="var(--color-chart-3)"
        data={orders}
        dataKey="value"
        height={56}
      />
    </GalleryShell>
  );
}
