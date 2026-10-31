"use client";

import { useEffect, useRef } from "react";

import { cn } from "cn";
import { motion, useAnimationControls, useMotionValue } from "motion/react";

import { Card, CardPanel } from "../ui/card";

interface Props {
  angle?: number;
  children: React.ReactNode;
  className?: string;
}

export function HighlightCard({ children, className, angle = 0 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const controls = useAnimationControls();
  const height = useMotionValue(0);
  const width = useMotionValue(0);

  useEffect(() => {
    const calcSize = () => {
      if (containerRef.current) {
        const containerWith = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;

        width.set(containerWith * 2);
        height.set(
          Math.sqrt(
            containerWith * containerWith + containerHeight * containerHeight
          )
        );
      }
    };

    calcSize();
    window.addEventListener("resize", calcSize);

    return () => {
      window.removeEventListener("resize", calcSize);
    };
  }, [height, width]);

  return (
    <Card
      className={cn("overflow-hidden", className)}
      render={
        <motion.div
          onHoverEnd={async () => {
            await controls.start({
              backgroundPosition: "0% 0%",
              transition: { duration: 0 },
            });
          }}
          onHoverStart={async () => {
            await controls.start({
              backgroundPosition: "200% 0%",
              transition: { duration: 1 },
            });
          }}
          ref={containerRef}
        />
      }
    >
      <CardPanel>
        {children}

        <motion.div
          animate={controls}
          className="pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rotate-[var(--shine-angle)] bg-[linear-gradient(to_right,transparent_20%,transparent_40%,hsla(0,0%,100%,10%)_50%,hsla(0,0%,100%,10%)_55%,transparent_70%,transparent_100%)] opacity-25 [background-size:200%_auto]"
          style={{
            // @ts-expect-error: Type has no support for css variable declaration
            "--shine-angle": `${angle}deg`,
            height,
            width,
          }}
        />
      </CardPanel>
    </Card>
  );
}
