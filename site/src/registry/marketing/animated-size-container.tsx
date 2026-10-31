"use client";

import { useRef } from "react";

import { cn } from "cn";
import { motion } from "motion/react";

import { useResizeObserver } from "@/registry/hooks/use-resize-observer";

interface AnimatedSizeContainerProps
  extends Omit<
    React.ComponentPropsWithRef<typeof motion.div>,
    "animate" | "children"
  > {
  children: React.ReactNode;
  height?: boolean;
  width?: boolean;
}

function AnimatedSizeContainer({
  width = false,
  height = false,
  className,
  transition,
  children,
  ...props
}: AnimatedSizeContainerProps) {
  const containerRef = useRef<React.ComponentRef<"div">>(null);
  const resizeObserverEntry = useResizeObserver(containerRef);

  return (
    <motion.div
      animate={{
        height: height
          ? (resizeObserverEntry?.contentRect.height ?? "auto")
          : "auto",
        width: width
          ? (resizeObserverEntry?.contentRect.width ?? "auto")
          : "auto",
      }}
      className={cn("overflow-hidden", className)}
      transition={transition ?? { duration: 0.3, type: "spring" }}
      {...props}
    >
      <div
        className={cn(height && "h-max", width && "w-max")}
        ref={containerRef}
      >
        {children}
      </div>
    </motion.div>
  );
}

export { AnimatedSizeContainer };
