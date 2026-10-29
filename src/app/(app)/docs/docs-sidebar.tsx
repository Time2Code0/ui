"use client";

import type * as PageTree from "fumadocs-core/page-tree";
import type { source } from "@/lib/source";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { cn } from "cn";
import { searchPath } from "fumadocs-core/breadcrumb";
import { flattenTree } from "fumadocs-core/page-tree";

import { useActiveIndicator } from "@/hooks/use-active-indicator";
import { groupsOf, isLayoutTabActive, type LayoutTab } from "@/lib/docs-tree";
import { Badge } from "@/registry/ui/badge";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/registry/ui/collapsible";
import { Icon } from "@/registry/ui/icon";
import { Link } from "@/registry/ui/link";
import {
  PreviewCard,
  PreviewCardCreateHandle,
  PreviewCardPopup,
  PreviewCardTrigger,
} from "@/registry/ui/preview-card";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/registry/ui/sidebar";

const previewCardHandle = PreviewCardCreateHandle<PageTree.Item>();

export function DocsSidebar({
  tree,
  tabs,
  previews,
}: {
  tree: typeof source.pageTree;
  tabs: LayoutTab[];
  previews: Map<string, React.ReactNode>;
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
                {group.children.map((node) => {
                  if (node.type === "folder") {
                    return (
                      <FolderEntry
                        folder={node}
                        key={node.$id}
                        pathname={pathname}
                        previews={previews}
                      />
                    );
                  }

                  if (node.type === "separator") {
                    return null;
                  }

                  return (
                    <SidebarMenuItem key={node.url}>
                      <SidebarMenuButton
                        className="h-auto min-h-8 py-1.5 ps-3.5 text-foreground-muted hover:bg-transparent active:bg-transparent data-[active=true]:bg-transparent"
                        isActive={node.url === pathname}
                        render={renderLink(node, previews)}
                      >
                        <span>{node.name}</span>
                        {"status" in node && node.status === "new" ? (
                          <Badge variant="info">New</Badge>
                        ) : null}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <PreviewCard handle={previewCardHandle}>
        {({ payload }) => (
          <PreviewCardPopup
            className="w-72 bg-background-muted *:data-[slot=preview-card-viewport]:p-1 *:data-[slot=preview-card-viewport]:[--viewport-inline-padding:--spacing(1)]"
            side="inline-end"
            sideOffset={-24}
          >
            {payload !== undefined && previews.get(payload.url)}
          </PreviewCardPopup>
        )}
      </PreviewCard>
    </Sidebar>
  );
}

function FolderEntry({
  folder,
  pathname,
  previews,
}: {
  folder: PageTree.Folder;
  pathname: string;
  previews: Map<string, React.ReactNode>;
}) {
  const pages = flattenTree(folder.children);
  const holdsPage = pages.some((page) => page.url === pathname);

  const [open, setOpen] = useState(holdsPage);

  // Navigating into the folder from elsewhere (search, a link in a page) opens it.
  const [seen, setSeen] = useState(pathname);
  if (seen !== pathname) {
    setSeen(pathname);

    if (holdsPage) {
      setOpen(true);
    }
  }

  return (
    <SidebarMenuItem>
      <Collapsible onOpenChange={setOpen} open={open}>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton className="group/folder h-auto min-h-8 gap-2 py-1.5 ps-3.5 text-foreground-muted hover:bg-transparent active:bg-transparent data-[active=true]:bg-transparent" />
          }
        >
          <span className="flex-1 truncate">{folder.name}</span>
          <Icon
            className="size-3.5 transition-transform duration-200 group-aria-expanded/folder:rotate-90 motion-reduce:transition-none"
            icon={ArrowRight01Icon}
          />
        </CollapsibleTrigger>

        <CollapsiblePanel>
          <SidebarMenuSub className="me-0 gap-0.5 pe-0">
            {pages.map((page) => (
              <SidebarMenuSubItem key={page.url}>
                <SidebarMenuSubButton
                  className="h-auto min-h-7 py-1 text-foreground-muted hover:bg-transparent active:bg-transparent data-[active=true]:bg-transparent data-[active=true]:font-medium sm:h-auto"
                  isActive={page.url === pathname}
                  render={renderLink(page, previews)}
                >
                  <span>{page.name}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsiblePanel>
      </Collapsible>
    </SidebarMenuItem>
  );
}

function renderLink(
  page: PageTree.Item,
  previews: Map<string, React.ReactNode>
) {
  const link = <Link href={page.url} />;

  if (previews.has(page.url)) {
    return (
      <PreviewCardTrigger
        handle={previewCardHandle}
        payload={page}
        render={link}
      />
    );
  }

  return link;
}
