"use client";

import {
  type MouseEvent,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { cn } from "cn";

import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuLinkItem,
  MenuPopup,
  MenuTrigger,
} from "@/registry/ui/menu";

interface ChartGalleryAnchor {
  featured?: boolean;
  id: string;
  label: string;
}

/** A section is "current" once its title row crosses this fraction of the viewport. */
const ACTIVE_LINE_VIEWPORT_FRACTION = 0.35;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToAnchor(id: string, behavior: ScrollBehavior) {
  document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
}

const userScrollEvents = ["wheel", "touchstart", "keydown", "pointerdown"];

/**
 * Smooth-scroll to a section, then snap onto it once scrolling settles: charts
 * mounting along the way can differ slightly from their placeholder height.
 * Skips the correction if the user takes over scrolling.
 */
function smoothScrollToAnchor(id: string) {
  let timeoutId = 0;

  const cleanup = () => {
    window.clearTimeout(timeoutId);
    window.removeEventListener("scrollend", settle);
    for (const type of userScrollEvents) {
      window.removeEventListener(type, cleanup);
    }
  };

  function settle() {
    cleanup();
    scrollToAnchor(id, "auto");
  }

  window.addEventListener("scrollend", settle, { once: true });
  for (const type of userScrollEvents) {
    window.addEventListener(type, cleanup, { once: true, passive: true });
  }
  // Fallback for browsers without `scrollend`.
  timeoutId = window.setTimeout(settle, 1500);
  scrollToAnchor(id, "smooth");
}

/**
 * Scroll-spy for tall sections: the active anchor is the last one whose title
 * row has scrolled above the activation line (or the last one at page end).
 * fumadocs' AnchorProvider needs the whole target inside a narrow band, which
 * goes stale while a chart card taller than the band fills the viewport.
 */
function useActiveChartAnchor(ids: string[]) {
  const [activeId, setActiveId] = useState<string | undefined>(ids[0]);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * ACTIVE_LINE_VIEWPORT_FRACTION;
      const atPageEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      let current: string | undefined = ids[0];

      if (atPageEnd) {
        current = ids.at(-1);
      } else {
        for (const id of ids) {
          const element = document.getElementById(id);
          if (!element || element.getBoundingClientRect().top > line) {
            break;
          }
          current = id;
        }
      }

      setActiveId(current);
    };

    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ids]);

  return activeId;
}

/**
 * "On this page" navigation for /charts/[chart]: lists every variation, follows
 * the one in view, and deep-links via `#id`. Desktop gets a sticky rail (styled
 * like the docs TOC rail); below `lg` the same anchors render as a sticky menu.
 */
export function ChartGallerySidebar({
  anchors,
}: {
  anchors: ChartGalleryAnchor[];
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const idsKey = anchors.map((anchor) => anchor.id).join(" ");
  const ids = useMemo(() => idsKey.split(" "), [idsKey]);
  const activeId = useActiveChartAnchor(ids);

  // Deep links: re-apply the hash target after hydration in case layout moved.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!(id && ids.includes(id))) {
      return;
    }

    const frame = requestAnimationFrame(() => scrollToAnchor(id, "auto"));
    return () => cancelAnimationFrame(frame);
  }, [ids]);

  // Keep the active link visible inside the rail without scrolling the page.
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>(
      `[data-anchor-id="${activeId}"]`
    );
    if (!(list && link)) {
      return;
    }

    const linkTop = link.offsetTop - list.offsetTop;
    const linkBottom = linkTop + link.offsetHeight;
    if (
      linkTop < list.scrollTop ||
      linkBottom > list.scrollTop + list.clientHeight
    ) {
      list.scrollTo({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        top: linkTop - list.clientHeight / 2 + link.offsetHeight / 2,
      });
    }
  }, [activeId]);

  const handleClick = (event: MouseEvent<HTMLElement>, id: string) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    if (prefersReducedMotion()) {
      scrollToAnchor(id, "auto");
    } else {
      smoothScrollToAnchor(id);
    }
    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <>
      <ChartGalleryMobileNav
        activeId={activeId}
        anchors={anchors}
        onNavigate={handleClick}
      />
      <ChartGalleryRail
        activeId={activeId}
        anchors={anchors}
        listRef={listRef}
        onNavigate={handleClick}
      />
    </>
  );
}

