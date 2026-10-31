"use client";

import { withBollingerBands } from "@/registry/charts/candlestick-chart/bollinger";
import { XAxis } from "@/registry/charts/chart-axis/x-axis";
import { Band } from "@/registry/charts/chart-band/band";
import { Grid } from "@/registry/charts/chart-grid/grid";
import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { Line } from "@/registry/charts/line-chart/line";
import { LineChart } from "@/registry/charts/line-chart/line-chart";

const BOLLINGER_DEMO_POINT_COUNT = 60;

function priceDemoValue(index: number): number {
  const trend = 1.6 * index;
  const swell = Math.sin(index / 6.5) * 26;
  const chop = Math.sin(index / 1.3) * 9 + Math.cos(index / 0.71) * 6;
  const shock = index > 34 && index < 44 ? Math.sin((index - 34) / 3) * 18 : 0;
  return Math.round(120 + trend + swell + chop + shock);
}

const priceData = Array.from(
  { length: BOLLINGER_DEMO_POINT_COUNT },
  (_, i) => ({
    date: new Date(2024, 0, i + 1),
    price: priceDemoValue(i),
  })
);

const BOLLINGER_DEMO_PERIOD = 10;

/** Adds priceUpper / priceLower / priceSma (null during the warm-up window). */
const bollingerData = withBollingerBands(priceData, {
  dataKey: "price",
  multiplier: 2,
  period: BOLLINGER_DEMO_PERIOD,
});

export function Particle() {
  return (
    <div className="w-full">
      <LineChart data={bollingerData}>
        <Grid horizontal />
        <Band
          fill="var(--color-chart-1)"
          fillOpacity={0.12}
          label="Bollinger"
          lowerKey="priceLower"
          strokeOpacity={0.5}
          upperKey="priceUpper"
        />
        {/* SMA: a zero-height band so the warm-up nulls render as a gap */}
        <Band
          fill="var(--color-chart-1)"
          fillOpacity={0}
          label="SMA"
          lowerKey="priceSma"
          lowerStroke={false}
          stroke="var(--color-chart-1)"
          strokeDasharray="4,4"
          strokeOpacity={0.8}
          upperKey="priceSma"
        />
        <Line dataKey="price" stroke="var(--color-chart-1)" strokeWidth={2} />
        <XAxis />
        <ChartTooltip />
      </LineChart>
    </div>
  );
}
