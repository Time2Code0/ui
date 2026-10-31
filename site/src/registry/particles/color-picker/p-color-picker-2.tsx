import { ColorPicker } from "@/registry/ui/color-picker";
import { Field, FieldDescription, FieldLabel } from "@/registry/ui/field";

export function Particle() {
  return (
    <div className="w-full max-w-xs">
      <Field>
        <FieldLabel htmlFor="accent-color" id="accent-color-label">
          Accent color
        </FieldLabel>
        {/* With no children the picker renders its own trigger and popover.
            `aria-labelledby` keeps the value in the trigger's name, so it
            reads "Accent color #0EA5E9" rather than the label alone. */}
        <ColorPicker
          aria-describedby="accent-color-description"
          aria-labelledby="accent-color-label"
          defaultValue="#0ea5e9"
          id="accent-color"
        />
        <FieldDescription id="accent-color-description">
          Used for links, focus rings and primary buttons.
        </FieldDescription>
      </Field>
    </div>
  );
}
