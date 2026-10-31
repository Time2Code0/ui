"use client";

import type { PieData } from "@/registry/charts/pie-chart/pie-context";

import { useState } from "react";

import { PieChart } from "@/registry/charts/pie-chart/pie-chart";
import {
  PieSlice,
  type PieSliceHoverEffect,
} from "@/registry/charts/pie-chart/pie-slice";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select";

// Sample data for pie charts
const salesData: PieData[] = [
  { color: "#0ea5e9", label: "Electronics", value: 4250 },
  { color: "#a855f7", label: "Clothing", value: 3120 },
  { color: "#f59e0b", label: "Food", value: 2100 },
  { color: "#10b981", label: "Home", value: 1580 },
  { color: "#ef4444", label: "Other", value: 1050 },
];

/**
 * Hover effect demo with selector
 */
export function Particle() {
  const [hoverEffect, setHoverEffect] =
    useState<PieSliceHoverEffect>("translate");

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-3">
        <span className="text-foreground-muted text-sm">Hover Effect:</span>
        <Select
          onValueChange={(v) => setHoverEffect(v as PieSliceHoverEffect)}
          value={hoverEffect}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectPopup>
            <SelectItem value="translate">Translate</SelectItem>
            <SelectItem value="grow">Grow</SelectItem>
            <SelectItem value="none">None</SelectItem>
          </SelectPopup>
        </Select>
      </div>

      <PieChart data={salesData} size={280}>
        {salesData.map((item, index) => (
          <PieSlice hoverEffect={hoverEffect} index={index} key={item.label} />
        ))}
      </PieChart>
    </div>
  );
}
