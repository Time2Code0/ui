"use client";

import type { ConfettiApi } from "@/registry/marketing/confetti";

import { useRef } from "react";

import { Confetti } from "@/registry/marketing/confetti";
import { Button } from "@/registry/ui/button";

export function Particle() {
  const ref = useRef<ConfettiApi>(null);

  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden">
      <Confetti
        className="pointer-events-none absolute inset-0 z-50 size-full"
        manualStart
        ref={ref}
      />
      <Button onClick={() => ref.current?.fire()}>Fire confetti</Button>
    </div>
  );
}
