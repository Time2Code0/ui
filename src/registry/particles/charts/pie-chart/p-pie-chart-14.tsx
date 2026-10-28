"use client";

import type { PieData } from "@/registry/charts/pie-context";

import { PieChart } from "@/registry/charts/pie-chart";
import { PieSlice } from "@/registry/charts/pie-slice";
import { PatternLines } from "@/registry/charts/visx-pattern";

/**
 * Pie chart with patterns
 */
export function Particle() {
  const patternData: PieData[] = [
    { label: "Category A", value: 35 },
    { label: "Category B", value: 25 },
    { label: "Category C", value: 20 },
    { label: "Category D", value: 20 },
  ];

  return (
    <PieChart data={patternData} size={280}>
      {/* Pattern definitions */}
      <PatternLines
        height={6}
        id="pie-pattern-1"
        orientation={["diagonal"]}
        stroke="var(--color-chart-1)"
        strokeWidth={1}
        width={6}
      />
      <PatternLines
        height={6}
        id="pie-pattern-2"
        orientation={["horizontal"]}
        stroke="var(--color-chart-2)"
        strokeWidth={1}
        width={6}
      />
      <PatternLines
        height={6}
        id="pie-pattern-3"
        orientation={["vertical"]}
        stroke="var(--color-chart-3)"
        strokeWidth={1}
        width={6}
      />
      <PatternLines
        height={8}
        id="pie-pattern-4"
        orientation={["diagonalRightToLeft"]}
        stroke="var(--color-chart-4)"
        strokeWidth={1}
        width={8}
      />

      {/* Slices with pattern fills */}
      <PieSlice fill="url(#pie-pattern-1)" index={0} />
      <PieSlice fill="url(#pie-pattern-2)" index={1} />
      <PieSlice fill="url(#pie-pattern-3)" index={2} />
      <PieSlice fill="url(#pie-pattern-4)" index={3} />
    </PieChart>
  );
}
