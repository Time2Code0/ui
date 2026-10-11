"use client";

import { useEffect, useId, useState } from "react";

import { cn } from "cn";
import { motion } from "motion/react";

interface Props extends React.ComponentPropsWithoutRef<"svg"> {
  containerRef: React.RefObject<HTMLElement | null>;
  curvature?: number;
  delay?: number;
  duration?: number;
  endXOffset?: number;
  endYOffset?: number;
  fromRef: React.RefObject<HTMLElement | null>;
  gradientStartColor?: string;
  gradientStopColor?: string;
  pathColor?: string;
  pathOpacity?: number;
  pathWidth?: number;
  reverse?: boolean;
  startXOffset?: number;
  startYOffset?: number;
  toRef: React.RefObject<HTMLElement | null>;
}

export function Beam({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = Math.random() * 3 + 4,
  delay = 0,
  pathColor = "var(--foreground)",
  pathWidth = 2,
  pathOpacity = 0.1,
  gradientStartColor = "var(--primary)",
  gradientStopColor = "var(--secondary)",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
  ...props
}: Props) {
  const id = useId();
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ height: 0, width: 0 });

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const rectFrom = fromRef.current.getBoundingClientRect();
        const rectTo = toRef.current.getBoundingClientRect();

        setSvgDimensions({
          height: containerRect.height,
          width: containerRect.width,
        });

        const startX =
          rectFrom.left -
          containerRect.left +
          rectFrom.width / 2 +
          startXOffset;
        const startY =
          rectFrom.top - containerRect.top + rectFrom.height / 2 + startYOffset;
        const endX =
          rectTo.left - containerRect.left + rectTo.width / 2 + endXOffset;
        const endY =
          rectTo.top - containerRect.top + rectTo.height / 2 + endYOffset;

        setPathD(
          `M ${startX},${startY} Q ${
            (startX + endX) / 2
          },${startY - curvature} ${endX},${endY}`
        );
      }
    };

    const observer = new ResizeObserver((entries) => {
      for (const _entry of entries) {
        updatePath();
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Initial path
    updatePath();

    return () => {
      observer.disconnect();
    };
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ]);

  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 transform-gpu stroke-2",
        className
      )}
      fill="none"
      height={svgDimensions.height}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
      width={svgDimensions.width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Beam</title>
      <path
        d={pathD}
        stroke={pathColor}
        strokeLinecap="round"
        strokeOpacity={pathOpacity}
        strokeWidth={pathWidth}
      />
      <path
        d={pathD}
        stroke={`url(#${id})`}
        strokeLinecap="round"
        strokeOpacity="1"
        strokeWidth={pathWidth}
      />
      <defs>
        <motion.linearGradient
          animate={
            reverse
              ? {
                  x1: ["90%", "-10%"],
                  x2: ["100%", "0%"],
                  y1: ["0%", "0%"],
                  y2: ["0%", "0%"],
                }
              : {
                  x1: ["10%", "110%"],
                  x2: ["0%", "100%"],
                  y1: ["0%", "0%"],
                  y2: ["0%", "0%"],
                }
          }
          className="transform-gpu"
          gradientUnits="userSpaceOnUse"
          id={id}
          initial={{
            x1: "0%",
            x2: "0%",
            y1: "0%",
            y2: "0%",
          }}
          transition={{
            delay,
            duration,
            ease: "easeOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 0,
          }}
        >
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop stopColor={gradientStartColor} />
          <stop offset="32.5%" stopColor={gradientStopColor} />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
}
