"use client";

import { useState } from "react";

import { Card, CardPanel } from "@/registry/ui/card";
import { ColorPicker, ColorPickerPanel } from "@/registry/ui/color-picker";

const SWATCHES = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

export function Particle() {
  const [value, setValue] = useState<string | null>("#6366f1");

  return (
    <Card className="w-full max-w-96">
      <CardPanel>
        {/* `alpha` adds the opacity slider and field; `swatches` adds the
            presets row under the default panel. */}
        <ColorPicker
          alpha
          aria-label="Fill color"
          onValueChange={setValue}
          swatches={SWATCHES}
          value={value}
        >
          <ColorPickerPanel />
        </ColorPicker>
      </CardPanel>
    </Card>
  );
}
