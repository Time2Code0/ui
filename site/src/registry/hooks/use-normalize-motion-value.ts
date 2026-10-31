"use client";

import type { MotionValue } from "motion/react";

import { useState } from "react";

import { useMotionValueEvent } from "motion/react";

/**
 * A hook to normalize a MotionValue back to its original type using useMotionValueEvent.
 * @param value The MotionValue to be normalized.
 * @returns The normalized value.
 */
export function useNormalizeMotionValue<T>(value: MotionValue<T>) {
  const [normalizedValue, setNormalizedValue] = useState<T>(value.get());

  useMotionValueEvent(value, "change", (latest) => {
    setNormalizedValue(latest);
  });

  return normalizedValue;
}
