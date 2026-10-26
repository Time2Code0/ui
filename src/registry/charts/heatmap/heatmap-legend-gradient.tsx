"use client";

import type { HeatmapLevelStyles } from "./heatmap-colors";

import { memo } from "react";

import { motion } from "motion/react";

import {
  buildHeatmapLegendGradient,
  resolveHeatmapHoverStyle,
} from "./heatmap-utils";

const HEATMAP_INACTIVE_TRANSITION = {
  duration: 0.22,
  ease: [0.4, 0, 0.2, 1] as const,
};

export interface HeatmapLegendGradientProps {
  activeScale: number;
  cellSize: number;
  cornerRadius: number;
  gap: number;
  gradientSpan: number;
  highlightedLevel: number | null;
  inactiveOpacity: number;
  inactiveScale: number;
  isDimming: boolean;
  isInteractive: boolean;
  levelStyles: HeatmapLevelStyles;
  levels: readonly number[];
  onEnter: (level: number) => void;
  onLeave: () => void;
}

export const HeatmapLegendGradient = memo(function HeatmapLegendGradient({
  levels,
  levelStyles,
  cellSize,
  gap,
  cornerRadius,
  gradientSpan,
  highlightedLevel,
  isDimming,
  inactiveOpacity,
  inactiveScale,
  activeScale,
  isInteractive,
  onEnter,
  onLeave,
}: HeatmapLegendGradientProps) {
  const barWidth = gradientSpan * cellSize + (gradientSpan - 1) * gap;
  const barHeight = cellSize;
  const pillRadius = Math.min(cornerRadius, barHeight / 2);
  const segmentWidth = barWidth / levels.length;
  const gradient = buildHeatmapLegendGradient(levelStyles);

  return (
    <div
      className="relative shrink-0"
      style={{ height: barHeight, width: barWidth }}
    >
      <motion.div
        animate={{
          opacity: isDimming && highlightedLevel === null ? inactiveOpacity : 1,
          scale: 1,
        }}
        aria-hidden="true"
        className="absolute inset-0"
        initial={{ opacity: 1, scale: 1 }}
        style={{
          background: gradient,
          borderRadius: pillRadius,
        }}
        transition={HEATMAP_INACTIVE_TRANSITION}
      />
      {levels.map((level, index) => {
        const isHighlighted = highlightedLevel === level;
        const isDimmed = isDimming && !isHighlighted;
        const hoverStyle = resolveHeatmapHoverStyle(isHighlighted, isDimmed, {
          activeScale,
          inactiveOpacity,
          inactiveScale,
        });

        return (
          <motion.span
            animate={{
              opacity: hoverStyle.opacity,
              scale: hoverStyle.scale,
            }}
            className="absolute top-0 block"
            initial={{ opacity: 1, scale: 1 }}
            key={level}
            onPointerEnter={() => onEnter(level)}
            onPointerLeave={onLeave}
            style={{
              cursor: isInteractive ? "pointer" : undefined,
              height: barHeight,
              left: index * segmentWidth,
              transformOrigin: "center center",
              width: segmentWidth,
            }}
            transition={HEATMAP_INACTIVE_TRANSITION}
          />
        );
      })}
    </div>
  );
});

HeatmapLegendGradient.displayName = "HeatmapLegendGradient";
