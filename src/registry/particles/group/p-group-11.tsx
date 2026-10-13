import { ChevronDownIcon, GitForkIcon } from "@hugeicons/core-free-icons";

import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Group, GroupSeparator } from "@/registry/ui/group";
import { Icon } from "@/registry/ui/icon";
import {
  Popover,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/ui/popover";

export function Particle() {
  return (
    <Group aria-label="Repository actions">
      <Button variant="outline">
        <Icon aria-hidden="true" icon={GitForkIcon} />
        Fork
        <Badge variant="secondary">48</Badge>
      </Button>
      <GroupSeparator />
      <Popover>
        <PopoverTrigger
          render={
            <Button aria-label="Send options" size="icon" variant="outline">
              <Icon aria-hidden="true" icon={ChevronDownIcon} />
            </Button>
          }
        />
        <PopoverPopup align="end" className="w-64">
          <PopoverTitle className="text-base">Existing forks</PopoverTitle>
          <PopoverDescription>
            You don't have any forks of this repository.
          </PopoverDescription>
        </PopoverPopup>
      </Popover>
    </Group>
  );
}
