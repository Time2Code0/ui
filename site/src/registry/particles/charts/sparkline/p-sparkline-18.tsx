"use client";

import {
  LineSparkline,
  useSparklineHover,
} from "@/registry/charts/sparkline/sparkline";

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

const visitors = makeSparkData(2, 24, 1800, -12);

const formatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 1,
  notation: "compact",
});

export function Particle() {
  const hover = useSparklineHover<SparkPoint>();
  const series = [
    { color: "var(--color-chart-1)", data: revenue, label: "Revenue" },
    { color: "var(--color-chart-2)", data: visitors, label: "Visitors" },
    {
      color: "var(--color-chart-3)",
      data: makeSparkData(3, 24, 120, 2),
      label: "Orders",
    },
  ];
  return (
    <div className="flex w-full max-w-md flex-col gap-3 py-4">
      {series.map((s) => (
        <div
          className="grid grid-cols-[5rem_1fr_4rem] items-center gap-3"
          key={s.label}
        >
          <span className="text-foreground-muted text-xs">{s.label}</span>
          <LineSparkline
            color={s.color}
            data={s.data}
            dataKey="value"
            height={28}
            {...hover.sparklineProps}
          />
          <span className="text-right text-sm tabular-nums">
            {formatter.format(
              s.data[hover.index ?? s.data.length - 1]?.value ?? 0
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
