"use client";

import { AnimatedSizeContainer } from "@/registry/marketing/animated-size-container";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/ui/tabs";

export function Particle() {
  return (
    <Tabs className="w-full" defaultValue="short">
      <TabsList>
        <TabsTab value="short">Short</TabsTab>
        <TabsTab value="long">Long</TabsTab>
      </TabsList>
      <AnimatedSizeContainer className="rounded-xl border" height>
        <TabsPanel className="p-4 text-sm" value="short">
          A single line of content.
        </TabsPanel>
        <TabsPanel className="flex flex-col gap-3 p-4 text-sm" value="long">
          <p>
            Switching tabs changes the height of the content. Instead of
            jumping, the container animates to the new size.
          </p>
          <p>
            It measures its content with a ResizeObserver, so it also reacts to
            content that grows or shrinks for any other reason.
          </p>
          <p>Wrap anything whose size changes over time.</p>
        </TabsPanel>
      </AnimatedSizeContainer>
    </Tabs>
  );
}
