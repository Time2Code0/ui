"use client";

import { motion, useTransform } from "motion/react";

import { useScrollAcceleratedClock } from "@/registry/hooks/use-scroll-accelerated-clock";
import { ScrollContainer } from "@/registry/marketing/scroll";

function Spinner() {
  const clock = useScrollAcceleratedClock(10);
  const rotate = useTransform(clock.value, (value) => value * 0.09);

  return (
    <motion.div
      className="size-12 rounded-lg bg-foreground"
      style={{ rotate }}
    />
  );
}

export function Particle() {
  return (
    <ScrollContainer className="h-72 w-full rounded-xl border">
      <div className="sticky top-0 flex h-72 flex-col items-center justify-center gap-6 text-foreground-muted text-sm">
        <Spinner />
        Scroll up and down
      </div>
      <div className="h-[1200px]" />
    </ScrollContainer>
  );
}
