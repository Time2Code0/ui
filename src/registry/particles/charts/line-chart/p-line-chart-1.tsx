"use client";

import { useMemo, useState } from "react";

import { curveCatmullRom } from "@visx/curve";

import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Background } from "@/registry/charts/chart-background/background";
import { ChartBrush } from "@/registry/charts/chart-brush/chart-brush";
import { ChartBrushLayout } from "@/registry/charts/chart-brush/chart-brush-layout";
import { ChartLegendHoverProvider } from "@/registry/charts/chart-core/legend-hover";
import { ChartLegend } from "@/registry/charts/chart-legend/chart-legend";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { Line } from "@/registry/charts/line-chart/line";
import { LineChart } from "@/registry/charts/line-chart/line-chart";

const trioData = Array.from({ length: 30 }, (_, index) => {
  const date = new Date(2025, 0, 1 + index);
  return {
    date,
    desktop: Math.round(180 + Math.sin(index / 4.2) * 70 + ((index * 9) % 31)),
    mobile: Math.round(120 + Math.cos(index / 3.8) * 55 + ((index * 5) % 23)),
    tablet: Math.round(
      150 + Math.sin(index / 5.1 + 1) * 48 + ((index * 7) % 19)
    ),
  };
});

const TRIO_KEYS = ["desktop", "mobile", "tablet"] as const;

/** Palette tokens so the trio follows the selected chart theme. */
const TRIO_STROKES = {
  desktop: "var(--color-chart-1)",
  mobile: "var(--color-chart-2)",
  tablet: "var(--color-chart-3)",
} as const;

const brushStripMargin = { bottom: 4, left: 8, right: 8, top: 4 };

const chartMargin = { bottom: 40, left: 8, right: 8, top: 8 };

function LineChartStudioTrioDemo({ height = 360 }: { height?: number }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const legendItems = useMemo(() => {
    const last = trioData.at(-1);
    if (!last) {
      return [];
    }
    return TRIO_KEYS.map((key) => ({
      color: TRIO_STROKES[key],
      label: key,
      value: last[key],
    }));
  }, []);

  return (
    <ChartLegendHoverProvider
      hoveredIndex={hoveredIndex}
      onHoverChange={setHoveredIndex}
    >
      <div className="flex w-full flex-col gap-2" style={{ height }}>
        <div className="flex justify-end px-2">
          <ChartLegend
            className="w-full flex-row flex-wrap gap-x-4 gap-y-2"
            hoveredIndex={hoveredIndex}
            itemClassName="w-auto shrink-0"
            items={legendItems}
            labelClassName="font-medium text-xs tabular-nums"
            onHover={setHoveredIndex}
            showValue={false}
          />
        </div>
        <ChartBrushLayout
          brushStrip={(brushLayout) => (
            <LineChart
              animationDuration={0}
              className="size-full"
              data={trioData}
              margin={brushStripMargin}
              status="ready"
              style={{ aspectRatio: "unset", height: "100%" }}
            >
              {TRIO_KEYS.map((key) => (
                <Line
                  animate={false}
                  curve={curveCatmullRom}
                  dataKey={key}
                  fadeEdges
                  key={`brush-${key}`}
                  showHighlight={false}
                  stroke={TRIO_STROKES[key]}
                  strokeWidth={2}
                />
              ))}
              <ChartBrush
                initialSelection={brushLayout.brushSelection ?? undefined}
                onSelectionChange={brushLayout.onBrushSelectionChange}
              />
            </LineChart>
          )}
          data={trioData}
          enabled
          height={72}
        >
          {(brushLayout) => (
            <LineChart
              className="size-full"
              data={trioData}
              margin={chartMargin}
              style={{ aspectRatio: "unset", height: "100%" }}
              tweenYDomainOnXDomainChange
              xDomain={brushLayout.xDomain}
              xDomainSlotCount={brushLayout.xDomainSlotCount}
              yDomainTween
            >
              <Background opacity={0.85} pattern="dots" />
              {TRIO_KEYS.map((key) => (
                <Line
                  curve={curveCatmullRom}
                  dataKey={key}
                  fadeEdges
                  key={key}
                  showHighlight
                  stroke={TRIO_STROKES[key]}
                  strokeWidth={2}
                />
              ))}
              <XAxis />
              <ChartTooltip />
            </LineChart>
          )}
        </ChartBrushLayout>
      </div>
    </ChartLegendHoverProvider>
  );
}

export function Particle() {
  return <LineChartStudioTrioDemo height={540} />;
}
