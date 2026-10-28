import { Suspense } from "react";

import { cn } from "cn";
import { NextProvider } from "fumadocs-core/framework/next";

import { Cmdk } from "@/components/layout/cmdk";
import { GitHubLink } from "@/components/layout/github-link";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ToggleThemeButton } from "@/components/layout/toggle-theme-button";
import { siteConfig } from "@/lib/config";
import { source } from "@/lib/source";
import { Link } from "@/registry/ui/link";
import { Separator } from "@/registry/ui/separator";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <NextProvider>
      <div className="pointer-events-none fixed inset-y-0 left-1/2 hidden w-full max-w-[90rem] -translate-x-1/2 md:block">
        <div className="absolute inset-x-4 inset-y-0 border-x lg:inset-x-6" />
      </div>

      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-[90rem] md:px-4 lg:px-6">
          <div
            className={cn(
              "relative flex h-16 items-center justify-between gap-2 border-x px-4 sm:px-6",
              "before:absolute before:-bottom-0.75 before:left-[-3.5px] before:size-1.5 before:bg-background-muted before:ring-1 before:ring-[color-mix(in_oklab,var(--color-foreground)_10%,var(--color-background))] max-md:before:hidden",
              "after:absolute after:right-[-3.5px] after:-bottom-0.75 after:size-1.5 after:bg-background-muted after:ring-1 after:ring-[color-mix(in_oklab,var(--color-foreground)_10%,var(--color-background))] max-md:after:hidden"
            )}
          >
            <div className="flex items-center gap-2">
              <Link href="https://time2code.dev">
                <div className="size-8 rounded-lg bg-blue-400" />
              </Link>

              <svg
                aria-hidden="true"
                className="size-5 text-foreground/10"
                strokeLinejoin="round"
                viewBox="0 0 16 16"
              >
                <title>Slash</title>
                <path
                  clipRule="evenodd"
                  d="M4.01526 15.3939L4.3107 14.7046L10.3107 0.704556L10.6061 0.0151978L11.9849 0.606077L11.6894 1.29544L5.68942 15.2954L5.39398 15.9848L4.01526 15.3939Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>

              <Link
                className="select-none font-redaction text-xl uppercase"
                href="/"
              >
                {siteConfig.name}
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Suspense>
                <MainNav navItems={siteConfig.navItems} />
              </Suspense>

              <Cmdk navItems={siteConfig.navItems} tree={source.pageTree} />

              <Separator className="h-4 max-md:hidden" orientation="vertical" />

              <GitHubLink />

              <ToggleThemeButton />

              <MobileNav
                className="lg:hidden"
                items={siteConfig.navItems}
                tree={source.pageTree}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[90rem] flex-1 md:px-4 lg:px-6">
        {children}
      </div>

      <footer className="border-t">
        <div className="mx-auto w-full max-w-[90rem] md:px-4 lg:px-6">
          <div
            className={cn(
              "relative flex h-12 items-center justify-center",
              "before:absolute before:-top-0.75 before:-left-0.5 before:size-1.5 before:bg-background-muted before:ring-1 before:ring-[color-mix(in_oklab,var(--color-foreground)_10%,var(--color-background))] max-md:before:hidden",
              "after:absolute after:-top-0.75 after:-right-0.75 after:size-1.5 after:bg-background-muted after:ring-1 after:ring-[color-mix(in_oklab,var(--color-foreground)_10%,var(--color-background))] max-md:after:hidden"
            )}
          >
            <p className="text-foreground-muted text-sm">
              Made by{" "}
              <Link
                className="underline underline-offset-2 transition-colors hover:text-foreground"
                href={siteConfig.author.url}
              >
                Time2Code
              </Link>{" "}
              ·{" "}
              <Link
                className="underline underline-offset-2 transition-colors hover:text-foreground"
                href={`${siteConfig.socials.github}/LICENSE.md`}
              >
                MIT License
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </NextProvider>
  );
}
