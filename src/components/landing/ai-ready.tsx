import { cn } from "cn";

import { Line } from "@/registry/marketing/pattern";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar";
import { Badge } from "@/registry/ui/badge";

import {
  ClaudeIcon,
  CursorIcon,
  GeminiIcon,
  OpenAIIcon,
  ReactIcon,
  TailwindIcon,
  TypeScriptIcon,
  VerifiedIcon,
  VSCodeIcon,
  WindsurfIcon,
} from "../brand-icons";

const features = [
  {
    description:
      "React, TypeScript, Tailwind CSS with CVA, and shadcn-style composition and APIs. Your AI will love it.",
    icons: [
      { icon: ReactIcon, name: "React" },
      { icon: TypeScriptIcon, name: "TypeScript" },
      { icon: TailwindIcon, name: "Tailwind CSS" },
    ],
    label: "Works with",
    title: "Perfect AI stack",
  },
  {
    description: (
      <>
        Every docs page is indexed in{" "}
        <code className="font-mono text-[0.9em] text-foreground">llms.txt</code>
        , so LLMs understand your components and design system styles at
        inference time.
      </>
    ),
    icons: [
      { icon: ClaudeIcon, name: "Claude" },
      { icon: OpenAIIcon, name: "ChatGPT" },
      { icon: GeminiIcon, name: "Gemini" },
    ],
    label: "Read by",
    title: "Power up your AI agent",
  },
  {
    badge: "Soon",
    description:
      "AI-powered component generation with a local agent, drawing on the full Akari library.",
    icons: [
      { icon: CursorIcon, name: "Cursor" },
      { icon: WindsurfIcon, name: "Windsurf" },
      { icon: VSCodeIcon, name: "VS Code" },
    ],
    label: "Runs in",
    title: "MCP server",
  },
];

export function AiReady() {
  return (
    <section
      className={cn(
        "relative scroll-mt-16 border-t",
        "before:absolute before:top-[-3.5px] before:left-[-2.5px] before:z-10 before:size-1.5 before:bg-background-muted before:ring-1 before:ring-[color-mix(in_oklab,var(--color-foreground)_10%,var(--color-background))] max-md:before:hidden",
        "after:absolute after:top-[-3.5px] after:right-[-2.5px] after:z-10 after:size-1.5 after:bg-background-muted after:ring-1 after:ring-[color-mix(in_oklab,var(--color-foreground)_10%,var(--color-background))] max-md:after:hidden"
      )}
      id="ai"
    >
      <div className="grid lg:grid-cols-3">
        <div className="px-4 py-10 sm:px-8 lg:col-span-2">
          <h2
            className="text-balance font-medium text-4xl leading-[1.05] tracking-[-0.03em] lg:text-5xl"
            id="ai-title"
          >
            Ready for AI ✨
          </h2>
          <div className="mt-4 flex max-w-xl flex-col gap-3 text-pretty text-foreground-muted text-lg leading-snug">
            <p>
              Our mission is to provide a top-quality React component dataset
              for the AI tool of your choice.
            </p>
            <p>
              The components are simple to use and accessible to everyone,
              whether you’re a non-technical founder, a designer or a developer
              of any skill level.
            </p>
          </div>
        </div>

        <figure className="mr-px flex flex-col gap-4 bg-background-muted px-4 py-8 max-lg:ml-px max-lg:border-t sm:px-8 lg:border-s lg:py-10">
          <figcaption className="flex items-center gap-3">
            <Avatar className="[--avatar-size:--spacing(10)]">
              <AvatarImage alt="" src="https://github.com/shadcn.png" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <span className="flex flex-col text-sm">
              <span className="flex items-center gap-1 font-semibold">
                shadcn
                <VerifiedIcon className="size-4" />
                <span className="sr-only">(verified)</span>
              </span>
              <span className="text-foreground-muted">@shadcn</span>
            </span>
          </figcaption>
          <blockquote className="flex flex-col gap-3 text-pretty text-foreground-muted leading-snug">
            <p>
              shadcn/ui turns 2! 🎉 What started as a side project has grown
              into a new standard for writing and distributing code—and now the
              go-to component library for AI.
            </p>
            <p>
              To the community improving and supporting it every day, thank you.
            </p>
          </blockquote>
        </figure>
      </div>

      <div className="grid border-t lg:grid-cols-3">
        {features.map((feature) => (
          <div
            className="flex flex-col max-lg:not-first:border-t lg:not-first:border-s"
            key={feature.title}
          >
            <div className="px-4 py-10 sm:px-8">
              <h3 className="flex items-center gap-2 font-medium text-2xl tracking-[-0.02em]">
                {feature.title}
                {feature.badge ? (
                  <Badge size="sm" variant="secondary">
                    {feature.badge}
                  </Badge>
                ) : null}
              </h3>
              <p className="mt-3 max-w-xl text-pretty text-foreground-muted leading-snug">
                {feature.description}
              </p>
            </div>

            <div className="relative mt-auto border-t ps-4 sm:ps-8">
              <Line />
              <ul aria-label={feature.label} className="relative flex">
                {feature.icons.map(({ icon: BrandIcon, name }) => (
                  <li
                    className="flex size-16 items-center justify-center border-e bg-background first:border-s"
                    key={name}
                    title={name}
                  >
                    <BrandIcon className="size-8" />
                    <span className="sr-only">{name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
