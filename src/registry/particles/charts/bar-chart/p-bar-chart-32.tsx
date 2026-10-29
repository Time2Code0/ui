"use client";

import { Bar } from "@/registry/charts/bar-chart/bar";
import { BarChart } from "@/registry/charts/bar-chart/bar-chart";
import { BarXAxis } from "@/registry/charts/bar-chart/bar-x-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import {
  Legend,
  LegendItem as LegendItemComponent,
  LegendLabel,
  LegendMarker,
} from "@/registry/charts/chart-legend/legend";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";

const stackedData = [
  { desktop: 4000, mobile: 2400, month: "Jan" },
  { desktop: 5000, mobile: 3000, month: "Feb" },
  { desktop: 3500, mobile: 2800, month: "Mar" },
  { desktop: 4200, mobile: 3200, month: "Apr" },
  { desktop: 3800, mobile: 2600, month: "May" },
  { desktop: 5500, mobile: 3800, month: "Jun" },
];

const stackedLegendItems = [
  { color: "hsl(217, 91%, 60%)", label: "Desktop", value: 0 },
  { color: "hsl(217, 91%, 75%)", label: "Mobile", value: 0 },
];

export function Particle() {
  return (
    <div className="w-full">
      <BarChart data={stackedData} stacked stackGap={3} xDataKey="month">
        <Grid horizontal />
        <Bar
          dataKey="desktop"
          fill="hsl(217, 91%, 60%)"
          lineCap={4}
          stackGap={3}
        />
        <Bar
          dataKey="mobile"
          fill="hsl(217, 91%, 75%)"
          lineCap={4}
          stackGap={3}
        />
        <BarXAxis />
        <ChartTooltip />
      </BarChart>
      <Legend
        className="flex-row justify-center gap-6"
        items={stackedLegendItems}
      >
        <LegendItemComponent className="flex items-center gap-2">
          <LegendMarker />
          <LegendLabel />
        </LegendItemComponent>
      </Legend>
    </div>
  );
}
