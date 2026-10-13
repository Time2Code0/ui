import {
  ChevronDownIcon,
  DownloadIcon,
  EditIcon,
  ShareIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/registry/ui/button";
import { Group, GroupSeparator } from "@/registry/ui/group";
import { Icon } from "@/registry/ui/icon";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@/registry/ui/menu";

export function Particle() {
  return (
    <Group aria-label="Subscription actions">
      <Button>Subscribe</Button>
      <GroupSeparator className="bg-foreground/72" />
      <Menu>
        <MenuTrigger
          render={
            <Button aria-label="Copy options" size="icon">
              <Icon
                aria-hidden="true"
                className="size-4"
                icon={ChevronDownIcon}
              />
            </Button>
          }
        />
        <MenuPopup align="end">
          <MenuItem>
            <Icon aria-hidden="true" icon={ShareIcon} />
            Share link
          </MenuItem>
          <MenuItem>
            <Icon aria-hidden="true" icon={DownloadIcon} />
            Download
          </MenuItem>
          <MenuItem>
            <Icon aria-hidden="true" icon={EditIcon} />
            Duplicate
          </MenuItem>
        </MenuPopup>
      </Menu>
    </Group>
  );
}
