"use client";

import type { Transition } from "motion/react";
import type { ArcDatum, Focus, SunburstEnterTiming } from "./sunburst";
import type { SunburstNode } from "./sunburst-data";

import {
  createContext,
  type ReactNode,
  type RefObject,
  useContext,
  useMemo,
} from "react";

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

const SunburstStableContext = createContext<SunburstStableContextValue | null>(
  null
);
const SunburstHoverContext = createContext<SunburstHoverContextValue | null>(
  null
);

export function SunburstProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: SunburstContextValue;
}) {
  const stable = useMemo<SunburstStableContextValue>(
    () => ({
      arcs: value.arcs,
      containerRef: value.containerRef,
      data: value.data,
      enterStaggerScale: value.enterStaggerScale,
      enterTiming: value.enterTiming,
      enterTransition: value.enterTransition,
      focus: value.focus,
      focusById: value.focusById,
      focusId: value.focusId,
      getColor: value.getColor,
      getFill: value.getFill,
      getFillOpacity: value.getFillOpacity,
      growAmountForArc: value.growAmountForArc,
      hoverPop: value.hoverPop,
      isDescendant: value.isDescendant,
      isRelated: value.isRelated,
      maxDepth: value.maxDepth,
      maxExpandedThickness: value.maxExpandedThickness,
      playKey: value.playKey,
      prevFocus: value.prevFocus,
      radius: value.radius,
      rootId: value.rootId,
      size: value.size,
      skipEnterAnimation: value.skipEnterAnimation,
      zoomT: value.zoomT,
      zoomTo: value.zoomTo,
    }),
    [
      value.data,
      value.arcs,
      value.focusById,
      value.rootId,
      value.maxDepth,
      value.radius,
      value.size,
      value.focus,
      value.prevFocus,
      value.focusId,
      value.zoomTo,
      value.zoomT,
      value.enterTiming,
      value.skipEnterAnimation,
      value.growAmountForArc,
      value.getColor,
      value.getFill,
      value.getFillOpacity,
      value.isRelated,
      value.isDescendant,
      value.enterTransition,
      value.enterStaggerScale,
      value.playKey,
      value.hoverPop,
      value.maxExpandedThickness,
      value.containerRef,
    ]
  );

  const hover = useMemo<SunburstHoverContextValue>(
    () => ({
      hoveredArc: value.hoveredArc,
      hoveredArcIndex: value.hoveredArcIndex,
      setHoveredArc: value.setHoveredArc,
      setHoveredArcIndex: value.setHoveredArcIndex,
    }),
    [
      value.hoveredArcIndex,
      value.setHoveredArcIndex,
      value.hoveredArc,
      value.setHoveredArc,
    ]
  );

  return (
    <SunburstStableContext.Provider value={stable}>
      <SunburstHoverContext.Provider value={hover}>
        {children}
      </SunburstHoverContext.Provider>
    </SunburstStableContext.Provider>
  );
}

export function useSunburstStable() {
  const ctx = useContext(SunburstStableContext);
  if (!ctx) {
    throw new Error("useSunburstStable must be used within SunburstChart");
  }
  return ctx;
}

export function useSunburstHover() {
  const ctx = useContext(SunburstHoverContext);
  if (!ctx) {
    throw new Error("useSunburstHover must be used within SunburstChart");
  }
  return ctx;
}
