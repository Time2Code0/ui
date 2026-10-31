"use client";

import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@/registry/ui/progress";

export function Particle() {
  return (
    <Progress max={512} suppressHydrationWarning value={502}>
      <div className="flex items-center justify-between gap-2">
        <ProgressLabel>Upload</ProgressLabel>
        <ProgressValue>{(_formatted, value) => `${value} / 512`}</ProgressValue>
      </div>
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  );
}
