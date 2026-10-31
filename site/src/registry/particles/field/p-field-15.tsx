import { Field, FieldLabel } from "@/registry/ui/field";
import { Switch } from "@/registry/ui/switch";

export function Particle() {
  return (
    <Field>
      <FieldLabel>
        <Switch />
        Email notifications
      </FieldLabel>
    </Field>
  );
}
