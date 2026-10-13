import { Suspense } from "react";

import { PackageSearchIcon } from "@hugeicons/core-free-icons";

import { getRegistryItem } from "@/lib/registry";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty";
import { Icon } from "@/registry/ui/icon";
import { Spinner } from "@/registry/ui/loading";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/ui/tabs";

import { ComponentPreviewStage } from "./component-preview-stage";
import { ComponentSource } from "./component-source";

export async function ComponentPreview({ name }: { name: string }) {
  const item = await getRegistryItem(name);

  const Component = item?.component;
  const metaClassName =
    typeof item?.meta?.className === "string" ? item.meta.className : undefined;

  if (!Component) {
    return (
      <Empty className="not-typeset full-width my-4 border-y bg-background-muted">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon icon={PackageSearchIcon} />
          </EmptyMedia>
          <EmptyTitle>Component not found</EmptyTitle>
          <EmptyDescription>
            There is no{" "}
            <code className="rounded bg-background px-[0.3rem] py-[0.2rem] font-mono text-[.8125rem] text-foreground">
              {name}
            </code>{" "}
            in the registry to preview.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <Tabs className="not-typeset full-width my-4 gap-0 border-y bg-background-muted">
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
            {metaClassName ? (
              <div className={metaClassName}>
                <Component />
              </div>
            ) : (
              <Component />
            )}
          </Suspense>
        </ComponentPreviewStage>
      </TabsPanel>
      <TabsPanel className="**:data-[slot=codeblock]:border-y-0" value="code">
        <ComponentSource name={name} />
      </TabsPanel>
    </Tabs>
  );
}
