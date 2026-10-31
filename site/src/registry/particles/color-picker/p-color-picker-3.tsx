import {
  ColorPicker,
  ColorPickerContent,
  ColorPickerInput,
} from "@/registry/ui/color-picker";
import { Field, FieldDescription, FieldLabel } from "@/registry/ui/field";

export function Particle() {
  return (
    <div className="w-full max-w-xs">
      <Field>
        <FieldLabel htmlFor="canvas-background">Canvas background</FieldLabel>
        {/* The input reads any CSS color on blur or Enter and writes it back
            as hex; the swatch button opens the full picker. */}
        <ColorPicker defaultValue="#f8fafc" id="canvas-background">
          <ColorPickerInput aria-describedby="canvas-background-description" />
          <ColorPickerContent />
        </ColorPicker>
        <FieldDescription id="canvas-background-description">
          Type a hex code, rgb(), hsl(), oklch() or a name like tomato.
        </FieldDescription>
      </Field>
    </div>
  );
}
