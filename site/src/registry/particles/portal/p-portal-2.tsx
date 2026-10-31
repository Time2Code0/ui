"use client";

import { useState } from "react";

import { Portal } from "@/registry/ui/portal";

export function Particle() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="grid w-full grid-cols-2 gap-4 text-sm">
      <div className="flex flex-col gap-2 rounded-lg border p-4">
        <span className="text-foreground-muted">Declared here</span>
        <Portal className="font-medium" container={container}>
          Hello from the left
        </Portal>
      </div>
      <div className="flex flex-col gap-2 rounded-lg border p-4">
        <span className="text-foreground-muted">Rendered here</span>
        <div ref={setContainer} />
      </div>
    </div>
  );
}
