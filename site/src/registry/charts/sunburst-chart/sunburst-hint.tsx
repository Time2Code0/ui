"use client";

import type { ArcDatum, Focus } from "./sunburst";

import { memo, type ReactNode } from "react";

import { useSunburstHover, useSunburstStable } from "./sunburst-context";

export interface SunburstHintContext {
  focus: Focus;
  hintText: string;
  hoveredArc: ArcDatum | null;
}

export interface SunburstHintProps {
  /** Custom hint content; receives `{ hintText, hoveredArc, focus }` */
  children?: ReactNode | ((context: SunburstHintContext) => ReactNode);
  /**
   * Hint wrapper class
   * @default "mt-3 min-h-5 text-center text-foreground-muted text-sm"
   */
  className?: string;
}

export const SunburstHint = memo(function SunburstHint({
  className,
  children,
}: SunburstHintProps) {
  const { focus } = useSunburstStable();
  const { hoveredArc } = useSunburstHover();

  const hintText = (() => {
    if (hoveredArc) {
      return hoveredArc.trail.join("  ›  ");
    }
    if (focus.depth === 0) {
      return "Click a segment to zoom in · hover to inspect";
    }
    return "Click the center to zoom out";
  })();

  const context: SunburstHintContext = { focus, hintText, hoveredArc };

  let content: ReactNode;
  if (typeof children === "function") {
    content = children(context);
  } else if (children == null) {
    content = hintText;
  } else {
    content = children;
  }

  return (
    <div
      aria-live="polite"
      className={
        className ?? "mt-3 min-h-5 text-center text-foreground-muted text-sm"
      }
      style={{ minHeight: 20 }}
    >
      {content}
    </div>
  );
});

SunburstHint.displayName = "SunburstHint";
