import { Button } from "@/registry/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/ui/input-group";

export function Particle() {
  return (
    <InputGroup>
      <InputGroupInput placeholder="Type to search…" type="search" />
      <InputGroupAddon align="inline-end">
        <Button size="xs" variant="secondary">
          Search
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
}
