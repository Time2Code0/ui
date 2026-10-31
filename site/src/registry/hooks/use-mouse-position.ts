"use client";

import { useEffect, useMemo } from "react";

import { useMotionValue } from "motion/react";

export function useMousePosition({
  defaultX = -1000,
  defaultY = -1000,
  ref,
}: {
  defaultX?: number;
  defaultY?: number;
  ref?: React.RefObject<HTMLElement | null>;
}) {
  const x = useMotionValue(defaultX);
  const y = useMotionValue(defaultY);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      } else {
        x.set(e.clientX);
        y.set(e.clientY);
      }
    };

    const element = ref?.current ?? document;

    element.addEventListener(
      "mousemove",
      handleMouseMove as (e: Event) => void
    );

    return () => {
      element.removeEventListener(
        "mousemove",
        handleMouseMove as (e: Event) => void
      );
    };
  });

  return useMemo(
    () => ({
      x,
      y,
    }),
    [x, y]
  );
}
