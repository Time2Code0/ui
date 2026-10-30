"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import {
  clampPickerState,
  colorToPickerState,
  formatOklch,
  formatOklchBody,
  type OklchPickerState,
  parseColor,
} from "@/components/color-picker/oklch";
import { OklchColorArea } from "@/components/color-picker/oklch-color-area";
import {
  OklchAlphaSlider,
  OklchHueSlider,
} from "@/components/color-picker/oklch-color-slider";
import { Input } from "@/registry/ui/input";

// One hue decimal keeps the body readable in a narrow field.
function formatDraft(state: OklchPickerState) {
  return formatOklchBody(state, 1);
}

function formatOpacity(state: OklchPickerState) {
  return String(Math.round(state.alpha * 100));
}

/**
 * OKLCh color picker: chroma × lightness area, hue and opacity sliders and
 * text fields. Emits `oklch(L C H)` / `oklch(L C H / A)` strings.
 */
export function ThemeColorPicker({
  color,
  onChange,
  onPreview,
}: {
  /** Any CSS color; non-OKLCh values are converted on the way in. */
  color: string;
  /** Commits a value: on pointer/key release, input blur or Enter. */
  onChange: (value: string) => void;
  /** Live value while dragging or stepping; not committed yet. */
  onPreview?: (value: string) => void;
}) {
  const id = useId();

  const [pickerState, setPickerState] = useState(() =>
    colorToPickerState(color)
  );
  const [draft, setDraft] = useState(() => formatDraft(pickerState));
  const [opacityDraft, setOpacityDraft] = useState(() =>
    formatOpacity(pickerState)
  );

  // Pointer events can outpace renders, so handlers read the latest state here.
  const pickerStateRef = useRef(pickerState);
  // The last committed value; echoing it back through `color` must not reset
  // the state (rounding would nudge the thumbs, and hue 360 would wrap to 0).
  const committedRef = useRef(color);

  const syncState = useCallback((next: OklchPickerState) => {
    pickerStateRef.current = next;
    setPickerState(next);
    setDraft(formatDraft(next));
    setOpacityDraft(formatOpacity(next));
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only external color changes should reset the picker
  useEffect(() => {
    if (color === committedRef.current) {
      return;
    }
    committedRef.current = color;
    syncState(colorToPickerState(color));
  }, [color]);

  const applyState = useCallback(
    (next: OklchPickerState, mode: "preview" | "commit") => {
      const clamped = clampPickerState(next);
      syncState(clamped);
      const value = formatOklch(clamped);
      if (mode === "commit") {
        committedRef.current = value;
        onChange(value);
      } else {
        onPreview?.(value);
      }
    },
    [onChange, onPreview, syncState]
  );

  const previewPartial = useCallback(
    (partial: Partial<OklchPickerState>) => {
      applyState({ ...pickerStateRef.current, ...partial }, "preview");
    },
    [applyState]
  );

  const commitCurrent = useCallback(() => {
    applyState(pickerStateRef.current, "commit");
  }, [applyState]);

  const resetDrafts = useCallback(() => {
    setDraft(formatDraft(pickerStateRef.current));
    setOpacityDraft(formatOpacity(pickerStateRef.current));
  }, []);

  // Blur and Enter both commit; skip untouched fields so tabbing through
  // doesn't emit a change.
  const commitDraft = useCallback(() => {
    if (draft === formatDraft(pickerStateRef.current)) {
      return;
    }
    const parsed = parseColor(draft);
    if (!parsed) {
      resetDrafts();
      return;
    }
    // Keep the current opacity unless the typed color sets its own.
    const alpha = parsed.alpha ?? pickerStateRef.current.alpha;
    applyState({ ...parsed, alpha }, "commit");
  }, [applyState, draft, resetDrafts]);

  const commitOpacityDraft = useCallback(() => {
    if (opacityDraft === formatOpacity(pickerStateRef.current)) {
      return;
    }
    const percent = Number.parseFloat(opacityDraft);
    if (!Number.isFinite(percent)) {
      resetDrafts();
      return;
    }
    applyState({ ...pickerStateRef.current, alpha: percent / 100 }, "commit");
  }, [applyState, opacityDraft, resetDrafts]);

  const onInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>, commit: () => void) => {
      if (event.key === "Enter") {
        commit();
      } else if (event.key === "Escape") {
        // Don't close the surrounding popover; just drop the edit.
        event.stopPropagation();
        resetDrafts();
      }
    },
    [resetDrafts]
  );

  const onDraftChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDraft(event.currentTarget.value);
    },
    []
  );

  const onDraftKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      onInputKeyDown(event, commitDraft);
    },
    [commitDraft, onInputKeyDown]
  );

  const onOpacityDraftChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setOpacityDraft(event.currentTarget.value);
    },
    []
  );

  const onOpacityDraftKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      onInputKeyDown(event, commitOpacityDraft);
    },
    [commitOpacityDraft, onInputKeyDown]
  );

  return (
    <div className="flex flex-col gap-3">
      <OklchColorArea
        onChange={previewPartial}
        onChangeEnd={commitCurrent}
        value={pickerState}
      />

      <div className="flex flex-col gap-2">
        <OklchHueSlider
          onChange={previewPartial}
          onChangeEnd={commitCurrent}
          value={pickerState}
        />
        <OklchAlphaSlider
          onChange={previewPartial}
          onChangeEnd={commitCurrent}
          value={pickerState}
        />
      </div>

      <div className="flex items-center gap-1.5">
        <label
          className="shrink-0 px-1 font-medium text-[10px] text-foreground-muted uppercase tracking-wide"
          htmlFor={`${id}-oklch`}
        >
          oklch
        </label>
        <Input
          autoComplete="off"
          className="min-w-0 flex-1 font-mono **:data-[slot=input]:px-1.5 **:data-[slot=input]:text-[11px]"
          id={`${id}-oklch`}
          onBlur={commitDraft}
          onChange={onDraftChange}
          onKeyDown={onDraftKeyDown}
          placeholder="0.865 0.127 207"
          size="sm"
          spellCheck={false}
          value={draft}
        />
        <Input
          aria-label="Opacity percent"
          autoComplete="off"
          className="w-11 shrink-0 font-mono **:data-[slot=input]:px-1 **:data-[slot=input]:text-center **:data-[slot=input]:text-[11px]"
          inputMode="decimal"
          onBlur={commitOpacityDraft}
          onChange={onOpacityDraftChange}
          onKeyDown={onOpacityDraftKeyDown}
          size="sm"
          value={opacityDraft}
        />
      </div>
    </div>
  );
}
