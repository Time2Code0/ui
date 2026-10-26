"use client";

import { useState } from "react";

import { curveLinear } from "@visx/curve";

import {
  ChartTooltip,
  Grid,
  Line,
  LineChart,
  ProfitLossLegend,
  ProfitLossLegendHoverProvider,
  ProfitLossLine,
  profitLossColor,
  resolveProfitLossTooltipLabel,
  XAxis,
} from "../_charts";
import {
  PROFIT_LOSS_DATA_KEY,
  profitLossLineDocsData,
} from "../_data/profit-loss-line-docs-data";

export function ProfitLossLineDemo() {
  const [legendHoveredIndex, setLegendHoveredIndex] = useState<number | null>(
    null
  );

  return (
    <div className="flex w-full flex-col gap-2">
      <LineChart data={profitLossLineDocsData}>
        <Grid
          highlightRowStroke="var(--foreground)"
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
