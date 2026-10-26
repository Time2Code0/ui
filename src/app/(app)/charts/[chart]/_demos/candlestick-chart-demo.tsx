"use client";

import {
  Candlestick,
  CandlestickChart,
  ChartTooltip,
  type OHLCDataPoint,
  XAxis,
} from "../_charts";
import { CandlestickTooltipDemo } from "./candlestick-tooltip-demo";

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

export function CandlestickChartDemo() {
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
