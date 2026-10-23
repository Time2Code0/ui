"use client";

import { usePathname } from "next/navigation";

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
          className={buttonVariants({ variant: "ghost" })}
          data-pressed={pathname.includes(item.href) || undefined}
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
