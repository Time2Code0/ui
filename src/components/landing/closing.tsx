import { cn } from "cn";

import { siteConfig } from "@/lib/config";
import { FluidGradientText } from "@/registry/marketing/fluid-gradient-text";
import { Link } from "@/registry/ui/link";

const wordmarkViewBox = { height: 220, width: 1200 };

export function Closing() {
  const columns = [
    {
      links: [
        { href: "/docs/get-started", label: "Get started" },
        { href: "/docs/ui", label: "Primitives" },
        { href: "/docs/marketing", label: "Marketing" },
        { href: "/docs/hooks", label: "Hooks" },
        { href: "/particles", label: "Particles" },
      ],
      title: "Library",
    },
    {
      links: [
        { href: "/docs/styling", label: "Styling" },
        { href: "/docs/changelog", label: "Changelog" },
        { href: "/llms.txt", label: "llms.txt" },
      ],
      title: "Docs",
    },
    {
      links: [
        { href: siteConfig.socials.github, label: "GitHub" },
        {
          href: `${siteConfig.socials.github}/discussions`,
          label: "Discussions",
        },
        { href: `${siteConfig.socials.github}/LICENSE.md`, label: "License" },
      ],
      title: "Project",
    },
  ];

  return (
    <section
      className={cn(
        "relative border-t",
        "before:absolute before:top-[-3.5px] before:left-[-2.5px] before:z-10 before:size-1.5 before:bg-background-muted before:ring-1 before:ring-[color-mix(in_oklab,var(--color-foreground)_10%,var(--color-background))] max-md:before:hidden",
        "after:absolute after:top-[-3.5px] after:right-[-2.5px] after:z-10 after:size-1.5 after:bg-background-muted after:ring-1 after:ring-[color-mix(in_oklab,var(--color-foreground)_10%,var(--color-background))] max-md:after:hidden"
      )}
    >
      <div className="relative z-10 px-4 pt-16 pb-8 sm:px-8 sm:pt-24">
        <nav
          aria-label="Footer"
          className="grid grid-cols-3 gap-x-6 gap-y-8 lg:grid-cols-12"
        >
          <div className="col-span-3 flex flex-col gap-3 lg:col-span-5">
            <p className="font-redaction text-2xl">{siteConfig.name}</p>
            <p className="max-w-[22rem] text-pretty text-foreground-muted text-sm leading-relaxed">
              React components for production apps and the marketing sites that
              sell them.
            </p>
          </div>
          {columns.map((column) => (
            <div
              className="flex flex-col gap-3 lg:col-span-2"
              key={column.title}
            >
              <h3 className="text-foreground-muted text-sm">{column.title}</h3>
              <ul className="flex flex-col gap-2 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      className="transition-colors hover:text-foreground-muted"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div
        aria-hidden="true"
        style={{
          marginTop: `-${((0.375 * wordmarkViewBox.height) / wordmarkViewBox.width) * 100}%`,
        }}
      >
        <FluidGradientText
          className="font-redaction"
          svgViewBoxHeight={wordmarkViewBox.height}
          svgViewBoxWidth={wordmarkViewBox.width}
          text="Time2Code"
        />
      </div>
    </section>
  );
}
