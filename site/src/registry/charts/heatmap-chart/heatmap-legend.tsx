"use client";

import { memo, useCallback } from "react";

import { cn } from "cn";
import { motion } from "motion/react";

import { renderPatternPreset } from "../chart-patterns/pattern-preset";
import { HEATMAP_INACTIVE_TRANSITION } from "./heatmap-animation";
import {
  defaultHeatmapColorScale,
  type HeatmapLevelStyle,
  type HeatmapLevelStyles,
  heatmapLevelPatternId,
  heatmapLevelPatternRenderOptions,
  isHeatmapLevelPattern,
} from "./heatmap-colors";
import { useHeatmapInteractionOptional } from "./heatmap-context";
import {
  buildHeatmapLegendGradient,
  getHeatmapContributionLevel,
  isHeatmapHoverEffectEnabled,
  resolveHeatmapHoverStyle,
} from "./heatmap-utils";

export const HEATMAP_LEGEND_LEVELS = [0, 1, 2, 3, 4] as const;

const HEATMAP_INACTIVE_OPACITY = 0.3;
/** Smooth tween for inactive opacity + scale on hover. */

export type HeatmapLegendVariant = "swatches" | "gradient";

export interface HeatmapLegendProps {
  /** Scale for the highlighted swatch while interacting. @default 1 */
  activeScale?: number;
  /** Horizontal alignment within the legend cell. @default "end" */
  align?: "start" | "center" | "end";
  /** Swatch size in pixels. @default 11 */
  cellSize?: number;
  /** Additional class name for the legend wrapper */
  className?: string;
  /** Override the default color scale (used when `levelStyles` is omitted). */
  colorScale?: (count: number | null | undefined) => string;
  /** Corner radius for swatches. @default 2 */
  cornerRadius?: number;
  /** Font size in pixels for side labels. */
  fontSize?: number;
  /** Gap between swatches. @default 2 */
  gap?: number;
  /** Gradient bar width in swatch units when `variant="gradient"`. @default 5 */
  gradientSpan?: number;
  /** Opacity for inactive swatches while interacting. @default 0.3 */
  inactiveOpacity?: number;
  /** Scale for inactive swatches while interacting. @default 1 */
  inactiveScale?: number;
  /** Sync dimming with chart hover. Defaults to `true` inside `HeatmapInteractionProvider`. */
  interactive?: boolean;
  /** Additional class name for less/more labels. */
  labelClassName?: string;
  /** Side label before the swatches. @default "Less" */
  lessLabel?: string;
  /** Shared level styles for cells and legend swatches. */
  levelStyles?: HeatmapLevelStyles;
  /** Side label after the swatches. @default "More" */
  moreLabel?: string;
  /** Legend layout — discrete swatches or a continuous gradient bar. @default "swatches" */
  variant?: HeatmapLegendVariant;
}

