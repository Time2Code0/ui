import { getRegistryItem } from "@/lib/registry";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/ui/tabs";

import { ComponentSource } from "./component-source";

export async function ComponentPreview({ name }: { name: string }) {
  const item = await getRegistryItem(name);

  const { component: Component } = item;

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
    <Tabs>
      <TabsList>
        <TabsTab value="preview">Preview</TabsTab>
        <TabsTab value="code">Code</TabsTab>
      </TabsList>
      <TabsPanel value="preview">
        <div data-slot="preview">
          <Component />
        </div>
      </TabsPanel>
      <TabsPanel value="code">
        <ComponentSource name={name} />
      </TabsPanel>
    </Tabs>
  );
}
