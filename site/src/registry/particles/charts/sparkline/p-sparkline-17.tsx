"use client";

import {
  BarSparkline,
  LineSparkline,
} from "@/registry/charts/sparkline/sparkline";

const hoverFeels = [
  { label: "Spring (default)", props: {} },
  {
    label: "Snappy",
    props: { springConfig: { damping: 45, stiffness: 600 } },
  },
  { label: "No spring", props: { hoverTransition: false } },
] as const;

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

const revenue = makeSparkData(1, 24, 4200, 40);

const orders = makeSparkData(3, 18, 120, 2);

export function Particle() {
  return (
    <div className="grid w-full max-w-2xl gap-6 py-4 sm:grid-cols-3">
      {hoverFeels.map((feel) => (
        <div className="flex flex-col gap-2" key={feel.label}>
          <span className="text-foreground-muted text-xs">{feel.label}</span>
          <LineSparkline
            data={revenue}
            dataKey="value"
            height={48}
            {...feel.props}
          />
        </div>
      ))}
      <BarSparkline
        className="sm:col-span-3"
        color="var(--color-chart-3)"
        data={orders}
        dataKey="value"
        height={40}
        hoverTransition={false}
      />
    </div>
  );
}
