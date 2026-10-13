import { NorthernLights } from "@/registry/marketing/northern-lights";

export function Particle() {
  return (
    <div className="relative flex h-96 w-full items-center justify-center overflow-hidden rounded-xl border">
      <NorthernLights height={384} />
      <span className="relative font-semibold text-4xl tracking-tight">
        Northern Lights
      </span>
    </div>
  );
}
