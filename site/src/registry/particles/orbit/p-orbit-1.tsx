"use client";

import { useTransform } from "motion/react";

import { useClock } from "@/registry/hooks/use-clock";
import { Orbit, Satellite } from "@/registry/marketing/orbit";

export function Particle() {
  const clock = useClock();
  // One full lap every 12 seconds.
  const angle = useTransform(clock.value, (value) => (value / 12_000) * 360);
  const opposite = useTransform(angle, (value) => value + 180);

  return (
    <Orbit className="size-56 rounded-full border border-dashed">
      <div className="absolute inset-0 flex items-center justify-center font-medium text-sm">
        Orbit
      </div>
      <Satellite position={angle}>
        <span className="block size-4 rounded-full bg-primary" />
      </Satellite>
      <Satellite position={opposite}>
        <span className="block size-3 rounded-full bg-secondary" />
      </Satellite>
    </Orbit>
  );
}
