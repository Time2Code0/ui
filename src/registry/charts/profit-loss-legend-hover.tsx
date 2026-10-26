"use client";

import { createContext, type ReactNode, use } from "react";

interface ProfitLossLegendHoverContextValue {
  hoveredIndex: number | null;
}

const ProfitLossLegendHoverContext =
  createContext<ProfitLossLegendHoverContextValue | null>(null);

export function ProfitLossLegendHoverProvider({
  hoveredIndex,
  children,
}: {
  hoveredIndex: number | null;
  children: ReactNode;
}) {
  return (
    <ProfitLossLegendHoverContext.Provider value={{ hoveredIndex }}>
      {children}
    </ProfitLossLegendHoverContext.Provider>
  );
}

export function useProfitLossLegendHover(): ProfitLossLegendHoverContextValue {
  const context = use(ProfitLossLegendHoverContext);
  return context ?? { hoveredIndex: null };
}
