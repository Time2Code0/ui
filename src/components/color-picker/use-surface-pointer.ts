"use client";

import { useRef, useState } from "react";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/**
 * Pointer + keyboard handling for a 1D (`x`) or 2D (`xy`) picking surface.
 * Positions are reported as 0–1 ratios; `onPickEnd` fires once a drag or key
 * press is done so callers can commit.
 */
export function useSurfacePointer({
  disabled = false,
  axis = "xy",
  onPick,
  onPickEnd,
  onStep,
}: {
  disabled?: boolean;
  axis?: "x" | "xy";
  onPick: (x: number, y: number) => void;
  onPickEnd?: () => void;
  /**
   * Keyboard step in "ticks": ±1 per arrow key, ±10 with Shift or Page keys,
   * ±Infinity for Home/End. `y` is positive upwards.
   */
  onStep?: (x: number, y: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef<boolean>(false);
  const steppedRef = useRef<boolean>(false);

  const pick = (clientX: number, clientY: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) {
      return;
    }
    const x = clamp01((clientX - rect.left) / rect.width);
    const y =
      axis === "xy" && rect.height > 0
        ? clamp01((clientY - rect.top) / rect.height)
        : 0;
    onPick(x, y);
  };

  // Shared by pointerup, pointercancel and lostpointercapture; the ref keeps
  // `onPickEnd` from firing twice when several of them arrive.
  const endDrag = () => {
    if (!draggingRef.current) {
      return;
    }
    draggingRef.current = false;
    setDragging(false);
    onPickEnd?.();
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) {
      return;
    }
    // Keep focus on the surface for keyboard follow-up without text selection.
    event.preventDefault();
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    setDragging(true);
    pick(event.clientX, event.clientY);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) {
      pick(event.clientX, event.clientY);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled || !onStep) {
      return;
    }
    const size = event.shiftKey ? 10 : 1;
    let x = 0;
    let y = 0;
    switch (event.key) {
      case "ArrowLeft":
        x = -size;
        break;
      case "ArrowRight":
        x = size;
        break;
      case "ArrowDown":
        y = -size;
        break;
      case "ArrowUp":
        y = size;
        break;
      case "PageDown":
        y = -10;
        break;
      case "PageUp":
        y = 10;
        break;
      case "Home":
        x = Number.NEGATIVE_INFINITY;
        break;
      case "End":
        x = Number.POSITIVE_INFINITY;
        break;
      default:
        return;
    }
    event.preventDefault();
    // 1D sliders treat vertical keys like horizontal ones.
    if (axis === "x") {
      x += y;
      y = 0;
    }
    steppedRef.current = true;
    onStep(x, y);
  };

  const onKeyUp = () => {
    if (steppedRef.current) {
      steppedRef.current = false;
      onPickEnd?.();
    }
  };

  return {
    dragging,
    handlers: {
      onBlur: onKeyUp,
      onKeyDown,
      onKeyUp,
      onLostPointerCapture: endDrag,
      onPointerCancel: endDrag,
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
    },
    ref,
  };
}
