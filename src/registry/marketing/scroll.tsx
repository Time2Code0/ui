"use client";

import type { HTMLMotionProps, MotionValue, SpringOptions } from "motion/react";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  motion,
  useScroll as useFramerMotionScroll,
  useMotionValueEvent,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

interface AxisMotion {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

interface ScrollApi {
  container: React.RefObject<HTMLElement | null>;
  position: AxisMotion;
  progress: AxisMotion;
  velocity: AxisMotion;
}

const ScrollContext = createContext<ScrollApi | null>(null);

export function useScroll() {
  const context = useContext(ScrollContext);

  if (!context) {
    throw new Error(
      "useScroll must be used within <ScrollContainer /> or <WindowScrollProvider />"
    );
  }

  return context;
}

interface ScrollSmoothingProps {
  children: React.ReactNode;
  position?: SpringOptions;
  progress?: SpringOptions;
  velocity?: SpringOptions;
}

export function ScrollSmoothing({
  progress,
  position,
  velocity,
  children,
}: ScrollSmoothingProps) {
  const inherit = useScroll();
  const progressX = useSpring(inherit.progress.x, progress);
  const progressY = useSpring(inherit.progress.y, progress);
  const positionX = useSpring(inherit.position.x, position);
  const positionY = useSpring(inherit.position.y, position);
  const velocityX = useSpring(inherit.velocity.x, velocity);
  const velocityY = useSpring(inherit.velocity.y, velocity);

  const scrollApi = useMemo(
    () => ({
      ...inherit,
      position: {
        x: position ? positionX : inherit.position.x,
        y: position ? positionY : inherit.position.y,
      },
      progress: {
        x: progress ? progressX : inherit.progress.x,
        y: progress ? progressY : inherit.progress.y,
      },
      velocity: {
        x: velocity ? velocityX : inherit.velocity.x,
        y: velocity ? velocityY : inherit.velocity.y,
      },
    }),
    [
      progressX,
      progressY,
      positionX,
      positionY,
      velocityX,
      velocityY,
      inherit,
      progress,
      position,
      velocity,
    ]
  );

  return (
    <ScrollContext.Provider value={scrollApi}>
      {children}
    </ScrollContext.Provider>
  );
}

const SMOOTH_SPRING = {
  damping: 2,
  mass: 0.01,
  stiffness: 100,
};

export function WindowScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const container = useRef<HTMLElement>(null);
  const { scrollX, scrollXProgress, scrollY, scrollYProgress } =
    useFramerMotionScroll();

  const scrollXSpring = useSpring(scrollX, SMOOTH_SPRING);
  const scrollXVelocity = useVelocity(scrollXSpring);
  const scrollYSpring = useSpring(scrollY, SMOOTH_SPRING);
  const scrollYVelocity = useVelocity(scrollYSpring);

  const scrollApi = useMemo(
    () => ({
      container,
      position: {
        x: scrollX,
        y: scrollY,
      },
      progress: {
        x: scrollXProgress,
        y: scrollYProgress,
      },
      velocity: {
        x: scrollXVelocity,
        y: scrollYVelocity,
      },
    }),
    [
      scrollX,
      scrollY,
      scrollXProgress,
      scrollYProgress,
      scrollXVelocity,
      scrollYVelocity,
    ]
  );

  useLayoutEffect(() => {
    container.current = document.documentElement;
  });

  return (
    <ScrollContext.Provider value={scrollApi}>
      {children}
    </ScrollContext.Provider>
  );
}

export function ScrollContainer({
  children,
  style,
  ...props
}: HTMLMotionProps<"div">) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollX, scrollXProgress, scrollY, scrollYProgress } =
    useFramerMotionScroll({ container });

  const scrollXSpring = useSpring(scrollX, SMOOTH_SPRING);
  const scrollXVelocity = useVelocity(scrollXSpring);
  const scrollYSpring = useSpring(scrollY, SMOOTH_SPRING);
  const scrollYVelocity = useVelocity(scrollYSpring);

  const scrollApi = useMemo(
    () => ({
      container,
      position: {
        x: scrollX,
        y: scrollY,
      },
      progress: {
        x: scrollXProgress,
        y: scrollYProgress,
      },
      velocity: {
        x: scrollXVelocity,
        y: scrollYVelocity,
      },
    }),
    [
      scrollX,
      scrollY,
      scrollXProgress,
      scrollYProgress,
      scrollXVelocity,
      scrollYVelocity,
    ]
  );

  return (
    <ScrollContext.Provider value={scrollApi}>
      <motion.div
        ref={container}
        style={{
          overflow: "auto",
          position: "relative",
          ...style,
        }}
        {...props}
      >
        {children}
      </motion.div>
    </ScrollContext.Provider>
  );
}

