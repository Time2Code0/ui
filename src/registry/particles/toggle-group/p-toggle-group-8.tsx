import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/ui/icon";
import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group";

export function Particle() {
  return (
    <ToggleGroup defaultValue={["bold"]} multiple>
      <ToggleGroupItem aria-label="Toggle bold" value="bold">
        <Icon icon={BoldIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Toggle italic" value="italic">
        <Icon icon={ItalicIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Toggle underline" value="underline">
        <Icon icon={UnderlineIcon} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
