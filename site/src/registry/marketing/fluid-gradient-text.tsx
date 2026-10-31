"use client";

import { useCallback, useId } from "react";

import { cn } from "cn";
import { motion, useMotionValue, useSpring } from "motion/react";

export interface FluidGradientTextProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  /**
   * SVG viewBox height used as the base text size.
   * @default 300
   */
  svgViewBoxHeight?: number;
  /**
   * SVG viewBox width used to scale the gradient and text layout.
   * @default 1200
   */
  svgViewBoxWidth?: number;
  /** Text content rendered inside the SVG. */
  text: string;
}

export function FluidGradientText({
  text,
  svgViewBoxWidth = 1200,
  svgViewBoxHeight = 300,
  className,
  onPointerLeave,
  onPointerMove,
  ...props
}: FluidGradientTextProps) {
  const gradientId = useId();
  const gradientX1Raw = useMotionValue(svgViewBoxWidth / 2);
  const gradientX1 = useSpring(gradientX1Raw, {
    damping: 30,
    mass: 0.5,
    stiffness: 200,
  });

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(event);

      const containerRect = event.currentTarget.getBoundingClientRect();
      const mouseX = event.clientX - containerRect.left;

      const normalizedX = (mouseX / containerRect.width) * svgViewBoxWidth;
      const clampedX = Math.max(0, Math.min(svgViewBoxWidth, normalizedX));

      gradientX1Raw.set(clampedX);
    },
    [gradientX1Raw, onPointerMove, svgViewBoxWidth]
  );

  const handlePointerLeave = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerLeave?.(event);
      gradientX1Raw.set(svgViewBoxWidth / 2);
    },
    [gradientX1Raw, onPointerLeave, svgViewBoxWidth]
  );

  return (
    <div
      className={cn("relative size-full overflow-hidden", className)}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      role="presentation"
      {...props}
    >
      <svg
        aria-label={text}
        className="size-full translate-y-[37.5%] select-none"
        fill="none"
        role="img"
        viewBox={`0 0 ${svgViewBoxWidth} ${svgViewBoxHeight}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          dominantBaseline="central"
          fill={`url(#${gradientId})`}
          fontSize={svgViewBoxHeight}
          stroke="currentColor"
          strokeOpacity="0.1"
          strokeWidth="1"
          textAnchor="middle"
          x="50%"
          y="50%"
        >
          {text}
        </text>
        <defs>
          <motion.linearGradient
            gradientUnits="userSpaceOnUse"
            id={gradientId}
            x1={gradientX1}
            x2={svgViewBoxWidth / 2}
            y1="0"
            y2={svgViewBoxHeight}
          >
            <stop offset="0.625" stopColor="currentColor" stopOpacity="0.05" />
            <stop offset="1" stopColor="currentColor" />
          </motion.linearGradient>
        </defs>
      </svg>
    </div>
  );
}
