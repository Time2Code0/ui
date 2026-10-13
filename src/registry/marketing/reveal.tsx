"use client";

import type { HTMLMotionProps } from "motion/react";

import { useState } from "react";

import { cn } from "cn";
import { motion } from "motion/react";

interface FadeInProps extends HTMLMotionProps<"div"> {
  delay?: number;
  duration?: number;
}

function FadeIn({
  duration = 0.5,
  delay = 0,
  animate = true,
  ...props
}: FadeInProps) {
  const variants = {
    hidden: {
      opacity: 0,
    },
    show: (i = 1) => ({
      opacity: 1,
      transition: {
        delay: i * delay,
        duration,
      },
    }),
  };

  return (
    <motion.div
      animate={typeof animate === "boolean" ? animate && "show" : animate}
      initial="hidden"
      variants={variants}
      {...props}
    />
  );
}

interface FromProps extends HTMLMotionProps<"div"> {
  containerClassName?: string;
  delay?: number;
  duration?: number;
  from?:
    | "left"
    | "top"
    | "right"
    | "bottom"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
}

function From({
  from = "left",
  duration = 0.5,
  delay = 0,
  animate = true,
  containerClassName,
  ...props
}: FromProps) {
  const [animationCompleted, setAnimationCompleted] = useState(false);

  const variants = {
    hidden: {
      ...(from.includes("top") && { y: "-100%" }),
      ...(from.includes("bottom") && { y: "100%" }),
      ...(from.includes("left") && { x: "-100%" }),
      ...(from.includes("right") && { x: "100%" }),
    },
    show: (i = 1) => ({
      transition: {
        delay: i * delay,
        duration,
      },
      x: 0,
      y: 0,
    }),
  };

  return (
    <div
      className={cn(
        !animationCompleted && "overflow-hidden",
        containerClassName
      )}
    >
      <motion.div
        animate={typeof animate === "boolean" ? animate && "show" : animate}
        initial="hidden"
        onAnimationComplete={() => {
          setAnimationCompleted(true);
        }}
        variants={variants}
        {...props}
      />
    </div>
  );
}

interface BoxProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  containerClassName?: string;
  delay?: number;
  duration?: number;
  from?: "left" | "top" | "right" | "bottom";
}

function Box({
  children,
  className,
  from = "left",
  duration = 0.5,
  delay = 0,
  animate = true,
  containerClassName,
  ...props
}: BoxProps) {
  const [animationCompleted, setAnimationCompleted] = useState(false);

  const variants = {
    hidden: {
      x: 0,
      y: 0,
    },
    show: (i = 1) => ({
      ...(from === "right" && { x: "-100%" }),
      ...(from === "left" && { x: "100%" }),
      ...(from === "bottom" && { y: "-100%" }),
      ...(from === "top" && { y: "100%" }),
      transition: {
        delay: i * delay,
        duration,
      },
    }),
  };

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {children}
      <motion.div
        animate={typeof animate === "boolean" ? animate && "show" : animate}
        className={cn(
          "absolute inset-0",
          { "bg-primary": !animationCompleted },
          className
        )}
        initial="hidden"
        onAnimationComplete={() => {
          setAnimationCompleted(true);
        }}
        variants={variants}
        {...props}
      />
    </div>
  );
}

interface TextProps extends HTMLMotionProps<"span"> {
  delay?: number;
  duration?: number;
  text: string;
}

function Text({
  text,
  delay = 0,
  duration = 0.05,
  animate = true,
  ...props
}: TextProps) {
  const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
  const occurrences = new Map<string, number>();
  const letters = Array.from(segmenter.segment(text), (s) => s.segment).map(
    (segment) => {
      const letter = segment === " " ? "\u00A0" : segment;
      const occurrence = (occurrences.get(letter) ?? 0) + 1;
      occurrences.set(letter, occurrence);

      return {
        key: `${letter}-${occurrence}`,
        letter,
      };
    }
  );

  return (
    <motion.span {...props}>
      {letters.map(({ key, letter }, index) => (
        <motion.span
          animate={typeof animate === "boolean" ? animate && "show" : animate}
          className="inline-flex"
          initial="hidden"
          key={key}
          variants={{
            hidden: {
              opacity: 0,
              y: "100%",
            },
            show: {
              opacity: 1,
              transition: {
                damping: 15,
                delay: index * duration + delay,
                type: "spring",
              },
              y: 0,
            },
          }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

export { Box, FadeIn, From, Text };
