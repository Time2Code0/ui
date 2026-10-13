import { HighlightCard } from "@/registry/marketing/highlight-card";

export function Particle() {
  return (
    <HighlightCard angle={20} className="w-72">
      <div className="flex flex-col gap-1">
        <span className="font-semibold">Hover me</span>
        <span className="text-foreground-muted text-sm">
          A shine sweeps across the card while the cursor is over it.
        </span>
      </div>
    </HighlightCard>
  );
}
