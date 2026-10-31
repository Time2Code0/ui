"use client";

import { useState } from "react";

import { curveLinear } from "@visx/curve";

import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { Line } from "@/registry/charts/line-chart/line";
import { LineChart } from "@/registry/charts/line-chart/line-chart";
import { ProfitLossLegend } from "@/registry/charts/line-chart/profit-loss-legend";
import {
  ProfitLossLegendHoverProvider,
  ProfitLossLine,
  profitLossColor,
  resolveProfitLossTooltipLabel,
} from "@/registry/charts/line-chart/profit-loss-line";

const PROFIT_LOSS_DATA_KEY = "pnl";

/** Sample profit/loss data that crosses zero several times. */
const profitLossLineDocsData = Array.from({ length: 24 }, (_, index) => {
  const pnl = Math.round(
    Math.sin(index / 2.5) * 800 + Math.cos(index / 6) * 400 + (index - 12) * 15
  );

  return {
    date: new Date(2024, 0, index + 1),
    [PROFIT_LOSS_DATA_KEY]: pnl,
  };
});

export function Particle() {
  const [legendHoveredIndex, setLegendHoveredIndex] = useState<number | null>(
    null
  );

  return (
    <div className="flex w-full flex-col gap-2">
      <LineChart data={profitLossLineDocsData}>
        <Grid
          highlightRowStroke="var(--color-foreground)"
          highlightRowStrokeOpacity={0.35}
          highlightRowValues={[0]}
          horizontal
        />
        <Line
          curve={curveLinear}
          dataKey={PROFIT_LOSS_DATA_KEY}
          fadeEdges={false}
          showHighlight={false}
          stroke="transparent"
          strokeWidth={0}
        />
        <ProfitLossLegendHoverProvider hoveredIndex={legendHoveredIndex}>
          <ProfitLossLine dataKey={PROFIT_LOSS_DATA_KEY} />
        </ProfitLossLegendHoverProvider>
        <XAxis />
        <ChartTooltip
          indicatorColor={(point) =>
            profitLossColor((point[PROFIT_LOSS_DATA_KEY] as number) ?? 0)
          }
          rows={(point) => {
            const value = (point[PROFIT_LOSS_DATA_KEY] as number) ?? 0;
            return [
              {
                color: profitLossColor(value),
                label: resolveProfitLossTooltipLabel(""),
                value,
              },
            ];
          }}
        />
      </LineChart>
      <ProfitLossLegend
        align="center"
        hoveredIndex={legendHoveredIndex}
        onHoverChange={setLegendHoveredIndex}
      />
    </div>
  );
}
