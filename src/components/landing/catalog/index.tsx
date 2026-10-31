import { cn } from "cn";

import { ThumbnailCard } from "@/components/thumbnail-card";
import { buttonVariants } from "@/registry/ui/button";
import { Link } from "@/registry/ui/link";

import { CatalogStage } from "./catalog-stage";
import { catalogColumns } from "./catalog-tiles";

const featured = [
  "calendar",
  "combobox",
  "table",
  "command",
  "dialog",
  "toast",
  "menu",
  "slider",
];

export function Catalog() {
  return (
    <section
      className={cn(
        "relative scroll-mt-16 border-t",
        "before:absolute before:top-[-3.5px] before:left-[-2.5px] before:z-10 before:size-1.5 before:bg-background-muted before:ring-1 before:ring-[color-mix(in_oklab,var(--color-foreground)_10%,var(--color-background))] max-md:before:hidden",
        "after:absolute after:top-[-3.5px] after:right-[-2.5px] after:z-10 after:size-1.5 after:bg-background-muted after:ring-1 after:ring-[color-mix(in_oklab,var(--color-foreground)_10%,var(--color-background))] max-md:after:hidden"
      )}
      id="components"
    >
      <div className="flex flex-col items-center gap-4 px-4 py-10 text-center sm:px-8">
        <h2
          className="max-w-[22ch] text-balance font-medium text-4xl leading-[1.05] tracking-[-0.03em] lg:text-5xl"
          id="components-title"
        >
          React components with every state built in.
        </h2>
        <p className="max-w-xl text-balance text-foreground-muted text-lg leading-snug">
          Every time2code/ui primitive handles focus, keyboard and screen
          readers, and ships with hover, loading, disabled and invalid states.
          Copy one in as source and it fits any project, whatever its size.
        </p>
      </div>

      <CatalogStage
        banner={<StackBanner />}
        className="h-120 border-y sm:h-144 md:mx-px lg:h-180"
        columns={catalogColumns}
      />

      <div className="flex flex-col items-center gap-10 px-4 py-10 sm:px-8">
        <ul className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 max-sm:[&>li:nth-child(n+5)]:hidden">
          {featured.map((name) => (
            <li className="flex" key={name}>
              <ThumbnailCard slug={["ui", name]} />
            </li>
          ))}
        </ul>
        <Link
          className={buttonVariants({ size: "lg", variant: "outline" })}
          href="/docs/ui"
        >
          View all components
        </Link>
      </div>
    </section>
  );
}

function StackBanner() {
  return (
    <div className="pointer-events-none flex select-none items-center gap-x-1.5 whitespace-nowrap rounded-xl border bg-background/90 px-4 py-3 text-foreground-muted shadow-foreground/5 shadow-lg outline-none backdrop-blur-sm sm:px-6 sm:py-4 sm:text-lg">
      <span className="max-sm:hidden">Built on</span>
      <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
        <svg
          aria-hidden="true"
          className="h-[1.1em] w-auto"
          fill="currentColor"
          viewBox="0 0 17 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.5001 7.01537C9.2245 6.99837 9 7.22385 9 7.49999V23C13.4183 23 17 19.4183 17 15C17 10.7497 13.6854 7.27351 9.5001 7.01537Z" />
          <path d="M8 9.8V12V23C3.58172 23 0 19.0601 0 14.2V12V1C4.41828 1 8 4.93989 8 9.8Z" />
        </svg>
        <span>Base UI</span>
      </span>

      <span>
        <span className="max-sm:hidden">and</span> styled with
      </span>

      <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
        <svg
          aria-hidden="true"
          className="h-[0.8em] w-auto"
          fill="none"
          viewBox="0 0 54 33"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
            fill="#38bdf8"
            fillRule="evenodd"
          />
        </svg>
        <span>Tailwind CSS</span>
      </span>
    </div>
  );
}
