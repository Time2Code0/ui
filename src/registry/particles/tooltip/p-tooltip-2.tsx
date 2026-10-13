import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/ui/icon";
import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/ui/tooltip";

export function Particle() {
  return (
    <TooltipProvider>
      <ToggleGroup defaultValue={["bold"]} multiple>
        <Tooltip>
          <TooltipTrigger
            render={<ToggleGroupItem aria-label="Toggle bold" value="bold" />}
          >
            <Icon icon={BoldIcon} />
          </TooltipTrigger>
          <TooltipPopup>Bold</TooltipPopup>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <ToggleGroupItem aria-label="Toggle italic" value="italic" />
            }
          >
            <Icon icon={ItalicIcon} />
          </TooltipTrigger>
          <TooltipPopup>Italic</TooltipPopup>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <ToggleGroupItem
                aria-label="Toggle underline"
                value="underline"
              />
            }
          >
            <Icon icon={UnderlineIcon} />
          </TooltipTrigger>
          <TooltipPopup>Underline</TooltipPopup>
        </Tooltip>
      </ToggleGroup>
    </TooltipProvider>
  );
}
