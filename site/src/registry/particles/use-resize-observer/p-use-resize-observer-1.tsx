"use client";

import { useRef } from "react";

import { useResizeObserver } from "@/registry/hooks/use-resize-observer";

export function Particle() {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useResizeObserver(ref);

  const width = Math.round(entry?.contentRect.width ?? 0);
  const height = Math.round(entry?.contentRect.height ?? 0);

  return (
    <div
      className="flex h-32 w-64 min-w-32 max-w-full resize items-center justify-center overflow-auto rounded-xl border bg-background-muted font-mono text-sm"
      ref={ref}
    >
      {width} × {height}
    </div>
  );
}
