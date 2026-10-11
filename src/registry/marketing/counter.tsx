"use client";

import { useEffect, useRef } from "react";

import { useMotionValue, useMotionValueEvent, useSpring } from "motion/react";

interface Props extends React.ComponentPropsWithoutRef<"span"> {
  from?: number;
  to: number;
}

export function Counter({ to, from = 0, ...props }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const value = useMotionValue(from);
  const springValue = useSpring(value, {
    damping: 100,
    stiffness: 100,
  });

  useEffect(() => {
    value.set(to);
  }, [value, to]);

  useMotionValueEvent(springValue, "change", (latest: number) => {
    if (ref.current) {
      ref.current.textContent = Intl.NumberFormat("en-US").format(
        Math.round(latest)
      );
    }
  });

  return <span ref={ref} {...props} />;
}
