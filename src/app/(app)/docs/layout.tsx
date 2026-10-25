import { NextProvider } from "fumadocs-core/framework/next";

import { getLayoutTabs } from "@/lib/docs-tree";
import { source } from "@/lib/source";
import { SidebarInset, SidebarProvider } from "@/registry/ui/sidebar";

import { DocsSidebar } from "./docs-sidebar";

export default function Layout({ children }: LayoutProps<"/docs">) {
  const tabs = getLayoutTabs(source.pageTree);

  return (
    <NextProvider>
      <SidebarProvider>
        <DocsSidebar tabs={tabs} tree={source.pageTree} />
        <SidebarInset className="min-w-0 bg-transparent">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </NextProvider>
  );
}
