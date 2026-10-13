"use client";

import { useClock } from "@/registry/hooks/use-clock";
import { Ticker } from "@/registry/marketing/ticker";

export function Particle() {
  const clock = useClock();

  return (
    <div className="flex flex-col items-center gap-6">
      <Ticker
        className="h-10 w-72 rounded-lg border"
        clock={clock}
        duration={8000}
      >
        <div className="flex size-full items-center justify-around font-medium text-sm">
          <span>Design</span>
          <span>·</span>
          <span>Develop</span>
          <span>·</span>
          <span>Deploy</span>
        </div>
      </Ticker>
      <Ticker
        className="h-10 w-40 rounded-lg border"
        clock={clock}
        direction="vertical"
        duration={4000}
      >
        <div className="flex size-full items-center justify-center font-medium text-sm">
          Vertical
        </div>
      </Ticker>
    </div>
  );
}
