"use client";

import { useState } from "react";

import { Card, CardPanel } from "@/registry/ui/card";
import { ColorPicker } from "@/registry/ui/color-picker";
import { Field, FieldDescription, FieldLabel } from "@/registry/ui/field";

export function Particle() {
  const [overlay, setOverlay] = useState<string | null>("rgb(15 23 42 / 0.55)");

  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <div className="relative flex h-40 items-end bg-[linear-gradient(135deg,#f97316,#ec4899_45%,#6366f1)] p-5">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: overlay ?? "transparent" }}
        />
        <div className="relative">
          <p className="font-medium text-white/80 text-xs uppercase tracking-wide">
            New season
          </p>
          <p className="font-semibold text-lg text-white">Spring collection</p>
        </div>
      </div>
      <CardPanel>
        <Field>
          <FieldLabel htmlFor="banner-overlay" id="banner-overlay-label">
            Banner overlay
          </FieldLabel>
          {/* `alpha` adds the opacity slider and field; `format="rgb"` writes
              the value as rgb(15 23 42 / 0.55), ready for a style prop. */}
          <ColorPicker
            alpha
            aria-describedby="banner-overlay-description"
            aria-labelledby="banner-overlay-label"
            format="rgb"
            id="banner-overlay"
            onValueChange={setOverlay}
            value={overlay}
          />
          <FieldDescription id="banner-overlay-description">
            Darken the artwork so the headline stays readable.
          </FieldDescription>
        </Field>
      </CardPanel>
    </Card>
  );
}
