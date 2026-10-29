"use client";

import { memo, useCallback } from "react";

import { arc as arcGenerator } from "@visx/shape";
import { type MotionValue, motion, useTransform } from "motion/react";

import { useEnterComplete } from "../chart-utils/use-enter-complete";
import { useMountProgress } from "../chart-utils/use-mount-progress";
import {
  getRingHitRadii,
  ringCssVars,
  useRingHover,
  useRingStable,
} from "./ring-context";

function generateArcPath(
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
  cornerRadius: number
): string {
  const generator = arcGenerator<unknown>({
    cornerRadius,
    innerRadius,
    outerRadius,
  });
  return generator({ endAngle, startAngle } as unknown as null) || "";
}

export type RingLineCap = "round" | "butt";

export interface RingProps {
  /** Enable animation on mount @default true */
  animate?: boolean;
  /** Optional color override. Falls back to the data color or palette. */
  color?: string;
  /** Index of the ring in the data array */
  index: number;
  /** Line cap style for ring ends @default "round" */
  lineCap?: RingLineCap;
  /** Show glow effect on hover @default true */
  showGlow?: boolean;
}

function ringHoverScale(isHovered: boolean, isPushedOut: boolean): number {
  if (isHovered) {
    return 1.03;
  }
  if (isPushedOut) {
    return 1.02;
  }
  return 1;
}

function RingProgressPath({
  progressComplete,
  progressPath,
  animatedProgressPath,
  color,
}: {
  progressComplete: boolean;
  progressPath: string;
  animatedProgressPath: MotionValue<string>;
  color: string;
}) {
  if (progressComplete) {
    if (!progressPath) {
      return null;
    }
    return <path d={progressPath} fill={color} />;
  }
  return <motion.path d={animatedProgressPath} fill={color} />;
}

export const Ring = memo(function Ring({
  index,
  color: colorProp,
  animate = true,
  showGlow = true,
  lineCap = "round",
}: RingProps) {
  const {
    data,
    getColor,
    getRingRadii,
    startAngle,
    endAngle,
    enterTransition,
    enterStaggerScale,
    animationKey,
    baseInnerRadius,
    strokeWidth,
    ringGap,
  } = useRingStable();
  const { hoveredIndex, setHoveredIndex } = useRingHover();

  const expandDelay = index * 0.08 * enterStaggerScale;
  const expandProgress = useMountProgress(
    enterTransition,
    expandDelay,
    `${animationKey}-expand-${index}`
  );
  const expandComplete = useEnterComplete(expandProgress);

  const progressDelay = (0.6 + index * 0.1) * enterStaggerScale;
  const progressMount = useMountProgress(
    enterTransition,
    progressDelay,
    `${animationKey}-progress-${index}`
  );
  const progressComplete = useEnterComplete(progressMount);

  const ringData = data[index];
  const progress = ringData ? ringData.value / ringData.maxValue : 0;
  const arcRange = endAngle - startAngle;

  const animatedProgressPath = useTransform(progressMount, (v) => {
    if (!ringData) {
      return "";
    }
    const currentEndAngle = startAngle + arcRange * progress * v;
    if (currentEndAngle <= startAngle + 0.01) {
      return "";
    }
    const radii = getRingRadii(index);
    const corner =
      lineCap === "round" ? (radii.outerRadius - radii.innerRadius) / 2 : 0;
    return generateArcPath(
      radii.innerRadius,
      radii.outerRadius,
      startAngle,
      currentEndAngle,
      corner
    );
  });

  const enterScale = useTransform(expandProgress, [0, 1], [0, 1]);

  const handleMouseEnter = useCallback(
    () => setHoveredIndex(index),
    [index, setHoveredIndex]
  );
  const handleMouseLeave = useCallback(
    () => setHoveredIndex(null),
    [setHoveredIndex]
  );

  if (!ringData) {
    return null;
  }

  const { innerRadius, outerRadius } = getRingRadii(index);
  const color = colorProp || getColor(index);

  const isHovered = hoveredIndex === index;
  const isFaded = hoveredIndex !== null && hoveredIndex !== index;
  const isPushedOut = hoveredIndex !== null && hoveredIndex < index;

  const cornerRadius =
    lineCap === "round" ? (outerRadius - innerRadius) / 2 : 0;
  const bgPath = generateArcPath(
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    cornerRadius
  );
  const progressEndAngle = startAngle + arcRange * progress;
  const progressPath =
    progressEndAngle <= startAngle + 0.01
      ? ""
      : generateArcPath(
          innerRadius,
          outerRadius,
          startAngle,
          progressEndAngle,
          cornerRadius
        );

  const hoverScale = ringHoverScale(isHovered, isPushedOut);
  const layerOpacity = isFaded ? 0.35 : 1;
  const enterDone = !animate || (expandComplete && progressComplete);

  const groupStyle = {
    filter: showGlow && isHovered ? `drop-shadow(0 0 12px ${color})` : "none",
    transformOrigin: "0px 0px",
  };

  // Static hit band (does not scale with hover) so the pointer can't fall
  // off the edge of a growing ring and flicker between hover states.
  const hitRadii = getRingHitRadii(
    index,
    baseInnerRadius,
    strokeWidth,
    ringGap
  );
  const hitboxPath = generateArcPath(
    hitRadii.innerRadius,
    hitRadii.outerRadius,
    startAngle,
    endAngle,
    0
  );
  const hitbox = (
    // biome-ignore lint/a11y/noStaticElementInteractions: SVG path used as hover hitbox for visualization
    <path
      d={hitboxPath}
      fill="transparent"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: "pointer" }}
    />
  );

  if (enterDone) {
    return (
      <g>
        {hitbox}
        <motion.g
          animate={{ opacity: layerOpacity, scale: hoverScale }}
          initial={false}
          pointerEvents="none"
          style={groupStyle}
          transition={{
            opacity: { duration: 0.15 },
            scale: { damping: 25, stiffness: 400, type: "spring" },
          }}
        >
          <path d={bgPath} fill={ringCssVars.ringBackground} />
          {progressPath ? <path d={progressPath} fill={color} /> : null}
        </motion.g>
      </g>
    );
  }

  if (!expandComplete) {
    return (
      <g>
        {hitbox}
        <motion.g
          pointerEvents="none"
          style={{
            ...groupStyle,
            opacity: layerOpacity,
            scale: enterScale,
          }}
        >
          <path d={bgPath} fill={ringCssVars.ringBackground} />
        </motion.g>
      </g>
    );
  }

  return (
    <g>
      {hitbox}
      <motion.g
        animate={{ opacity: layerOpacity, scale: hoverScale }}
        initial={false}
        pointerEvents="none"
        style={groupStyle}
        transition={{
          opacity: { duration: 0.15 },
          scale: { damping: 25, stiffness: 400, type: "spring" },
        }}
      >
        <path d={bgPath} fill={ringCssVars.ringBackground} />
        <RingProgressPath
          animatedProgressPath={animatedProgressPath}
          color={color}
          progressComplete={progressComplete}
          progressPath={progressPath}
        />
      </motion.g>
    </g>
  );
});

Ring.displayName = "Ring";
