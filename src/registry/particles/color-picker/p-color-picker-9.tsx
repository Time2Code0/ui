"use client";

import { useCallback, useState } from "react";

import { Button } from "@/registry/ui/button";
import {
  ColorPicker,
  ColorPickerContent,
  ColorPickerInput,
  getContrastRatio,
} from "@/registry/ui/color-picker";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/registry/ui/field";

export function Particle() {
  const [brand, setBrand] = useState<string | null>("#2563eb");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const ratio = brand ? getContrastRatio("#ffffff", brand) : null;
  // Your own validation: white text on the brand color needs 3:1.
  const invalid = ratio !== null && ratio < 3;

  const handleReset = useCallback(() => setSubmitted(null), []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (invalid) {
        return;
      }
      const data = new FormData(event.currentTarget);
      setSubmitted(String(data.get("brandColor")));
    },
    [invalid]
  );

  return (
    <form
      className="flex w-full max-w-xs flex-col items-start gap-4"
      onReset={handleReset}
      onSubmit={handleSubmit}
    >
      <Field invalid={invalid}>
        <FieldLabel htmlFor="brand-color">Brand color</FieldLabel>
        <ColorPicker
          defaultValue="#2563eb"
          id="brand-color"
          invalid={invalid}
          name="brandColor"
          onValueChange={setBrand}
          required
        >
          <ColorPickerInput
            aria-describedby={
              invalid ? "brand-color-error" : "brand-color-description"
            }
          />
          <ColorPickerContent />
        </ColorPicker>
        {invalid ? (
          <FieldError id="brand-color-error" match>
            White text on this color has a contrast of {ratio}:1. Pick a darker
            color, 3:1 or more.
          </FieldError>
        ) : (
          <FieldDescription id="brand-color-description">
            Buttons draw white text on it.
          </FieldDescription>
        )}
      </Field>
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="reset" variant="outline">
          Reset
        </Button>
      </div>
      {submitted ? (
        <p className="text-foreground-muted text-sm">
          Submitted brandColor={submitted}
        </p>
      ) : null}
    </form>
  );
}
