"use client";

import type { ReactNode } from "react";

import { cn } from "cn";

import {
  LineSparkline,
  type SparklineCrosshair,
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

const crosshairs: Exclude<SparklineCrosshair, false>[] = [
  "dashed",
  "solid",
  "gradient",
];

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

export function Particle() {
  return (
    <GalleryShell className="grid gap-6 sm:grid-cols-3">
      {crosshairs.map((crosshair) => (
        <div className="flex flex-col gap-2" key={crosshair}>
          <span className="text-foreground-muted text-xs">{crosshair}</span>
          <LineSparkline
            crosshair={crosshair}
            data={revenue}
            dataKey="value"
            height={48}
          />
        </div>
      ))}
    </GalleryShell>
  );
}
