"use client";

import type { RingData } from "@/registry/charts/ring-context";

import { Ring } from "@/registry/charts/ring";
import { RingCenter } from "@/registry/charts/ring-center";
import { RingChart } from "@/registry/charts/ring-chart";

export function Particle() {
  const customData: RingData[] = [
    {
      color: "var(--color-chart-1)",
      label: "Revenue",
      maxValue: 100_000,
      value: 85_000,
    },
    {
      color: "var(--color-chart-2)",
      label: "Expenses",
      maxValue: 100_000,
      value: 62_000,
    },
    {
      color: "var(--color-chart-3)",
      label: "Profit",
      maxValue: 100_000,
      value: 23_000,
    },
  ];

  return (
    <RingChart data={customData} ringGap={8} size={240} strokeWidth={16}>
      {customData.map((item, index) => (
        <Ring index={index} key={item.label} />
      ))}
      <RingCenter
        defaultLabel="Total"
        formatOptions={{ notation: "compact" }}
        prefix="$"
      />
    </RingChart>
  );
}
