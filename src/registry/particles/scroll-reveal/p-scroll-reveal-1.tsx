"use client";

import { motion } from "motion/react";

import { ScrollReveal } from "@/registry/marketing/scroll-reveal";

const features = [
  "Accessible",
  "Composable",
  "Themeable",
  "Typed",
  "Animated",
  "Documented",
];

export function Particle() {
  return (
    <div className="h-80 w-full overflow-y-auto rounded-xl border">
      <div className="flex h-60 items-center justify-center text-foreground-muted text-sm">
        Scroll down
      </div>
      <div className="flex flex-col gap-4 p-4">
        {features.map((feature) => (
          <ScrollReveal key={feature}>
            {({ isInView, ref }) => (
              <motion.div
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
                }
                className="rounded-lg border p-4 font-medium"
                ref={ref}
                transition={{ duration: 0.4 }}
              >
                {feature}
              </motion.div>
            )}
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
