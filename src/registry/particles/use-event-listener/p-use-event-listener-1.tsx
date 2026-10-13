"use client";

import { useState } from "react";

import { useEventListener } from "@/registry/hooks/use-event-listener";
import { Kbd } from "@/registry/ui/kbd";

export function Particle() {
  const [key, setKey] = useState<string>();

  useEventListener("keydown", (event) => setKey(event.key));

  return (
    <div className="flex flex-col items-center gap-3 text-sm">
      <span className="text-foreground-muted">Press any key</span>
      {key ? <Kbd className="h-8 min-w-8 px-2 text-base">{key}</Kbd> : null}
    </div>
  );
}
