"use client";

import type { PieData } from "@/registry/charts/pie-chart/pie-context";

import { PatternLines } from "@/registry/charts/chart-patterns/visx-pattern";
import { PieCenter } from "@/registry/charts/pie-chart/pie-center";
import { PieChart } from "@/registry/charts/pie-chart/pie-chart";
import { PieSlice } from "@/registry/charts/pie-chart/pie-slice";

const piePatternData: PieData[] = [
  { label: "Category A", value: 35 },
  { label: "Category B", value: 25 },
  { label: "Category C", value: 20 },
  { label: "Category D", value: 20 },
];

export function Particle() {
  return (
    <div className="mx-auto aspect-square w-full max-w-[min(100%,300px)] sm:max-w-[260px]">
      <PieChart data={piePatternData} innerRadius={55}>
        <PatternLines
          height={6}
          id="donut-ex-p1"
          orientation={["diagonal"]}
          stroke="var(--color-chart-1)"
          strokeWidth={1}
          width={6}
        />
        <PatternLines
          height={6}
          id="donut-ex-p2"
          orientation={["horizontal"]}
          stroke="var(--color-chart-2)"
          strokeWidth={1}
          width={6}
        />
        <PatternLines
          height={6}
          id="donut-ex-p3"
          orientation={["vertical"]}
          stroke="var(--color-chart-3)"
          strokeWidth={1}
          width={6}
        />
        <PatternLines
          height={8}
          id="donut-ex-p4"
          orientation={["diagonalRightToLeft"]}
          stroke="var(--color-chart-4)"
          strokeWidth={1}
          width={8}
        />
        <PieSlice fill="url(#donut-ex-p1)" index={0} />
        <PieSlice fill="url(#donut-ex-p2)" index={1} />
        <PieSlice fill="url(#donut-ex-p3)" index={2} />
        <PieSlice fill="url(#donut-ex-p4)" index={3} />
        <PieCenter defaultLabel="Total" />
      </PieChart>
    </div>
  );
}
