"use client";

import { motion, useSpring, useTransform } from "motion/react";

import { type SpringConfig, useChartConfig } from "../chart-config-context";
import { chartCssVars } from "../chart-context";

export interface TooltipDotProps {
  /** Animate position with a spring. @default true */
  animate?: boolean;
  color: string;
  /**
   * Ring corner radius as a fraction of side length (0 = square, 0.5 = circle).
   * Same semantics as bar square radius.
   */
  cornerRadiusFraction?: number;
  /** `dot` variant: halo opacity (0–1). @default 0.3 */
  haloOpacity?: number;
  /**
   * `dot` variant: halo radius as a multiple of `size`. The halo is a soft disc
   * in the series color behind the core. `0` hides it.
   * @default 2.6
   */
  haloScale?: number;
  /** Core dot radius; half-extent for ring squares. @default 5 */
  size?: number;
  /** Per-chart override; falls back to `ChartConfigProvider.tooltipSpring`. */
  springConfig?: SpringConfig;
  /** Outline color for the `dot` variant. @default var(--color-background) */
  strokeColor?: string;
  /**
   * `dot`: outline width around the core (default `0`, no outline).
   * `ring`: ring stroke width (default `1.5`).
   */
  strokeWidth?: number;
  /** Dot fill or transparent ring around the hovered mark. @default "dot" */
  variant?: "dot" | "ring";
  visible: boolean;
  x: number;
  y: number;
}

const DEFAULT_HALO_SCALE = 2.6;
const DEFAULT_HALO_OPACITY = 0.3;
/** Entrance spring for the core + halo radius (position uses the tooltip spring). */
const HALO_SPRING = { damping: 28, stiffness: 420, type: "spring" } as const;

function ringCornerRadius(
  halfExtent: number,
  cornerRadiusFraction: number
): number {
  const side = halfExtent * 2;
  return side * Math.max(0, Math.min(0.5, cornerRadiusFraction));
}

function AnimatedRingDot({
  x,
  y,
  halfExtent,
  cornerRadiusFraction,
  fill,
  stroke,
  strokeWidth,
  springConfig,
}: {
  x: number;
  y: number;
  halfExtent: number;
  cornerRadiusFraction: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  springConfig?: SpringConfig;
}) {
  const { tooltipSpring } = useChartConfig();
  const effectiveSpring = springConfig ?? tooltipSpring;
  const animatedX = useSpring(x, effectiveSpring);
  const animatedY = useSpring(y, effectiveSpring);
  const side = halfExtent * 2;
  const rx = ringCornerRadius(halfExtent, cornerRadiusFraction);
  const rectX = useTransform(animatedX, (value) => value - halfExtent);
  const rectY = useTransform(animatedY, (value) => value - halfExtent);

  animatedX.set(x);
  animatedY.set(y);

  return (
    <motion.rect
      fill={fill}
      height={side}
      rx={rx}
      ry={rx}
      stroke={stroke}
      strokeWidth={strokeWidth}
      width={side}
      x={rectX}
      y={rectY}
    />
  );
}

export function TooltipDot({
  x,
  y,
  visible,
  color,
  size = 5,
  strokeColor = chartCssVars.background,
  strokeWidth,
  haloScale = DEFAULT_HALO_SCALE,
  haloOpacity = DEFAULT_HALO_OPACITY,
  variant = "dot",
  cornerRadiusFraction = 0.25,
  springConfig,
  animate = true,
}: TooltipDotProps) {
  const { tooltipSpring } = useChartConfig();
  const effectiveSpring = springConfig ?? tooltipSpring;
  const animatedX = useSpring(x, effectiveSpring);
  const animatedY = useSpring(y, effectiveSpring);

  const isRing = variant === "ring";

  if (animate && !isRing) {
    animatedX.set(x);
    animatedY.set(y);
  }

  if (!visible) {
    return null;
  }

  if (isRing) {
    const ringStrokeWidth = strokeWidth ?? 1.5;
    if (animate) {
      return (
        <AnimatedRingDot
          cornerRadiusFraction={cornerRadiusFraction}
          fill="transparent"
          halfExtent={size}
          springConfig={springConfig}
          stroke={color}
          strokeWidth={ringStrokeWidth}
          x={x}
          y={y}
        />
      );
    }

    const side = size * 2;
    const rx = ringCornerRadius(size, cornerRadiusFraction);

    return (
      <rect
        fill="transparent"
        height={side}
        rx={rx}
        ry={rx}
        stroke={color}
        strokeWidth={ringStrokeWidth}
        width={side}
        x={x - size}
        y={y - size}
      />
    );
  }

  const outlineWidth = strokeWidth ?? 0;
  const outline =
    outlineWidth > 0
      ? { stroke: strokeColor, strokeWidth: outlineWidth }
      : undefined;
  const haloRadius = Math.max(0, size * haloScale);
  const showHalo = haloRadius > size && haloOpacity > 0;

  if (!animate) {
    return (
      <g>
        {showHalo && (
          <circle
            cx={x}
            cy={y}
            fill={color}
            fillOpacity={haloOpacity}
            r={haloRadius}
          />
        )}
        <circle cx={x} cy={y} fill={color} r={size} {...outline} />
      </g>
    );
  }

  return (
    <g>
      {showHalo && (
        <motion.circle
          animate={{ r: haloRadius }}
          cx={animatedX}
          cy={animatedY}
          fill={color}
          fillOpacity={haloOpacity}
          initial={{ r: size }}
          transition={HALO_SPRING}
        />
      )}
      <motion.circle
        animate={{ r: size }}
        cx={animatedX}
        cy={animatedY}
        fill={color}
        initial={{ r: size * 0.5 }}
        transition={HALO_SPRING}
        {...outline}
      />
    </g>
  );
}

TooltipDot.displayName = "TooltipDot";
