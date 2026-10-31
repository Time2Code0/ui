"use client";

import { useCallback, useState } from "react";

import { Add01Icon } from "@hugeicons/core-free-icons";

import { Badge } from "@/registry/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/registry/ui/card";
import {
  ColorPicker,
  ColorPickerContent,
  ColorPickerSwatch,
  ColorPickerSwatches,
  ColorPickerTrigger,
  getForegroundColor,
} from "@/registry/ui/color-picker";
import { Field, FieldLabel } from "@/registry/ui/field";
import { Icon } from "@/registry/ui/icon";
import { Input } from "@/registry/ui/input";

const LABEL_COLORS = [
  { label: "Red", value: "#ef4444" },
  { label: "Orange", value: "#f97316" },
  { label: "Yellow", value: "#eab308" },
  { label: "Green", value: "#22c55e" },
  { label: "Teal", value: "#14b8a6" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Violet", value: "#8b5cf6" },
  { label: "Pink", value: "#ec4899" },
  { label: "Slate", value: "#64748b" },
];

export function Particle() {
  const [name, setName] = useState("Needs design");
  const [color, setColor] = useState<string | null>("#8b5cf6");
  const custom =
    !!color && !LABEL_COLORS.some((preset) => preset.value === color);
  const ink = color ? getForegroundColor(color) : null;

  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value),
    []
  );

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Edit label</CardTitle>
        <CardDescription>Labels group issues across projects.</CardDescription>
      </CardHeader>
      <CardPanel className="flex flex-col gap-6">
        <Field>
          <FieldLabel htmlFor="label-name">Name</FieldLabel>
          <Input id="label-name" onChange={handleNameChange} value={name} />
        </Field>
        <Field>
          <FieldLabel id="label-color-label">Color</FieldLabel>
          <ColorPicker onValueChange={setColor} value={color}>
            <div className="flex w-full items-center gap-3">
              <ColorPickerSwatches
                aria-labelledby="label-color-label"
                className="flex-1"
                colors={LABEL_COLORS}
                shape="circle"
              />
              {/* The plus opens the full picker; once a custom color is
                  set, it shows that color instead. */}
              <ColorPickerTrigger aria-label="Custom color" size="icon-sm">
                {custom ? (
                  <ColorPickerSwatch shape="circle" />
                ) : (
                  <Icon aria-hidden="true" icon={Add01Icon} />
                )}
              </ColorPickerTrigger>
              <ColorPickerContent align="end" />
            </div>
          </ColorPicker>
        </Field>
        <div className="flex items-center gap-3">
          <span className="text-foreground-muted text-sm">Preview</span>
          <Badge
            style={{
              backgroundColor: color ?? undefined,
              color: ink ?? undefined,
            }}
          >
            {name.trim() || "Untitled"}
          </Badge>
        </div>
      </CardPanel>
    </Card>
  );
}
