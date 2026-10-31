import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "@/registry/ui/input-group";
import { NumberField, NumberFieldInput } from "@/registry/ui/number-field";

export function Particle() {
  return (
    <InputGroup>
      <NumberField aria-label="Enter the amount" defaultValue={10}>
        <NumberFieldInput className="text-left" />
      </NumberField>
      <InputGroupAddon>
        <InputGroupText>€</InputGroupText>
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupText>EUR</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
}
