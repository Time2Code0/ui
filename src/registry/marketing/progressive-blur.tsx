"use client";

import type { HTMLMotionProps } from "motion/react";
import type { Direction } from "./mask";

import { memo } from "react";

import { cn } from "cn";
import { motion } from "motion/react";

import { Mask, masks } from "./mask";

interface Props extends HTMLMotionProps<"div"> {
  blurEnd?: number;
  blurStart?: number;
  children?: React.ReactNode;
  direction?: Direction;
  layers?: number;
}

function ProgressiveBlurComponent({
  blurStart = 0,
  blurEnd = 12,
  direction = "to-bottom",
  layers = 5,
  children,
  className,
  ...props
}: Props) {
  layers = Math.max(layers, 2);
  const step = 1 / (layers + 1);
  const blurMin = Math.min(blurStart, blurEnd);
  const blurMax = Math.max(blurStart, blurEnd);
  const blurRange = blurMax - blurMin;
  const blurBase = blurRange ** (1 / (layers - 1));

  return (
    <motion.div {...props} className={cn("relative", className)}>
      {children}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backdropFilter: `blur(${blurMin}px)`,
        }}
      />
      {[...new Array(layers).keys()].map((layer) => {
        const backdropFilter = `blur(${blurBase ** layer}px)`;
        return (
          <Mask
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            image={masks.linear({
              direction,
              opacities: [0, 1, 1, 0],
              positions: [
                layer * step,
                (layer + 1) * step,
                (layer + 2) * step,
                (layer + 3) * step,
              ],
              rotate: blurStart > blurEnd ? 180 : 0,
            })}
            key={layer}
            style={{
              backdropFilter,
              WebkitBackdropFilter: backdropFilter,
            }}
          />
        );
      })}
    </motion.div>
  );
}

export const ProgressiveBlur = memo(ProgressiveBlurComponent);
