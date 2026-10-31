"use client";

import type { PieData } from "@/registry/charts/pie-chart/pie-context";

import { PieChart } from "@/registry/charts/pie-chart/pie-chart";
import { PieSlice } from "@/registry/charts/pie-chart/pie-slice";

const pieData: PieData[] = [
  { color: "var(--color-chart-1)", label: "Chrome", value: 275 },
  { color: "var(--color-chart-2)", label: "Safari", value: 200 },
  { color: "var(--color-chart-3)", label: "Firefox", value: 187 },
  { color: "var(--color-chart-4)", label: "Edge", value: 173 },
  { color: "var(--color-chart-5)", label: "Other", value: 90 },
];

function PieGrowHover() {
  return (
    <div className="mx-auto aspect-square w-full max-w-[min(100%,300px)] sm:max-w-[260px]">
      <PieChart data={pieData}>
        {pieData.map((item, index) => (
          <PieSlice hoverEffect="grow" index={index} key={item.label} />
        ))}
      </PieChart>
    </div>
  );
}

export function Particle() {
  return (
    <div className="mx-auto aspect-square w-full max-w-[min(100%,300px)] sm:max-w-[260px]">
      <PieGrowHover />
    </div>
  );
}
