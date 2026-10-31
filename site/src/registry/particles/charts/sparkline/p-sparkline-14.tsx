"use client";

import type { ReactNode } from "react";

import { cn } from "cn";

import {
  AreaSparkline,
  BarSparkline,
  LineSparkline,
} from "@/registry/charts/sparkline/sparkline";

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

const gridVariants = [AreaSparkline, LineSparkline, BarSparkline] as const;

/** 64 sparklines sharing one ResizeObserver. */
export function Particle() {
  return (
    <GalleryShell className="grid grid-cols-4 gap-x-4 gap-y-3 sm:grid-cols-8">
      {Array.from({ length: 64 }, (_, i) => {
        const data = sparklineGalleryData(i, 20, 100, (i % 7) - 3);
        const Component = gridVariants[i % 3] ?? LineSparkline;
        return (
          <Component
            color={`var(--color-chart-${(i % 5) + 1})`}
            data={data}
            dataKey="value"
            height={24}
            key={`spark-${i}`}
          />
        );
      })}
    </GalleryShell>
  );
}
