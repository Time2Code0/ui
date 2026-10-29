"use client";

import type { PieData } from "@/registry/charts/pie-chart/pie-context";

import { RadialGradient } from "@visx/gradient";

import { PieChart } from "@/registry/charts/pie-chart/pie-chart";
import { PieSlice } from "@/registry/charts/pie-chart/pie-slice";

/**
 * Pie chart with gradients
 */
export function Particle() {
  const gradientData: PieData[] = [
    { label: "Segment A", value: 40 },
    { label: "Segment B", value: 30 },
    { label: "Segment C", value: 30 },
  ];

  return (
    <PieChart data={gradientData} size={280}>
      {/* Gradient definitions */}
      <RadialGradient
        from="#0ea5e9"
        fromOffset="0%"
        id="pie-gradient-1"
        to="#06b6d4"
        toOffset="100%"
      />
      <RadialGradient
        from="#a855f7"
        fromOffset="0%"
        id="pie-gradient-2"
        to="#ec4899"
        toOffset="100%"
      />
      <RadialGradient
        from="#f59e0b"
        fromOffset="0%"
        id="pie-gradient-3"
        to="#ef4444"
        toOffset="100%"
      />

      {/* Slices with gradient fills */}
      <PieSlice fill="url(#pie-gradient-1)" index={0} />
      <PieSlice fill="url(#pie-gradient-2)" index={1} />
      <PieSlice fill="url(#pie-gradient-3)" index={2} />
    </PieChart>
  );
}
