"use client";

import { Candlestick } from "@/registry/charts/candlestick-chart/candlestick";
import {
  CandlestickChart,
  type OHLCDataPoint,
} from "@/registry/charts/candlestick-chart/candlestick-chart";
import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Background } from "@/registry/charts/chart-background/background";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";

// Candlestick OHLC data (~30 days)
const candlestickOhlcData: OHLCDataPoint[] = (() => {
  const points: OHLCDataPoint[] = [];
  const days = 30;
  let open = 100;
  const base = new Date(2024, 0, 1).getTime();
  for (let i = 0; i < days; i++) {
    const date = new Date(base + i * 24 * 60 * 60 * 1000);
    const volatility = 1.5 + Math.random() * 1.5;
    const drift = (Math.random() - 0.48) * volatility;
    const high = open + Math.abs(drift) * (1.5 + Math.random());
    const low = open - Math.abs(drift) * (1.5 + Math.random());
    const close = low + Math.random() * (high - low);
    points.push({ close, date, high, low, open });
    open = close;
  }
  return points;
})();

function CandlestickTooltipContent({
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
  const fmt = (v: number) => `$${v.toFixed(2)}`;
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
        <span className="text-foreground tabular-nums">{fmt(open)}</span>
        <span className="text-foreground-muted">High</span>
        <span className="text-success-foreground tabular-nums">
          {fmt(high)}
        </span>
        <span className="text-foreground-muted">Low</span>
        <span className="text-destructive-foreground tabular-nums">
          {fmt(low)}
        </span>
        <span className="text-foreground-muted">Close</span>
        <span className="text-foreground tabular-nums">{fmt(close)}</span>
      </div>
    </div>
  );
}

export function Particle() {
  return (
    <CandlestickChart
      data={candlestickOhlcData}
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
      style={{ height: 320 }}
    >
      <Background />
      <Candlestick fadedOpacity={0.25} />
      <ChartTooltip content={CandlestickTooltipContent} />
      <XAxis />
    </CandlestickChart>
  );
}
