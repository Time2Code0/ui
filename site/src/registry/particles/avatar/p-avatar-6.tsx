import { UserIcon } from "@hugeicons/core-free-icons";

import { Avatar, AvatarFallback } from "@/registry/ui/avatar";
import { Icon } from "@/registry/ui/icon";

export function Particle() {
  return (
    <Avatar>
      <AvatarFallback>
        <Icon aria-hidden="true" className="size-4" icon={UserIcon} />
      </AvatarFallback>
    </Avatar>
  );
}
