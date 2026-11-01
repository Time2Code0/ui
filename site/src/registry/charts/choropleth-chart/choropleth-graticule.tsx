"use client";

import { memo } from "react";

import { geoGraticule } from "d3-geo";

import { useChoroplethStable } from "./choropleth-context";

export interface ChoroplethGraticuleProps {
  /** Step intervals for graticule lines [longitude, latitude] in degrees. @default [10, 10] */
  step?: [number, number];
  /** Stroke color for graticule lines. @default rgba(255,255,255,0.1) */
  stroke?: string;
  /** Stroke width for graticule lines. @default 0.5 */
  strokeWidth?: number;
}

function graticule(step?: [number, number]) {
  const generator = geoGraticule();
  return step ? generator.step(step) : generator;
}

export const ChoroplethGraticule = memo(function ChoroplethGraticule({
  stroke = "rgba(255,255,255,0.1)",
  strokeWidth = 0.5,
  step,
}: ChoroplethGraticuleProps) {
  const { rawPathGenerator } = useChoroplethStable();

  return (
    <path
      d={rawPathGenerator(graticule(step)()) ?? ""}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
});

ChoroplethGraticule.displayName = "ChoroplethGraticule";
