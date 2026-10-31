"use client";

import { Field, FieldLabel, FieldValidity } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";

export function Particle() {
  return (
    <Field>
      <FieldLabel>Email</FieldLabel>
      <Input placeholder="Enter your email" required type="email" />
      <FieldValidity>
        {(validity) => (
          <div className="flex w-full flex-col gap-2">
            {validity.error && (
              <p className="text-destructive-foreground text-xs">
                {validity.error}
              </p>
            )}
            <div className="w-full rounded-md bg-background-muted p-2">
              <pre className="max-h-60 overflow-y-auto font-mono text-xs [scrollbar-width:none]">
                {JSON.stringify(validity, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </FieldValidity>
    </Field>
  );
}
