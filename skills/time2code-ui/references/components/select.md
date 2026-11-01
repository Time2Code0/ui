# Select

## When to use

- Single-choice selection from a predefined list.
- Select-style triggers with popup options.

## When NOT to use

- If the user needs to type/filter options -> use Combobox instead.
- If the list is very short (2-3 items) with visible options -> consider RadioGroup.
- If the selection drives complex search/autocomplete -> use Autocomplete instead.

## Install

```bash
npx time2code add select
```

## Canonical imports

```tsx
import {
  Select,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectLabel,
  SelectPopup,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
```

## Minimal pattern

```tsx
const items = [
  { label: "Next.js", value: "next" },
  { label: "Vite", value: "vite" },
]

<Select items={items}>
  <SelectTrigger>
    <SelectValue placeholder="Select framework" />
  </SelectTrigger>
  <SelectPopup>
    {items.map((item) => (
      <SelectItem key={item.value} value={item.value}>
        {item.label}
      </SelectItem>
    ))}
  </SelectPopup>
</Select>
```

Prefer this `items`-first pattern: `items` lets `SelectValue` show the label for the selected value before the popup has mounted, which avoids SSR mismatches. With `{ label, value }` items, give `SelectItem` the primitive `value`; pass the whole object only for object values (see below).

Visible label without `Field`: put `SelectLabel` inside `Select`, above `SelectTrigger`. Clicking it focuses the trigger. Inside a `Field`, use `FieldLabel` instead.

Sizes: `sm`, `default`, `lg` on `SelectTrigger`. `SelectPopup` renders its own list, so put `SelectItem`s directly inside it.

For form-bound selects, prefer wrapping with `Field` + `FieldLabel` + `FieldError` so value, label, and validation stay semantically linked.

## Patterns from particles

- **Field composition**: in forms, place `Select` inside `Field` wrappers (see `p-select-11`, `p-select-23`, `p-field-11`).
- **Trigger composition**: keep `SelectTrigger` as the interaction entry point and avoid Radix `asChild` assumptions from other primitives; where composition is needed, prefer documented Base UI `render` patterns for supported parts.
- **Multiple selection**: use `multiple` with array values (for example `defaultValue={["javascript", "typescript"]}`) and a custom `SelectValue` render function for compact summaries.
- **Object values**: use full objects in `SelectItem value={item}` with `itemToStringValue` for stable form value serialization.
- **Grouped options**: use `SelectGroup` + `SelectGroupLabel`; combine with `SelectSeparator` between groups when needed.
- **Disabled options**: pass `disabled` on individual `SelectItem` rows (for unavailable choices).
- **Rich row/trigger rendering**: render custom content (icons, avatars, secondary text) in both `SelectValue` and `SelectItem`; adjust row density via `className` where needed.
- **Alignment tuning**: use `alignItemWithTrigger={false}` only when the default selected-item alignment causes layout issues.

## Portal forwarding

- **Portal forwarding**: optional `portalProps` on `SelectPopup` → Base UI `Select.Portal` (`keepMounted`, `container`, …). See [portal-props.md](../portal-props.md).

## Common pitfalls

- Keeping children-only Radix select patterns without adding `items`.
- Forgetting to render `SelectValue` inside `SelectTrigger`.
- Placing placeholder on the wrong part; use `placeholder` on `SelectValue` when needed.
- Putting `SelectLabel` inside `SelectPopup` as a heading; it labels the whole select and belongs next to the trigger. Use `SelectGroupLabel` for headings inside the popup.
- Using object item values without `itemToStringValue` when stable string value serialization is required.
- Treating `multiple` select values as scalars instead of arrays.
- Mixing select and combobox APIs without validating docs.
- Writing `SelectContent` from shadcn/ui; the part is `SelectPopup`.

## Useful particle references

- basic select + sizing + disabled: `p-select-1` through `p-select-4`
- without item alignment (`alignItemWithTrigger={false}`): `p-select-5`
- grouped/labeled/select field patterns: `p-select-6`, `p-select-11`, `p-select-23`
- multiple selection summary rendering: `p-select-7`
- icons in trigger / options: `p-select-8`, `p-select-9`
- object values: `p-select-10`
- related pattern: `p-combobox-18` (`SelectButton` with combobox trigger)

