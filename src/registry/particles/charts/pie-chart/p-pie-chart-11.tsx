"use client";

import type { PieData } from "@/registry/charts/pie-context";

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
 * Basic pie chart without legend
 */
export function Particle() {
  return (
    <PieChart data={salesData} size={240}>
      {salesData.map((item, index) => (
        <PieSlice index={index} key={item.label} />
      ))}
    </PieChart>
  );
}
