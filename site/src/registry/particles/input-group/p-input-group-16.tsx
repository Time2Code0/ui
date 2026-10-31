import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/ui/input-group";
import { Spinner } from "@/registry/ui/loading";

export function Particle() {
  return (
    <InputGroup>
      <InputGroupInput disabled placeholder="Searching…" type="search" />
      <InputGroupAddon align="inline-end">
        <Spinner />
      </InputGroupAddon>
    </InputGroup>
  );
}
