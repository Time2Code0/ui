"use client";

import { PatternLines } from "@/registry/charts/chart-patterns/visx-pattern";
import { Gauge } from "@/registry/charts/gauge-chart/gauge";

export function Particle() {
  return (
    <div className="w-full min-w-0 sm:mx-auto sm:max-w-md">
      <Gauge
        activeFill="url(#gauge-gallery-ex3-fg)"
        centerValue={1840}
        className="min-w-0 [&>div]:aspect-[5/4] [&>div]:sm:aspect-[21/16]"
        defaultLabel="Trials converted (30d)"
        endAngle={400}
        formatOptions={{ maximumFractionDigits: 0 }}
        inactiveFill="var(--color-chart-1)"
        inactiveFillOpacity={0.4}
        minWidth={0}
        notchCornerRadius={7}
        spacing={0}
        startAngle={140}
        value={66}
      >
        <PatternLines
          height={6}
          id="gauge-gallery-ex3-fg"
          orientation={["diagonal"]}
          stroke="var(--color-chart-1)"
          strokeWidth={1}
          width={6}
        />
      </Gauge>
    </div>
  );
}
