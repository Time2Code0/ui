"use client";

import { useEffect, useRef } from "react";

import { cn } from "cn";
import {
  motion,
  useInView,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

import { MouseContainer, useMouse } from "@/registry/marketing/mouse";
import { Line } from "@/registry/marketing/pattern";
import {
  ScrollTarget,
  useScroll,
  WindowScrollProvider,
} from "@/registry/marketing/scroll";

const SCROLL_SPRING = { damping: 25, stiffness: 50 };

/** Pixels each column travels either side of rest; negative columns move up. */
const COLUMN_TRAVEL = [128, -256, 192, -128, 48, -320, 240];

const REVEAL_AMOUNT = 0.3;
const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const;
const REVEAL = { duration: 1, ease: EASE_OUT_QUAD };
const HIDE = { duration: 0.5, ease: EASE_OUT_QUAD };

const COLUMN_TILT = -15;
const COLUMN_STAGGER = 0.1;
const COLUMN_PERSPECTIVE = 1600;

const BANNER_BLUR = 64;
const BANNER_OPACITY_DELAY = 0.7;
const BANNER_BLUR_DELAY = 0.8;

const MAGNET_SPRING = { damping: 25, mass: 2, stiffness: 150 };
const MAGNET_STRENGTH = 0.03;

export interface CatalogColumn {
  className?: string;
  content: React.ReactNode;
}

export function CatalogStage({
  banner,
  columns,
  className,
}: {
  banner: React.ReactNode;
  columns: CatalogColumn[];
  className?: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const shown = useInView(stage, { amount: REVEAL_AMOUNT });
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <WindowScrollProvider>
      <ScrollTarget
        className={className}
        one={{ container: "start", target: "end" }}
        zero={{ container: "end", target: "start" }}
      >
        <MouseContainer
          className="relative isolate size-full overflow-hidden bg-background-muted"
          resetPositionOnLeave
        >
          <Line className="bg-size-[6px_6px]" />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
            inert
            ref={stage}
          >
            <div className="absolute flex w-[120%] items-center justify-center gap-6 [transform:rotateX(34deg)_rotateY(9deg)_rotate(-26deg)] max-sm:scale-[0.62] sm:max-lg:scale-[0.82]">
              {columns.map((column, index) => (
                <ScrollColumn
                  className={column.className}
                  delay={(index + 1) * COLUMN_STAGGER}
                  // biome-ignore lint/suspicious/noArrayIndexKey: columns are static
                  key={index}
                  shown={shown}
                  tilt={reduceMotion ? 0 : COLUMN_TILT}
                  travel={COLUMN_TRAVEL[index % COLUMN_TRAVEL.length]}
                >
                  {column.content}
                </ScrollColumn>
              ))}
            </div>
          </div>

          <MagneticBanner blur={reduceMotion ? 0 : BANNER_BLUR} shown={shown}>
            {banner}
          </MagneticBanner>
        </MouseContainer>
      </ScrollTarget>
    </WindowScrollProvider>
  );
}

function ScrollColumn({
  children,
  className,
  delay,
  shown,
  tilt,
  travel,
}: {
  children: React.ReactNode;
  className?: string;
  delay: number;
  shown: boolean;
  tilt: number;
  travel: number;
}) {
  const scroll = useScroll();
  const still = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      still.current = query.matches;
    };
    updateMotion();
    query.addEventListener("change", updateMotion);

    return () => query.removeEventListener("change", updateMotion);
  }, []);

  const y = useSpring(
    useTransform(scroll.progress.y, (progress) =>
      still.current ? 0 : (progress * 2 - 1) * travel
    ),
    SCROLL_SPRING
  );

  const copyClassName = cn("flex flex-col gap-4 pb-4", className);

  return (
    <motion.div
      animate={
        shown ? { opacity: 1, rotateX: 0 } : { opacity: 0, rotateX: tilt }
      }
      className="transform-3d flex shrink-0 flex-col"
      initial={{ opacity: 0, rotateX: tilt }}
      style={{ transformPerspective: COLUMN_PERSPECTIVE, y }}
      transition={shown ? { ...REVEAL, delay } : HIDE}
    >
      <div className={copyClassName}>{children}</div>
      <div className={copyClassName}>{children}</div>
    </motion.div>
  );
}

function MagneticBanner({
  blur,
  children,
  shown,
}: {
  blur: number;
  children: React.ReactNode;
  shown: boolean;
}) {
  const mouse = useMouse();
  const frameRef = useRef<HTMLDivElement>(null);
  const frame = useRef({ height: 0, width: 0 });
  const magnetic = useRef(false);

  useEffect(() => {
    const element = frameRef.current;
    if (element === null) {
      return;
    }

    const query = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );
    const updateMagnetic = () => {
      magnetic.current = query.matches;
    };
    updateMagnetic();
    query.addEventListener("change", updateMagnetic);

    const observer = new ResizeObserver(([entry]) => {
      frame.current = {
        height: entry.contentRect.height,
        width: entry.contentRect.width,
      };
    });
    observer.observe(element);

    return () => {
      query.removeEventListener("change", updateMagnetic);
      observer.disconnect();
    };
  }, []);

  // The mouse container parks the position off-stage (negative) on leave, which
  // releases the banner back to the centre.
  const pull = (position: number, size: number) =>
    position < 0 || !magnetic.current
      ? 0
      : (position - size / 2) * MAGNET_STRENGTH;

  const x = useSpring(
    useTransform(mouse.position.x, (position) =>
      pull(position, frame.current.width)
    ),
    MAGNET_SPRING
  );
  const y = useSpring(
    useTransform(mouse.position.y, (position) =>
      pull(position, frame.current.height)
    ),
    MAGNET_SPRING
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4"
      ref={frameRef}
    >
      <motion.div
        animate={
          shown
            ? {
                filter: "blur(0px)",
                opacity: 1,
                transitionEnd: { filter: "none" },
              }
            : { filter: `blur(${blur}px)`, opacity: 0 }
        }
        initial={{ filter: `blur(${blur}px)`, opacity: 0 }}
        style={{ x, y }}
        transition={
          shown
            ? {
                filter: { ...REVEAL, delay: BANNER_BLUR_DELAY },
                opacity: { ...REVEAL, delay: BANNER_OPACITY_DELAY },
              }
            : HIDE
        }
      >
        {children}
      </motion.div>
    </div>
  );
}
