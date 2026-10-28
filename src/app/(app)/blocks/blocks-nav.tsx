"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";

import { Link } from "@/registry/ui/link";
import { ScrollArea } from "@/registry/ui/scroll-area";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control";

export function BlocksNav({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const pathname = usePathname();
  const scrollActiveIntoView = useCallback((node: HTMLAnchorElement | null) => {
    node?.scrollIntoView({
      behavior: "instant",
      block: "nearest",
      inline: "center",
    });
  }, []);

  return (
    <ScrollArea className="mt-6 snap-x snap-mandatory scroll-px-4 pb-2.5">
      <SegmentedControl className="p-1 *:data-[slot=segmented-control-indicator]:border">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <SegmentedControlItem
              className="px-3 py-1.5"
              key={item.href}
              render={
                <Link
                  aria-current={isActive ? "page" : undefined}
                  href={item.href}
                  ref={isActive ? scrollActiveIntoView : undefined}
                >
                  {item.label}
                </Link>
              }
            />
          );
        })}
      </SegmentedControl>
    </ScrollArea>
  );
}