export const HeatmapLegend = memo(function HeatmapLegend({
  lessLabel = "Less",
  moreLabel = "More",
  cellSize = 11,
  gap = 2,
  cornerRadius = 2,
  align = "end",
  variant = "swatches",
  gradientSpan = 5,
  fontSize,
  labelClassName,
  levelStyles: levelStylesProp,
  colorScale = defaultHeatmapColorScale,
  inactiveOpacity = HEATMAP_INACTIVE_OPACITY,
  inactiveScale = 1,
  activeScale = 1,
  interactive,
  className,
}: HeatmapLegendProps) {
  const interaction = useHeatmapInteractionOptional();
  const isInteractive = interactive ?? interaction != null;
  const levelStyles =
    levelStylesProp ??
    (HEATMAP_LEGEND_LEVELS.map((level) => ({
      color: colorScale(level),
      fillMode: "solid" as const,
      pattern: "none" as const,
    })) as unknown as HeatmapLevelStyles);

  const {
    hoveredLegendLevel,
    tooltipData,
    setHoveredCell,
    setHoveredLegendLevel,
    setTooltipData,
  } = interaction ?? {
    hoveredLegendLevel: null,
    setHoveredCell: () => undefined,
    setHoveredLegendLevel: () => undefined,
    setTooltipData: () => undefined,
    tooltipData: null,
  };

  const highlightedLevel =
    hoveredLegendLevel ??
    (tooltipData ? getHeatmapContributionLevel(tooltipData.count) : null);
  const hoverParams = { activeScale, inactiveOpacity, inactiveScale };
  const inactiveEnabled = isHeatmapHoverEffectEnabled(hoverParams);
  const isDimming =
    isInteractive && highlightedLevel !== null && inactiveEnabled;

  const handleLegendEnter = useCallback(
    (level: number) => {
      if (!isInteractive) {
        return;
      }

      setHoveredLegendLevel(level);
      setHoveredCell(null);
      setTooltipData(null);
    },
    [isInteractive, setHoveredCell, setHoveredLegendLevel, setTooltipData]
  );

  const handleLegendLeave = useCallback(() => {
    if (!isInteractive) {
      return;
    }

    setHoveredLegendLevel(null);
  }, [isInteractive, setHoveredLegendLevel]);

  const labelStyle = fontSize == null ? undefined : { fontSize };

  return (
    <div
      className={cn(
        "flex w-full items-center gap-1.5 text-foreground-muted text-xs",
        align === "start" && "justify-start",
        align === "center" && "justify-center",
        align === "end" && "justify-end",
        className
      )}
      style={labelStyle}
    >
      <span className={labelClassName}>{lessLabel}</span>
      {variant === "gradient" ? (
        <HeatmapLegendGradient
          activeScale={activeScale}
          cellSize={cellSize}
          cornerRadius={cornerRadius}
          gap={gap}
          gradientSpan={gradientSpan}
          highlightedLevel={highlightedLevel}
          inactiveOpacity={inactiveOpacity}
          inactiveScale={inactiveScale}
          isDimming={isDimming}
          isInteractive={isInteractive}
          levelStyles={levelStyles}
          levels={HEATMAP_LEGEND_LEVELS}
          onEnter={handleLegendEnter}
          onLeave={handleLegendLeave}
        />
      ) : (
        <div className="flex items-center" style={{ gap }}>
          {HEATMAP_LEGEND_LEVELS.map((level) => {
            const isHighlighted = highlightedLevel === level;
            const isDimmed = isDimming && !isHighlighted;
            const hoverStyle = resolveHeatmapHoverStyle(
              isHighlighted,
              isDimmed,
              hoverParams
            );
            const style = levelStyles[level];

            return (
              <motion.span
                animate={{
                  opacity: hoverStyle.opacity,
                  scale: hoverStyle.scale,
                }}
                aria-hidden="true"
                className="block shrink-0 leading-none"
                initial={{ opacity: 1, scale: 1 }}
                key={level}
                onPointerEnter={() => handleLegendEnter(level)}
                onPointerLeave={handleLegendLeave}
                style={{
                  cursor: isInteractive ? "pointer" : undefined,
                }}
                transition={HEATMAP_INACTIVE_TRANSITION}
              >
                <HeatmapLegendSwatch
                  cellSize={cellSize}
                  cornerRadius={cornerRadius}
                  level={level}
                  style={style}
                />
              </motion.span>
            );
          })}
        </div>
      )}
      <span className={labelClassName}>{moreLabel}</span>
    </div>
  );
});

HeatmapLegend.displayName = "HeatmapLegend";

interface HeatmapLegendGradientProps {
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

const HeatmapLegendGradient = memo(function HeatmapLegendGradient({
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

const HeatmapLegendSwatch = memo(function HeatmapLegendSwatch({
  level,
  style,
  cellSize,
  cornerRadius,
}: {
  level: number;
  style: HeatmapLevelStyle;
  cellSize: number;
  cornerRadius: number;
}) {
  const shellStyle = {
    borderRadius: cornerRadius,
    height: cellSize,
    width: cellSize,
  };

  if (isHeatmapLevelPattern(style) && style.pattern) {
    const patternId = heatmapLevelPatternId(level);
    const patternNode = renderPatternPreset(
      style.pattern,
      patternId,
      heatmapLevelPatternRenderOptions(style)
    );
    const opacity = style.patternOpacity ?? 1;

    return (
      <span
        aria-hidden="true"
        className="block shrink-0 overflow-hidden"
        style={{ ...shellStyle, opacity }}
      >
        <svg
          aria-hidden="true"
          className="block size-full"
          viewBox={`0 0 ${cellSize} ${cellSize}`}
        >
          {patternNode ? <defs>{patternNode}</defs> : null}
          <rect
            fill={patternNode ? `url(#${patternId})` : style.color}
            height={cellSize}
            rx={cornerRadius}
            ry={cornerRadius}
            width={cellSize}
          />
        </svg>
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="block shrink-0"
      style={{
        ...shellStyle,
        backgroundColor: style.color,
        border: level === 0 ? `1px solid ${style.color}` : undefined,
        boxSizing: "border-box",
      }}
    />
  );
});

HeatmapLegendSwatch.displayName = "HeatmapLegendSwatch";
