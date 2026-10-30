"use client";

import { useCallback } from "react";

import { cn } from "cn";

import { ColorThumb } from "./color-thumb";
import {
  type OklchPickerState,
  oklchAlphaTrackBackground,
  oklchHueTrackBackground,
  pickerStateToCss,
} from "./oklch";
import { useSurfacePointer } from "./use-surface-pointer";

const HUE_TRACK_BACKGROUND = oklchHueTrackBackground();

export function OklchHueSlider({
  value,
  disabled,
  onChange,
  onChangeEnd,
}: {
  value: OklchPickerState;
  disabled?: boolean;
  onChange: (next: Pick<OklchPickerState, "h">) => void;
  onChangeEnd?: () => void;
}) {
  const handleChange = useCallback((h: number) => onChange({ h }), [onChange]);

  return (
    <OklchSlider
      ariaLabel="Hue"
      disabled={disabled}
      max={360}
      onChange={handleChange}
      onChangeEnd={onChangeEnd}
      thumbColor={pickerStateToCss({ alpha: 1, c: 0.2, h: value.h, l: 0.65 })}
      trackBackground={HUE_TRACK_BACKGROUND}
      value={value.h}
      valueText={`${Math.round(value.h)}°`}
    />
  );
}

export function OklchAlphaSlider({
  value,
  disabled,
  onChange,
  onChangeEnd,
}: {
  value: OklchPickerState;
  disabled?: boolean;
  onChange: (next: Pick<OklchPickerState, "alpha">) => void;
  onChangeEnd?: () => void;
}) {
  const handleChange = useCallback(
    (alpha: number) => onChange({ alpha }),
    [onChange]
  );

  return (
    <OklchSlider
      ariaLabel="Opacity"
      disabled={disabled}
      max={1}
      onChange={handleChange}
      onChangeEnd={onChangeEnd}
      step={0.01}
      thumbColor={pickerStateToCss(value)}
      trackBackground={oklchAlphaTrackBackground(value)}
      value={value.alpha}
      valueText={`${Math.round(value.alpha * 100)}%`}
    />
  );
}

function OklchSlider({
  ariaLabel,
  value,
  max,
  step = 1,
  valueText,
  disabled = false,
  thumbColor,
  trackBackground,
  onChange,
  onChangeEnd,
}: {
  ariaLabel: string;
  value: number;
  max: number;
  step?: number;
  valueText: string;
  disabled?: boolean;
  thumbColor: string;
  trackBackground: string;
  onChange: (value: number) => void;
  onChangeEnd?: () => void;
}) {
  const { ref, dragging, handlers } = useSurfacePointer({
    axis: "x",
    disabled,
    onPick: (x) => onChange(x * max),
    onPickEnd: onChangeEnd,
    onStep: (x) => onChange(Math.min(max, Math.max(0, value + x * step))),
  });

  return (
    <div
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
      aria-valuemax={max}
      aria-valuemin={0}
      aria-valuenow={Math.round(value * 100) / 100}
      aria-valuetext={valueText}
      className={cn(
        "relative h-3 w-full touch-none select-none rounded-full outline-none ring-foreground/30 focus-visible:ring-[3px]",
        disabled && "pointer-events-none opacity-50"
      )}
      ref={ref}
      role="slider"
      style={{ background: trackBackground }}
      tabIndex={disabled ? -1 : 0}
      {...handlers}
    >
      <ColorThumb
        className="size-3.5"
        dragging={dragging}
        style={{
          backgroundColor: thumbColor,
          left: `${(value / max) * 100}%`,
          top: "50%",
        }}
      />
    </div>
  );
}
