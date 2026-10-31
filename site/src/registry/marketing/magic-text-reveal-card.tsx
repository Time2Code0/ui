"use client";

import { memo, useEffect, useRef, useState } from "react";

import { cn } from "cn";
import { motion } from "motion/react";

interface Props {
  children?: React.ReactNode;
  className?: string;
  revealText: string;
  text: string;
}

export function MagicTextRevealCard({
  text,
  revealText,
  children,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [widthPercentage, setWidthPercentage] = useState(0);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    const { clientX } = event;

    if (ref.current) {
      const { left, width } = ref.current.getBoundingClientRect();
      setWidthPercentage(((clientX - left) / width) * 100);
    }
  };

  const onMouseLeave = () => {
    setIsMouseOver(false);
    setWidthPercentage(0);
  };

  const onMouseEnter = () => {
    setIsMouseOver(true);
  };

  const rotateDeg = (widthPercentage - 50) * 0.1;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-background p-4 backdrop-blur-xs",
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      ref={ref}
      role="none"
    >
      {children}

      <div className="relative flex items-center overflow-hidden">
        <motion.div
          animate={
            isMouseOver
              ? {
                  clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
                  opacity: widthPercentage > 0 ? 1 : 0,
                }
              : {
                  clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
                  opacity: 0,
                }
          }
          className="absolute z-20 bg-background will-change-transform"
          style={{ width: "100%" }}
          transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
        >
          <p className="bg-linear-to-b from-foreground to-foreground/90 bg-clip-text py-10 font-bold text-base text-foreground sm:text-[3rem]">
            {revealText}
          </p>
        </motion.div>

        <motion.div
          animate={{
            left: `${widthPercentage}%`,
            opacity: widthPercentage > 0 ? 1 : 0,
            rotate: `${rotateDeg}deg`,
          }}
          className="absolute z-50 h-40 w-2 bg-linear-to-b from-transparent via-foreground/10 to-transparent will-change-transform"
          transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
        />

        <div className="overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white,transparent)]">
          <p className="bg-foreground/10 bg-clip-text py-10 font-bold text-base text-transparent sm:text-[3rem]">
            {text}
          </p>

          <Sparkles />
        </div>
      </div>
    </div>
  );
}

interface Sparkle {
  animateLeft: string;
  animateTop: string;
  duration: number;
  left: string;
  opacity: number;
  top: string;
}

function createSparkles(): Sparkle[] {
  const randomMove = () => Math.random() * 4 - 2;

  return Array.from({ length: 140 }, () => ({
    animateLeft: `calc(${Math.random() * 100}% + ${randomMove()}px)`,
    animateTop: `calc(${Math.random() * 100}% + ${randomMove()}px)`,
    duration: Math.random() * 10 + 20,
    left: `${Math.random() * 100}%`,
    opacity: Math.random(),
    top: `${Math.random() * 100}%`,
  }));
}

const SparklesInternal = () => {
  // Random positions are generated after mount so the server render and
  // hydration agree.
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    setSparkles(createSparkles());
  }, []);

  return (
    <div className="absolute inset-0">
      {sparkles.map((sparkle, index) => (
        <motion.span
          animate={{
            left: sparkle.animateLeft,
            opacity: sparkle.opacity,
            scale: [1, 1.2, 0],
            top: sparkle.animateTop,
          }}
          className="inline-block"
          // biome-ignore lint/suspicious/noArrayIndexKey: static decorative list
          key={index}
          style={{
            backgroundColor: "var(--color-foreground)",
            borderRadius: "50%",
            height: "2px",
            left: sparkle.left,
            position: "absolute",
            top: sparkle.top,
            width: "2px",
            zIndex: 1,
          }}
          transition={{
            duration: sparkle.duration,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      ))}
    </div>
  );
};

export const Sparkles = memo(SparklesInternal);
