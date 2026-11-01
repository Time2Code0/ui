# Color Picker

## When to use

- Picking a color: brand or theme colors, labels, chart series, design tokens.
- A CSS color text input with a swatch (`ColorPickerInput`).

## When NOT to use

- A small fixed palette with no custom color -> use RadioGroup with swatch cards (`p-radio-group-10`).

## Install

```bash
npx time2code add color-picker
```

It does its own color math, so there is no color library to install.

## Canonical imports

```tsx
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerFields,
  ColorPickerInput,
  ColorPickerPanel,
  ColorPickerSlider,
  ColorPickerSwatches,
  ColorPickerTrigger,
} from "@/components/ui/color-picker"
```

## Minimal pattern

```tsx
const [color, setColor] = useState<string | null>("#3b82f6")

<ColorPicker onValueChange={setColor} value={color} />
```

Without children, `ColorPicker` renders a trigger button and a popover with the default panel (area, eye dropper, copy, hue slider, fields and the root's `swatches`).

## Patterns from particles

### Composition

`ColorPicker` holds the value and renders no element. `ColorPickerTrigger` or `ColorPickerInput` opens `ColorPickerContent` (a `PopoverPopup`); `ColorPickerPanel` renders controls in place for an inline picker. Inside either, combine the parts freely:

```tsx
<ColorPicker alpha onValueChange={setColor} value={color}>
  <ColorPickerTrigger />
  <ColorPickerContent>
    <ColorPickerPanel>
      <ColorPickerArea />
      <ColorPickerSlider channel="hue" />
      <ColorPickerSlider channel="alpha" />
      <ColorPickerFields />
      <ColorPickerSwatches colors={["#ef4444", "#22c55e", "#3b82f6"]} />
    </ColorPickerPanel>
  </ColorPickerContent>
</ColorPicker>
```

Other parts: `ColorPickerWheel` (hue ring; put a `ColorPickerArea className="size-full"` inside it), `ColorPickerChannelInput`, `ColorPickerSwatch`, `ColorPickerSwatchItem`, `ColorPickerValue`, `ColorPickerEyeDropper`, `ColorPickerCopy`, `ColorPickerClear`, and the `useColorPicker` hook.

### Value

- The value is a CSS color string written in `format` (`"hex"` default, `"rgb"`, `"hsl"`, `"hsb"`, `"oklch"`). `null` is empty. Incoming values can be any color the picker parses.
- `onValueChange` fires on every change, including each move of a drag. Save to a server or an undo history in `onValueCommit`, which fires once per interaction.
- `alpha` adds the opacity slider and field; without it the value is always opaque.
- Use `format="oklch"` with `ColorPickerSlider colorSpace="oklch"` (`lightness`, `chroma`, `hue`) for theme tokens.
- Helpers: `parseColor`, `formatColor`, `getContrastRatio`, `getForegroundColor`, `isColorInSrgb`.

### Forms

Give the root a `name` and the value submits with a native form. `required`, `disabled`, `readOnly` and `invalid` work like other form controls; `inputRef` lets form libraries focus it on error.

```tsx
<FieldLabel htmlFor="brand">Brand color</FieldLabel>
<ColorPicker id="brand" name="brandColor" required>
  <ColorPickerInput />
  <ColorPickerContent />
</ColorPicker>
```

### i18n

Every rendered string comes from the `i18n` prop, merged over the English defaults (`{ labels: { placeholder: "Farbe wählen" } }`).

## Common pitfalls

- Saving on `onValueChange`, which fires on every drag frame; use `onValueCommit`.
- Expecting `alpha` in the value without passing `alpha`.
- Adding a color library for conversions the helpers already cover.
- Wrapping `ColorPickerContent` in your own `Popover`; it already is one.

## Useful particle references

- inline picker with opacity and swatches: `p-color-picker-1`
- popover picker: `p-color-picker-2`
- color input: `p-color-picker-3`
- opacity: `p-color-picker-4`
- preset swatches with a custom color: `p-color-picker-5`
- OKLCH theme token: `p-color-picker-6`
- hue wheel with area: `p-color-picker-7`
- RGB channel sliders: `p-color-picker-8`
- form: `p-color-picker-9`
- contrast checker: `p-color-picker-10`

Full API: https://design.time2code.dev/docs/ui/color-picker.md
