"use client";

import type { MotionValue } from "motion/react";

import { useRef } from "react";

import { useAnimationFrame, useMotionValue } from "motion/react";

export interface Clock {
  setRate: (rate: number) => void;
  value: MotionValue<number>;
}

/**
 * Custom hook to create a clock that updates its value over time.
 *
 * @param {number} [defaultValue=0] - The initial value of the clock.
 * @param {number} [rate=1] - The rate at which the clock updates its value.
 * @returns {Clock} The current clock value and a function to update the rate.
 */
export function useClock(defaultValue = 0, rate = 1): Clock {
  const value = useMotionValue(defaultValue);
  const rateRef = useRef(rate);

  useAnimationFrame((_, delta) => {
    value.set(value.get() + delta * rateRef.current);
  });

  const setRate = (newRate: number) => {
    rateRef.current = newRate;
  };

  return {
    setRate,
    value,
  };
}
