import {
  ContextMenu,
  ContextMenuCheckboxItem,
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
        <ContextMenuCheckboxItem defaultChecked variant="switch">
          Auto save
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem variant="switch">
          Show preview
        </ContextMenuCheckboxItem>
      </ContextMenuPopup>
    </ContextMenu>
  );
}
