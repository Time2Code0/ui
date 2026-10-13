"use client";

import { useRef } from "react";

import { useMousePosition } from "@/registry/hooks/use-mouse-position";
import { useNormalizeMotionValue } from "@/registry/hooks/use-normalize-motion-value";

export function Particle() {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition({ defaultX: 0, defaultY: 0, ref });
  const normalizedX = useNormalizeMotionValue(x);
  const normalizedY = useNormalizeMotionValue(y);

  return (
    <div
      className="flex h-48 w-full items-center justify-center rounded-xl border bg-background-muted font-mono text-sm"
      ref={ref}
    >
      x: {Math.round(normalizedX)}, y: {Math.round(normalizedY)}
    </div>
  );
}
