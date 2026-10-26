"use client";

import type { scaleLinear, scaleTime } from "@visx/scale";
import type { Transition } from "motion/react";
import type { Margin } from "../chart-context";
import type { ChartPhase, ChartStatus } from "../chart-phase";
import type { HeatmapLevelStyles } from "./heatmap-colors";
import type {
  HeatmapSeparatorLayout,
  HeatmapWeekStartDay,
} from "./heatmap-utils";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { cn } from "cn";

type HeatmapTimeScale = ReturnType<typeof scaleTime<number>>;
type HeatmapLinearScale = ReturnType<typeof scaleLinear<number>>;

export interface HeatmapBin {
  bin: number;
  count: number;
  date: Date;
}

export interface HeatmapColumn {
  bin: number;
  bins: HeatmapBin[];
}

export interface HeatmapTooltipData {
  column: number;
  count: number;
  date: Date;
  row: number;
  x: number;
  y: number;
}

export interface HeatmapInteractionContextValue {
  clearInteraction: () => void;
  hoveredCell: { column: number; row: number } | null;
  hoveredLegendLevel: number | null;
  setHoveredCell: (cell: { column: number; row: number } | null) => void;
  setHoveredLegendLevel: (level: number | null) => void;
  setTooltipData: Dispatch<SetStateAction<HeatmapTooltipData | null>>;
  tooltipData: HeatmapTooltipData | null;
}

export interface HeatmapContextValue {
  animateCells: boolean;
  animationDuration: number;
  binHeight: number;
  binWidth: number;
  brushYScale: HeatmapLinearScale;
  chartPhase: ChartPhase;
  chartStatus: ChartStatus;
  colorScale: (count: number | null | undefined) => string;
  containerRef: RefObject<HTMLDivElement | null>;
  data: HeatmapColumn[];
  enterStaggerScale: number;
  enterTransition?: Transition;
  fillScale: (count: number | null | undefined) => string;
  gap: number;
  height: number;
  innerHeight: number;
  innerWidth: number;
  isLoaded: boolean;
  isReady: boolean;
  levelStyles: HeatmapLevelStyles;
  loadingCellMaxOpacity: number;
  loadingCellRandomness: number;
  loadingLabel?: string;
  loadingOpacity: number;
  margin: Margin;
  revealEpoch: number;
  revealMode: HeatmapRevealMode;
  separatorLayout: HeatmapSeparatorLayout | null;
  showLoadingCells: boolean;
  showLoadingLabel: boolean;
  timeXScale: HeatmapTimeScale;
  weekStartDay: HeatmapWeekStartDay;
  width: number;
  xScale: (columnIndex: number) => number;
  yScale: (rowIndex: number) => number;
}

/** How cells transition into view after loading or on first mount. */
export type HeatmapRevealMode = "enter" | "fromLoading" | null;

const HeatmapContext = createContext<HeatmapContextValue | null>(null);
const HeatmapInteractionContext =
  createContext<HeatmapInteractionContextValue | null>(null);

export function HeatmapInteractionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [hoveredCell, setHoveredCell] = useState<{
    column: number;
    row: number;
  } | null>(null);
  const [hoveredLegendLevel, setHoveredLegendLevel] = useState<number | null>(
    null
  );
  const [tooltipData, setTooltipData] = useState<HeatmapTooltipData | null>(
    null
  );

  const clearInteraction = useCallback(() => {
    setHoveredCell(null);
    setHoveredLegendLevel(null);
    setTooltipData(null);
  }, []);

  const value = useMemo<HeatmapInteractionContextValue>(
    () => ({
      clearInteraction,
      hoveredCell,
      hoveredLegendLevel,
      setHoveredCell,
      setHoveredLegendLevel,
      setTooltipData,
      tooltipData,
    }),
    [clearInteraction, hoveredCell, hoveredLegendLevel, tooltipData]
  );

  return (
    <HeatmapInteractionContext.Provider value={value}>
      {children}
    </HeatmapInteractionContext.Provider>
  );
}

export function HeatmapProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: HeatmapContextValue;
}) {
  return (
    <HeatmapContext.Provider value={value}>{children}</HeatmapContext.Provider>
  );
}

export function useHeatmap(): HeatmapContextValue {
  const context = useContext(HeatmapContext);
  if (!context) {
    throw new Error("useHeatmap must be used within a HeatmapProvider");
  }
  return context;
}

export function useHeatmapInteraction(): HeatmapInteractionContextValue {
  const context = useContext(HeatmapInteractionContext);
  if (!context) {
    throw new Error(
      "useHeatmapInteraction must be used within a HeatmapInteractionProvider"
    );
  }
  return context;
}

export function useHeatmapInteractionOptional(): HeatmapInteractionContextValue | null {
  return useContext(HeatmapInteractionContext);
}

/** Clears hover state when the pointer leaves chart + legend. */
export function HeatmapInteractionBoundary({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { clearInteraction } = useHeatmapInteraction();

  return (
    <div
      className={cn("size-full min-h-0 min-w-0", className)}
      onPointerLeave={clearInteraction}
    >
      {children}
    </div>
  );
}

/** Nests a provider only when one is not already present upstream. */
export function HeatmapInteractionRoot({ children }: { children: ReactNode }) {
  const existing = useContext(HeatmapInteractionContext);
  if (existing) {
    return children;
  }
  return <HeatmapInteractionProvider>{children}</HeatmapInteractionProvider>;
}
