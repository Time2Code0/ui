"use client";

import type { ChartStatFlowFormat } from "@/registry/charts/chart-stat-flow";

import { Gauge } from "@/registry/charts/gauge";

const gaugeGalleryUsdFormat: ChartStatFlowFormat = {
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
  style: "currency",
};

export function Particle() {
  return (
    <div className="w-full min-w-0 sm:mx-auto sm:max-w-md">
      <Gauge
        activeGradient={["#a855f7", "#06b6d4"]}
        centerValue={428_000}
        className="min-w-0 [&>div]:aspect-[5/4] [&>div]:sm:aspect-[21/16]"
        defaultLabel="ARR run rate"
        endAngle={400}
        formatOptions={gaugeGalleryUsdFormat}
        inactiveFillOpacity={0.4}
        inactiveGradient={["#334155", "#38bdf8"]}
        minWidth={0}
        notchCornerRadius={7}
        spacing={0}
        startAngle={140}
        useGradient
        value={66}
      />
    </div>
  );
}
