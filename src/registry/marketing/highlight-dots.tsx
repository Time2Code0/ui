"use client";

import { useRef } from "react";

import { cn } from "cn";
import { motion, useTransform } from "motion/react";

import { useMousePosition } from "@/registry/hooks/use-mouse-position";

import { Dot } from "./pattern";

interface Props extends React.ComponentPropsWithoutRef<"div"> {
  containerClassName?: string;
}

export function HighlightDots({
  children,
  className,
  containerClassName,
  ...props
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition({ ref: containerRef });

  const mouseX = useTransform(mousePosition.x, (x) => `${x}px`);
  const mouseY = useTransform(mousePosition.y, (y) => `${y}px`);

  return (
    <div
      className={cn("group absolute inset-0", containerClassName)}
      ref={containerRef}
      {...props}
    >
      <Dot />
      <motion.svg
        className="absolute inset-0 size-full fill-primary opacity-0 transition duration-300 [mask-image:radial-gradient(200px_circle_at_var(--mouse-x)_var(--mouse-y),black_0%,transparent_100%)] group-hover:opacity-100"
        style={
          {
            "--mouse-x": mouseX,
            "--mouse-y": mouseY,
          } as React.CSSProperties
        }
      >
        <title>Colored Dotted Background</title>
        <defs>
          <pattern
            height={16}
            id="dots"
            patternContentUnits="userSpaceOnUse"
            patternUnits="userSpaceOnUse"
            width={16}
          >
            <circle cx={1} cy={1} id="pattern-circle" r={1} />
          </pattern>
        </defs>

        <rect fill={"url(#dots)"} height="100%" strokeWidth="0" width="100%" />
      </motion.svg>

      <div className={cn("relative", className)}>{children}</div>
    </div>
  );
}
