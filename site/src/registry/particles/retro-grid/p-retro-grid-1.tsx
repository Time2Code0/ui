import { RetroGrid } from "@/registry/marketing/retro-grid";

export function Particle() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border">
      <RetroGrid gradient />
      <span className="relative font-semibold text-4xl tracking-tight">
        Retro Grid
      </span>
    </div>
  );
}
