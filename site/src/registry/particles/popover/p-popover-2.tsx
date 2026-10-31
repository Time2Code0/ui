"use client";

import { XIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";
import {
  Popover,
  PopoverClose,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/ui/popover";

export function Particle() {
  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline">Open Popover</Button>}
      />
      <PopoverPopup className="w-80">
        <PopoverClose
          aria-label="Close"
          className="absolute end-2 top-2"
          render={
            <Button size="icon" variant="ghost">
              <Icon icon={XIcon} />
            </Button>
          }
        />
        <div className="mb-2">
          <PopoverTitle className="text-base">Notifications</PopoverTitle>
          <PopoverDescription>
            You are all caught up. Good job!
          </PopoverDescription>
        </div>
        <PopoverClose render={<Button variant="outline">Close</Button>} />
      </PopoverPopup>
    </Popover>
  );
}
