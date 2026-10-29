"use client";

import { Bar } from "@/registry/charts/bar-chart/bar";
import { BarChart } from "@/registry/charts/bar-chart/bar-chart";
import { BarXAxis } from "@/registry/charts/bar-chart/bar-x-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";

const profitLossData = [
  { month: "Jan", profit: 4200 },
  { month: "Feb", profit: -1800 },
  { month: "Mar", profit: 2600 },
  { month: "Apr", profit: -3400 },
  { month: "May", profit: 5100 },
  { month: "Jun", profit: -900 },
  { month: "Jul", profit: 3800 },
  { month: "Aug", profit: 6200 },
];

/** Local preview for a plus/minus (profit / loss) bar chart. */
export function Particle() {
  return (
    <div className="w-full">
      <BarChart data={profitLossData} xDataKey="month">
        <Grid highlightRowValues={[0]} horizontal />
        <Bar dataKey="profit" lineCap={4} />
        <BarXAxis />
        <ChartTooltip />
      </BarChart>
    </div>
  );
}
