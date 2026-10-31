"use client";

import { Checkbox } from "@/registry/ui/checkbox";
import { CheckboxGroup } from "@/registry/ui/checkbox-group";
import { Field, FieldItem, FieldLabel } from "@/registry/ui/field";
import { Fieldset, FieldsetLegend } from "@/registry/ui/fieldset";

export function Particle() {
  return (
    <Field
      className="gap-2"
      name="frameworks"
      render={(props) => <Fieldset {...props} />}
    >
      <FieldsetLegend className="font-medium text-sm">
        Frameworks
      </FieldsetLegend>
      <CheckboxGroup defaultValue={["react"]}>
        <FieldItem>
          <FieldLabel>
            <Checkbox value="react" /> React
          </FieldLabel>
        </FieldItem>
        <FieldItem>
          <FieldLabel>
            <Checkbox value="vue" /> Vue
          </FieldLabel>
        </FieldItem>
        <FieldItem>
          <FieldLabel>
            <Checkbox value="svelte" /> Svelte
          </FieldLabel>
        </FieldItem>
      </CheckboxGroup>
    </Field>
  );
}
