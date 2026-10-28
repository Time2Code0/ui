"use client";

import type { ReactNode } from "react";

import { cn } from "cn";

import { AreaSparkline } from "@/registry/charts/sparkline";

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

/** Plan tier changes — step curve reads as discrete levels. */
const seats: SparklineGalleryPoint[] = [
  5, 5, 5, 8, 8, 8, 8, 12, 12, 10, 10, 15, 15, 15, 20, 20, 18, 25,
].map((value, i) => ({ day: `Week ${i + 1}`, value }));

export function Particle() {
  return (
    <GalleryShell className="max-w-md">
      <AreaSparkline
        color="var(--color-chart-5)"
        curve="step"
        data={seats}
        dataKey="value"
        endDot
        height={56}
        yDomain={[0]}
      />
    </GalleryShell>
  );
}
