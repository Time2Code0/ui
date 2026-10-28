"use client";

import type { Transition } from "motion/react";

import { createSplitContext } from "./split-context";

// CSS variable references for radar chart theming
export const radarCssVars = {
  // Default radar colors from chart palette
  area1: "var(--color-chart-1)",
  area2: "var(--color-chart-2)",
  area3: "var(--color-chart-3)",
  area4: "var(--color-chart-4)",
  area5: "var(--color-chart-5)",
  background: "var(--color-background)",
  border: "color-mix(in oklab, var(--color-foreground) 10%, transparent)",
  foreground: "var(--color-foreground)",
  foregroundMuted: "var(--color-foreground-muted)",
  grid: "color-mix(in oklab, var(--color-foreground) 10%, transparent)",
  label: "var(--color-foreground-muted)",
};

// Default radar color palette
export const defaultRadarColors = [
  radarCssVars.area1,
  radarCssVars.area2,
  radarCssVars.area3,
  radarCssVars.area4,
  radarCssVars.area5,
];

export interface RadarMetric {
  /** Unique key for the metric */
  key: string;
  /** Display label for the metric */
  label: string;
}

export interface RadarData {
  /** Color for this data series (defaults to chart-1 through chart-5) */
  color?: string;
  /** Display label for this data series */
  label: string;
  /** Metric values (key -> value, normalized 0-100) */
  values: Record<string, number>;
}

export interface RadarHoverContextValue {
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
}

export interface RadarStableContextValue {
  // Animation
  animate: boolean;
  // Data
  data: RadarData[];
  /** Total enter animation budget in ms */
  enterDurationMs: number;
  /** Motion enter transition (spring or cubic-bezier tween). */
  enterTransition?: Transition;
  getAngle: (metricIndex: number) => number;

  // Computed helpers
  getColor: (index: number) => string;
  getPointPosition: (
    metricIndex: number,
    value: number
  ) => { x: number; y: number };
  levels: number;
  metrics: RadarMetric[];
  /** Changes when motion settings change — replays enter animations. */
  motionReplayKey: string;
  radius: number;

  // Dimensions
  size: number;
  /** Scales stagger delays between grid / campaigns / metrics */
  staggerScale: number;
  yScale: (value: number) => number;
}

export type RadarContextValue = RadarStableContextValue &
  RadarHoverContextValue;

export const {
  Provider: RadarProvider,
  useHover: useRadarHover,
  useStable: useRadarStable,
} = createSplitContext<RadarStableContextValue, RadarHoverContextValue>({
  hoverKeys: {
    hoveredIndex: true,
    setHoveredIndex: true,
  },
  name: "Radar",
  wrappers: "<RadarChart>",
});

export function useRadar(): RadarContextValue {
  return { ...useRadarStable(), ...useRadarHover() };
}
