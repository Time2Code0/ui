"use client";

import type { ChartStatFlowFormat } from "@/registry/charts/chart-center/chart-stat-flow";

import { Gauge } from "@/registry/charts/gauge-chart/gauge";

const gaugeGalleryUsdFormat: ChartStatFlowFormat = {
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
  style: "currency",
};

export function Particle() {
  return (
    <div className="flex w-full items-center px-4 py-6">
      <Gauge
        centerValue={428_000}
        defaultLabel="ARR run rate"
        formatOptions={gaugeGalleryUsdFormat}
        inactiveFillOpacity={0.4}
        labelAlign="center"
        labelPlacement="bottom"
        notchCornerRadius={3}
        orientation="linear"
        spacing={0}
        totalNotches={72}
        useGradient
        value={72}
      />
    </div>
  );
}