interface ScrollIntersection {
  container: "start" | "center" | "end" | number;
  target: "start" | "center" | "end" | number;
}

interface ScrollTargetProps extends React.HTMLProps<HTMLDivElement> {
  axis?: "x" | "y";
  one?: ScrollIntersection;
  zero?: ScrollIntersection;
}

export function ScrollTarget({
  children,
  zero = { container: "start", target: "start" },
  one = { container: "end", target: "end" },
  axis = "y",
  ...props
}: ScrollTargetProps) {
  const inherit = useScroll();
  const target = useRef<HTMLDivElement>(null);
  const { scrollX, scrollXProgress, scrollY, scrollYProgress } =
    useFramerMotionScroll({
      axis,
      container: inherit.container,
      offset: [
        `${zero.target} ${zero.container}`,
        `${one.target} ${one.container}`,
      ],
      target,
    });

  const scrollApi = useMemo(
    () => ({
      ...inherit,
      position: {
        x: scrollX,
        y: scrollY,
      },
      progress: {
        x: scrollXProgress,
        y: scrollYProgress,
      },
    }),
    [inherit, scrollX, scrollY, scrollXProgress, scrollYProgress]
  );

  return (
    <ScrollContext.Provider value={scrollApi}>
      <div ref={target} {...props}>
        {children}
      </div>
    </ScrollContext.Provider>
  );
}

interface ScrollRangeProps {
  children: React.ReactNode;
  one?: number;
  zero?: number;
}

export function ScrollRange({ zero = 0, one = 1, children }: ScrollRangeProps) {
  const inherit = useScroll();
  const adjustXProgress = useTransform(inherit.progress.x, [zero, one], [0, 1]);
  const adjustYProgress = useTransform(inherit.progress.y, [zero, one], [0, 1]);

  const scrollApi = useMemo(
    () => ({
      ...inherit,
      progress: {
        x: adjustXProgress,
        y: adjustYProgress,
      },
    }),
    [adjustXProgress, adjustYProgress, inherit]
  );

  return (
    <ScrollContext.Provider value={scrollApi}>
      {children}
    </ScrollContext.Provider>
  );
}

type ScrollDirection = "up" | "down" | "static";

export function useScrollDirection() {
  const scroll = useScroll();
  const [direction, setDirection] = useState<ScrollDirection>("static");

  useMotionValueEvent(scroll.velocity.y, "change", (latest) => {
    if (latest > 0) {
      setDirection("down");
    } else if (latest < 0) {
      setDirection("up");
    } else {
      setDirection("static");
    }
  });

  return direction;
}

export function useScrollAtStart({ axis = "y" }: { axis?: "x" | "y" }) {
  const scroll = useScroll();
  const [atStart, setAtStart] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (!scroll.container.current) {
        return;
      }

      const { scrollTop, scrollLeft } = scroll.container.current;

      if (axis === "y") {
        setAtStart(scrollTop < 1);
      } else {
        setAtStart(scrollLeft < 1);
      }
    };

    scroll.container.current?.addEventListener("scroll", handleScroll);

    return () => {
      scroll.container.current?.removeEventListener("scroll", handleScroll);
    };
  });

  return atStart;
}

export function useScrollAtEnd({ axis = "y" }: { axis?: "x" | "y" }) {
  const scroll = useScroll();
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!scroll.container.current) {
        return;
      }

      const {
        scrollTop,
        scrollLeft,
        scrollHeight,
        scrollWidth,
        clientHeight,
        clientWidth,
      } = scroll.container.current;

      if (axis === "y") {
        setAtEnd(scrollHeight - scrollTop - clientHeight < 1);
      } else {
        setAtEnd(scrollWidth - scrollLeft - clientWidth < 1);
      }
    };

    scroll.container.current?.addEventListener("scroll", handleScroll);

    return () => {
      scroll.container.current?.removeEventListener("scroll", handleScroll);
    };
  });

  return atEnd;
}
