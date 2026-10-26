"use client";

import { Area, AreaChart, ChartTooltip, Grid, XAxis } from "../_charts";

export function AreaTooltipDemo() {
  return (
    <ChartTooltip
      rows={(point) => [
        {
          color: "var(--chart-line-primary)",
          label: "Revenue",
          value: `$${(point.revenue as number)?.toLocaleString() ?? 0}`,
        },
        {
          color: "var(--chart-line-secondary)",
          label: "Costs",
          value: `$${(point.costs as number)?.toLocaleString() ?? 0}`,
        },
      ]}
    />
  );
}

const revenue = [
  12_000, 13_500, 11_000, 14_500, 13_800, 15_200, 16_000, 14_800, 15_500,
  14_200, 16_800, 17_500, 16_200, 15_800, 17_200, 18_500, 17_800, 16_500,
  19_200, 18_800, 17_500, 19_800, 20_500, 19_200, 21_000, 21_800, 20_500,
  22_500, 23_200, 24_000,
];
const costs = [
  8500, 9200, 7800, 10_100, 9400, 10_800, 11_200, 10_500, 10_900, 9800, 11_800,
  12_400, 11_500, 11_200, 12_100, 13_200, 12_600, 11_700, 13_800, 13_400,
  12_400, 14_200, 14_800, 13_600, 15_200, 15_800, 14_600, 16_200, 16_800,
  17_400,
];
const chartData = revenue.map((value, index) => ({
  costs: costs[index] ?? 0,
  date: new Date(2025, 0, 1 + index),
  revenue: value,
}));

/** `AreaTooltipDemo` inside the area chart it was written for (docs page hero). */
export function AreaTooltipPreview() {
  return (
    <div className="w-full">
      <AreaChart data={chartData}>
        <Grid horizontal />
        <Area
          dataKey="revenue"
          fadeEdges
          fill="var(--chart-line-primary)"
          fillOpacity={0.3}
        />
        <Area
          dataKey="costs"
          fadeEdges
          fill="var(--chart-line-secondary)"
          fillOpacity={0.3}
        />
        <XAxis />
        <AreaTooltipDemo />
      </AreaChart>
    </div>
  );
}
