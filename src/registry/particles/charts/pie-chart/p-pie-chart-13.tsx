"use client";

import type { LegendItemData } from "@/registry/charts/legend/legend-context";
import type { PieData } from "@/registry/charts/pie-context";

import { useState } from "react";

import { Legend } from "@/registry/charts/legend/legend";
import { LegendItem as LegendItemComponent } from "@/registry/charts/legend/legend-item";
import { LegendLabel } from "@/registry/charts/legend/legend-label";
import { LegendMarker } from "@/registry/charts/legend/legend-marker";
import { LegendValue } from "@/registry/charts/legend/legend-value";
import { PieCenter } from "@/registry/charts/pie-center";
import { PieChart } from "@/registry/charts/pie-chart";
import { PieSlice } from "@/registry/charts/pie-slice";

// Convert pie data to legend items
function toLegendItems(data: PieData[]): LegendItemData[] {
  return data.map((d) => ({
    color: d.color || "",
    label: d.label,
    value: d.value,
  }));
}

// Sample data for pie charts
const salesData: PieData[] = [
  { color: "#0ea5e9", label: "Electronics", value: 4250 },
  { color: "#a855f7", label: "Clothing", value: 3120 },
  { color: "#f59e0b", label: "Food", value: 2100 },
  { color: "#10b981", label: "Home", value: 1580 },
  { color: "#ef4444", label: "Other", value: 1050 },
];

/**
 * Donut chart with interactive legend
 */
export function Particle() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const legendItems = toLegendItems(salesData);

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col items-center justify-center gap-8 lg:w-auto lg:flex-row lg:gap-12">
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

      <Legend
        hoveredIndex={hoveredIndex}
        items={legendItems}
        onHoverChange={setHoveredIndex}
        title="Sales by Category"
      >
        <LegendItemComponent className="flex items-center gap-3">
          <LegendMarker />
          <LegendLabel className="flex-1" />
          <LegendValue showPercentage />
        </LegendItemComponent>
      </Legend>
    </div>
  );
}
