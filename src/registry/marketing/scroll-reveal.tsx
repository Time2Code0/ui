"use client";

import type { UseInViewOptions } from "motion/react";

import { useRef } from "react";

import { useInView } from "motion/react";

interface Props {
  children: ({
    ref,
    isInView,
  }: {
    ref: React.RefObject<HTMLDivElement | null>;
    isInView: boolean;
  }) => React.ReactNode;
  options?: UseInViewOptions;
}

export function ScrollReveal({ children, options = { once: true } }: Props) {
  const ref = useRef<React.ComponentRef<"div">>(null);
  const isInView = useInView(ref, options);

  return children({
    isInView,
    ref,
  });
}
