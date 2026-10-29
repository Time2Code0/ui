"use client";

import type { ReactNode } from "react";

import { cn } from "cn";

import { AreaSparkline } from "@/registry/charts/sparkline/sparkline";

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

const visitors = sparklineGalleryData(2, 24, 1800, -12);

function SparklineAreaExample({ fill }: { fill: "gradient" | "solid" }) {
  return (
    <GalleryShell className="max-w-md">
      <AreaSparkline
        color={fill === "solid" ? "var(--color-chart-2)" : undefined}
        data={visitors}
        dataKey="value"
        fill={fill}
        fillOpacity={fill === "solid" ? 0.2 : undefined}
        height={56}
      />
    </GalleryShell>
  );
}

export function Particle() {
  return <SparklineAreaExample fill="solid" />;
}
