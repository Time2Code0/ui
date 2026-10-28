"use client";

import type { Transition } from "motion/react";
import type { RefObject } from "react";

import { createSplitContext } from "./split-context";

// CSS variable references for ring chart theming
export const ringCssVars = {
  background: "var(--color-background)",
  foreground: "var(--color-foreground)",
  foregroundMuted: "var(--color-foreground-muted)",
  label: "var(--color-foreground-muted)",
  // Default ring colors from chart palette
  ring1: "var(--color-chart-1)",
  ring2: "var(--color-chart-2)",
  ring3: "var(--color-chart-3)",
  ring4: "var(--color-chart-4)",
  ring5: "var(--color-chart-5)",
  ringBackground:
    "color-mix(in oklab, var(--color-foreground) 10%, transparent)",
};

// Default ring color palette
export const defaultRingColors = [
  ringCssVars.ring1,
  ringCssVars.ring2,
  ringCssVars.ring3,
  ringCssVars.ring4,
  ringCssVars.ring5,
];

export interface RingData {
  /** Optional color override - falls back to palette */
  color?: string;
  /** Display label for the ring */
  label: string;
  /** Maximum value (determines progress percentage) */
  maxValue: number;
  /** Current value */
  value: number;
}

/**
 * Stable pointer hit area for ring `index`.
 *
 * The visible ring scales on hover, so using it as the hit target creates a
 * feedback loop at its edges (hover → grow → pointer leaves → shrink → hover).
 * The hit band is static and extends half the ring gap on each side, so
 * neighbouring bands share an edge: no overlap and no dead gap between rings.
 */
export function getRingHitRadii(
  index: number,
  baseInnerRadius: number,
  strokeWidth: number,
  ringGap: number
): { innerRadius: number; outerRadius: number } {
  const halfGap = Math.max(0, ringGap) / 2;
  const bandInner = baseInnerRadius + index * (strokeWidth + ringGap);
  return {
    innerRadius: Math.max(0, bandInner - halfGap),
    outerRadius: bandInner + strokeWidth + halfGap,
  };
}

export interface RingHoverContextValue {
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
}

export interface RingStableContextValue {
  // Animation state
  animationKey: number;
  baseInnerRadius: number;
  center: number;

  // Container ref for portals
  containerRef: RefObject<HTMLDivElement | null>;
  // Data
  data: RingData[];
  endAngle: number;
  enterStaggerScale: number;
  enterTransition?: Transition;

  /**
   * Studio geometry scrub — skip Motion path morphing and use plain SVG paths.
   * @default false
   */
  geometryScrubbing: boolean;

  // Get color for a ring index
  getColor: (index: number) => string;

  // Get ring radii for an index
  getRingRadii: (index: number) => { innerRadius: number; outerRadius: number };
  isLoaded: boolean;
  ringGap: number;

  // Dimensions
  size: number;

  // Arc angle range
  startAngle: number;
  strokeWidth: number;

  // Computed values
  totalValue: number;
}

export type RingContextValue = RingStableContextValue & RingHoverContextValue;

export const {
  Provider: RingProvider,
  useHover: useRingHover,
  useStable: useRingStable,
} = createSplitContext<RingStableContextValue, RingHoverContextValue>({
  hoverKeys: {
    hoveredIndex: true,
    setHoveredIndex: true,
  },
  name: "Ring",
  wrappers: "<RingChart>",
});

export function useRing(): RingContextValue {
  return { ...useRingStable(), ...useRingHover() };
}
