"use client";

import { Candlestick } from "@/registry/charts/candlestick";
import {
  CandlestickChart,
  type OHLCDataPoint,
} from "@/registry/charts/candlestick-chart";
import { ChartTooltip } from "@/registry/charts/tooltip/chart-tooltip";
import { XAxis } from "@/registry/charts/x-axis";

const chartData: OHLCDataPoint[] = [
  { close: 104, date: new Date(2024, 0, 1), high: 108, low: 96, open: 100 },
  { close: 109, date: new Date(2024, 0, 2), high: 112, low: 101, open: 104 },
  { close: 108, date: new Date(2024, 0, 3), high: 115, low: 105, open: 109 },
  { close: 110, date: new Date(2024, 0, 4), high: 114, low: 102, open: 108 },
  { close: 115, date: new Date(2024, 0, 5), high: 118, low: 108, open: 110 },
  { close: 113, date: new Date(2024, 0, 6), high: 120, low: 111, open: 115 },
  { close: 117, date: new Date(2024, 0, 7), high: 119, low: 110, open: 113 },
  { close: 121, date: new Date(2024, 0, 8), high: 124, low: 115, open: 117 },
  { close: 120, date: new Date(2024, 0, 9), high: 126, low: 118, open: 121 },
  { close: 125, date: new Date(2024, 0, 10), high: 128, low: 117, open: 120 },
];

function formatUsd(v: number) {
  return `$${v.toFixed(2)}`;
}

function CandlestickTooltipDemo({
  point,
}: {
  point: Record<string, unknown>;
  index: number;
}) {
  const date = point.date instanceof Date ? point.date : new Date();
  const open = (point.open as number) ?? 0;
  const high = (point.high as number) ?? 0;
  const low = (point.low as number) ?? 0;
  const close = (point.close as number) ?? 0;

  return (
    <div className="px-3 py-2.5">
      <div className="mb-1.5 font-medium text-foreground text-xs opacity-60">
        {date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-sm">
        <span className="text-foreground-muted">Open</span>
        <span className="text-foreground tabular-nums">{formatUsd(open)}</span>
        <span className="text-foreground-muted">High</span>
        <span className="text-success-foreground tabular-nums">
          {formatUsd(high)}
        </span>
        <span className="text-foreground-muted">Low</span>
        <span className="text-destructive-foreground tabular-nums">
          {formatUsd(low)}
        </span>
        <span className="text-foreground-muted">Close</span>
        <span className="text-foreground tabular-nums">{formatUsd(close)}</span>
      </div>
    </div>
  );
}

export function Particle() {
  return (
    <div className="w-full">
      <CandlestickChart
        data={chartData}
        margin={{ bottom: 40, left: 16, right: 16, top: 16 }}
        style={{ height: 320 }}
      >
        <Candlestick fadedOpacity={0.25} />
        <ChartTooltip content={CandlestickTooltipDemo} />
        <XAxis />
      </CandlestickChart>
    </div>
  );
}
