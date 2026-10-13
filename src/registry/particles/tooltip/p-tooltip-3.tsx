"use client";

import type { ComponentType } from "react";

import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/ui/icon";
import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group";
import {
  Tooltip,
  TooltipCreateHandle,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/ui/tooltip";

const tooltipHandle = TooltipCreateHandle<ComponentType>();

const BoldContent = () => <span>Make text bold</span>;

const ItalicContent = () => <span>Apply italic formatting to text</span>;

const UnderlineContent = () => <span>Underline text</span>;

export function Particle() {
  return (
    <TooltipProvider>
      <ToggleGroup defaultValue={["bold"]} multiple>
        <TooltipTrigger
          className="after:absolute after:left-full after:h-full after:w-1"
          handle={tooltipHandle}
          payload={BoldContent}
          render={<ToggleGroupItem aria-label="Toggle bold" value="bold" />}
        >
          <Icon aria-hidden="true" icon={BoldIcon} />
        </TooltipTrigger>
        <TooltipTrigger
          className="after:absolute after:left-full after:h-full after:w-1"
          handle={tooltipHandle}
          payload={ItalicContent}
          render={<ToggleGroupItem aria-label="Toggle italic" value="italic" />}
        >
          <Icon aria-hidden="true" icon={ItalicIcon} />
        </TooltipTrigger>
        <TooltipTrigger
          className="after:absolute after:left-full after:h-full after:w-1"
          handle={tooltipHandle}
          payload={UnderlineContent}
          render={
            <ToggleGroupItem aria-label="Toggle underline" value="underline" />
          }
        >
          <Icon aria-hidden="true" icon={UnderlineIcon} />
        </TooltipTrigger>
      </ToggleGroup>

      <Tooltip handle={tooltipHandle}>
        {({ payload: Payload }) => (
          <TooltipPopup>{Payload !== undefined && <Payload />}</TooltipPopup>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
