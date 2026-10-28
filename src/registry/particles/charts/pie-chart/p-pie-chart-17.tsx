"use client";

import type { PieData } from "@/registry/charts/pie-context";

import { useState } from "react";

import { PieCenter } from "@/registry/charts/pie-center";
import { PieChart } from "@/registry/charts/pie-chart";
import { PieSlice } from "@/registry/charts/pie-slice";

// Sample data for pie charts
const salesData: PieData[] = [
  { color: "#0ea5e9", label: "Electronics", value: 4250 },
  { color: "#a855f7", label: "Clothing", value: 3120 },
  { color: "#f59e0b", label: "Food", value: 2100 },
  { color: "#10b981", label: "Home", value: 1580 },
  { color: "#ef4444", label: "Other", value: 1050 },
];

/**
 * Donut with custom center content
 */
export function Particle() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <PieChart
      data={salesData}
      hoveredIndex={hoveredIndex}
      innerRadius={80}
      onHoverChange={setHoveredIndex}
      size={300}
    >
      {salesData.map((item, index) => (
        <PieSlice index={index} key={item.label} />
      ))}
      <PieCenter>
        {({ value, label, isHovered, data }) => (
          <div className="text-center">
            <div
              className="font-bold text-3xl"
              style={{ color: isHovered ? data.color : undefined }}
            >
              {value.toLocaleString()}
            </div>
            <div className="text-foreground-muted text-sm">{label}</div>
            {isHovered && (
              <div className="mt-1 text-foreground-muted text-xs">
                {(
                  (data.value / salesData.reduce((s, d) => s + d.value, 0)) *
                  100
                ).toFixed(1)}
                % of total
              </div>
            )}
          </div>
        )}
      </PieCenter>
    </PieChart>
  );
}
