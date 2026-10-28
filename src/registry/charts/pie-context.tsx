"use client";

import type { Transition } from "motion/react";
import type { RefObject } from "react";

import { createSplitContext } from "./split-context";

// CSS variable references for pie chart theming
export const pieCssVars = {
  background: "var(--color-background)",
  foreground: "var(--color-foreground)",
  foregroundMuted: "var(--color-foreground-muted)",
  label: "var(--color-foreground-muted)",
  // Default slice colors from chart palette
  slice1: "var(--color-chart-1)",
  slice2: "var(--color-chart-2)",
  slice3: "var(--color-chart-3)",
  slice4: "var(--color-chart-4)",
  slice5: "var(--color-chart-5)",
};

// Default slice color palette
export const defaultPieColors = [
  pieCssVars.slice1,
  pieCssVars.slice2,
  pieCssVars.slice3,
  pieCssVars.slice4,
  pieCssVars.slice5,
];

export interface PieData {
  /** Optional color override - falls back to palette */
  color?: string;
  /** Optional fill override for patterns/gradients (e.g., "url(#patternId)") */
  fill?: string;
  /** Display label for the slice */
  label: string;
  /** Value for the slice (determines slice size relative to total) */
  value: number;
}

/** Arc data computed by visx Pie */
export interface PieArcData {
  data: PieData;
  endAngle: number;
  index: number;
  padAngle: number;
  startAngle: number;
  value: number;
}

export interface PieHoverContextValue {
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
}

export interface PieStableContextValue {
  // Animation state
  animationKey: number;
  arcs: PieArcData[];
  center: number;

  // Container ref for portals
  containerRef: RefObject<HTMLDivElement | null>;
  cornerRadius: number;
  // Data
  data: PieData[];
  enterStaggerScale: number;
  enterTransition?: Transition;

  /**
   * Studio geometry scrub — skip Motion path morphing and use plain SVG paths.
   * @default false
   */
  geometryScrubbing: boolean;

  // Get color for a slice index
  getColor: (index: number) => string;

  // Get fill for a slice index (supports patterns/gradients)
  getFill: (index: number) => string;

  // Hover effect
  hoverOffset: number;
  innerRadius: number;
  isLoaded: boolean;
  outerRadius: number;
  padAngle: number;

  /** Precomputed slice paths during geometry scrub (one per arc). */
  scrubSlicePaths: readonly string[] | null;

  // Dimensions
  size: number;

  // Computed values
  totalValue: number;
}

export type PieContextValue = PieStableContextValue & PieHoverContextValue;

export const {
  Provider: PieProvider,
  useHover: usePieHover,
  useStable: usePieStable,
} = createSplitContext<PieStableContextValue, PieHoverContextValue>({
  hoverKeys: {
    hoveredIndex: true,
    setHoveredIndex: true,
  },
  name: "Pie",
  wrappers: "<PieChart>",
});

export function usePie(): PieContextValue {
  return { ...usePieStable(), ...usePieHover() };
}
