import { MicIcon, PaperclipIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/registry/ui/button";
import { Group } from "@/registry/ui/group";
import { Icon } from "@/registry/ui/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/ui/input-group";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/registry/ui/tooltip";

export function Particle() {
  return (
    <Group
      aria-label="Message composer"
      className="[--radius-lg:9999px] [--radius:9999rem]"
    >
      <Group aria-label="Attachments">
        <Button aria-label="Attach file" size="icon" variant="outline">
          <Icon aria-hidden="true" icon={PaperclipIcon} />
        </Button>
      </Group>
      <Group aria-label="Message input">
        <InputGroup>
          <InputGroupInput placeholder="Send a message" />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    aria-label="Voice Mode"
                    size="icon-xs"
                    variant="ghost"
                  >
                    <Icon aria-hidden="true" icon={MicIcon} />
                  </Button>
                }
              />
              <TooltipPopup>Voice Mode</TooltipPopup>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </Group>
    </Group>
  );
}
