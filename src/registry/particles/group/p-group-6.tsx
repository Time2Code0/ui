import {
  ArchiveIcon,
  EditIcon,
  EllipsisIcon,
  FilesIcon,
  FilmIcon,
  ShareIcon,
  TrashIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/registry/ui/button";
import { Group, GroupSeparator } from "@/registry/ui/group";
import { Icon } from "@/registry/ui/icon";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@/registry/ui/menu";

export function Particle() {
  return (
    <Group aria-label="File actions">
      <Button>
        <Icon aria-hidden="true" icon={FilesIcon} />
        Files
      </Button>
      <GroupSeparator className="bg-foreground/72" />
      <Button>
        <Icon aria-hidden="true" icon={FilmIcon} />
        Media
      </Button>
      <GroupSeparator className="bg-foreground/72" />
      <Menu>
        <MenuTrigger
          render={
            <Button aria-label="Menu" size="icon">
              <Icon aria-hidden="true" className="size-4" icon={EllipsisIcon} />
            </Button>
          }
        />
        <MenuPopup align="end">
          <MenuItem>
            <Icon aria-hidden="true" icon={EditIcon} />
            Edit
          </MenuItem>
          <MenuItem>
            <Icon aria-hidden="true" icon={ArchiveIcon} />
            Archive
          </MenuItem>
          <MenuItem>
            <Icon aria-hidden="true" icon={ShareIcon} />
            Share
          </MenuItem>
          <MenuItem variant="destructive">
            <Icon aria-hidden="true" icon={TrashIcon} />
            Delete
          </MenuItem>
        </MenuPopup>
      </Menu>
    </Group>
  );
}
