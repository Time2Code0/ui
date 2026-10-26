"use client";

import type { Transition } from "motion/react";
import type { RefObject } from "react";
import type { ArcDatum, Focus, SunburstEnterTiming } from "./sunburst";
import type { SunburstNode } from "./sunburst-data";

import { createSplitContext } from "./split-context";

export const sunburstCssVars = {
  background: "var(--chart-background)",
  foreground: "var(--chart-foreground)",
  foregroundMuted: "var(--chart-foreground-muted)",
  label: "var(--chart-label)",
  ring: "var(--chart-background)",
  slice1: "var(--chart-1)",
  slice2: "var(--chart-2)",
  slice3: "var(--chart-3)",
  slice4: "var(--chart-4)",
  slice5: "var(--chart-5)",
};

export const defaultSunburstColors = [
  sunburstCssVars.slice1,
  sunburstCssVars.slice2,
  sunburstCssVars.slice3,
  sunburstCssVars.slice4,
  sunburstCssVars.slice5,
];

const OPACITY_STEP = 0.15;
const OPACITY_FLOOR = 0.45;

/** Relative depth within the current focus view (1 = innermost visible ring). */
export function opacityForRelativeDepth(relativeDepth: number): number {
  if (relativeDepth <= 1) {
    return 1;
  }
  return Math.max(OPACITY_FLOOR, 1 - (relativeDepth - 1) * OPACITY_STEP);
}

export interface SunburstHoverContextValue {
  hoveredArc: ArcDatum | null;
  hoveredArcIndex: number | null;
  setHoveredArc: (arc: ArcDatum | null) => void;
  setHoveredArcIndex: (index: number | null) => void;
}

export interface SunburstStableContextValue {
  arcs: ArcDatum[];

  containerRef: RefObject<HTMLDivElement | null>;
  data: SunburstNode;
  enterStaggerScale: number;
  enterTiming: SunburstEnterTiming;

  enterTransition?: Transition;

  focus: Focus;
  focusById: Map<string, Focus>;
  focusId: string;

  getColor: (categoryIndex: number, nodeColor?: string) => string;
  getFill: (
    arcIndex: number,
    fillOverride?: string,
    colorOverride?: string
  ) => string;
  getFillOpacity: (relativeDepth: number, override?: number) => number;
  growAmountForArc: (arcId: string) => number;
  hoverPop: number;
  isDescendant: (arc: ArcDatum, ancestorId: string) => boolean;

  isRelated: (arc: ArcDatum) => boolean;
  maxDepth: number;
  maxExpandedThickness: number;
  playKey: number;
  prevFocus: Focus;
  radius: number;
  rootId: string;
  size: number;
  skipEnterAnimation: boolean;

  zoomT: number;
  zoomTo: (nextId: string) => void;
}

export type SunburstContextValue = SunburstStableContextValue &
  SunburstHoverContextValue;

export const {
  Provider: SunburstProvider,
  useHover: useSunburstHover,
  useStable: useSunburstStable,
} = createSplitContext<SunburstStableContextValue, SunburstHoverContextValue>({
  hoverKeys: {
    hoveredArc: true,
    hoveredArcIndex: true,
    setHoveredArc: true,
    setHoveredArcIndex: true,
  },
  name: "Sunburst",
  wrappers: "<SunburstChart>",
});
