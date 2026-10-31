"use client";

import { useState } from "react";

import {
  ColorPicker,
  ColorPickerChannelInput,
  ColorPickerPanel,
  ColorPickerSlider,
  ColorPickerSwatch,
  ColorPickerValue,
} from "@/registry/ui/color-picker";
import { InputGroup, InputGroupAddon } from "@/registry/ui/input-group";

const CHANNELS = [
  { channel: "red", short: "R" },
  { channel: "green", short: "G" },
  { channel: "blue", short: "B" },
  { channel: "alpha", short: "A" },
] as const;

export function Particle() {
  const [value, setValue] = useState<string | null>("#f97316");

  return (
    <ColorPicker
      alpha
      aria-label="Stroke color"
      format="rgb"
      onValueChange={setValue}
      value={value}
    >
      <ColorPickerPanel className="w-full max-w-72">
        <div className="flex items-center gap-3">
          <ColorPickerSwatch className="size-8 rounded-md" />
          <ColorPickerValue className="font-medium text-sm tabular-nums" />
        </div>
        {/* Each track shows what its channel can reach from the current
            color, so dragging red redraws green and blue. */}
        {CHANNELS.map(({ channel, short }) => (
          <div
            className="grid grid-cols-[1fr_5.5rem] items-center gap-3"
            key={channel}
          >
            <ColorPickerSlider channel={channel} />
            <InputGroup>
              <InputGroupAddon className="text-foreground-muted text-xs">
                {short}
              </InputGroupAddon>
              <ColorPickerChannelInput channel={channel} className="w-full" />
            </InputGroup>
          </div>
        ))}
      </ColorPickerPanel>
    </ColorPicker>
  );
}
