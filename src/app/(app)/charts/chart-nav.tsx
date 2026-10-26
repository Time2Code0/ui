"use client";

import { Fragment, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "cn";

import { ScrollArea } from "@/registry/ui/scroll-area";

import { chartTypes } from "./chart-types";

export function ChartNav() {
  const pathname = usePathname();
  const scrollActiveIntoView = useCallback((node: HTMLAnchorElement | null) => {
    node?.scrollIntoView({
      behavior: "instant",
      block: "nearest",
      inline: "center",
    });
  }, []);

  return (
    <ScrollArea className="snap-x snap-mandatory scroll-px-4">
      <nav className="flex w-max min-w-full gap-1 rounded-xl bg-muted/72 p-1">
        {chartTypes.map((chart, index) => {
          const href = `/charts/${chart.slug}`;
          const isActive = pathname === href;
          const startsUtilities =
            "group" in chart && !("group" in (chartTypes[index - 1] ?? {}));

          return (
            <Fragment key={chart.slug}>
              {startsUtilities ? (
                <div
                  aria-hidden
                  className="mx-1 w-px shrink-0 self-stretch bg-foreground/10"
                />
              ) : null}
              <Link
                className={cn(
                  "shrink-0 snap-center rounded-lg border px-3 py-1.5 font-medium text-sm transition-colors",
                  isActive
                    ? "border-border bg-background text-foreground shadow-xs/5 dark:bg-input/32"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
                href={href}
                ref={isActive ? scrollActiveIntoView : undefined}
              >
                {chart.label}
              </Link>
            </Fragment>
          );
        })}
      </nav>
    </ScrollArea>
  );
}
