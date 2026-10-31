import { Field, FieldError, FieldLabel } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";

export function Particle() {
  return (
    <Field>
      <FieldLabel>Email</FieldLabel>
      <Input placeholder="Enter your email" type="email" />
      <FieldError>Please enter a valid email address.</FieldError>
    </Field>
  );
}
