"use client";

import type { ChartExamplePreviewLayout } from "./chart-example-preview";

import { Fragment, type ReactNode, useEffect, useState } from "react";

import { cn } from "cn";
import { useReducedMotion } from "motion/react";

import { ChartPreviewGate } from "./chart-preview-gate";
import { ComponentShowcase } from "./component-showcase";
import { ShowcaseReplayAction } from "./showcase-replay-action";

/**
 * Chart gallery item: title row, then a `ComponentShowcase` (live preview with
 * collapsible code below it). The icon-only Replay control sits over the
 * preview's top-right corner, revealed on hover / focus (always shown on touch
 * or reduced motion).
 */
export function ChartExampleFrame({
  anchorId,
  title,
  description,
  code,
  data,
  footer,
  hero = false,
  previewLayout = "cartesian",
  children,
}: {
  /** Deep-link target (`#anchorId`) placed on the title row for the gallery sidebar. */
  anchorId?: string;
  /** Gallery chart type (`/charts/[chart]`). */
  chartSlug: string;
  title: string;
  description: string;
  code: string;
  data?: string;
  footer?: string;
  hero?: boolean;
  previewLayout?: ChartExamplePreviewLayout;
  children: ReactNode;
}) {
  const [replayKey, setReplayKey] = useState(0);
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  // null until mounted: the server can't know the pointer type or motion
  // preference, so the Replay button only appears after hydration.
  const [coarsePointer, setCoarsePointer] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCoarsePointer(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const showReplay =
    coarsePointer !== null &&
    (reducedMotion === true || coarsePointer || hovered || focused);
  const fullCode = data ? `${code}\n\n${data}` : code;
  const TitleTag = hero ? "h2" : "h3";

  return (
    <div
      className="flex min-w-0 flex-col gap-3"
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setFocused(false);
        }
      }}
      onFocusCapture={() => setFocused(true)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <header
        className="flex scroll-mt-[calc(var(--site-header-height)+4.5rem)] flex-col gap-0.5 lg:scroll-mt-[calc(var(--site-header-height)+1.5rem)]"
        id={anchorId}
      >
        <TitleTag
          className={cn(
            "m-0 font-semibold text-foreground tracking-tight",
            hero ? "text-base" : "text-sm"
          )}
        >
          {title}
        </TitleTag>
        <p className="m-0 text-pretty text-foreground-muted text-sm">
          {description}
        </p>
      </header>

      <ComponentShowcase
        code={fullCode}
        previewOverlay={
          <div className="absolute top-3 right-3 z-10">
            <ShowcaseReplayAction
              index={0}
              onReplay={() => setReplayKey((key) => key + 1)}
              reducedMotion={reducedMotion}
              visible={showReplay}
            />
          </div>
        }
      >
        <ChartPreviewGate
          layout={previewLayout}
          previewRole={hero ? "hero" : "example"}
        >
          <Fragment key={replayKey}>{children}</Fragment>
        </ChartPreviewGate>
      </ComponentShowcase>

      {footer ? (
        <p className="m-0 text-foreground-muted text-xs">{footer}</p>
      ) : null}
    </div>
  );
}
