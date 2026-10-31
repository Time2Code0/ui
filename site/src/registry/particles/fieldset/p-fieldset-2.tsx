import { Button } from "@/registry/ui/button";
import { Field, FieldLabel } from "@/registry/ui/field";
import {
  Fieldset,
  FieldsetLegend,
  FieldsetSeparator,
} from "@/registry/ui/fieldset";
import { Input } from "@/registry/ui/input";

export function Particle() {
  return (
    <Fieldset className="flex w-full flex-col gap-6">
      <FieldsetLegend>Sign in</FieldsetLegend>
      <Button variant="outline">Continue with GitHub</Button>
      <FieldsetSeparator>Or</FieldsetSeparator>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input placeholder="you@example.com" type="email" />
      </Field>
    </Fieldset>
  );
}
