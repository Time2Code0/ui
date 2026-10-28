"use client";

import { type ReactNode, useRef } from "react";

import { useInView } from "motion/react";

import {
  ChartExamplePreviewFrame,
  type ChartExamplePreviewLayout,
} from "./chart-example-preview";

/**
 * Same-size stand-in rendered before the chart mounts. Uses the classes the
 * preview frame already targets (`.relative.w-full`, `.relative.aspect-square`)
 * so per-layout sizing and mobile aspect overrides apply to it too.
 */
function ChartPreviewPlaceholder({
  layout,
}: {
  layout: ChartExamplePreviewLayout;
}) {
  switch (layout) {
    case "compact":
    case "funnel":
      return <div aria-hidden className="relative aspect-square w-full" />;
    case "wide":
      return <div aria-hidden className="relative aspect-video w-full" />;
    case "heatmap":
      return <div aria-hidden className="relative h-40 w-full" />;
    case "inline":
      return <div aria-hidden className="relative h-28 w-full" />;
    default:
      return (
        <div
          aria-hidden
          className="relative w-full"
          style={{ aspectRatio: "2 / 1" }}
        />
      );
  }
}

/**
 * Chart gallery preview that only mounts its chart once it nears the viewport
 * (so entrance animations run when seen, not at page load), then stays mounted.
 */
export function ChartPreviewGate({
  layout = "cartesian",
  previewRole = "example",
  children,
}: {
  layout?: ChartExamplePreviewLayout;
  previewRole?: "hero" | "example";
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    margin: "80px 0px",
    once: true,
  });

  return (
    <ChartExamplePreviewFrame
      layout={layout}
      previewRole={previewRole}
      ref={ref}
    >
      {inView ? children : <ChartPreviewPlaceholder layout={layout} />}
    </ChartExamplePreviewFrame>
  );
}
