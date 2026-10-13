import { SearchIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/ui/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/ui/input-group";

export function Particle() {
  return (
    <InputGroup>
      <InputGroupInput
        aria-label="Search"
        placeholder="Search"
        size="lg"
        type="search"
      />
      <InputGroupAddon>
        <Icon aria-hidden="true" icon={SearchIcon} />
      </InputGroupAddon>
    </InputGroup>
  );
}
