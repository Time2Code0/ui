import { RotateInterval } from "@/registry/marketing/rotate-interval";

export function Particle() {
  return (
    <div className="flex items-center gap-2 font-semibold text-4xl tracking-tight">
      Build
      <RotateInterval
        interval={2000}
        items={["faster", "better", "together"]}
      />
    </div>
  );
}
