import { AiReady } from "@/components/landing/ai-ready";
import { Catalog } from "@/components/landing/catalog";
import { Closing } from "@/components/landing/closing";
import { Hero } from "@/components/landing/hero";
import { Introduction } from "@/components/landing/introduction";

export default function Page() {
  return (
    <main>
      <Hero />
      <Introduction />
      <Catalog />
      <AiReady />
      <Closing />
    </main>
  );
}
