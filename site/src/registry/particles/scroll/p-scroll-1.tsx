"use client";

import { motion } from "motion/react";

import {
  ScrollContainer,
  useScroll,
  useScrollDirection,
} from "@/registry/marketing/scroll";

function Header() {
  const { progress } = useScroll();
  const direction = useScrollDirection();

  return (
    <div className="sticky top-0 z-10 border-b bg-background">
      <div className="flex items-center justify-between px-4 py-2 text-sm">
        <span className="font-medium">Article</span>
        <span className="text-foreground-muted">Direction: {direction}</span>
      </div>
      <motion.div
        className="h-0.5 origin-left bg-primary"
        style={{ scaleX: progress.y }}
      />
    </div>
  );
}

export function Particle() {
  return (
    <ScrollContainer className="h-80 w-full rounded-xl border">
      <Header />
      <div className="flex flex-col gap-4 p-4">
        {Array.from({ length: 12 }, (_, index) => index).map((index) => (
          <div className="h-16 rounded-lg bg-background-muted" key={index} />
        ))}
      </div>
    </ScrollContainer>
  );
}
