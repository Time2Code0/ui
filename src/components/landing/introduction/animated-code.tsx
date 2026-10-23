"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "cn";
import { useInView, useReducedMotion } from "motion/react";

const LEAD_LINES = 2;
const STEP_INTERVAL = 2800;
const VISIBLE_LINES = 14;

export function AnimatedCode({
  children,
  lineCount,
  stops,
}: {
  children: React.ReactNode;
  lineCount: number;
  stops: number[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion || stops.length < 2) {
      return;
    }

    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % stops.length);
    }, STEP_INTERVAL);

    return () => clearInterval(interval);
  }, [inView, reduceMotion, stops.length]);

  const start = stops[index] ?? 0;
  const offset = Math.max(
    0,
    Math.min(start - LEAD_LINES, lineCount - VISIBLE_LINES)
  );

  return (
    <div
      aria-hidden="true"
      className="mask-t-from-88% mask-r-from-80% mask-b-from-70% relative h-(--code-height) overflow-hidden font-mono text-[0.8125rem] leading-(--code-line)"
      ref={ref}
      style={
        {
          "--code-height": `calc(${VISIBLE_LINES} * var(--code-line))`,
          "--code-line": "1.5rem",
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "w-max ps-2 transition-[translate] duration-700 ease-[cubic-bezier(0.31,0.1,0.08,0.96)] motion-reduce:transition-none",
          "[&_.line]:[counter-increment:line] [&_code]:[counter-reset:line]",
          "[&_.line]:before:me-6 [&_.line]:before:inline-block [&_.line]:before:w-7 [&_.line]:before:text-end [&_.line]:before:text-foreground/30 [&_.line]:before:content-[counter(line)]",
          "[&_span]:text-(--shiki-light) dark:[&_span]:text-(--shiki-dark)"
        )}
        style={{
          transitionDuration: index === 0 ? "1200ms" : undefined,
          translate: `0 calc(${-offset} * var(--code-line))`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
