"use client";

import type { MotionValue } from "motion/react";

import { useEffect } from "react";

import { isMotionValue, useMotionValue } from "motion/react";

/**
 * Custom React hook that ensures a given value is coerced to a `MotionValue`.
 * If the input `val` is already a `MotionValue`, it returns it directly.
 * Otherwise, it creates a new `MotionValue` initialized with `val`.
 *
 * @template T - The type of the value.
 * @param {T | MotionValue<T>} val - The value to coerce. Can be a plain value or a `MotionValue`.
 * @returns {MotionValue<T>} - A `MotionValue` instance, either the input `val` if it was already a `MotionValue`, or a new instance based on `val`.
 */
export function useCoerceToMotionValue<T>(
  val: T | MotionValue<T>
): MotionValue<T> {
  const fallbackMotionVal = useMotionValue(
    isMotionValue(val) ? val.get() : val
  );

  useEffect(() => {
    if (!isMotionValue(val)) {
      fallbackMotionVal.set(val);
    }
  }, [fallbackMotionVal, val]);

  return isMotionValue(val) ? (val as MotionValue<T>) : fallbackMotionVal;
}
