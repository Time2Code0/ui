"use client";

import type { ReactNode } from "react";

import {
  chartCenterLabelClassName,
  chartCenterValueClassName,
} from "./chart-center-typography";
import {
  ChartCenterContent,
  type ChartStatFlowFormat,
  defaultChartStatFlowFormat,
} from "./chart-stat-flow";
import { useRingHover, useRingStable } from "./ring-context";

export interface RingCenterProps {
  /** Custom render function for complete control over center content */
  children?: (props: {
    value: number;
    label: string;
    isHovered: boolean;
    data: { label: string; value: number; maxValue: number; color?: string };
  }) => ReactNode;
  /** Additional class name for the container */
  className?: string;
  /** Label shown below the value. Default: "Total" when not hovering */
  defaultLabel?: string;
  /** Format options for NumberFlow. Default: standard notation */
  formatOptions?: ChartStatFlowFormat;
  /** Class name for the label text. Scales with center size via container queries. */
  labelClassName?: string;
  /** Prefix to show before the number (e.g., "$") */
  prefix?: string;
  /** Suffix to show after the number (e.g., "%") */
  suffix?: string;
  /** Class name for the value text. Scales with center size via container queries. */
  valueClassName?: string;
}

/**
 * RingCenter displays content in the center of the ring chart.
 *
 * This component renders as pure HTML (not inside SVG foreignObject) to avoid
 * Safari's WebKit bug #23113 where HTML content with CSS transforms/opacity
 * inside foreignObject renders at incorrect positions.
 *
 * The parent RingChart uses CSS Grid stacking to overlay this HTML content
 * on top of the SVG rings.
 */
export function RingCenter({
  defaultLabel = "Total",
  formatOptions = defaultChartStatFlowFormat,
  children,
  className = "",
  valueClassName = chartCenterValueClassName,
  labelClassName = chartCenterLabelClassName,
  prefix,
  suffix,
}: RingCenterProps) {
  const { data, totalValue, baseInnerRadius } = useRingStable();
  const { hoveredIndex } = useRingHover();

  const hoveredData = hoveredIndex === null ? null : data[hoveredIndex];
  const displayValue = hoveredData ? hoveredData.value : totalValue;
  const displayLabel = hoveredData ? hoveredData.label : defaultLabel;

  return (
    <ChartCenterContent
      className={className}
      formatOptions={formatOptions}
      label={displayLabel}
      labelClassName={labelClassName}
      prefix={prefix}
      renderCustom={
        children && hoveredData
          ? () =>
              children({
                data: hoveredData,
                isHovered: hoveredIndex !== null,
                label: displayLabel,
                value: displayValue,
              })
          : undefined
      }
      // Leave some padding so text doesn't touch the inner edge.
      size={baseInnerRadius * 2 - 16}
      suffix={suffix}
      value={displayValue}
      valueClassName={valueClassName}
    />
  );
}

RingCenter.displayName = "RingCenter";
