import { Noise } from "@/registry/marketing/noise";

export function Particle() {
  return (
    <div className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-primary to-secondary">
      <Noise blendMode="overlay" grainSize={2} opacity={0.6} />
      <span className="relative font-semibold text-3xl text-white tracking-tight">
        Noise
      </span>
    </div>
  );
}
