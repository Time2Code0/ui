"use client";

import type { ReactNode } from "react";

import { cn } from "cn";

import { LineSparkline } from "@/registry/charts/sparkline";

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

const tableRows = [
  { data: sparklineGalleryData(11, 16, 320, 6), name: "Starter" },
  { data: sparklineGalleryData(12, 16, 880, 18), name: "Pro" },
  { data: sparklineGalleryData(13, 16, 540, -9), name: "Team" },
  { data: sparklineGalleryData(14, 16, 1260, 4), name: "Enterprise" },
];

function percentChange(data: SparklineGalleryPoint[], value: number) {
  const first = data[0]?.value ?? 0;
  return first === 0 ? 0 : ((value - first) / first) * 100;
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

export function Particle() {
  return (
    <GalleryShell className="max-w-lg">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-foreground-muted text-xs">
            <th className="pb-2 font-medium">Plan</th>
            <th className="pb-2 font-medium">Last 16 weeks</th>
            <th className="pb-2 text-right font-medium">MRR</th>
            <th className="pb-2 text-right font-medium">Change</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row) => {
            const last = row.data.at(-1)?.value ?? 0;
            const change = percentChange(row.data, last);
            return (
              <tr className="border-b last:border-0" key={row.name}>
                <td className="py-2 pr-3">{row.name}</td>
                <td className="py-2 pr-3">
                  <LineSparkline
                    color={
                      change >= 0
                        ? "var(--color-success-foreground)"
                        : "var(--color-destructive-foreground)"
                    }
                    data={row.data}
                    dataKey="value"
                    height={24}
                    strokeWidth={1.5}
                    width={120}
                  />
                </td>
                <td className="py-2 text-right tabular-nums">
                  ${compact.format(last)}
                </td>
                <td className="py-2 text-right">
                  <ChangeBadge change={change} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </GalleryShell>
  );
}
