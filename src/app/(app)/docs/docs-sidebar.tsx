"use client";

import type * as PageTree from "fumadocs-core/page-tree";
import type { source } from "@/lib/source";

import { useRef } from "react";
import { usePathname } from "next/navigation";

import { cn } from "cn";
import { searchPath } from "fumadocs-core/breadcrumb";

import { useActiveIndicator } from "@/hooks/use-active-indicator";
import { groupsOf, isLayoutTabActive, type LayoutTab } from "@/lib/docs-tree";
import { Badge } from "@/registry/ui/badge";
import { Link } from "@/registry/ui/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/ui/sidebar";
export function DocsSidebar({
  tree,
  tabs,
}: {
  tree: typeof source.pageTree;
  tabs: LayoutTab[];
}) {
  const sidebarContentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const path = searchPath(tree.children, pathname) ?? [];
  const root = path.findLast(
    (item) => item.type === "folder" && item.root
  ) as PageTree.Folder;
  const groups = groupsOf(root);

  const indicator = useActiveIndicator(sidebarContentRef, pathname);

  return (
    <Sidebar
      className="sticky top-[calc(--spacing(16)+1px)] h-[calc(100svh-(--spacing(16)))] border-r bg-transparent max-lg:hidden"
      collapsible="none"
    >
      {tabs.length > 1 ? (
        <SidebarHeader className="relative gap-0 py-3 pr-2 pl-0 after:absolute after:inset-x-4 after:bottom-0 after:h-px after:bg-foreground/10">
          <nav aria-label="Docs sections">
            <SidebarMenu className="gap-0.5">
              {tabs.map((tab) => (
                <SidebarMenuItem
                  className="h-8 gap-2.5 px-2.5 text-foreground-muted hover:text-foreground data-[active=true]:font-normal data-[active=true]:text-foreground"
                  key={tab.url}
                >
                  <SidebarMenuButton
                    isActive={isLayoutTabActive(tab, path, pathname)}
                    render={<Link href={tab.url} />}
                  >
                    {tab.icon}
                    <span>{tab.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </nav>
        </SidebarHeader>
      ) : null}

      <SidebarContent className="relative py-2 pr-2" ref={sidebarContentRef}>
        {indicator.rect ? (
          <span
            aria-hidden
            className={cn(
              "absolute top-0 left-0 rounded-lg bg-accent motion-reduce:transition-none",
              indicator.animate &&
                "transition-[translate,width,height] duration-200 ease-out"
            )}
            style={{
              height: indicator.rect.height,
              translate: `${indicator.rect.left}px ${indicator.rect.top}px`,
              width: indicator.rect.width,
            }}
          />
        ) : null}

        {groups.map((group) => (
          <SidebarGroup className="gap-1" key={group.$id}>
            {group.name ? (
              <SidebarGroupLabel className="h-7">
                {group.name}
              </SidebarGroupLabel>
            ) : null}

            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.children.map((node) =>
                  node.type === "page" ? (
                    <SidebarMenuItem key={node.url}>
                      <SidebarMenuButton
                        className="h-auto min-h-8 py-1.5 ps-3.5 text-foreground-muted hover:bg-transparent active:bg-transparent data-[active=true]:bg-transparent"
                        isActive={node.url === pathname}
                        render={<Link href={node.url} />}
                      >
                        <span>{node.name}</span>
                        {"status" in node && node.status === "new" ? (
                          <Badge variant="info">New</Badge>
                        ) : null}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ) : null
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
