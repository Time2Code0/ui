"use client";

import { useState } from "react";

import { Box, FadeIn, From, Text } from "@/registry/marketing/reveal";
import { Button } from "@/registry/ui/button";

export function Particle() {
  const [key, setKey] = useState(0);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-3" key={key}>
        <Text className="font-semibold text-4xl tracking-tight" text="Reveal" />
        <From delay={0.2} from="bottom">
          <p className="text-foreground-muted">Slides in from below.</p>
        </From>
        <Box delay={0.4} from="left">
          <p className="px-2 font-medium">Uncovered by a sliding box.</p>
        </Box>
        <FadeIn delay={0.6}>
          <p className="text-foreground-muted text-sm">And fades in last.</p>
        </FadeIn>
      </div>
      <Button onClick={() => setKey((value) => value + 1)} variant="outline">
        Replay
      </Button>
    </div>
  );
}
