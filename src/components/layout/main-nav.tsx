"use client";

import { usePathname } from "next/navigation";

import { cn } from "cn";

import { buttonVariants } from "@/registry/ui/button";
import { Link } from "@/registry/ui/link";

export function MainNav({
  navItems,
}: {
  navItems: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-2 lg:flex">
      {navItems.map((item) => (
        <Link
          className={cn(
            buttonVariants({ variant: "ghost" }),
            (pathname === item.href || pathname.startsWith(`${item.href}/`)) &&
              "bg-accent"
          )}
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
