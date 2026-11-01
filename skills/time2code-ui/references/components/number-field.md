# Number Field

## When to use

- Numeric entry with increment/decrement controls.
- Bounded stepper-style quantity/amount inputs.

## Install

```bash
npx time2code add number-field
```

## Canonical imports

```tsx
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "@/components/ui/number-field"
```

## Minimal pattern

```tsx
<NumberField defaultValue={0}>
  <NumberFieldScrubArea label="Quantity" />
  <NumberFieldGroup>
    <NumberFieldDecrement />
    <NumberFieldInput />
    <NumberFieldIncrement />
  </NumberFieldGroup>
</NumberField>
```

For form-bound numeric inputs, prefer wrapping `NumberField` with `Field` + `FieldLabel` + `FieldError` instead of standalone usage.

## Patterns from particles

### Key patterns

Number field with external label and bounds:

```tsx
<Field name="quantity">
  <FieldLabel>Quantity</FieldLabel>
  <NumberField defaultValue={1} min={0} max={99}>
    <NumberFieldGroup>
      <NumberFieldDecrement />
      <NumberFieldInput />
      <NumberFieldIncrement />
    </NumberFieldGroup>
  </NumberField>
  <FieldError>Enter a quantity between 0 and 99.</FieldError>
</Field>
```

Number field with scrub area (drag to adjust):

```tsx
<NumberField defaultValue={50}>
  <NumberFieldScrubArea label="Brightness" />
  <NumberFieldGroup>
    <NumberFieldDecrement />
    <NumberFieldInput />
    <NumberFieldIncrement />
  </NumberFieldGroup>
</NumberField>
```

Sizes: `sm`, `default`, `lg` via `size` on the `NumberField` root.

### More examples

See `p-number-field-1` through `p-number-field-10` for sizes, disabled, scrub, range, formatted value, step and form patterns.

## Common pitfalls

- Treating number field value as free-form text without numeric bounds/steps.
- Missing increment/decrement controls in stepper-style UIs where expected.
- Not validating min/max constraints and resulting clamped behavior.

## Useful particle references

- small size: `p-number-field-2`
- large size: `p-number-field-3`
- disabled: `p-number-field-4`
- with external label: `p-number-field-5`
- with scrub: `p-number-field-6`
- with range: `p-number-field-7`
- with formatted value: `p-number-field-8`
- with step: `p-number-field-9`
- in a form: `p-number-field-10`
