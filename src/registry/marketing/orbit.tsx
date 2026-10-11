"use client";

import type { HTMLMotionProps, MotionValue } from "motion/react";

import { createContext, useContext, useEffect, useRef, useState } from "react";

import { cn } from "cn";
import { motion, useMotionTemplate, useTransform } from "motion/react";

import { useCoerceToMotionValue } from "@/registry/hooks/use-coerce-to-motion-value";

interface OrbitContextApi {
  orbitRef: React.RefObject<SVGRectElement | null>;
}

const OrbitContext = createContext<OrbitContextApi | null>(null);

export function useOrbit() {
  const context = useContext(OrbitContext);

  if (!context) {
    throw new Error("useOrbit must be used within <Orbit />");
  }

  return context;
}

interface OrbitProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export function Orbit({ children, className, ...props }: OrbitProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGRectElement>(null);

  const [orbitRadius, setOrbitRadius] = useState("0px");

  useEffect(() => {
    // @ts-expect-error: TODO: fix later
    const computedRadius = getComputedStyle(svgRef.current).getPropertyValue(
      "border-radius"
    );
    setOrbitRadius(computedRadius);
  }, []);

  return (
    <OrbitContext.Provider value={{ orbitRef: pathRef }}>
      <motion.div className={cn("relative", className)} {...props}>
        <svg
          preserveAspectRatio="none"
          ref={svgRef}
          style={{
            borderRadius: "inherit",
            height: "100%",
            position: "absolute",
            width: "100%",
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Orbiter</title>
          <rect
            fill="none"
            height="100%"
            ref={pathRef}
            rx={orbitRadius}
            ry={orbitRadius}
            width="100%"
          />
        </svg>
        {children}
      </motion.div>
    </OrbitContext.Provider>
  );
}

const mod = (n: number, m: number) => ((n % m) + m) % m;

interface SatelliteProps extends HTMLMotionProps<"div"> {
  position?: number | MotionValue<number>;
}

export function Satellite({
  position = 0,
  style,
  className,
  ...props
}: SatelliteProps) {
  const orbit = useOrbit();
  const angle = useCoerceToMotionValue(position);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // this timeout is required for firefox to have a path length ready
    setTimeout(() => {
      setReady(true);
    }, 0);
  }, []);

  const offset = useTransform(angle, (val) => {
    const length = orbit.orbitRef.current?.getTotalLength();
    if (length) {
      return mod((val / 360) * length, length);
    }

    return 0;
  });

  const x = useTransform(
    offset,
    (val) => orbit.orbitRef.current?.getPointAtLength(val).x
  );
  const y = useTransform(
    offset,
    (val) => orbit.orbitRef.current?.getPointAtLength(val).y
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <motion.div
      className={cn("absolute top-0 left-0 inline-block", className)}
      style={{
        transform,
        visibility: ready ? "visible" : "hidden",
        ...style,
      }}
      {...props}
    />
  );
}
