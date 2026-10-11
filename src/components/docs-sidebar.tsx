"use client";

import type { source } from "@/lib/source";

import { usePathname } from "next/navigation";

import { Badge } from "@/registry/ui/badge";
import { Link } from "@/registry/ui/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/ui/sidebar";

export function DocsSidebar({ tree }: { tree: typeof source.pageTree }) {
  const pathname = usePathname();

  return (
    <Sidebar
      className="sticky top-[calc(--spacing(16)+1px)] h-[calc(100svh-(--spacing(16)))] border-r bg-transparent max-lg:hidden"
      collapsible="none"
    >
      <SidebarContent>
        {tree.children.map((item) => (
          <SidebarGroup key={item.$id}>
            <SidebarGroupLabel>{item.name}</SidebarGroupLabel>
            <SidebarGroupContent>
              {item.type === "folder" && (
                <SidebarMenu className="gap-0.5">
                  {item.children.map((subItem) => {
                    if (subItem.type !== "page") {
                      return null;
                    }

                    return (
                      <SidebarMenuItem key={subItem.url}>
                        <SidebarMenuButton
                          className="text-foreground-muted data-active:bg-primary/10 data-active:text-primary"
                          isActive={subItem.url === pathname}
                          render={<Link href={subItem.url} />}
                        >
                          {subItem.name}
                          <Badge variant="info">New</Badge>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
