import { BoldIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/ui/icon";
import { Toggle } from "@/registry/ui/toggle";

export function Particle() {
  return (
    <Toggle aria-label="Toggle bold" variant="outline">
      <Icon icon={BoldIcon} />
    </Toggle>
  );
}
