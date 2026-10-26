"use client";

import { type ReactNode, useMemo, useState } from "react";

import { cn } from "cn";

import { DynamicCodeBlock } from "@/components/dynamic-codeblock.client";
import { Button } from "@/registry/ui/button";
import { Card, CardFrame } from "@/registry/ui/card";

import { formatShowcaseCode } from "../_lib/format-showcase-code";

/** ~5 lines at showcase line-height when the panel is collapsed. */
const collapsedCodeMaxHeightClassName = "max-h-[8.5rem]";

/**
 * Live preview card with a collapsible code card below it (coss CardFrame).
 * Ported from bklit-ui's docs `ComponentShowcase`.
 */
export function ComponentShowcase({
  children,
  code,
  lang = "tsx",
  className,
  previewOverlay,
}: {
  /** The live preview component to render */
  children: ReactNode;
  /** Code string to display (syntax highlighted on the client) */
  code?: string;
  lang?: string;
  className?: string;
  /** Absolutely positioned controls painted over the preview panel. */
  previewOverlay?: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const formattedCode = useMemo(
    () => (code ? formatShowcaseCode(code) : ""),
    [code]
  );

  return (
    <CardFrame className={className}>
      <Card className="flex w-full shrink-0 items-center justify-center p-6 sm:p-8">
        <div className="flex w-full items-stretch justify-stretch">
          {children}
        </div>
        {previewOverlay}
      </Card>

      {formattedCode ? (
        <div className="relative z-1 overflow-hidden rounded-b-2xl">
          <div
            className={cn(
              "relative overflow-hidden transition-[max-height] duration-300",
              isOpen ? "" : collapsedCodeMaxHeightClassName
            )}
          >
            <DynamicCodeBlock
              code={formattedCode}
              codeblock={{
                allowCopy: isOpen,
                className: "my-0 border-0 bg-transparent",
                "data-line-numbers": true,
              }}
              lang={lang}
            />
          </div>

          {isOpen ? (
            <div className="flex justify-center border-t p-1.5">
              <Button
                className="text-foreground-muted"
                onClick={() => setIsOpen(false)}
                size="sm"
                variant="ghost"
              >
                Collapse
              </Button>
            </div>
          ) : (
            <button
              className={cn(
                "absolute inset-x-0 bottom-0 z-10 flex h-20 cursor-pointer items-end justify-center pb-3",
                "bg-linear-to-b from-transparent via-background-muted/80 to-background-muted",
                "font-medium text-foreground-muted text-sm transition-colors hover:text-foreground"
              )}
              onClick={() => setIsOpen(true)}
              type="button"
            >
              View code
            </button>
          )}
        </div>
      ) : null}
    </CardFrame>
  );
}
