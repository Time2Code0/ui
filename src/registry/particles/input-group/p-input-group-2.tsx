import { MailIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/ui/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/ui/input-group";

export function Particle() {
  return (
    <InputGroup>
      <InputGroupInput aria-label="Email" placeholder="Email" type="email" />
      <InputGroupAddon align="inline-end">
        <Icon aria-hidden="true" icon={MailIcon} />
      </InputGroupAddon>
    </InputGroup>
  );
}
