"use client";

import { ArrowUpIcon, PlusIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/registry/ui/input-group";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@/registry/ui/menu";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/registry/ui/tooltip";

export function Particle() {
  return (
    <InputGroup>
      <InputGroupTextarea placeholder="Ask, Search or Chat…" />
      <InputGroupAddon align="block-end">
        <Menu>
          <Tooltip>
            <TooltipTrigger
              render={
                <MenuTrigger
                  render={
                    <Button
                      aria-label="Add files"
                      className="rounded-full"
                      size="icon-sm"
                      variant="ghost"
                    >
                      <Icon icon={PlusIcon} />
                    </Button>
                  }
                />
              }
            />
            <TooltipPopup>Add files and more</TooltipPopup>
          </Tooltip>
          <MenuPopup align="start">
            <MenuItem>Add photos &amp; files</MenuItem>
            <MenuItem>Create image</MenuItem>
            <MenuItem>Thinking</MenuItem>
            <MenuItem>Deep research</MenuItem>
          </MenuPopup>
        </Menu>
        <InputGroupText className="ml-auto">78% used</InputGroupText>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                aria-label="Send"
                className="rounded-full"
                size="icon-sm"
                variant="default"
              >
                <Icon icon={ArrowUpIcon} />
              </Button>
            }
          />
          <TooltipPopup>Send</TooltipPopup>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  );
}
