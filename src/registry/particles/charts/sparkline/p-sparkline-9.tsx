"use client";

import type { ReactNode } from "react";

import { cn } from "cn";

import {
  AreaSparkline,
  BarSparkline,
  useSparklineHover,
} from "@/registry/charts/sparkline";

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

export function Particle() {
  const hover = useSparklineHover<SparklineGalleryPoint>();
  const shown = hover.datum ?? visitors.at(-1);
  return (
    <GalleryShell className="flex max-w-md flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="text-foreground-muted text-xs">Visitors</span>
        <span className="font-semibold text-lg tabular-nums">
          {shown?.value.toLocaleString("en")}
        </span>
      </div>
      <AreaSparkline
        color="var(--color-chart-2)"
        data={visitors}
        dataKey="value"
        height={48}
        hoverTransition={false}
        {...hover.sparklineProps}
      />
      <BarSparkline
        color="var(--color-chart-2)"
        data={visitors}
        dataKey="value"
        height={32}
        hoverTransition={false}
        {...hover.sparklineProps}
      />
    </GalleryShell>
  );
}
