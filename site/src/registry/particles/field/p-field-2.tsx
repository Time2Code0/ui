import { Field, FieldError, FieldLabel } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";

export function Particle() {
  return (
    <Field>
      <FieldLabel>
        Password <span className="text-destructive-foreground">*</span>
      </FieldLabel>
      <Input placeholder="Enter password" required type="password" />
      <FieldError>Please fill out this field.</FieldError>
    </Field>
  );
}
