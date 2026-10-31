"use client";

import type { PieData } from "@/registry/charts/pie-chart/pie-context";

import { useState } from "react";

import { PieCenter } from "@/registry/charts/pie-chart/pie-center";
import { PieChart } from "@/registry/charts/pie-chart/pie-chart";
import { PieSlice } from "@/registry/charts/pie-chart/pie-slice";

// Sample data for pie charts
const salesData: PieData[] = [
  { color: "#0ea5e9", label: "Electronics", value: 4250 },
  { color: "#a855f7", label: "Clothing", value: 3120 },
  { color: "#f59e0b", label: "Food", value: 2100 },
  { color: "#10b981", label: "Home", value: 1580 },
  { color: "#ef4444", label: "Other", value: 1050 },
];

/**
 * Donut chart with center content
 */
export function Particle() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <PieChart
      data={salesData}
      hoveredIndex={hoveredIndex}
      innerRadius={70}
      onHoverChange={setHoveredIndex}
      size={280}
    >
      {salesData.map((item, index) => (
        <PieSlice index={index} key={item.label} />
      ))}
      <PieCenter defaultLabel="Total Sales" />
    </PieChart>
  );
}
