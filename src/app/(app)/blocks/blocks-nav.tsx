"use client";

import { usePathname } from "next/navigation";

import { cn } from "cn";

import { buttonVariants } from "@/registry/ui/button";
import { Link } from "@/registry/ui/link";

export function BlocksNav({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Block categories" className="overflow-x-auto">
      <ul className="flex w-max items-center gap-0.5 rounded-lg bg-background-muted p-0.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              className={cn(
                buttonVariants({ size: "sm", variant: "ghost" }),
                "rounded-md text-foreground-muted hover:bg-transparent hover:text-foreground",
                "data-active:border-foreground/10 data-active:bg-background data-active:text-foreground"
              )}
              data-active={pathname === item.href}
              href={item.href}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
