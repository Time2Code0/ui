"use client";

import { useState } from "react";

import { useInterval } from "@/registry/hooks/use-interval";
import { Button } from "@/registry/ui/button";

export function Particle() {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(true);

  useInterval(() => setCount((value) => value + 1), running ? 1000 : null);

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="font-semibold text-4xl tabular-nums">{count}</span>
      <div className="flex gap-2">
        <Button onClick={() => setRunning((value) => !value)} variant="outline">
          {running ? "Pause" : "Resume"}
        </Button>
        <Button onClick={() => setCount(0)} variant="ghost">
          Reset
        </Button>
      </div>
    </div>
  );
}
