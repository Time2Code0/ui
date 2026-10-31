import { LedMatrix } from "@/registry/marketing/led-matrix";

export function Particle() {
  return (
    <div className="relative h-80 w-full overflow-hidden rounded-xl border">
      <LedMatrix
        colors={[
          [59, 130, 246],
          [139, 92, 246],
        ]}
      />
      <div className="absolute inset-0 flex items-center justify-center font-semibold text-3xl tracking-tight">
        LED Matrix
      </div>
    </div>
  );
}
