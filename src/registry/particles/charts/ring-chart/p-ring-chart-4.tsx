"use client";

import type { RingData } from "@/registry/charts/ring-context";

import { Ring } from "@/registry/charts/ring";
import { RingCenter } from "@/registry/charts/ring-center";
import { RingChart } from "@/registry/charts/ring-chart";

const ringGoalData: RingData[] = [
  { color: "#0ea5e9", label: "Steps", maxValue: 10_000, value: 8200 },
  { color: "#a855f7", label: "Calories", maxValue: 2500, value: 1800 },
  { color: "#10b981", label: "Distance", maxValue: 5, value: 4.2 },
];

export function Particle() {
  return (
    <div className="mx-auto aspect-square w-full max-w-[min(100%,300px)] sm:max-w-[260px]">
      <RingChart
        data={ringGoalData}
        endAngle={Math.PI / 2}
        startAngle={-Math.PI}
      >
        {ringGoalData.map((item, index) => (
          <Ring index={index} key={item.label} />
        ))}
        <RingCenter defaultLabel="Activity" />
      </RingChart>
    </div>
  );
}
