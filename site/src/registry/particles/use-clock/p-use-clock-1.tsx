"use client";

import { useState } from "react";

import { motion, useTransform } from "motion/react";

import { useClock } from "@/registry/hooks/use-clock";
import { Button } from "@/registry/ui/button";

const rates = [0, 0.5, 1, 3];

export function Particle() {
  const clock = useClock();
  const [rate, setRate] = useState(1);
  // The clock advances by 1000 per second at rate 1.
  const rotate = useTransform(clock.value, (value) => value * 0.09);

  return (
    <div className="flex flex-col items-center gap-8">
      <motion.div
        className="size-16 rounded-xl bg-foreground"
        style={{ rotate }}
      />
      <div className="flex gap-2">
        {rates.map((value) => (
          <Button
            key={value}
            onClick={() => {
              setRate(value);
              clock.setRate(value);
            }}
            size="sm"
            variant={rate === value ? "default" : "outline"}
          >
            {value}×
          </Button>
        ))}
      </div>
    </div>
  );
}
