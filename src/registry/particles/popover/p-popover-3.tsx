"use client";

import type { ComponentType } from "react";

import { BellIcon, UserIcon } from "@hugeicons/core-free-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar";
import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";
import {
  Popover,
  PopoverCreateHandle,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/ui/popover";

const popoverHandle = PopoverCreateHandle<ComponentType>();

const NotificationsContent = () => (
  <>
    <PopoverTitle className="text-base">Notifications</PopoverTitle>
    <PopoverDescription>
      You have no new notifications at this time.
    </PopoverDescription>
  </>
);

const ProfileContent = () => (
  <div className="w-48">
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage
          alt="Mark Andersson"
          src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
        />
        <AvatarFallback>MA</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <h4 className="line-clamp-1 font-medium text-sm">Mark Andersson</h4>
        <div className="flex items-center gap-3 text-foreground-muted text-xs">
          Product Designer
        </div>
      </div>
    </div>
    <Button className="mt-3 w-full" size="sm" variant="outline">
      Log out
    </Button>
  </div>
);

export function Particle() {
  return (
    <div className="flex gap-2">
      <PopoverTrigger
        handle={popoverHandle}
        payload={NotificationsContent}
        render={
          <Button aria-label="Notifications" size="icon" variant="outline">
            <Icon aria-hidden="true" icon={BellIcon} />
          </Button>
        }
      />
      <PopoverTrigger
        handle={popoverHandle}
        payload={ProfileContent}
        render={
          <Button aria-label="Profile" size="icon" variant="outline">
            <Icon aria-hidden="true" icon={UserIcon} />
          </Button>
        }
      />
      <Popover handle={popoverHandle}>
        {({ payload: Payload }) => (
          <PopoverPopup className="min-w-none">
            {Payload !== undefined && <Payload />}
          </PopoverPopup>
        )}
      </Popover>
    </div>
  );
}
