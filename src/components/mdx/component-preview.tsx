import { getRegistryItem } from "@/lib/registry";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/ui/tabs";

import { ComponentSource } from "./component-source";

export async function ComponentPreview({ name }: { name: string }) {
  const item = await getRegistryItem(name);

  const { component: Component } = item;
  const metaClassName =
    typeof item.meta?.className === "string" ? item.meta.className : undefined;

  if (!Component) {
    return (
      <p className="text-foreground-muted text-sm">
        Component{" "}
        <code className="relative rounded bg-background-muted px-[0.3rem] py-[0.2rem] font-mono text-[.8125rem]">
          {name}
        </code>{" "}
        not found in registry.
      </p>
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
        <div
          className="flex min-h-72 items-center justify-center bg-white px-4 py-12 sm:px-6 dark:bg-[oklch(0.159_0_0)]"
          data-slot="preview"
        >
          {metaClassName ? (
            <div className={metaClassName}>
              <Component />
            </div>
          ) : (
            <Component />
          )}
        </div>
      </TabsPanel>
      <TabsPanel className="**:data-[slot=codeblock]:border-y-0" value="code">
        <ComponentSource name={name} />
      </TabsPanel>
    </Tabs>
  );
}
