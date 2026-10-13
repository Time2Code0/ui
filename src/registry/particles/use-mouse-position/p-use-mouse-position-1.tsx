"use client";

import { useRef } from "react";

import { motion } from "motion/react";

import { useMousePosition } from "@/registry/hooks/use-mouse-position";

export function Particle() {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition({ ref });

  return (
    <div
      className="relative h-64 w-full overflow-hidden rounded-xl border bg-background-muted"
      ref={ref}
    >
      <span className="absolute inset-0 flex items-center justify-center text-foreground-muted text-sm">
        Move your cursor here
      </span>
      <motion.div
        className="pointer-events-none absolute -top-4 -left-4 size-8 rounded-full bg-foreground"
        style={{ x, y }}
      />
    </div>
  );
}
