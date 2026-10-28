"use client";

import {
  AreaSparkline,
  BarSparkline,
  LineSparkline,
} from "@/registry/charts/sparkline";

interface SparkPoint {
  day: string;
  value: number;
}

/** Deterministic wavy series so SSR and client render the same paths. */
function makeSparkData(
  seed: number,
  length = 24,
  base = 100,
  trend = 1.5
): SparkPoint[] {
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

/** 200 sparklines — a quick way to eyeball mount and hover cost. */
export function Particle() {
  return (
    <div className="grid w-full grid-cols-4 gap-x-4 gap-y-2 py-4 sm:grid-cols-8">
      {Array.from({ length: 200 }, (_, i) => {
        const data = makeSparkData(i, 20, 100, (i % 7) - 3);
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
    </div>
  );
}
