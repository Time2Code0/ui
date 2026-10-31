"use client";

import { Area } from "@/registry/charts/area-chart/area";
import { AreaChart } from "@/registry/charts/area-chart/area-chart";
import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { ChartBrush } from "@/registry/charts/chart-brush/chart-brush";
import { ChartBrushLayout } from "@/registry/charts/chart-brush/chart-brush-layout";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";

const DATA_KEY = "value";

const brushData = Array.from({ length: 30 }, (_, index) => {
  const date = new Date("2025-01-01");
  date.setDate(date.getDate() + index);
  return {
    date,
    [DATA_KEY]: Math.round(420 + Math.sin(index * 0.7) * 90 + index * 14),
  };
});

const brushStripMargin = { bottom: 4, left: 40, right: 40, top: 4 };

export function Particle() {
  return (
    <div className="w-full" style={{ height: 360 }}>
      <ChartBrushLayout
        brushStrip={(brushLayout) => (
          <AreaChart
            animationDuration={0}
            className="size-full"
            data={brushData}
            margin={brushStripMargin}
            status="ready"
            style={{ aspectRatio: "unset", height: "100%" }}
          >
            <Area
              animate={false}
              dataKey={DATA_KEY}
              fadeEdges
              fill="var(--color-chart-1)"
              fillOpacity={0.15}
              showHighlight={false}
              strokeWidth={2}
            />
            <ChartBrush
              fadeOuterEdges
              initialSelection={brushLayout.brushSelection ?? undefined}
              onSelectionChange={brushLayout.onBrushSelectionChange}
              selectionPattern={{
                color:
                  "color-mix(in oklch, var(--color-chart-1) 20%, transparent)",
                preset: "diagonal",
              }}
            />
          </AreaChart>
        )}
        data={brushData}
        enabled
        height={72}
      >
        {(brushLayout) => (
          <AreaChart
            className="size-full"
            data={brushData}
            style={{ aspectRatio: "unset", height: "100%" }}
            tweenYDomainOnXDomainChange
            xDomain={brushLayout.xDomain}
            xDomainSlotCount={brushLayout.xDomainSlotCount}
            yDomainTween
          >
            <Grid
              horizontal
              stroke="color-mix(in oklab, var(--color-foreground) 10%, transparent)"
            />
            <Area
              dataKey={DATA_KEY}
              fadeEdges
              fill="var(--color-chart-1)"
              fillOpacity={0.35}
              strokeWidth={2}
            />
            <XAxis />
            <ChartTooltip />
          </AreaChart>
        )}
      </ChartBrushLayout>
    </div>
  );
}
