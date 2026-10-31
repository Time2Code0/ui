"use client";

import { useState } from "react";

import { cn } from "cn";
import { AnimatePresence, motion } from "motion/react";

import { useInterval } from "@/registry/hooks/use-interval";

interface Props extends React.ComponentPropsWithoutRef<typeof motion.div> {
  containerClassName?: string;
  interval: number;
  items: React.ReactNode[];
}

export function RotateInterval({
  items,
  interval,
  containerClassName,
  ...props
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useInterval(() => {
    if (activeIndex === items.length - 1) {
      setActiveIndex(0);
    } else {
      setActiveIndex(activeIndex + 1);
    }
  }, interval);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          animate={{ rotateX: "0deg", y: 0 }}
          exit={{ rotateX: "-25deg", y: "100%" }}
          initial={{ rotateX: "25deg", y: "-75%" }}
          key={activeIndex}
          transition={{ duration: 0.2, ease: "easeOut" }}
          {...props}
        >
          {items[activeIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
