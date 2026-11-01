# Label

## When to use

- Visible accessible labels for inputs and controls.
- Simple `htmlFor`/`id` associations in forms and settings UIs.

## Install

```bash
npx time2code add label
```

## Canonical imports

```tsx
import { Label } from "@/components/ui/label"
```

## Minimal pattern

```tsx
<Label htmlFor="email">Email</Label>
```

## Patterns from particles

### Key patterns

Label paired with input:

```tsx
const id = useId()

<div className="flex flex-col gap-2">
  <Label htmlFor={id}>Email</Label>
  <Input id={id} type="email" placeholder="name@example.com" />
</div>
```

Label wrapping a checkbox:

```tsx
<Label>
  <Checkbox />
  Accept terms and conditions
</Label>
```

Prefer `FieldLabel` within `Field` for validation-aware forms.

### More examples

See `p-field-1`, `p-input-6`, `p-checkbox-1` for label-in-form patterns.

## Common pitfalls

- Using `aria-label` when visible `Label` text exists and can be associated.
- Mismatching `htmlFor`/`id` between label and control.
- Using label component as generic typography instead of form labeling.

## Useful particle references

- with checkbox: `p-checkbox-1`
- with input: `p-input-6`
- label-specific particles: no dedicated `p-label-*` family; use form references `p-field-1`, `p-input-6`, `p-checkbox-1`.
