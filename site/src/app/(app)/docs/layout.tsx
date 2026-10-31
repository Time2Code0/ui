import type * as PageTree from "fumadocs-core/page-tree";

import { Suspense } from "react";

import { cn } from "cn";
import { NextProvider } from "fumadocs-core/framework/next";

import { getComponentThumbnail } from "@/components/thumbnails";
import { getLayoutTabs } from "@/lib/docs-tree";
import { getRegistryItem } from "@/lib/registry";
import { source } from "@/lib/source";
import { Index } from "@/registry/__index__";
import { Spinner } from "@/registry/ui/loading";
import { SidebarInset, SidebarProvider } from "@/registry/ui/sidebar";

import { DocsSidebar } from "./docs-sidebar";
import { DemoFit } from "./layout.client";

async function getPreviews(
  nodes: PageTree.Node[]
): Promise<Map<string, React.ReactNode>> {
  const nodeResults = await Promise.all(
    nodes.map(async (node): Promise<Map<string, React.ReactNode>> => {
      const result = new Map<string, React.ReactNode>();

      if (node.type === "separator") {
        return result;
      }

      if (node.type === "folder") {
        return getPreviews(node.children);
      }

      const slug = node.url.split("/").pop();
      const name = `p-${slug}-1`;
      const Component = Index[name as keyof typeof Index];
      const thumbnail = getComponentThumbnail(slug ?? "");

      if (Component === undefined && thumbnail === undefined) {
        return result;
      }

      let metaClassName = "";

      if (Component !== undefined) {
        const registryItem = await getRegistryItem(name);

        metaClassName =
          typeof registryItem.meta?.className === "string"
            ? registryItem.meta.className
            : "";
      }

      result.set(
        node.url,
        <DisplayPreview item={node} key={node.$id}>
          <Suspense
            fallback={<Spinner className="size-4 text-foreground-muted" />}
          >
            {Component ? (
              <DemoFit
                className={cn(
                  node.url.startsWith("/docs/charts/") && "w-full",
                  metaClassName
                )}
              >
                <Component />
              </DemoFit>
            ) : (
              thumbnail
            )}
          </Suspense>
        </DisplayPreview>
      );

      return result;
    })
  );

  const result = new Map<string, React.ReactNode>();

  for (const nodeResult of nodeResults) {
    for (const [key, value] of nodeResult) {
      result.set(key, value);
    }
  }

  return result;
}

export default async function Layout({ children }: LayoutProps<"/docs">) {
  "use cache";
  const tabs = getLayoutTabs(source.pageTree);
  const previews = await getPreviews(source.pageTree.children);

  return (
    <NextProvider>
      <SidebarProvider>
        <DocsSidebar previews={previews} tabs={tabs} tree={source.pageTree} />
        <SidebarInset className="min-w-0 bg-transparent">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </NextProvider>
  );
}

async function DisplayPreview({
  item,
  children,
}: {
  item: PageTree.Item;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        aria-hidden="true"
        className="pointer-events-none relative flex h-44 items-center justify-center overflow-hidden rounded-sm border bg-background"
        inert
      >
        {children}
      </div>

      <div className="flex flex-col gap-0.5 px-1.5 pb-1">
        <p className="font-medium text-sm">{item.name}</p>
        {item.description ? (
          <p className="text-pretty text-foreground-muted text-xs">
            {item.description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
