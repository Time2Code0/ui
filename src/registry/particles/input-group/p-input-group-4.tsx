import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/registry/ui/input-group";

export function Particle() {
  return (
    <InputGroup>
      <InputGroupInput
        aria-label="Choose a username"
        placeholder="Choose a username"
        type="text"
      />
      <InputGroupAddon align="inline-end">
        <InputGroupText>@time2code.dev</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
}
