import { Dot, Hex, Line, Square } from "@/registry/marketing/pattern";

export function Particle() {
  return (
    <div className="grid w-full grid-cols-2 gap-4 text-sm">
      <div className="relative flex h-40 items-end overflow-hidden rounded-xl border p-3">
        <Square
          squares={[
            [2, 1],
            [4, 2],
          ]}
        />
        <span className="relative">Square</span>
      </div>
      <div className="relative flex h-40 items-end overflow-hidden rounded-xl border p-3">
        <Hex />
        <span className="relative">Hex</span>
      </div>
      <div className="relative flex h-40 items-end overflow-hidden rounded-xl border p-3">
        <Dot />
        <span className="relative">Dot</span>
      </div>
      <div className="relative flex h-40 items-end overflow-hidden rounded-xl border p-3">
        <Line />
        <span className="relative">Line</span>
      </div>
    </div>
  );
}
