"use client";

import type { PieData } from "@/registry/charts/pie-context";

import { useState } from "react";

import { Legend } from "@/registry/charts/legend/legend";
import { LegendItem as LegendItemComponent } from "@/registry/charts/legend/legend-item";
import { LegendLabel } from "@/registry/charts/legend/legend-label";
import { LegendMarker } from "@/registry/charts/legend/legend-marker";
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

function PieWithLegend() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const legendItems = pieData.map((d) => ({
    color: d.color || "",
    label: d.label,
    value: d.value,
  }));
  return (
    <div className="flex flex-col items-center gap-4">
      <PieChart
        data={pieData}
        hoveredIndex={hoveredIndex}
        innerRadius={55}
        onHoverChange={setHoveredIndex}
      >
        {pieData.map((item, index) => (
          <PieSlice index={index} key={item.label} />
        ))}
        <PieCenter defaultLabel="Browsers" />
      </PieChart>
      <Legend
        className="flex-row flex-wrap justify-center gap-x-4 gap-y-1"
        hoveredIndex={hoveredIndex}
        items={legendItems}
        onHoverChange={setHoveredIndex}
      >
        <LegendItemComponent className="flex items-center gap-1.5">
          <LegendMarker />
          <LegendLabel className="text-xs" />
        </LegendItemComponent>
      </Legend>
    </div>
  );
}

export function Particle() {
  return (
    <div className="mx-auto aspect-square w-full max-w-[min(100%,300px)] sm:max-w-[260px]">
      <PieWithLegend />
    </div>
  );
}
