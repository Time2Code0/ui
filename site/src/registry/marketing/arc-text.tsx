"use client";

import type { HTMLMotionProps } from "motion/react";

import { memo } from "react";

import { cn } from "cn";
import { motion } from "motion/react";

const getArcAngle = (arcLength: number, radius: number) => {
  const safeRadius = Math.max(radius, 0.01);
  return (arcLength / safeRadius) * (180 / Math.PI);
};

interface Props extends HTMLMotionProps<"div"> {
  charWidth?: number;
  radius: number;
  text: string;
}

export const ArcText = memo(
  ({ text, radius, charWidth = 13, className, style, ...props }: Props) => {
    const chars = text.split("");
    const degreePerChar = getArcAngle(charWidth, radius);

    return (
      <motion.div
        className={cn("", className)}
        style={{
          height: `${radius * 2}px`,
          width: `${radius * 2}px`,
          ...style,
        }}
        {...props}
      >
        <div aria-hidden="true" className="absolute inset-0">
          {chars.map((char, index) => (
            <span
              className="absolute top-0 left-1/2 inline-block"
              key={`${char}-${index.toString()}`}
              style={{
                bottom: 0,
                fontSize: 14,
                height: `${radius}px`,
                letterSpacing: 0,
                textAlign: "center",
                transform: `translateX(-50%) rotate(${degreePerChar * (index - (chars.length - 1) / 2)}deg)`,
                transformOrigin: "bottom center",
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </motion.div>
    );
  }
);
ArcText.displayName = "ArcText";
