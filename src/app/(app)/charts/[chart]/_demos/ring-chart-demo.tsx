"use client";

import { useState } from "react";

import {
  Legend,
  LegendItemComponent,
  type LegendItemData,
  LegendLabel,
  LegendMarker,
  LegendProgress,
  LegendValue,
  Ring,
  RingCenter,
  RingChart,
  type RingData,
} from "../_charts";

// Sample session data
const sessionsData: RingData[] = [
  { color: "#0ea5e9", label: "Organic", maxValue: 5000, value: 4250 },
  { color: "#a855f7", label: "Paid", maxValue: 5000, value: 3120 },
  { color: "#f59e0b", label: "Email", maxValue: 5000, value: 2100 },
  { color: "#10b981", label: "Social", maxValue: 5000, value: 1580 },
  { color: "#ef4444", label: "Referral", maxValue: 5000, value: 1050 },
  { color: "#6366f1", label: "Direct", maxValue: 5000, value: 747 },
];

export function RingChartDemo() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Convert ring data to legend items
  const legendItems: LegendItemData[] = sessionsData.map((d) => ({
    color: d.color || "",
    label: d.label,
    maxValue: d.maxValue,
    value: d.value,
  }));

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col items-center justify-center gap-8 lg:w-auto lg:flex-row lg:gap-12">
      {/* Chart */}
      <RingChart
        data={sessionsData}
        hoveredIndex={hoveredIndex}
        onHoverChange={setHoveredIndex}
        size={320}
      >
        {sessionsData.map((item, index) => (
          <Ring index={index} key={item.label} />
        ))}
        <RingCenter defaultLabel="Total Sessions" />
      </RingChart>

      {/* Composable Legend */}
      <Legend
        hoveredIndex={hoveredIndex}
        items={legendItems}
        onHoverChange={setHoveredIndex}
        title="Sessions by Channel"
      >
        <LegendItemComponent className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1">
          <LegendMarker />
          <LegendLabel />
          <LegendValue showPercentage />
          <div className="col-span-full">
            <LegendProgress />
          </div>
        </LegendItemComponent>
      </Legend>
    </div>
  );
}

export function RingChartBasicDemo() {
  return (
    <RingChart data={sessionsData} size={280}>
      {sessionsData.map((item, index) => (
        <Ring index={index} key={item.label} />
      ))}
      <RingCenter />
    </RingChart>
  );
}

export function RingChartCustomColorsDemo() {
  const customData: RingData[] = [
    {
      color: "var(--chart-1)",
      label: "Revenue",
      maxValue: 100_000,
      value: 85_000,
    },
    {
      color: "var(--chart-2)",
      label: "Expenses",
      maxValue: 100_000,
      value: 62_000,
    },
    {
      color: "var(--chart-3)",
      label: "Profit",
      maxValue: 100_000,
      value: 23_000,
    },
  ];

  return (
    <RingChart data={customData} ringGap={8} size={240} strokeWidth={16}>
      {customData.map((item, index) => (
        <Ring index={index} key={item.label} />
      ))}
      <RingCenter
        defaultLabel="Total"
        formatOptions={{ notation: "compact" }}
        prefix="$"
      />
    </RingChart>
  );
}
