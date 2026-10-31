"use client";

import type { MotionValue } from "motion/react";

import { motion, useTransform } from "motion/react";

import { useClock } from "@/registry/hooks/use-clock";
import { useCoerceToMotionValue } from "@/registry/hooks/use-coerce-to-motion-value";

function ProgressBar({ value }: { value: number | MotionValue<number> }) {
  const progress = useCoerceToMotionValue(value);
  const scaleX = useTransform(progress, [0, 100], [0, 1]);

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/10">
      <motion.div
        className="h-full origin-left bg-foreground"
        style={{ scaleX }}
      />
    </div>
  );
}

export function Particle() {
  const clock = useClock();
  const animated = useTransform(clock.value, (value) => (value / 30) % 100);

  return (
    <div className="flex w-full flex-col gap-6 text-sm">
      <div className="flex flex-col gap-2">
        <span className="text-foreground-muted">Static number</span>
        <ProgressBar value={60} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-foreground-muted">Motion value</span>
        <ProgressBar value={animated} />
      </div>
    </div>
  );
}
