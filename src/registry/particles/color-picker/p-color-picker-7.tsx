"use client";

import { useState } from "react";

import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerFields,
  ColorPickerPanel,
  ColorPickerWheel,
} from "@/registry/ui/color-picker";

export function Particle() {
  const [value, setValue] = useState<string | null>("#14b8a6");

  return (
    <ColorPicker
      aria-label="Brand color"
      onValueChange={setValue}
      value={value}
    >
      <ColorPickerPanel className="w-60 items-center">
        {/* Children fill the square inside the ring, so the area there
            makes the ring-and-square picker. */}
        <ColorPickerWheel>
          <ColorPickerArea className="size-full" />
        </ColorPickerWheel>
        <ColorPickerFields formats={["hex"]} />
      </ColorPickerPanel>
    </ColorPicker>
  );
}
