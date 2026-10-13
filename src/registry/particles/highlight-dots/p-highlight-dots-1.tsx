import { HighlightDots } from "@/registry/marketing/highlight-dots";

export function Particle() {
  return (
    <div className="relative h-72 w-full overflow-hidden rounded-xl border">
      <HighlightDots containerClassName="flex items-center justify-center">
        <span className="font-semibold text-3xl tracking-tight">
          Highlight Dots
        </span>
      </HighlightDots>
    </div>
  );
}
