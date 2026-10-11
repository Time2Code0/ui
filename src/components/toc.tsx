"use client";

import type { RefObject } from "react";

import { useEffect, useRef, useState } from "react";

import { Text } from "@hugeicons/core-free-icons";
import { cn } from "cn";
import {
  AnchorProvider,
  ScrollProvider,
  TOCItem,
  type TOCItemType,
  useActiveAnchors,
} from "fumadocs-core/toc";

import { Icon } from "@/registry/ui/icon";
import { ScrollArea } from "@/registry/ui/scroll-area";

export function TableOfContents({ toc }: { toc: TOCItemType[] }) {
  const viewRef = useRef(null);

  return (
    <AnchorProvider toc={toc}>
      <ScrollProvider containerRef={viewRef}>
        <ScrollArea
          className="**:data-[slot=scroll-area-scrollbar]:hidden"
          overscrollContain
          ref={viewRef}
          scrollFade
        >
          <div className="flex min-h-0 flex-col gap-3 p-4">
            <h3 className="inline-flex items-center gap-1.5 text-foreground-muted text-sm">
              <Icon icon={Text} />
              <span>On this page</span>
            </h3>

            <TocItems items={toc} />
          </div>
        </ScrollArea>
      </ScrollProvider>
    </AnchorProvider>
  );
}

function TocItems({ items }: { items: TOCItemType[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<{
    height: number;
    path: string;
    width: number;
  }>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    function onResize(): void {
      if (!container || container.clientHeight === 0) {
        return;
      }

      let width = 0;
      let height = 0;
      const d: string[] = [];

      for (let i = 0; i < items.length; i += 1) {
        const element = container.querySelector<HTMLElement>(
          `a[href="${items[i].url}"]`
        );
        if (!element) {
          continue;
        }

        const styles = getComputedStyle(element);
        const offset = getLineOffset(items[i].depth) + 1;
        const top = element.offsetTop + Number.parseFloat(styles.paddingTop);
        const bottom =
          element.offsetTop +
          element.clientHeight -
          Number.parseFloat(styles.paddingBottom);

        width = Math.max(offset, width);
        height = Math.max(height, bottom);

        d.push(`${i === 0 ? "M" : "L"}${offset} ${top}`);
        d.push(`L${offset} ${bottom}`);
      }

      setSvg({ height, path: d.join(" "), width: width + 1 });
    }

    const observer = new ResizeObserver(onResize);
    onResize();
    observer.observe(container);

    return () => observer.disconnect();
  }, [items]);

  return (
    <div className="relative">
      {svg ? (
        <div
          className="absolute start-0 top-0 rtl:-scale-x-100"
          style={{
            height: svg.height,
            maskImage: `url("data:image/svg+xml,${encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" width="${svg.width}" height="${svg.height}"><path d="${svg.path}" stroke="black" stroke-width="1" fill="none" /></svg>`
            )}")`,
            width: svg.width,
          }}
        >
          <TocThumb
            className="mt-(--toc-top) h-(--toc-height) bg-primary transition-all"
            containerRef={containerRef}
          />
        </div>
      ) : null}

      <div className="flex flex-col" ref={containerRef}>
        {items.map((item, i) => (
          <TocItem
            item={item}
            key={item.url}
            lower={items[i + 1]?.depth}
            upper={items[i - 1]?.depth}
          />
        ))}
      </div>
    </div>
  );
}

function TocThumb({
  className,
  containerRef,
}: {
  className?: string;
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const activeAnchors = useActiveAnchors();

  useEffect(() => {
    const container = containerRef.current;
    const element = ref.current;
    if (!(container && element)) {
      return;
    }

    function update(): void {
      if (!(container && element)) {
        return;
      }

      let top = Number.MAX_VALUE;
      let bottom = 0;

      for (const anchor of activeAnchors) {
        const item = container.querySelector<HTMLElement>(
          `a[href="#${anchor}"]`
        );
        if (!item) {
          continue;
        }

        const styles = getComputedStyle(item);

        top = Math.min(
          top,
          item.offsetTop + Number.parseFloat(styles.paddingTop)
        );
        bottom = Math.max(
          bottom,
          item.offsetTop +
            item.clientHeight -
            Number.parseFloat(styles.paddingBottom)
        );
      }

      if (top > bottom) {
        top = 0;
        bottom = 0;
      }

      element.style.setProperty("--toc-top", `${top}px`);
      element.style.setProperty("--toc-height", `${bottom - top}px`);
    }

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);

    return () => observer.disconnect();
  }, [activeAnchors, containerRef]);

  return <div className={className} ref={ref} role="none" />;
}

function getItemOffset(depth: number): number {
  if (depth <= 2) {
    return 14;
  }

  if (depth === 3) {
    return 26;
  }

  return 36;
}

function getLineOffset(depth: number): number {
  return depth >= 3 ? 10 : 0;
}

function TocItem({
  item,
  lower = item.depth,
  upper = item.depth,
}: {
  item: TOCItemType;
  lower?: number;
  upper?: number;
}) {
  const offset = getLineOffset(item.depth);
  const upperOffset = getLineOffset(upper);
  const lowerOffset = getLineOffset(lower);

  return (
    <TOCItem
      className="wrap-anywhere relative scroll-m-4 py-1.5 text-foreground-muted text-sm transition-colors first:pt-0 last:pb-0 hover:text-foreground data-[active=true]:text-primary"
      href={item.url}
      style={{ paddingInlineStart: getItemOffset(item.depth) }}
    >
      {offset === upperOffset ? null : (
        <svg
          aria-hidden="true"
          className="absolute start-0 -top-1.5 size-4 rtl:-scale-x-100"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            className="stroke-foreground/10"
            strokeWidth="1"
            x1={upperOffset}
            x2={offset}
            y1="0"
            y2="12"
          />
        </svg>
      )}

      <div
        className={cn(
          "absolute inset-y-0 w-px bg-foreground/10",
          offset !== upperOffset && "top-1.5",
          offset !== lowerOffset && "bottom-1.5"
        )}
        style={{ insetInlineStart: offset }}
      />

      {item.title}
    </TOCItem>
  );
}
