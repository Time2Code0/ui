import { Suspense } from "react";

import { cn } from "cn";

import { getRegistryItem } from "@/lib/registry";
import { Spinner } from "@/registry/ui/loading";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/ui/tabs";

import { ComponentPreviewStage } from "./component-preview-stage";
import { ComponentRenderer } from "./component-renderer";
import { ComponentSource } from "./component-source";

export interface ComponentPreviewProps {
  align?: "center" | "start" | "end";
  className?: string;
  name: string;
}

export async function ComponentPreview({
  name,
  className,
  align = "center",
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
        <div
          className="relative flex min-h-72 w-full justify-center overflow-y-auto bg-white p-10 data-[align=start]:items-start data-[align=end]:items-end data-[align=center]:items-center max-sm:px-6 dark:bg-[oklch(0.159_0_0)]"
          data-align={align}
          data-slot="preview-stage"
        >
          <ComponentPreviewStage name={name}>
            <Suspense
              fallback={<Spinner className="size-5 text-foreground-muted" />}
            >
              <ComponentRenderer metaClassName={metaClassName} name={name} />
            </Suspense>
          </ComponentPreviewStage>
        </div>
      </TabsPanel>
      <TabsPanel className="**:data-[slot=codeblock]:border-y-0" value="code">
        <ComponentSource
          codeblock={{ className: "my-0" }}
          language="tsx"
          name={name}
          title=""
        />
      </TabsPanel>
    </Tabs>
  );
}
