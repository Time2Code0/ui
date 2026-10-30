"use client";

import { useEffect, useRef } from "react";

import { cn } from "cn";

import { ColorThumb } from "./color-thumb";
import {
  OKLCH_PICKER_CHROMA_MAX,
  type OklchPickerState,
  paintOklchPlane,
  pickerStateToCss,
} from "./oklch";
import { useSurfacePointer } from "./use-surface-pointer";

const PLANE_DPR_CAP = 2;
const LIGHTNESS_STEP = 0.01;
const CHROMA_STEP = OKLCH_PICKER_CHROMA_MAX / 100;

function redrawPlane(canvas: HTMLCanvasElement, hue: number) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(PLANE_DPR_CAP, window.devicePixelRatio || 1);
  const width = Math.round(Math.max(1, rect.width) * dpr);
  const height = Math.round(Math.max(1, rect.height) * dpr);

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { alpha: false });
  if (ctx) {
    paintOklchPlane(ctx, width, height, hue);
  }
}

/** Chroma (x) × lightness (y) plane at the current hue. */
export function OklchColorArea({
  value,
  disabled = false,
  className,
  onChange,
  onChangeEnd,
}: {
  value: OklchPickerState;
  disabled?: boolean;
  className?: string;
  onChange: (next: Pick<OklchPickerState, "l" | "c">) => void;
  onChangeEnd?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { ref, dragging, handlers } = useSurfacePointer({
    axis: "xy",
    disabled,
    onPick: (x, y) => onChange({ c: x * OKLCH_PICKER_CHROMA_MAX, l: 1 - y }),
    onPickEnd: onChangeEnd,
    onStep: (x, y) =>
      onChange({
        c: value.c + x * CHROMA_STEP,
        l: value.l + y * LIGHTNESS_STEP,
      }),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const paint = () => redrawPlane(canvas, value.h);
    paint();

    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [value.h]);

  return (
    <div
      aria-disabled={disabled || undefined}
      aria-label="Lightness and chroma"
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(value.l * 100)}
      aria-valuetext={`Lightness ${Math.round(value.l * 100)}%, chroma ${value.c.toFixed(3)}`}
      className={cn(
        "relative aspect-4/3 w-full touch-none select-none rounded-md outline-none ring-foreground/30 focus-visible:ring-[3px]",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      ref={ref}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      {...handlers}
    >
      <canvas
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full rounded-[inherit]"
        ref={canvasRef}
      />
      <ColorThumb
        dragging={dragging}
        style={{
          backgroundColor: pickerStateToCss({ ...value, alpha: 1 }),
          left: `${(value.c / OKLCH_PICKER_CHROMA_MAX) * 100}%`,
          top: `${(1 - value.l) * 100}%`,
        }}
      />
    </div>
  );
}
