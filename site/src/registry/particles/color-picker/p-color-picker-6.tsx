"use client";

import type { CSSProperties } from "react";

import { useState } from "react";

import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/registry/ui/card";
import { Checkbox } from "@/registry/ui/checkbox";
import {
  ColorPicker,
  ColorPickerChannelInput,
  ColorPickerCopy,
  ColorPickerSlider,
  getForegroundColor,
  isColorInSrgb,
  parseColor,
} from "@/registry/ui/color-picker";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/ui/input-group";
import { Label } from "@/registry/ui/label";

const CHANNELS = [
  { channel: "lightness", short: "L" },
  { channel: "chroma", short: "C" },
  { channel: "hue", short: "H" },
] as const;

export function Particle() {
  // Tailwind's blue-500, a P3 color: its chroma runs past sRGB.
  const [primary, setPrimary] = useState<string | null>(
    "oklch(62.3% 0.214 259.815)"
  );
  const color = parseColor(primary);
  const foreground = color ? getForegroundColor(color) : null;
  // Button, Badge and Checkbox fill with --color-foreground and draw on
  // --color-background, so the preview points both at the primary pair.
  const theme =
    primary && foreground
      ? ({
          "--color-background": foreground,
          "--color-foreground": primary,
        } as CSSProperties)
      : undefined;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Primary color</CardTitle>
        <CardDescription>
          Tune the --color-primary token in OKLCH, the format Tailwind v4 themes
          use.
        </CardDescription>
      </CardHeader>
      <CardPanel className="flex flex-col gap-5">
        <ColorPicker
          aria-label="Primary color"
          format="oklch"
          onValueChange={setPrimary}
          value={primary}
        >
          <div className="grid gap-3">
            {CHANNELS.map(({ channel, short }) => (
              <div
                className="grid grid-cols-[1rem_1fr_5rem] items-center gap-3"
                key={channel}
              >
                <span
                  aria-hidden="true"
                  className="font-medium text-foreground-muted text-xs"
                >
                  {short}
                </span>
                <ColorPickerSlider channel={channel} colorSpace="oklch" />
                <InputGroup>
                  <ColorPickerChannelInput
                    channel={channel}
                    className="w-full"
                    colorSpace="oklch"
                  />
                </InputGroup>
              </div>
            ))}
          </div>
          <InputGroup>
            <InputGroupInput
              aria-label="CSS variable"
              readOnly
              value={`--color-primary: ${primary ?? "none"};`}
            />
            <InputGroupAddon align="inline-end">
              <ColorPickerCopy size="icon-xs" />
            </InputGroupAddon>
          </InputGroup>
        </ColorPicker>
        <div className="flex flex-wrap items-center gap-3">
          <Button style={theme}>Save changes</Button>
          <Badge style={theme}>New</Badge>
          <div className="flex items-center gap-2">
            <Checkbox defaultChecked id="primary-notify" style={theme} />
            <Label htmlFor="primary-notify">Notify team</Label>
          </div>
          {color && !isColorInSrgb(color) ? (
            <Badge className="ms-auto" variant="warning">
              Outside sRGB
            </Badge>
          ) : null}
        </div>
      </CardPanel>
    </Card>
  );
}
