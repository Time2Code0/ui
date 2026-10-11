import { NextProvider } from "fumadocs-core/framework/next";

import { DocsSidebar } from "@/components/docs-sidebar";
import { source } from "@/lib/source";
import { SidebarInset, SidebarProvider } from "@/registry/ui/sidebar";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <NextProvider>
      <SidebarProvider>
        <DocsSidebar tree={source.pageTree} />
        <SidebarInset className="min-w-0 bg-transparent">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </NextProvider>
  );
}
