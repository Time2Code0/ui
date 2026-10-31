import { ArrowRightIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/registry/ui/button";
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
        aria-label="Subscribe to our newsletter"
        disabled
        placeholder="Your best email"
        type="email"
      />
      <InputGroupAddon align="inline-end">
        <Button aria-label="Subscribe" disabled size="icon-xs" variant="ghost">
          <Icon aria-hidden="true" icon={ArrowRightIcon} />
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
}