function FeaturedBadge() {
  return (
    <Badge className="shrink-0" size="sm" variant="info">
      Featured
    </Badge>
  );
}

interface ChartGalleryNavProps {
  activeId: string | undefined;
  anchors: ChartGalleryAnchor[];
  onNavigate: (event: MouseEvent<HTMLElement>, id: string) => void;
}

function ChartGalleryRail({
  anchors,
  activeId,
  listRef,
  onNavigate,
}: ChartGalleryNavProps & { listRef: RefObject<HTMLDivElement | null> }) {
  return (
    <nav
      aria-label="Chart variations"
      className="sticky top-[calc(--spacing(12)+--spacing(16))] hidden max-h-[calc(100svh---spacing(16)-3rem)] min-w-0 flex-col self-start lg:flex"
    >
      <p className="m-0 flex h-7 shrink-0 items-center font-medium text-foreground text-xs">
        On this page
      </p>
      <div
        className="no-scrollbar relative min-h-0 flex-1 overflow-y-auto pt-1"
        ref={listRef}
      >
        <ul className="relative m-0 ms-3.5 flex list-none flex-col gap-0.5 p-0 before:absolute before:inset-y-0 before:-left-3.25 before:w-px before:bg-border">
          {anchors.map((anchor) => {
            const isActive = anchor.id === activeId;

            return (
              <li key={anchor.id}>
                <a
                  aria-current={isActive ? "location" : undefined}
                  className="relative flex items-center gap-2 py-1 text-[0.8125rem] text-foreground-muted leading-4.5 no-underline transition-colors before:absolute before:inset-y-px before:-left-3.25 before:w-px before:rounded-full hover:text-foreground data-[active=true]:text-foreground data-[active=true]:before:w-0.5 data-[active=true]:before:bg-foreground"
                  data-active={isActive}
                  data-anchor-id={anchor.id}
                  href={`#${anchor.id}`}
                  onClick={(event) => onNavigate(event, anchor.id)}
                >
                  <span className="min-w-0 truncate">{anchor.label}</span>
                  {anchor.featured ? <FeaturedBadge /> : null}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

function ChartGalleryMobileNav({
  anchors,
  activeId,
  onNavigate,
}: ChartGalleryNavProps) {
  const active = anchors.find((anchor) => anchor.id === activeId);

  return (
    <nav
      aria-label="Chart variations"
      className="sticky top-16 z-20 bg-background/80 py-2 backdrop-blur-sm lg:hidden"
    >
      <Menu>
        <MenuTrigger
          render={
            <Button
              className="w-full justify-between font-normal"
              variant="outline"
            />
          }
        >
          <span className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 font-medium">On this page</span>
            {active ? (
              <>
                <span aria-hidden className="text-foreground-muted/64">
                  /
                </span>
                <span className="min-w-0 truncate text-foreground-muted">
                  {active.label}
                </span>
                {active.featured ? <FeaturedBadge /> : null}
              </>
            ) : null}
          </span>
          <Icon icon={ArrowDown01Icon} size={14} />
        </MenuTrigger>
        <MenuPopup
          align="start"
          className="max-h-[min(var(--available-height),24rem)] w-(--anchor-width)"
        >
          <MenuGroup>
            <MenuGroupLabel>On this page</MenuGroupLabel>
            {anchors.map((anchor) => {
              const isActive = anchor.id === activeId;
              return (
                <MenuLinkItem
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "text-sm",
                    isActive ? "font-medium" : "text-foreground-muted"
                  )}
                  href={`#${anchor.id}`}
                  key={anchor.id}
                  onClick={(event) => onNavigate(event, anchor.id)}
                >
                  <span className="min-w-0 truncate">{anchor.label}</span>
                  {anchor.featured ? <FeaturedBadge /> : null}
                </MenuLinkItem>
              );
            })}
          </MenuGroup>
        </MenuPopup>
      </Menu>
    </nav>
  );
}
