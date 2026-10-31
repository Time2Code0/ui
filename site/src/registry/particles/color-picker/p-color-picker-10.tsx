"use client";

import { useState } from "react";

import { Badge } from "@/registry/ui/badge";
import {
  ColorPicker,
  ColorPickerContent,
  ColorPickerInput,
  getContrastRatio,
} from "@/registry/ui/color-picker";
import { Field, FieldLabel } from "@/registry/ui/field";

const LEVELS = [
  { label: "AA large", min: 3 },
  { label: "AA", min: 4.5 },
  { label: "AAA", min: 7 },
];

export function Particle() {
  const [text, setText] = useState<string | null>("#1e293b");
  const [background, setBackground] = useState<string | null>("#e0f2fe");
  const ratio = text && background ? getContrastRatio(text, background) : null;

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel htmlFor="contrast-text">Text</FieldLabel>
          <ColorPicker id="contrast-text" onValueChange={setText} value={text}>
            <ColorPickerInput />
            <ColorPickerContent />
          </ColorPicker>
        </Field>
        <Field>
          <FieldLabel htmlFor="contrast-background">Background</FieldLabel>
          <ColorPicker
            id="contrast-background"
            onValueChange={setBackground}
            value={background}
          >
            <ColorPickerInput />
            <ColorPickerContent />
          </ColorPicker>
        </Field>
      </div>
      <div
        className="flex flex-col gap-1 rounded-xl border p-5"
        style={{
          backgroundColor: background ?? undefined,
          color: text ?? undefined,
        }}
      >
        <p className="font-semibold text-lg">The quick brown fox</p>
        <p className="text-sm">jumps over the lazy dog.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="me-auto font-medium text-sm tabular-nums">
          {ratio === null ? "–" : `${ratio}:1`}
        </span>
        {LEVELS.map(({ label, min }) => {
          const pass = ratio !== null && ratio >= min;
          return (
            <Badge key={label} variant={pass ? "success" : "error"}>
              {label} {pass ? "pass" : "fail"}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
