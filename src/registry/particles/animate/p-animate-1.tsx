"use client";

import { useState } from "react";

import { FadeIn, From, ZoomIn } from "@/registry/marketing/animate";
import { Button } from "@/registry/ui/button";

export function Particle() {
  const [key, setKey] = useState(0);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-4" key={key}>
        <FadeIn custom={0}>
          <div className="flex size-20 items-center justify-center rounded-xl border text-sm">
            Fade
          </div>
        </FadeIn>
        <ZoomIn custom={1}>
          <div className="flex size-20 items-center justify-center rounded-xl border text-sm">
            Zoom
          </div>
        </ZoomIn>
        <From custom={2} direction="bottom">
          <div className="flex size-20 items-center justify-center rounded-xl border text-sm">
            From
          </div>
        </From>
      </div>
      <Button onClick={() => setKey((value) => value + 1)} variant="outline">
        Replay
      </Button>
    </div>
  );
}
