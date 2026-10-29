"use client";

import { Gauge } from "@/registry/charts/gauge-chart/gauge";

export function Particle() {
  return (
    <div className="mx-auto w-full min-w-[300px] max-w-lg py-4">
      <Gauge
        centerValue={428_000}
        defaultLabel="ARR run rate"
        formatOptions={{
          currency: "USD",
          maximumFractionDigits: 0,
          style: "currency",
        }}
        inactiveFillOpacity={0.4}
        spacing={25}
        value={66}
      />
    </div>
  );
}
