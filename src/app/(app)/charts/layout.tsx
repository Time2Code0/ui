import { Suspense } from "react";

import { cn } from "cn";

import { ChartNav } from "./chart-nav";

export default function ChartsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div
        className={cn(
          "relative border-b px-4 py-8 sm:px-6 md:py-12 lg:py-16",
          "before:absolute before:bottom-[-3.5px] before:left-[-2.5px] before:z-10 before:size-1.5 before:bg-background-muted before:ring-1 before:ring-[color-mix(in_oklab,var(--color-foreground)_10%,var(--color-background))] max-md:before:hidden",
          "after:absolute after:right-[-2.5px] after:bottom-[-3.5px] after:z-10 after:size-1.5 after:bg-background-muted after:ring-1 after:ring-[color-mix(in_oklab,var(--color-foreground)_10%,var(--color-background))] max-md:after:hidden"
        )}
      >
        <h1 className="text-balance font-medium text-4xl leading-[1.05] tracking-[-0.03em] lg:text-5xl">
          Charts
        </h1>
        <p className="mt-3 max-w-2xl text-pretty text-foreground-muted lg:text-lg">
          Copy-paste chart examples
        </p>

        <Suspense>
          <ChartNav />
        </Suspense>
      </div>

      {children}
    </main>
  );
}
