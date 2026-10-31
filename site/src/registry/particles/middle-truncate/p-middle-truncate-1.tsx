"use client";

import type { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

import { useCallback, useEffect, useState } from "react";

import { cn } from "cn";

import { Label } from "@/registry/ui/label";
import { MiddleTruncate } from "@/registry/ui/middle-truncate";
import { Slider } from "@/registry/ui/slider";
import { Toggle } from "@/registry/ui/toggle";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/ui/tooltip";

const MAX_WIDTH = 600;
const ANIMATION_DURATION = 4000;

const EXAMPLES: {
  label: string;
  className?: string;
  style?: React.CSSProperties;
  value: string;
}[] = [
  {
    label: "Branch",
    value: "feature/redesign-dashboard-navigation-with-sidebar-improvements",
  },
  {
    label: "Preview URL",
    value:
      "platform-web-git-feature-redesign-dashboard-navigation-acme.vercel.app",
  },
  { label: "Deployment ID", value: "dpl_8gmXTT1yJRP8UbGfXD7A3sp4RKhW" },
  {
    className: "font-mono",
    label: "Env var key",
    value: "STRIPE_WEBHOOK_SIGNING_SECRET",
  },
  {
    className: "font-mono",
    label: "Monospace, no ligatures",
    style: {
      fontFeatureSettings: '"liga" 0, "calt" 0',
      fontVariantLigatures: "none",
    },
    value: "STRIPE_WEBHOOK_SIGNING_SECRET",
  },
  { label: "Commit SHA", value: "2b0874e797d7c2a4092d0033ee0c2f0f9aef2869" },
  {
    label: "File path",
    value: "apps/web/app/(dashboard)/[teamSlug]/[project]/settings/page.tsx",
  },
  {
    label: "Custom domain",
    value: "api.internal.platform-observability.example.com",
  },
  { label: "Model name", value: "google/gemini-3.1-flash-image-preview" },
  { label: "Emoji", value: "🚀-release-👩‍💻-notes-🇩🇪-final-🎉-draft-v2" },
  { label: "Fits as-is", value: "sidebar.tsx" },
];

// Only show the full value when part of it is hidden.
function openWhenTruncated(
  open: boolean,
  details: TooltipPrimitive.Root.ChangeEventDetails
) {
  if (open && !details.trigger?.hasAttribute("data-truncated")) {
    details.cancel();
  }
}

export function Particle() {
  const [width, setWidth] = useState(320);
  const [animating, setAnimating] = useState(false);
  const handleWidthChange = useCallback(
    (value: number | readonly number[]) => setWidth(value as number),
    []
  );

  // Ping-pong the width between 0 and MAX_WIDTH.
  useEffect(() => {
    if (!animating) {
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = ((now - start) / ANIMATION_DURATION) % 2;
      const eased = progress < 1 ? progress : 2 - progress;
      setWidth(Math.round(eased * MAX_WIDTH));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [animating]);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-4">
        <Toggle
          onPressedChange={setAnimating}
          pressed={animating}
          size="sm"
          variant="outline"
        >
          Animate
        </Toggle>
        <Slider
          aria-label="Width"
          className="max-w-64"
          disabled={animating}
          max={MAX_WIDTH}
          onValueChange={handleWidthChange}
          value={width}
        />
        <span className="w-12 text-end font-mono text-foreground-muted text-xs tabular-nums">
          {width}px
        </span>
      </div>
      <TooltipProvider>
        <dl className="flex flex-col gap-3">
          {EXAMPLES.map((example) => (
            <div className="flex flex-col gap-1" key={example.label}>
              <dt>
                <Label render={<span />}>{example.label}</Label>
              </dt>
              <dd className="text-foreground-muted text-sm" style={{ width }}>
                <Tooltip onOpenChange={openWhenTruncated}>
                  <TooltipTrigger
                    render={
                      <MiddleTruncate
                        className={cn(
                          "rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-foreground",
                          example.className
                        )}
                        style={example.style}
                        tabIndex={0}
                        title={undefined}
                        value={example.value}
                      />
                    }
                  />
                  <TooltipPopup className="max-w-80 break-all">
                    {example.value}
                  </TooltipPopup>
                </Tooltip>
              </dd>
            </div>
          ))}
        </dl>
      </TooltipProvider>
    </div>
  );
}
