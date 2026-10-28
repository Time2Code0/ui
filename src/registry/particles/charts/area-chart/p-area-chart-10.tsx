"use client";

import { AreaChartLoading } from "@/registry/charts/area-chart-loading";

export function Particle() {
  return (
    <AreaChartLoading
      loadingStyle="sweep"
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
    />
  );
}
