import { TextScrollReveal } from "@/registry/marketing/text-scroll-reveal";

export function Particle() {
  return (
    <TextScrollReveal
      className="h-[150vh] max-w-xl font-semibold text-3xl tracking-tight"
      text="Scroll down the page and watch each word light up one after another as you read along."
    />
  );
}
