"use client";

import { motion } from "motion/react";

interface AnimationPropsBase {
  animate?: boolean;
  children: React.ReactNode;
  custom?: number;
  delay?: number;
  duration?: number;
}

interface FromProps extends AnimationPropsBase {
  direction?: "top" | "bottom" | "left" | "right";
}

export function From({
  children,
  animate = true,
  direction = "bottom",
  duration = 0.3,
  delay = 0.3,
  custom = 0,
}: FromProps) {
  const variants = {
    hide: () => {
      switch (direction) {
        case "top":
          return { y: -200 };
        case "bottom":
          return { y: 200 };
        case "left":
          return { x: -200 };
        case "right":
          return { x: 200 };
        // defaults to bottom
        default:
          return { y: 200 };
      }
    },
    show: {
      transition: { delay: delay * custom, duration },
      x: 0,
      y: 0,
    },
  };

  return (
    <motion.div animate={animate && "show"} initial="hide" variants={variants}>
      {children}
    </motion.div>
  );
}

type FadeInProps = AnimationPropsBase;

export function FadeIn({
  children,
  animate = true,
  duration = 0.3,
  delay = 0.3,
  custom = 0,
}: FadeInProps) {
  return (
    <motion.div
      animate={animate && "show"}
      initial="hide"
      variants={{
        hide: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { delay: delay * custom, duration },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

type ZoomInProps = AnimationPropsBase;

export function ZoomIn({
  children,
  animate = true,
  duration = 0.3,
  delay = 0.3,
  custom = 0,
}: ZoomInProps) {
  return (
    <motion.div
      animate={animate && "show"}
      initial="hide"
      variants={{
        hide: { scale: 0 },
        show: {
          scale: 1,
          transition: { delay: delay * custom, duration },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
