import { Spotlight } from "@/registry/marketing/spotlight";

export function Particle() {
  return (
    <div className="dark relative isolate flex h-96 w-full items-center justify-center overflow-hidden rounded-xl bg-background text-foreground">
      <Spotlight />
      <Spotlight orientation="right" />
      <span className="font-semibold text-4xl tracking-tight">Spotlight</span>
    </div>
  );
}
