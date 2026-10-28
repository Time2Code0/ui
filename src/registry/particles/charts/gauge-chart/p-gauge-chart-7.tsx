"use client";

import { Gauge } from "@/registry/charts/gauge";

export function Particle() {
  return (
    <div className="w-full min-w-0 sm:mx-auto sm:max-w-md">
      <Gauge
        centerValue={12}
        className="min-w-0 [&>div]:aspect-[5/4] [&>div]:sm:aspect-[21/16]"
        defaultLabel="Active squads"
        endAngle={450}
        formatOptions={{ maximumFractionDigits: 0 }}
        inactiveFillOpacity={0.4}
        minWidth={0}
        spacing={60}
        startAngle={270}
        totalNotches={33}
        value={66}
      />
    </div>
  );
}
