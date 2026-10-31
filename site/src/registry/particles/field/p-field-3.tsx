import { Field, FieldDescription, FieldLabel } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";

export function Particle() {
  return (
    <Field disabled>
      <FieldLabel>Email</FieldLabel>
      <Input disabled placeholder="Enter your email" type="email" />
      <FieldDescription>This field is currently disabled.</FieldDescription>
    </Field>
  );
}
