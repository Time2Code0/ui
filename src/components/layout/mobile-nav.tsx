"use client";

import type { LinkProps } from "next/link";
import type { source } from "@/lib/source";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { Menu09Icon } from "@hugeicons/core-free-icons";
import { cn } from "cn";

import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import {
  Drawer,
  DrawerPanel,
  DrawerPopup,
  DrawerTrigger,
} from "@/registry/ui/drawer";
import { Icon } from "@/registry/ui/icon";
import { Link } from "@/registry/ui/link";

export function MobileNav({
  tree,
  items,
  className,
}: {
  tree: typeof source.pageTree;
  items: { href: string; label: string }[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer onOpenChange={setOpen} open={open} position="left">
      <DrawerTrigger
        render={
          <Button className={className} size="icon" variant="ghost">
            <Icon className="size-5" icon={Menu09Icon} />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        }
      />
      <DrawerPopup showCloseButton variant="straight">
        <DrawerPanel className="flex flex-col gap-12 pt-8" scrollFade={false}>
          <div className="flex flex-col gap-3">
            <div className="font-medium text-sm">Menu</div>
            <div className="flex flex-col gap-1">
              <MobileLink href="/" onOpenChange={setOpen}>
                Home
              </MobileLink>
              {items.map((item) => (
                <MobileLink
                  href={item.href}
                  key={item.label}
                  onOpenChange={setOpen}
                >
                  {item.label}
                </MobileLink>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {tree?.children?.map((group) => {
              if (group.type === "folder") {
                return (
                  <div className="flex flex-col gap-3" key={group.$id}>
                    <div className="font-medium text-sm">{group.name}</div>
                    <div className="flex flex-col gap-0.5">
                      {group.index ? (
                        <MobileLink
                          href={group.index.url}
                          onOpenChange={setOpen}
                        >
                          Overview
                        </MobileLink>
                      ) : null}

                      {group.children.map((item) => {
                        if (item.type === "page") {
                          return (
                            <MobileLink
                              href={item.url}
                              key={item.url}
                              onOpenChange={setOpen}
                            >
                              {item.name}
                              {"status" in item && item.status === "new" && (
                                <Badge variant="info">New</Badge>
                              )}
                            </MobileLink>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </DrawerPanel>
      </DrawerPopup>
    </Drawer>
  );
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: LinkProps & {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(href.toString());
    onOpenChange?.(false);
  }, [href, onOpenChange, router]);

  return (
    <Link
      className={cn(
        "flex items-center gap-2 py-1.5 text-foreground-muted",
        className
      )}
      href={href}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}
