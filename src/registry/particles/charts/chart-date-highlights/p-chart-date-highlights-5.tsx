"use client";

import { ChartBrush } from "@/registry/charts/chart-brush";
import { ChartBrushLayout } from "@/registry/charts/chart-brush-layout";
import { Deadline } from "@/registry/charts/deadline";
import { Grid } from "@/registry/charts/grid";
import { Line } from "@/registry/charts/line";
import { LineChart } from "@/registry/charts/line-chart";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";
import { Weekends } from "@/registry/charts/weekends";
import { XAxis } from "@/registry/charts/x-axis";

const longRangeData = Array.from({ length: 120 }, (_, index) => ({
  date: new Date(2026, 6, 1 + index),
  value: Math.round(320 + Math.sin(index / 6) * 60 + index * 2.4),
}));

const brushStripMargin = { bottom: 4, left: 40, right: 40, top: 4 };

const LONG_RANGE_DUE_DATE = new Date(2026, 9, 1);

export function Particle() {
  return (
    <div className="w-full" style={{ height: 360 }}>
      <ChartBrushLayout
        brushStrip={(brushLayout) => (
          <LineChart
            animationDuration={0}
            className="size-full"
            data={longRangeData}
            margin={brushStripMargin}
            status="ready"
            style={{ aspectRatio: "unset", height: "100%" }}
          >
            <Deadline date={LONG_RANGE_DUE_DATE} />
            <Line
              animate={false}
              dataKey="value"
              showHighlight={false}
              stroke="var(--color-chart-1)"
              strokeWidth={2}
            />
            <ChartBrush
              initialSelection={brushLayout.brushSelection ?? undefined}
              onSelectionChange={brushLayout.onBrushSelectionChange}
            />
          </LineChart>
        )}
        data={longRangeData}
        enabled
        height={72}
      >
        {(brushLayout) => (
          <LineChart
            className="size-full"
            data={longRangeData}
            style={{ aspectRatio: "unset", height: "100%" }}
            tweenYDomainOnXDomainChange
            xDomain={brushLayout.xDomain}
            xDomainSlotCount={brushLayout.xDomainSlotCount}
            yDomainTween
          >
            <Grid horizontal />
            <Weekends />
            <Deadline date={LONG_RANGE_DUE_DATE} label="Launch" />
            <Line
              dataKey="value"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
            />
            <XAxis />
            <ChartTooltip />
          </LineChart>
        )}
      </ChartBrushLayout>
    </div>
  );
}
