"use client";

import type { RingData } from "@/registry/charts/ring-context";

import { Ring } from "@/registry/charts/ring";
import { RingCenter } from "@/registry/charts/ring-center";
import { RingChart } from "@/registry/charts/ring-chart";

const ringData: RingData[] = [
  {
    color: "var(--color-chart-1)",
    label: "Organic",
    maxValue: 5000,
    value: 4250,
  },
  { color: "var(--color-chart-2)", label: "Paid", maxValue: 5000, value: 3120 },
  {
    color: "var(--color-chart-3)",
    label: "Email",
    maxValue: 5000,
    value: 2100,
  },
  {
    color: "var(--color-chart-4)",
    label: "Social",
    maxValue: 5000,
    value: 1580,
  },
];

export function Particle() {
  return (
    <div className="mx-auto aspect-square w-full max-w-[min(100%,300px)] sm:max-w-[260px]">
      <RingChart data={ringData} endAngle={0} startAngle={-Math.PI}>
        {ringData.map((item, index) => (
          <Ring index={index} key={item.label} />
        ))}
        <RingCenter defaultLabel="Sessions" />
      </RingChart>
    </div>
  );
}
