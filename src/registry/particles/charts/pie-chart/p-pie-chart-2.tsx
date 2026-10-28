"use client";

import type { PieData } from "@/registry/charts/pie-context";

import { useState } from "react";

import { PieCenter } from "@/registry/charts/pie-center";
import { PieChart } from "@/registry/charts/pie-chart";
import { PieSlice } from "@/registry/charts/pie-slice";

const pieData: PieData[] = [
  { color: "var(--color-chart-1)", label: "Chrome", value: 275 },
  { color: "var(--color-chart-2)", label: "Safari", value: 200 },
  { color: "var(--color-chart-3)", label: "Firefox", value: 187 },
  { color: "var(--color-chart-4)", label: "Edge", value: 173 },
  { color: "var(--color-chart-5)", label: "Other", value: 90 },
];

function PieDonutInteractive() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  return (
    <div className="mx-auto aspect-square w-full max-w-[min(100%,300px)] sm:max-w-[260px]">
      <PieChart
        data={pieData}
        hoveredIndex={hoveredIndex}
        innerRadius={60}
        onHoverChange={setHoveredIndex}
      >
        {pieData.map((item, index) => (
          <PieSlice index={index} key={item.label} />
        ))}
        <PieCenter defaultLabel="Total" />
      </PieChart>
    </div>
  );
}

export function Particle() {
  return (
    <div className="mx-auto aspect-square w-full max-w-[min(100%,300px)] sm:max-w-[260px]">
      <PieDonutInteractive />
    </div>
  );
}
