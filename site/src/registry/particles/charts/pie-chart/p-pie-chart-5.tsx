"use client";

import type { PieData } from "@/registry/charts/pie-chart/pie-context";

import { RadialGradient } from "@/registry/charts/chart-gradients/gradients";
import { PieChart } from "@/registry/charts/pie-chart/pie-chart";
import { PieSlice } from "@/registry/charts/pie-chart/pie-slice";

const pieGradientData: PieData[] = [
  { label: "Segment A", value: 40 },
  { label: "Segment B", value: 30 },
  { label: "Segment C", value: 30 },
];

export function Particle() {
  return (
    <div className="mx-auto aspect-square w-full max-w-[min(100%,300px)] sm:max-w-[260px]">
      <PieChart data={pieGradientData}>
        <RadialGradient
          from="#0ea5e9"
          fromOffset="0%"
          id="pie-ex-g1"
          to="#06b6d4"
          toOffset="100%"
        />
        <RadialGradient
          from="#a855f7"
          fromOffset="0%"
          id="pie-ex-g2"
          to="#ec4899"
          toOffset="100%"
        />
        <RadialGradient
          from="#f59e0b"
          fromOffset="0%"
          id="pie-ex-g3"
          to="#ef4444"
          toOffset="100%"
        />
        <PieSlice fill="url(#pie-ex-g1)" index={0} />
        <PieSlice fill="url(#pie-ex-g2)" index={1} />
        <PieSlice fill="url(#pie-ex-g3)" index={2} />
      </PieChart>
    </div>
  );
}
