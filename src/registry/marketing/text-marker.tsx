"use client";

import type { Transition } from "motion/react";

import { cn } from "cn";
import { motion } from "motion/react";

interface Props extends React.ComponentPropsWithoutRef<"span"> {
  animate?: boolean;
  transition?: Transition;
}

export function TextMarker({
  children,
  className,
  animate = true,
  transition = { duration: 0.5 },
  ...props
}: Props) {
  const variants = {
    hidden: {
      scaleX: 0,
    },
    show: {
      scaleX: "100%",
    },
  };

  return (
    <span
      className={cn(
        "relative isolate border-l-2 border-l-primary pr-2.5 pl-2",
        className
      )}
      {...props}
    >
      <motion.span
        animate={animate && "show"}
        className="pointer-events-none absolute inset-0 -z-10 origin-[0%_50%] border-r-2 border-r-primary bg-primary/30"
        initial="hidden"
        transition={transition}
        variants={variants}
      />

      {children}
    </span>
  );
}
