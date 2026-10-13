/** biome-ignore-all lint/performance/noImgElement: dont need optimization */
"use client";

import { useState } from "react";

import { MoveHorizontalIcon } from "@hugeicons/core-free-icons";
import { cn } from "cn";

import { Icon } from "../ui/icon";

interface Props {
  after: string;
  before: string;
  className?: string;
}

export function ImageComparison({ before, after, className }: Props) {
  const [location, setLocation] = useState(50);

  return (
    <div className={cn("relative border", className)}>
      <div
        className="absolute inset-0 z-10"
        style={{ clipPath: `inset(0 0 0 ${location}%)` }}
      >
        <img
          alt="After"
          className="size-full object-cover align-bottom"
          height={1080}
          src={after}
          width={1920}
        />
      </div>

      <img
        alt="Before"
        className="size-full object-cover align-bottom"
        height={1080}
        src={before}
        width={1920}
      />

      <input
        aria-label="Comparison position"
        className="absolute inset-0 z-20 cursor-pointer touch-auto opacity-0"
        max={100}
        min={0}
        onChange={(e) => {
          setLocation(Number(e.target.value));
        }}
        type="range"
      />

      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 z-10 flex -translate-x-1/2 items-center justify-center",
          "before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-foreground"
        )}
        style={{ left: `${location}%` }}
      >
        <div className="flex size-10 items-center justify-center rounded-full bg-foreground">
          <Icon className="text-background" icon={MoveHorizontalIcon} />
        </div>
      </div>
    </div>
  );
}
