import { Suspense } from "react";

import { cn } from "cn";

import { getRegistryItem } from "@/lib/registry";
import { Spinner } from "@/registry/ui/loading";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/ui/tabs";

import { ComponentPreviewStage } from "./component-preview-stage";
import { ComponentRenderer } from "./component-renderer";
import { ComponentSource } from "./component-source";

export interface ComponentPreviewProps {
  className?: string;
  name: string;
}

export async function ComponentPreview({
  name,
  className,
}: ComponentPreviewProps) {
  const item = await getRegistryItem(name);

  const metaClassName =
    typeof item.meta?.className === "string" ? item.meta.className : undefined;

  return (
    <Tabs className={cn("my-4 gap-0 border-y bg-background-muted", className)}>
      <div className="flex h-10 items-center gap-2 border-b px-4 text-foreground-muted [&_svg]:size-3.5">
        <TabsList className="min-w-0 gap-0.5 overflow-x-auto bg-transparent p-0 *:data-[slot=tab-indicator]:rounded-md *:data-[slot=tab-indicator]:bg-accent">
          <TabsTab
            className="h-7 grow-0 rounded-md px-2 font-mono font-normal text-[0.8125rem] hover:text-foreground"
            value="preview"
          >
            Preview
          </TabsTab>
          <TabsTab
            className="h-7 grow-0 rounded-md px-2 font-mono font-normal text-[0.8125rem] hover:text-foreground"
            value="code"
          >
            Code
          </TabsTab>
        </TabsList>
      </div>
      <TabsPanel value="preview">
        <ComponentPreviewStage name={name}>
          <Suspense
            fallback={<Spinner className="size-5 text-foreground-muted" />}
          >
            <ComponentRenderer metaClassName={metaClassName} name={name} />
          </Suspense>
        </ComponentPreviewStage>
      </TabsPanel>
      <TabsPanel className="**:data-[slot=codeblock]:border-y-0" value="code">
        <ComponentSource codeblock={{ className: "my-0" }} name={name} />
      </TabsPanel>
    </Tabs>
  );
}
