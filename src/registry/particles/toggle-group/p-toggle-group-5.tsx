import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/ui/icon";
import {
  ToggleGroup,
  ToggleGroupItem,
  ToggleGroupSeparator,
} from "@/registry/ui/toggle-group";

export function Particle() {
  return (
    <ToggleGroup
      defaultValue={["bold"]}
      orientation="vertical"
      variant="outline"
    >
      <ToggleGroupItem aria-label="Toggle bold" value="bold">
        <Icon icon={BoldIcon} />
      </ToggleGroupItem>
      <ToggleGroupSeparator orientation="horizontal" />
      <ToggleGroupItem aria-label="Toggle italic" value="italic">
        <Icon icon={ItalicIcon} />
      </ToggleGroupItem>
      <ToggleGroupSeparator orientation="horizontal" />
      <ToggleGroupItem aria-label="Toggle underline" value="underline">
        <Icon icon={UnderlineIcon} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
