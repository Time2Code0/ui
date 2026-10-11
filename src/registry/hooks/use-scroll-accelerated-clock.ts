"use client";

import type { Clock } from "./use-clock";

import { useEffect, useState } from "react";

import { useMotionValueEvent } from "motion/react";

import { useScroll, useScrollDirection } from "@/registry/marketing/scroll";

import { useClock } from "./use-clock";

/**
 * Custom hook that returns a clock object whose rate is influenced by the scroll velocity and direction.
 * The clock's rate accelerates based on the current scroll speed and an optional acceleration multiplier.
 *
 * @param {number} [acceleration=5] - The factor by which the scroll velocity affects the clock rate.
 * @returns {Clock} - A clock object with a rate modified by scroll events.
 *
 * @example
 * const clock = useScrollAcceleratedClock(10);
 * console.log(clock.rate); // The clock rate will change based on the scroll direction and velocity.
 */
export function useScrollAcceleratedClock(acceleration = 5): Clock {
  const scroll = useScroll();
  const direction = useScrollDirection();
  const clock = useClock();
  const [baseRate, setBaseRate] = useState(1);

  useEffect(() => {
    if (direction === "up") {
      setBaseRate(-1);
    } else if (direction === "down") {
      setBaseRate(1);
    }
  }, [direction]);

  useMotionValueEvent(scroll.velocity.y, "change", (latest) => {
    clock.setRate(baseRate + (latest / 1000) * acceleration);
  });

  return clock;
}
