"use client";

import { Gauge } from "@/registry/charts/gauge-chart/gauge";

export function Particle() {
  return (
    <div className="flex w-full items-center px-4 py-6">
      <Gauge
        inactiveFillOpacity={0.4}
        notchCornerRadius={3}
        notchLengthPercent={38}
        orientation="linear"
        spacing={0}
        totalNotches={72}
        useGradient
        value={72}
      />
    </div>
  );
}
