"use client";

import { useEffect, useState } from "react";

import {
  motion,
  useAnimationControls,
  useMotionValue,
  useTransform,
} from "motion/react";

import { GradientText } from "./gradient-text";

export function MagicText({ children }: { children: React.ReactNode }) {
  const [isHovered, setHovered] = useState(false);

  return (
    <span
      className="group relative inline-block"
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
      role="none"
    >
      {new Array(3).fill(crypto.randomUUID()).map((key, index) => (
        <Star delay={100 * index} hovered={isHovered} key={key} />
      ))}

      <GradientText animate>{children}</GradientText>
    </span>
  );
}

function Star({ hovered, delay = 0 }: { hovered: boolean; delay?: number }) {
  const containerAnimation = useAnimationControls();
  const svgAnimation = useAnimationControls();

  const positionTop = useMotionValue(0);
  const positionLeft = useMotionValue(0);

  useEffect(() => {
    const doAnimation = async () => {
      if (!hovered) {
        return;
      }

      positionTop.set(Math.floor(Math.random() * 101));
      positionLeft.set(Math.floor(Math.random() * 101));

      await containerAnimation.start({
        scale: [0, 1, 0],
        transition: { delay: 0.3, duration: 0.7 },
      });

      await svgAnimation.start({
        rotate: [0, 180],
        transition: { duration: 1 },
      });
    };

    doAnimation().catch(() => {
      console.error();
    });

    const interval = setInterval(() => {
      doAnimation().catch(() => {
        console.error();
      });
    }, 1000 + delay);

    return () => {
      clearInterval(interval);
    };
  }, [
    containerAnimation,
    delay,
    hovered,
    positionLeft,
    positionTop,
    svgAnimation,
  ]);

  const top = useTransform(() => `${positionTop.get()}%`);
  const left = useTransform(() => `${positionLeft.get()}%`);

  return (
    <motion.span
      animate={containerAnimation}
      className="pointer-events-none absolute block select-none opacity-0 group-hover:opacity-100"
      style={{ left, top }}
    >
      <motion.svg
        animate={svgAnimation}
        className="fill-primary opacity-50"
        height="40"
        viewBox="0 0 68 68"
        width="40"
      >
        <title>Wand</title>
        <path d="M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z" />
      </motion.svg>
    </motion.span>
  );
}
