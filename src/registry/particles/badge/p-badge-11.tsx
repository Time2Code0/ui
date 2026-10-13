import { CheckIcon } from "@hugeicons/core-free-icons";

import { Badge } from "@/registry/ui/badge";
import { Icon } from "@/registry/ui/icon";

export function Particle() {
  return (
    <Badge variant="outline">
      <Icon aria-hidden="true" icon={CheckIcon} />
      Verified
    </Badge>
  );
}
