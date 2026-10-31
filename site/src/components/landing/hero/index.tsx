import { Dot } from "@/registry/marketing/pattern";
import { buttonVariants } from "@/registry/ui/button";
import { Link } from "@/registry/ui/link";

import { AgentPrompt } from "./agent-prompt";
import { Showcase } from "./showcase";

export function Hero() {
  return (
    <section className="relative z-10 overflow-x-clip">
      <Dot
        aria-hidden="true"
        className="fill-foreground/[0.09] [mask-image:linear-gradient(to_bottom,black,transparent_32rem)]"
        height={14}
        width={14}
      />

      <div className="relative grid gap-8 px-4 py-8 sm:px-8 md:py-12 lg:py-16 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end xl:gap-10">
        <div className="motion-safe:fade-in motion-safe:slide-in-from-bottom-2 flex max-w-2xl flex-col items-start gap-2 fill-mode-both motion-safe:animate-in motion-safe:duration-700 xl:gap-4">
          <h1
            className="text-balance font-medium text-4xl leading-[1.05] tracking-[-0.03em] lg:text-5xl"
            id="hero-title"
          >
            A component library built for humans and agents.
          </h1>
          <p className="text-pretty text-foreground-muted lg:text-lg">
            Shadcn-compatible components, blocks, and particles build with Base
            UI and Tailwind CSS. Copy what you need, make it yours.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              className={buttonVariants({ size: "lg" })}
              href="/docs/get-started"
            >
              Get started
            </Link>
            <Link
              className={buttonVariants({ size: "lg", variant: "outline" })}
              href="/particles"
            >
              Browse particles
            </Link>
          </div>
        </div>

        <AgentPrompt className="motion-safe:fade-in motion-safe:slide-in-from-bottom-2 fill-mode-both motion-safe:animate-in motion-safe:delay-100 motion-safe:duration-700 xl:w-[30rem]" />
      </div>

      <div className="motion-safe:fade-in relative fill-mode-both motion-safe:animate-in motion-safe:delay-200 motion-safe:duration-1000">
        <Showcase />
      </div>
    </section>
  );
}
