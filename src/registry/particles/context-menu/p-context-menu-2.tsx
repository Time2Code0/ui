import Link from "next/link";

import {
  ContextMenu,
  ContextMenuLinkItem,
  ContextMenuPopup,
  ContextMenuTrigger,
} from "@/registry/ui/context-menu";

export function Particle() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-full max-w-sm items-center justify-center rounded-lg border border-dashed text-foreground-muted text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuPopup>
        <ContextMenuLinkItem render={<Link href="/docs" />}>
          Docs
        </ContextMenuLinkItem>
        <ContextMenuLinkItem render={<Link href="/particles" />}>
          Particles
        </ContextMenuLinkItem>
      </ContextMenuPopup>
    </ContextMenu>
  );
}
