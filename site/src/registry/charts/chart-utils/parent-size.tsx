"use client";

import type { CSSProperties, ReactNode } from "react";

import { useParentSize } from "@visx/responsive";

export interface ChartParentSizeProps {
  children: (size: { width: number; height: number }) => ReactNode;
  className?: string;
  debounceTime?: number;
  style?: CSSProperties;
}

/**
 * Drop-in for visx `<ParentSize>` without its `overflow: hidden` measuring
 * layer, so tooltips, markers, and strokes at the chart edge aren't clipped.
 */
export function ParentSize({
  children,
  className,
  debounceTime,
  style,
}: ChartParentSizeProps) {
  const { parentRef, width, height } = useParentSize({ debounceTime });
  return (
    <div
      className={className}
      style={{ height: "100%", position: "relative", width: "100%", ...style }}
    >
      <div ref={parentRef} style={{ inset: 0, position: "absolute" }}>
        {children({ height, width })}
      </div>
    </div>
  );
}
