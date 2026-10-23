"use client";

import type { Folder } from "fumadocs-core/page-tree";
import type { source } from "@/lib/source";

import { Fragment, useCallback, useMemo, useState } from "react";

import {
  ArrowTurnBackwardIcon,
  Atom01Icon,
  BookOpen02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { useHotkey } from "@tanstack/react-hotkeys";

import { useConfig } from "@/hooks/use-config";
import { useCopyToClipboard } from "@/registry/hooks/use-copy-to-clipboard";
import { Button } from "@/registry/ui/button";
import {
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandSeparator,
} from "@/registry/ui/command";
import { Icon } from "@/registry/ui/icon";
import { Kbd, KbdGroup } from "@/registry/ui/kbd";
import { Link } from "@/registry/ui/link";

interface PageItem {
  isComponent: boolean;
  keywords?: string[];
  label: string;
  url: string;
  value: string;
}

interface PageGroup {
  items: PageItem[];
  value: string;
}

function getPageGroupItems(group: Folder) {
  const items: PageItem[] = [];

  if (group.index) {
    items.push({
      isComponent: false,
      label: "Overview",
      url: group.index.url,
      value: `${group.name} Overview`,
    });
  }

  for (const item of group.children) {
    if (item.type === "page") {
      const isComponent =
        item.url.includes("/ui/") ||
        item.url.includes("/marketing/") ||
        item.url.includes("/hooks/");
      const itemName = item.name?.toString() || "";

      items.push({
        isComponent,
        keywords: isComponent ? ["component"] : undefined,
        label: itemName,
        url: item.url,
        value: itemName ? `${group.name} ${itemName}` : "",
      });
    }
  }

  return items;
}

export function Cmdk({
  tree,
  navItems,
}: {
  tree: typeof source.pageTree;
  navItems?: { label: string; href: string }[];
}) {
  const [config] = useConfig();
  const [open, setOpen] = useState(false);
  const { copyToClipboard } = useCopyToClipboard();
  const [copyPayload, setCopyPayload] = useState("");

  const packageManager = config.packageManager || "pnpm";

  const groupedItems = useMemo(() => {
    const groups: PageGroup[] = [];

    if (navItems && navItems.length > 0) {
      groups.push({
        items: navItems.map((item) => ({
          isComponent: false,
          keywords: ["nav", "navigation", item.label.toLowerCase()],
          label: item.label,
          url: item.href,
          value: `Navigation ${item.label}`,
        })),
        value: "Pages",
      });
    }

    for (const group of tree.children) {
      if (group.type === "folder") {
        const items = getPageGroupItems(group);

        if (items.length > 0) {
          groups.push({
            items,
            value:
              typeof group.name === "string" ? group.name : String(group.name),
          });
        }
      }
    }

    return groups;
  }, [tree, navItems]);

  const handleOnItemHighlighted = useCallback(
    (highlightedValue: unknown) => {
      const item = highlightedValue as PageItem | null;

      if (!item) {
        return;
      }

      if (item.isComponent) {
        const componentName = item.url.split("/").pop();

        const registryItem = `https://design.time2code.dev/r/${componentName}`;
        let cmd: string;
        switch (packageManager) {
          case "pnpm":
            cmd = `pnpm dlx shadcn@latest add ${registryItem}`;
            break;
          case "bun":
            cmd = `bunx --bun shadcn@latest add ${registryItem}`;
            break;
          case "yarn":
            cmd = `yarn dlx shadcn@latest add ${registryItem}`;
            break;
          default:
            cmd = `npx shadcn@latest add ${registryItem}`;
        }

        setCopyPayload(cmd);
      } else {
        setCopyPayload("");
      }
    },
    [packageManager]
  );

  const handleOnNavigate = useCallback(() => {
    setOpen(false);
  }, []);

  useHotkey("Mod+K", () => {
    setOpen((currentOpen) => !currentOpen);
  });

  useHotkey(
    "Mod+C",
    () => {
      copyToClipboard(copyPayload);
    },
    { enabled: Boolean(copyPayload) && open }
  );

  return (
    <CommandDialog onOpenChange={setOpen} open={open}>
      <CommandDialogTrigger
        render={
          <Button className="mx-2 hidden md:inline-flex" variant="secondary" />
        }
      >
        <Icon icon={Search01Icon} />
        <span>Search</span>
        <KbdGroup className="-me-1">
          <Kbd>&#8984;</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </CommandDialogTrigger>
      <CommandDialogPopup>
        <Command
          items={groupedItems}
          onItemHighlighted={handleOnItemHighlighted}
        >
          <CommandInput placeholder="Search documentation..." />
          <CommandPanel>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandList>
              {(group: PageGroup, _index: number) => (
                <Fragment key={group.value}>
                  <CommandGroup items={group.items}>
                    <CommandGroupLabel>{group.value}</CommandGroupLabel>
                    <CommandCollection>
                      {(item: PageItem) => (
                        <CommandItem
                          key={item.value}
                          render={
                            <Link
                              href={item.url}
                              onNavigate={handleOnNavigate}
                            />
                          }
                        >
                          <Icon
                            className="mr-2 size-4 opacity-80"
                            icon={
                              item.isComponent ? Atom01Icon : BookOpen02Icon
                            }
                          />
                          <span className="flex-1">{item.label}</span>
                        </CommandItem>
                      )}
                    </CommandCollection>
                  </CommandGroup>
                  <CommandSeparator />
                </Fragment>
              )}
            </CommandList>
          </CommandPanel>
          <CommandFooter>
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap">Go to Page</span>
              <Kbd>
                <Icon icon={ArrowTurnBackwardIcon} />
              </Kbd>
            </div>

            {copyPayload ? (
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate font-mono">{copyPayload}</span>
                <KbdGroup>
                  <Kbd>&#8984;</Kbd>
                  <Kbd>C</Kbd>
                </KbdGroup>
              </div>
            ) : null}
          </CommandFooter>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  );
}
