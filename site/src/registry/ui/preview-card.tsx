"use client";

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
import { cn } from "cn";

export const PreviewCardCreateHandle: typeof PreviewCardPrimitive.createHandle =
  PreviewCardPrimitive.createHandle;

export const PreviewCard: typeof PreviewCardPrimitive.Root =
  PreviewCardPrimitive.Root;

export function PreviewCardTrigger({
  ...props
}: PreviewCardPrimitive.Trigger.Props): React.ReactElement {
  return (
    <PreviewCardPrimitive.Trigger data-slot="preview-card-trigger" {...props} />
  );
}

export function PreviewCardPopup({
  children,
  className,
  side = "bottom",
  align = "center",
  sideOffset = 4,
  alignOffset = 0,
  anchor,
  portalProps,
  ...props
}: PreviewCardPrimitive.Popup.Props & {
  portalProps?: PreviewCardPrimitive.Portal.Props;
  side?: PreviewCardPrimitive.Positioner.Props["side"];
  align?: PreviewCardPrimitive.Positioner.Props["align"];
  sideOffset?: PreviewCardPrimitive.Positioner.Props["sideOffset"];
  alignOffset?: PreviewCardPrimitive.Positioner.Props["alignOffset"];
  anchor?: PreviewCardPrimitive.Positioner.Props["anchor"];
}): React.ReactElement {
  return (
    <PreviewCardPrimitive.Portal {...portalProps}>
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom,transform] duration-350 ease-in-out data-instant:transition-none"
        data-slot="preview-card-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <PreviewCardPrimitive.Popup
          className={cn(
            "relative flex h-(--popup-height,auto) w-64 origin-(--transform-origin) text-balance rounded-lg border bg-background text-foreground text-sm outline-none",
            "transition-[width,height,scale,opacity,translate] duration-200 ease-in-out",
            "data-[side=bottom]:data-ending-style:-translate-y-2 data-[side=bottom]:data-starting-style:-translate-y-2",
            "data-[side=left]:data-ending-style:translate-x-2 data-[side=left]:data-starting-style:translate-x-2",
            "data-[side=right]:data-ending-style:-translate-x-2 data-[side=right]:data-starting-style:-translate-x-2",
            "data-[side=top]:data-ending-style:translate-y-2 data-[side=top]:data-starting-style:translate-y-2",
            "data-[side=inline-start]:data-ending-style:translate-x-2 data-[side=inline-start]:data-starting-style:translate-x-2",
            "data-[side=inline-end]:data-ending-style:-translate-x-2 data-[side=inline-end]:data-starting-style:-translate-x-2",
            "data-starting-style:scale-95 data-starting-style:opacity-0",
            "data-ending-style:scale-95 data-ending-style:opacity-0",
            className
          )}
          data-slot="preview-card-popup"
          {...props}
        >
          <PreviewCardPrimitive.Viewport
            className={cn(
              "relative size-full overflow-clip px-(--viewport-inline-padding) py-4 [--viewport-inline-padding:--spacing(4)] data-instant:transition-none",
              "**:data-current:data-ending-style:opacity-0 **:data-current:data-starting-style:opacity-0 **:data-previous:data-ending-style:opacity-0 **:data-previous:data-starting-style:opacity-0",
              "**:data-current:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)] **:data-previous:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)]",
              "**:data-current:opacity-100 **:data-previous:opacity-100 **:data-current:transition-opacity **:data-previous:transition-opacity"
            )}
            data-slot="preview-card-viewport"
          >
            {children}
          </PreviewCardPrimitive.Viewport>
        </PreviewCardPrimitive.Popup>
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  );
}
