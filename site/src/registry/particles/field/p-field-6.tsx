import { ArrowRightIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/registry/ui/button";
import { Field, FieldError, FieldLabel } from "@/registry/ui/field";
import { Icon } from "@/registry/ui/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/ui/input-group";

export function Particle() {
  return (
    <Field>
      <FieldLabel>Subscribe</FieldLabel>
      <InputGroup>
        <InputGroupInput placeholder="Your best email" type="email" />
        <InputGroupAddon align="inline-end">
          <Button aria-label="Subscribe" size="icon-xs" variant="ghost">
            <Icon aria-hidden="true" icon={ArrowRightIcon} />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <FieldError>Please enter a valid email address.</FieldError>
    </Field>
  );
}
