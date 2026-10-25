"use client";

import type { MotionStyle, MotionValue } from "motion/react";

import { createContext, use, useEffect, useRef, useState } from "react";

import { cn } from "cn";
import { motion, useScroll, useTransform } from "motion/react";

import { Card, CardPanel } from "../ui/card";

interface StickyStackedCardsContextValue {
  count: number;
  scrollYProgress: MotionValue<number>;
}

const StickyStackedCardsContext = createContext<
  StickyStackedCardsContextValue | undefined
>(undefined);

const useStickyStackedCards = () => {
  const context = use(StickyStackedCardsContext);

  if (!context) {
    throw new Error(
      "useStickyStackedCards must be used within <StickyStackedCardsContext.Provider>"
    );
  }

  return context;
};

function Root(props: React.ComponentPropsWithoutRef<"div">) {
  const ref = useRef<React.ComponentRef<"div">>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
    target: ref,
  });
  const [childrenLength, setChildrenLength] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setChildrenLength(ref.current.children.length);
    }
  }, []);

  return (
    <StickyStackedCardsContext.Provider
      value={{ count: childrenLength, scrollYProgress }}
    >
      <div ref={ref} {...props}>
        {props.children}
        {/* Workarround because otherwise the cards dont scale correctly */}
        <div className="sr-only relative">L</div>
      </div>
    </StickyStackedCardsContext.Provider>
  );
}

function StackedCard({
  index,
  children,
  className,
}: {
  index: number;
  children: React.ReactNode;
  className?: string;
}) {
  const { scrollYProgress, count } = useStickyStackedCards();

  const scale = useTransform(
    scrollYProgress,
    [0.4 - 0.2 * (count - index), 1],
    [1, 0.92 - 0.04 * (count - index)]
  );

  return (
    <Card
      render={
        <motion.div
          className={cn(
            "sticky top-0 mb-20 flex size-full p-24 pb-16",
            className
          )}
          style={
            {
              scale: index === count ? undefined : scale,
              top: `calc(10vh + (2vh * ${index}))`,
            } as MotionStyle
          }
        />
      }
    >
      <CardPanel className="p-0">{children}</CardPanel>
    </Card>
  );
}

export { Root, StackedCard };
