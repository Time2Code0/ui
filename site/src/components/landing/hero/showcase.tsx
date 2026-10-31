"use client";

import { Fragment, useLayoutEffect, useRef, useState } from "react";

import { cn } from "cn";
import {
  animate,
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/ui/tabs";

import {
  ChangelogDemo,
  CheckoutDemo,
  CommandDemo,
  MembersDemo,
  PlansDemo,
  ProofDemo,
  ScheduleDemo,
  SignUpDemo,
  TasksDemo,
  UsageDemo,
  VerifyDemo,
  WaitlistDemo,
} from "./demos";
import { type DemoId, liveTiles, type Tile, targets, tiles } from "./layout";

interface Demo {
  component: React.ComponentType;
  label: string;
}

const demos: Record<DemoId, Demo> = {
  changelog: {
    component: ChangelogDemo,
    label: "Changelog",
  },
  checkout: {
    component: CheckoutDemo,
    label: "Checkout",
  },
  command: {
    component: CommandDemo,
    label: "Command",
  },
  members: {
    component: MembersDemo,
    label: "Members",
  },
  plans: {
    component: PlansDemo,
    label: "Plans",
  },
  proof: {
    component: ProofDemo,
    label: "Customers",
  },
  schedule: {
    component: ScheduleDemo,
    label: "Booking",
  },
  "sign-up": {
    component: SignUpDemo,
    label: "Sign up",
  },
  tasks: {
    component: TasksDemo,
    label: "Tasks",
  },
  usage: {
    component: UsageDemo,
    label: "Usage",
  },
  verify: {
    component: VerifyDemo,
    label: "Verify",
  },
  waitlist: {
    component: WaitlistDemo,
    label: "Waitlist",
  },
};

const groups: DemoId[][] = [
  ["sign-up", "verify", "members"],
  ["command", "tasks", "schedule"],
  ["plans", "checkout", "usage"],
  ["waitlist", "changelog", "proof"],
];

/* Room the camera keeps clear around the active tile, in stage pixels, so its
   glow fades out before the stage edge. The bottom also clears the half of
   the demo switcher that overlaps the stage. */
const SAFE_X = 20;
const SAFE_TOP = 56;
const SAFE_BOTTOM = 64;
const OFFSET_Y = (SAFE_TOP - SAFE_BOTTOM) / 2;

const pan = { bounce: 0, type: "spring", visualDuration: 0.9 } as const;

interface Camera {
  scale: MotionValue<number>;
  x: MotionValue<number>;
  y: MotionValue<number>;
}

/**
 * Both layers read the same motion values, so they can never drift apart.
 * The world's origin sits at the stage centre; pointing the camera at a tile
 * means moving that tile's centre onto the origin, scaled to fit when the
 * stage is narrower than the tile.
 */
function useCamera(active: DemoId, stage: React.RefObject<HTMLElement | null>) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(-targets[active].x);
  const y = useMotionValue(-targets[active].y + OFFSET_Y);
  const scale = useMotionValue(1);
  const [size, setSize] = useState<{ height: number; width: number } | null>(
    null
  );
  const shown = useRef<DemoId | null>(null);

  useLayoutEffect(() => {
    const node = stage.current;
    if (!node) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      const { height, width } = entry.contentRect;
      setSize({ height, width });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [stage]);

  useLayoutEffect(() => {
    if (!size) {
      return;
    }

    const target = targets[active];
    const fit = Math.min(
      1,
      (size.width - SAFE_X * 2) / target.width,
      (size.height - SAFE_TOP - SAFE_BOTTOM) / target.height
    );
    const next = {
      scale: fit,
      x: -target.x * fit,
      y: -target.y * fit + OFFSET_Y,
    };

    // A resize or the first measurement re-frames in place; only a new demo pans.
    if (shown.current === active || shown.current === null || reduceMotion) {
      x.jump(next.x);
      y.jump(next.y);
      scale.jump(next.scale);
    } else {
      animate(x, next.x, pan);
      animate(y, next.y, pan);
      animate(scale, next.scale, pan);
    }
    shown.current = active;
  }, [active, size, reduceMotion, x, y, scale]);

  return { scale, x, y } satisfies Camera;
}

export function Showcase() {
  const stage = useRef<HTMLDivElement>(null);
  const switcher = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<DemoId>("sign-up");
  const camera = useCamera(active, stage);

  // On narrow screens the switcher scrolls; keep the active demo in view.
  useLayoutEffect(() => {
    const list: HTMLDivElement | null = switcher.current;
    const tab = list?.querySelector<HTMLElement>(`[data-demo="${active}"]`);

    if (!(list && tab) || list.scrollWidth <= list.clientWidth) {
      return;
    }

    list.scrollTo({
      behavior: "smooth",
      left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2,
    });
  }, [active]);

  return (
    <Tabs className="relative gap-0" onValueChange={setActive} value={active}>
      <TabsPanel
        aria-label={`${demos[active].label} demo`}
        className="relative isolate h-152 flex-none overflow-hidden md:h-192"
        ref={stage}
        value={active}
      >
        <BackgroundTiles active={active} camera={camera} />
        <ForegroundTiles active={active} camera={camera} />
      </TabsPanel>

      <div className="absolute inset-x-0 bottom-0 z-20 flex translate-y-1/2 justify-center px-4">
        <TabsList
          aria-label="Demos"
          className="max-w-full justify-start overflow-x-auto overscroll-x-contain rounded-full border bg-background-muted/90 p-1 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.18)] backdrop-blur-sm [scrollbar-width:none] *:data-[slot=tab-indicator]:rounded-full *:data-[slot=tab-indicator]:shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_8%,transparent),0_1px_2px_rgb(0_0_0/0.06)]"
          ref={switcher}
        >
          {groups.map((group, index) => (
            <Fragment key={group[0]}>
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="mx-1 h-4 w-px shrink-0 bg-foreground/10"
                />
              ) : null}
              {group.map((demo) => (
                <TabsTab
                  className="group/tab h-8 grow-0 rounded-full px-3 max-sm:text-[0.8125rem]"
                  data-demo={demo}
                  key={demo}
                  value={demo}
                >
                  <span
                    aria-hidden="true"
                    className="size-1.5 shrink-0 rounded-full ring-1 ring-foreground/30 transition-colors group-data-active/tab:bg-primary group-data-active/tab:ring-primary max-sm:hidden"
                  />

                  {demos[demo].label}
                </TabsTab>
              ))}
            </Fragment>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}

function BackgroundTiles({
  active,
  camera,
}: {
  active: DemoId;
  camera: Camera;
}) {
  return (
    <div
      aria-hidden="true"
      className="mask-intersect absolute inset-0 opacity-35 [mask-image:linear-gradient(to_bottom,transparent,black_26%,black_68%,transparent),linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] dark:opacity-30"
      inert
    >
      <motion.div
        className="absolute top-1/2 left-1/2 size-0"
        style={{ ...camera, originX: 0, originY: 0 }}
      >
        {tiles.map((tile) => {
          const Component = demos[tile.demo].component;

          return (
            <TileFrame
              className={cn(
                tile.live && "transition-opacity duration-500",
                tile.live && tile.demo === active && "opacity-0 delay-300"
              )}
              key={tile.key}
              tile={tile}
            >
              <Component />
            </TileFrame>
          );
        })}
      </motion.div>
    </div>
  );
}

function ForegroundTiles({
  active,
  camera,
}: {
  active: DemoId;
  camera: Camera;
}) {
  return (
    <div className="mask-intersect pointer-events-none absolute inset-0 z-10 [mask-image:linear-gradient(to_bottom,transparent,black_2rem,black_calc(100%-2rem),transparent),linear-gradient(to_right,transparent,black_1rem,black_calc(100%-1rem),transparent)]">
      <motion.div
        className="absolute top-1/2 left-1/2 size-0"
        style={{ ...camera, originX: 0, originY: 0 }}
      >
        {liveTiles.map((tile) => {
          const isActive = tile.demo === active;
          const Component = demos[tile.demo].component;

          return (
            <TileFrame
              className={cn(
                "transition-opacity duration-500 motion-reduce:duration-200",
                isActive
                  ? "pointer-events-auto delay-300 motion-reduce:delay-0"
                  : "opacity-0"
              )}
              glow={isActive}
              inert={!isActive}
              key={tile.key}
              tile={tile}
            >
              <Component />
            </TileFrame>
          );
        })}
      </motion.div>
    </div>
  );
}

function TileFrame({
  children,
  className,
  glow = false,
  tile,
  ...props
}: React.ComponentProps<"div"> & { glow?: boolean; tile: Tile }) {
  return (
    <div
      className={cn(
        "absolute rounded-2xl text-left shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_32px_-12px_rgb(0_0_0/0.12)]",
        className
      )}
      style={{
        height: tile.height,
        left: tile.x,
        top: tile.y,
        width: tile.width,
      }}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute -inset-1.5 -z-10 rounded-[1.375rem] bg-[linear-gradient(135deg,var(--color-primary),transparent_38%,transparent_62%,var(--color-primary))] blur-xl transition-opacity duration-700",
          glow ? "opacity-35 dark:opacity-45" : "opacity-0"
        )}
      />
      {children}
    </div>
  );
}
