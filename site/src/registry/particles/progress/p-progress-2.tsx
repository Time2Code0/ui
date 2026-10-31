import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@/registry/ui/progress";

export function Particle() {
  return (
    <Progress suppressHydrationWarning value={60}>
      <div className="flex items-center justify-between gap-2">
        <ProgressLabel>Export data</ProgressLabel>
        <ProgressValue suppressHydrationWarning />
      </div>
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  );
}
