"use client";

import type { HTMLMotionProps, MotionValue, SpringOptions } from "motion/react";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "cn";
import { motion, useSpring, useTransform, useVelocity } from "motion/react";

import { useMousePosition } from "@/registry/hooks/use-mouse-position";

const SMOOTH_SPRING = {
  damping: 2,
  mass: 0.01,
  stiffness: 100,
};

interface AxisMotion {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

interface MouseTargetInfo {
  data: unknown;
  id: string;
}

interface MouseContextApi {
  activeTarget: MouseTargetInfo | undefined;
  popTarget: (targetId: string) => void;
  position: AxisMotion;
  pushTarget: (target: MouseTargetInfo) => void;
  targets: MouseTargetInfo[];
  velocity: AxisMotion;
}

const MouseContext = createContext<MouseContextApi | null>(null);

export function useMouse() {
  const context = useContext(MouseContext);

  if (!context) {
    throw new Error("useMouse must be used within <MouseProvider />");
  }

  return context;
}

export function MouseProvider({
  children,
  defaultX = -1000,
  defaultY = -1000,
}: {
  children: React.ReactNode;
  defaultX?: number;
  defaultY?: number;
}) {
  const { x, y } = useMousePosition({ defaultX, defaultY });
  const xSpring = useSpring(x, SMOOTH_SPRING);
  const velocityX = useVelocity(xSpring);
  const ySpring = useSpring(y, SMOOTH_SPRING);
  const velocityY = useVelocity(ySpring);
  const [targets, setTargets] = useState<MouseTargetInfo[]>([]);

  const pushTarget = useCallback((target: MouseTargetInfo) => {
    setTargets((prev) => [...prev, target]);
  }, []);

  const popTarget = useCallback((targetId: string) => {
    setTargets((prev) => prev.filter((t) => t.id !== targetId));
  }, []);

  const activeTarget = targets.at(-1) as MouseTargetInfo | undefined;

  const api = useMemo(
    () => ({
      activeTarget,
      popTarget,
      position: {
        x,
        y,
      },
      pushTarget,
      targets,
      velocity: {
        x: velocityX,
        y: velocityY,
      },
    }),
    [activeTarget, popTarget, pushTarget, targets, velocityX, velocityY, x, y]
  );

  return <MouseContext.Provider value={api}>{children}</MouseContext.Provider>;
}

interface MouseContainerProps extends HTMLMotionProps<"div"> {
  defaultX?: number;
  defaultY?: number;
  resetPositionOnLeave?: boolean;
}

export function MouseContainer({
  children,
  defaultX = -1000,
  defaultY = -1000,
  resetPositionOnLeave = false,
  ...props
}: MouseContainerProps) {
  const container = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition({ defaultX, defaultY, ref: container });

  const xSpring = useSpring(x, SMOOTH_SPRING);
  const velocityX = useVelocity(xSpring);
  const ySpring = useSpring(y, SMOOTH_SPRING);
  const velocityY = useVelocity(ySpring);
  const [targets, setTargets] = useState<MouseTargetInfo[]>([]);

  const pushTarget = useCallback((target: MouseTargetInfo) => {
    setTargets((prev) => [...prev, target]);
  }, []);

  const popTarget = useCallback((targetId: string) => {
    setTargets((prev) => prev.filter((t) => t.id !== targetId));
  }, []);

  const activeTarget = targets.at(-1) as MouseTargetInfo | undefined;

  const api = useMemo(
    () => ({
      activeTarget,
      popTarget,
      position: {
        x,
        y,
      },
      pushTarget,
      targets,
      velocity: {
        x: velocityX,
        y: velocityY,
      },
    }),
    [activeTarget, popTarget, pushTarget, targets, velocityX, velocityY, x, y]
  );

  return (
    <MouseContext.Provider value={api}>
      <motion.div
        ref={container}
        {...props}
        onMouseLeave={(e) => {
          if (resetPositionOnLeave) {
            x.set(defaultX);
            y.set(defaultY);
          }

          props.onMouseLeave?.(e);
        }}
      >
        {children}
      </motion.div>
    </MouseContext.Provider>
  );
}

export type Loose<T> = T | (string & {});

interface MouseFollowerProps extends Omit<HTMLMotionProps<"div">, "children"> {
  alignX?: Loose<"start" | "end" | "center">;
  alignY?: Loose<"start" | "end" | "center">;
  children: React.ReactNode | ((mouse: MouseContextApi) => React.ReactNode);
}

const PERCENT_BY_ALIGNMENT: Record<string, string> = {
  center: "-50%",
  end: "-100%",
  start: "0%",
};

export function MouseFollower({
  children,
  className,
  style,
  alignX = "center",
  alignY = "center",
  ...props
}: MouseFollowerProps) {
  const mouse = useMouse();
  const transform = useTransform(
    [mouse.position.x, mouse.position.y],
    ([x, y]) =>
      `translateX(${x as number}px) translateY(${y as number}px) translateX(${
        PERCENT_BY_ALIGNMENT[`${alignX}`] ?? alignX
      }) translateY(${PERCENT_BY_ALIGNMENT[`${alignY}`] ?? alignY})`
  );
  const resolvedChildren =
    typeof children === "function" ? children(mouse) : children;

  return (
    <motion.div
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-999 inline-block",
        className
      )}
      style={{
        transform,
        ...style,
      }}
      {...props}
    >
      {resolvedChildren}
    </motion.div>
  );
}

interface MouseTargetProps extends HTMLMotionProps<"div"> {
  data: unknown;
  targetId?: string;
}

export function MouseTarget({
  children,
  onMouseEnter,
  onMouseLeave,
  data = {},
  targetId,
  ...props
}: MouseTargetProps) {
  const fallbackId = useId();
  const id = targetId ?? fallbackId;
  const ref = useRef(null);
  const mouse = useMouse();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only run once on mount
  useEffect(
    () => () => {
      mouse.popTarget(id);
    },
    []
  );

  return (
    <motion.div
      onMouseEnter={(e) => {
        mouse.pushTarget({ data, id });
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        mouse.popTarget(id);
        onMouseLeave?.(e);
      }}
      ref={ref}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface MouseSmoothingProps {
  children: React.ReactNode;
  position?: SpringOptions;
  velocity?: SpringOptions;
}

export function MouseSmoothing({
  position,
  velocity,
  children,
}: MouseSmoothingProps) {
  const inherit = useMouse();
  const positionX = useSpring(inherit.position.x, position);
  const positionY = useSpring(inherit.position.y, position);
  const velocityX = useSpring(inherit.velocity.x, velocity);
  const velocityY = useSpring(inherit.velocity.y, velocity);

  const api = useMemo(
    () => ({
      ...inherit,
      position: {
        x: position ? positionX : inherit.position.x,
        y: position ? positionY : inherit.position.y,
      },
      velocity: {
        x: velocity ? velocityX : inherit.velocity.x,
        y: velocity ? velocityY : inherit.velocity.y,
      },
    }),
    [inherit, position, positionX, positionY, velocity, velocityX, velocityY]
  );

  return <MouseContext.Provider value={api}>{children}</MouseContext.Provider>;
}
