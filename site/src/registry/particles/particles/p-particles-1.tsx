import { Particles } from "@/registry/marketing/particles";

export function Particle() {
  return (
    <div className="dark relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl bg-background text-foreground">
      <Particles className="absolute inset-0" id="particles-demo" />
      <span className="pointer-events-none relative font-semibold text-3xl tracking-tight">
        Particles
      </span>
    </div>
  );
}
