import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/ui/input-group";
import { Kbd } from "@/registry/ui/kbd";

export function Particle() {
  return (
    <InputGroup>
      <InputGroupInput placeholder="Search…" type="search" />
      <InputGroupAddon align="inline-end">
        <Kbd>⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  );
}
