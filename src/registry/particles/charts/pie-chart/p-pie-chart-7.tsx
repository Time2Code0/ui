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

function PieCustomCenter() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = pieData.reduce((s, d) => s + d.value, 0);
  return (
    <div className="mx-auto aspect-square w-full max-w-[min(100%,300px)] sm:max-w-[260px]">
      <PieChart
        data={pieData}
        hoveredIndex={hoveredIndex}
        innerRadius={65}
        onHoverChange={setHoveredIndex}
      >
        {pieData.map((item, index) => (
          <PieSlice index={index} key={item.label} />
        ))}
        <PieCenter>
          {({ value, label, isHovered, data: d }) => (
            <div className="text-center">
              <div
                className="font-bold text-xl"
                style={{ color: isHovered ? d.color : undefined }}
              >
                {value.toLocaleString()}
              </div>
              <div className="text-foreground-muted text-xs">{label}</div>
              {isHovered && (
                <div className="mt-0.5 text-[10px] text-foreground-muted">
                  {((d.value / total) * 100).toFixed(1)}%
                </div>
              )}
            </div>
          )}
        </PieCenter>
      </PieChart>
    </div>
  );
}

export function Particle() {
  return (
    <div className="mx-auto aspect-square w-full max-w-[min(100%,300px)] sm:max-w-[260px]">
      <PieCustomCenter />
    </div>
  );
}
