"use client";

import { LineChartLoading } from "@/registry/charts/line-chart-loading";

export function Particle() {
  return (
    <LineChartLoading
      loadingStyle="sweep"
      margin={{ bottom: 40, left: 8, right: 8, top: 20 }}
    />
  );
}
