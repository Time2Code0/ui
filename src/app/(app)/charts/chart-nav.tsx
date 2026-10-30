"use client";

import { Fragment, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ScrollArea } from "@/registry/ui/scroll-area";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control";
import { Separator } from "@/registry/ui/separator";

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
    <ScrollArea
      className="mt-6 snap-x snap-mandatory scroll-px-4 pb-2.5"
      scrollFade
    >
      <SegmentedControl className="p-1 *:data-[slot=segmented-control-indicator]:border">
        {chartTypes.map((chart, index) => {
          const href = `/charts/${chart.slug}`;
          const isActive = pathname === href;
          const startsUtilities =
            "group" in chart && !("group" in (chartTypes[index - 1] ?? {}));

          return (
            <Fragment key={chart.slug}>
              {startsUtilities ? (
                <Separator className="mx-1 h-5" orientation="vertical" />
              ) : null}

              <SegmentedControlItem
                className="px-3 py-1.5"
                render={
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    href={href}
                    ref={isActive ? scrollActiveIntoView : undefined}
                  >
                    {chart.label}
                  </Link>
                }
              />
            </Fragment>
          );
        })}
      </SegmentedControl>
    </ScrollArea>
  );
}
