"use client";

import { useState } from "react";

import { Counter } from "@/registry/marketing/counter";
import { Button } from "@/registry/ui/button";

const values = [100, 2500, 1_000_000];

export function Particle() {
  const [value, setValue] = useState(values[0]);

  return (
    <div className="flex flex-col items-center gap-6">
      <Counter
        className="font-semibold text-5xl tabular-nums tracking-tight"
        to={value}
      />
      <div className="flex gap-2">
        {values.map((option) => (
          <Button
            key={option}
            onClick={() => setValue(option)}
            size="sm"
            variant={value === option ? "default" : "outline"}
          >
            {Intl.NumberFormat("en-US").format(option)}
          </Button>
        ))}
      </div>
    </div>
  );
}
