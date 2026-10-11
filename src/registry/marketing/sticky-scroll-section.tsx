"use client";

import { createContext, useContext, useRef, useState } from "react";

import { cn } from "cn";
import { useMotionValueEvent, useScroll } from "motion/react";

import { Portal } from "@/registry/ui/portal";

interface StickyScrollRevealContextValue {
  activeChildIndex: number;
  reactorRef: React.RefObject<HTMLDivElement | null>;
}

const StickyScrollRevealContext = createContext<
  StickyScrollRevealContextValue | undefined
>(undefined);

const useStickyScrollReveal = () => {
  const context = useContext(StickyScrollRevealContext);

  if (!context) {
    throw new Error(
      "useStickyScrollReveal must be used within <StickyScrollRevealContext.Provder>"
    );
  }

  return context;
};

function Root({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reactorRef = useRef<HTMLDivElement>(null);

  const [activeItemIndex, setActiveItemIndex] = useState(0);

  const items: unknown[] = [];

  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const itemsBreakpoints = items.map((_, index) => index / items.length);
    itemsBreakpoints.forEach((breakpoint, index) => {
      if (latest > breakpoint - 0.2 && latest <= breakpoint) {
        setActiveItemIndex(index);
      }
    });
  });

  return (
    <StickyScrollRevealContext.Provider
      value={{ activeChildIndex: activeItemIndex, reactorRef }}
    >
      <div
        className={cn("relative flex justify-center gap-10 p-10", className)}
        ref={ref}
      >
        <div className="relative flex max-w-2xl items-start px-4">
          {children}
          <div className="h-40" />
        </div>

        <div ref={reactorRef} />
      </div>
    </StickyScrollRevealContext.Provider>
  );
}

function Item({
  render,
}: {
  render: (isActive: boolean) => React.ReactElement;
}) {
  const index = 1;

  const { activeChildIndex } = useStickyScrollReveal();

  return <>{render(activeChildIndex === index)}</>;
}

function Trigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("my-20", className)}>{children}</div>;
}

function Reactor({ children }: { children: React.ReactNode }) {
  const { reactorRef } = useStickyScrollReveal();

  return <Portal container={reactorRef.current}>{children}</Portal>;
}

export { Item, Reactor, Root, Trigger };
