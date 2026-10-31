import { PlusIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";

export function Particle() {
  return (
    <Button aria-label="Add" size="icon-lg">
      <Icon aria-hidden="true" icon={PlusIcon} />
    </Button>
  );
}
