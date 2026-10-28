"use client";

import type { ReactNode } from "react";

import { cn } from "cn";

import { BarSparkline, useSparklineHover } from "@/registry/charts/sparkline";

interface SparklineGalleryPoint {
  day: string;
  value: number;
}

/** Daily profit / loss — swings across zero. */
const profitLoss: SparklineGalleryPoint[] = Array.from(
  { length: 20 },
  (_, i) => ({
    day: `Day ${i + 1}`,
    value: Math.round(Math.sin(i * 0.9) * 420 + Math.cos(i * 2.3) * 180 + 40),
  })
);

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
  const shown = hover.datum ?? profitLoss.at(-1);
  const value = shown?.value ?? 0;
  return (
    <GalleryShell className="flex max-w-md flex-col gap-2">
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-foreground-muted">Daily P&amp;L</span>
        <span
          className={cn(
            "font-medium tabular-nums",
            value >= 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400"
          )}
        >
          {shown?.day} · {value >= 0 ? "+" : "−"}${Math.abs(value)}
        </span>
      </div>
      <BarSparkline
        data={profitLoss}
        dataKey="value"
        height={56}
        {...hover.sparklineProps}
      />
    </GalleryShell>
  );
}
