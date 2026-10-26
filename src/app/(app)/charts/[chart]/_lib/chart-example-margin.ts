"use client";

import type { Margin } from "../_charts";

/** Chart example margins — extra top room for 3D lids, tooltip dots, and markers. */
export const CHART_EXAMPLE_MARGIN_PX = {
  bottom: 40,
  side: 8,
  top: 20,
} as const;

export const chartExampleMarginSnippet =
  "margin={{ top: 20, right: 8, bottom: 40, left: 8 }}";

const chartExampleMargin: Margin = {
  bottom: CHART_EXAMPLE_MARGIN_PX.bottom,
  left: CHART_EXAMPLE_MARGIN_PX.side,
  right: CHART_EXAMPLE_MARGIN_PX.side,
  top: CHART_EXAMPLE_MARGIN_PX.top,
};

export function useChartExampleMargin(): Margin {
  return chartExampleMargin;
}
