"use client";

import type { Clock } from "@/registry/hooks/use-clock";

import { cn } from "cn";
import { motion, useTransform } from "motion/react";

interface Props extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  clock: Clock;
  direction?: "horizontal" | "vertical";
  duration?: number;
}

export function Ticker({
  clock,
  duration = 12_000,
  direction = "horizontal",
  children,
  className,
  ...props
}: Props) {
  const progress = useTransform(
    clock.value,
    (time) => (time % duration) / duration
  );
  const percentage = useTransform(progress, (t) => t * 100);
  const translate = useTransform(percentage, (val) => `${-val}%`);

  return (
    <div
      className={cn("relative inline-block overflow-hidden", className)}
      {...props}
    >
      <motion.div
        className="size-full"
        style={{
          x: direction === "horizontal" ? translate : 0,
          y: direction === "vertical" ? translate : 0,
        }}
      >
        {direction === "horizontal" && (
          <div className="absolute top-0 right-0 size-full">{children}</div>
        )}
        {direction === "vertical" && (
          <div className="absolute bottom-full left-0 size-full">
            {children}
          </div>
        )}
        <div className="size-full">{children}</div>
        {direction === "horizontal" && (
          <div className="absolute top-0 left-full size-full">{children}</div>
        )}
        {direction === "vertical" && (
          <div className="absolute top-full left-0 size-full">{children}</div>
        )}
      </motion.div>
    </div>
  );
}
