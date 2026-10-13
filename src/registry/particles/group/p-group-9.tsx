import { ZoomInIcon, ZoomOutIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/registry/ui/button";
import { Group, GroupSeparator } from "@/registry/ui/group";
import { Icon } from "@/registry/ui/icon";

export function Particle() {
  return (
    <Group aria-label="Zoom controls" orientation="vertical">
      <Button aria-label="Zoom in" size="icon" variant="outline">
        <Icon icon={ZoomInIcon} />
      </Button>
      <GroupSeparator orientation="horizontal" />
      <Button aria-label="Zoom Out" size="icon" variant="outline">
        <Icon icon={ZoomOutIcon} />
      </Button>
    </Group>
  );
}
