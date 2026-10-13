"use client";

import { Field, FieldDescription, FieldLabel } from "@/registry/ui/field";
import { Textarea } from "@/registry/ui/textarea";

export function Particle() {
  return (
    <Field>
      <FieldLabel>Bio</FieldLabel>
      <Textarea placeholder="Tell us about yourself…" />
      <FieldDescription>
        Write a short bio. Maximum 500 characters.
      </FieldDescription>
    </Field>
  );
}
