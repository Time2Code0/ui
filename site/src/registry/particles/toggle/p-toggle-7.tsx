import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/ui/icon";
import { Toggle } from "@/registry/ui/toggle";

export function Particle() {
  return (
    <div className="flex items-center gap-1">
      <Toggle aria-label="Toggle bold" variant="outline">
        <Icon icon={BoldIcon} />
      </Toggle>
      <Toggle aria-label="Toggle italic" variant="outline">
        <Icon icon={ItalicIcon} />
      </Toggle>
      <Toggle aria-label="Toggle underline" variant="outline">
        <Icon icon={UnderlineIcon} />
      </Toggle>
    </div>
  );
}
