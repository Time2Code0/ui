import { MagicTextRevealCard } from "@/registry/marketing/magic-text-reveal-card";

export function Particle() {
  return (
    <MagicTextRevealCard
      className="w-full max-w-xl"
      revealText="Here's the secret"
      text="Hover over me"
    >
      <p className="text-foreground-muted text-sm">
        Move your cursor across the card
      </p>
    </MagicTextRevealCard>
  );
}
