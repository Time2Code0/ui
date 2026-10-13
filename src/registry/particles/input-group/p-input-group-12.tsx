"use client";

import { InfoIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/ui/input-group";
import { Label } from "@/registry/ui/label";
import { Popover, PopoverPopup, PopoverTrigger } from "@/registry/ui/popover";

export function Particle() {
  return (
    <InputGroup>
      <InputGroupInput
        id="email-1"
        placeholder="team@time2code.dev"
        type="email"
      />
      <InputGroupAddon align="block-start">
        <Label className="text-foreground" htmlFor="email-1">
          Email
        </Label>
        <Popover>
          <PopoverTrigger
            className="ml-auto"
            openOnHover
            render={
              <Button className="-m-1" size="icon-xs" variant="ghost">
                <Icon icon={InfoIcon} />
              </Button>
            }
          />
          <PopoverPopup side="top" tooltipStyle>
            <p>We&apos;ll use this to send you notifications</p>
          </PopoverPopup>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  );
}
