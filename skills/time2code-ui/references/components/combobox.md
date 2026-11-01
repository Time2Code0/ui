# Combobox

## When to use

- Searchable selection combining text input and list selection.
- Rich option rows with filtering and custom trigger behavior.

## When NOT to use

- If options are few and fixed (no search needed) -> use Select instead.
- If you need free-form text suggestions without strict selection -> use Autocomplete instead.
- If the user picks from a simple short list -> use RadioGroup or Select.

## Install

```bash
npx time2code add combobox
```

## Canonical imports

```tsx
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxClear,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxFilter,
} from "@/components/ui/combobox"
```

## Minimal pattern

```tsx
const items = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "orange", label: "Orange" },
  { value: "grape", label: "Grape" },
]

<Combobox items={items}>
  <ComboboxInput placeholder="Select an item..." />
  <ComboboxPopup>
    <ComboboxEmpty>No results found.</ComboboxEmpty>
    <ComboboxList>
      {(item) => <ComboboxItem key={item.value} value={item}>{item.label}</ComboboxItem>}
    </ComboboxList>
  </ComboboxPopup>
</Combobox>
```

For form-bound comboboxes, prefer `Field` composition (`Field` + `FieldLabel` + `FieldError`) instead of standalone controls.

Define static `items` at module scope and memoize dynamic collections. For object items without `label`/`value` keys, pass `itemToStringLabel` and `itemToStringValue` to `Combobox`.

## Patterns from particles

- **Portal forwarding**: optional `portalProps` on `ComboboxPopup` → Base UI `Combobox.Portal` (`keepMounted`, `container`, …). See [portal-props.md](../portal-props.md).

### Key patterns

Combobox with label in a Field:

```tsx
<Field>
  <FieldLabel>Framework</FieldLabel>
  <Combobox items={items}>
    <ComboboxInput placeholder="Search..." />
    <ComboboxPopup>
      <ComboboxEmpty>No results found.</ComboboxEmpty>
      <ComboboxList>
        {(item) => <ComboboxItem key={item.value} value={item}>{item.label}</ComboboxItem>}
      </ComboboxList>
    </ComboboxPopup>
  </Combobox>
</Field>
```

Sizes: `sm`, `default`, `lg` on `ComboboxInput`. It also takes `showTrigger`, `showClear` and `startAddon`.

Multiple selection with chips (`ComboboxChip` renders its own remove button):

```tsx
<Combobox items={items} multiple>
  <ComboboxChips>
    <ComboboxValue>
      {(value: Item[]) => (
        <>
          {value.map((item) => (
            <ComboboxChip aria-label={item.label} key={item.value}>
              {item.label}
            </ComboboxChip>
          ))}
          <ComboboxChipsInput
            aria-label="Select items"
            placeholder={value.length > 0 ? undefined : "Select items..."}
          />
        </>
      )}
    </ComboboxValue>
  </ComboboxChips>
  <ComboboxPopup>
    <ComboboxEmpty>No items found.</ComboboxEmpty>
    <ComboboxList>
      {(item) => <ComboboxItem key={item.value} value={item}>{item.label}</ComboboxItem>}
    </ComboboxList>
  </ComboboxPopup>
</Combobox>
```

Button trigger with the search input inside the popup (select-like):

```tsx
<Combobox items={countries}>
  <ComboboxTrigger render={<Button className="w-full justify-between font-normal" variant="outline"><ComboboxValue /></Button>} />
  <ComboboxPopup aria-label="Select country">
    <div className="border-b p-2">
      <ComboboxInput placeholder="Search…" showTrigger={false} />
    </div>
    <ComboboxEmpty>No countries found.</ComboboxEmpty>
    <ComboboxList>
      {(country) => <ComboboxItem key={country.code} value={country}>{country.label}</ComboboxItem>}
    </ComboboxList>
  </ComboboxPopup>
</Combobox>
```

### More examples

See `p-combobox-1` through `p-combobox-14` and `p-combobox-18` for sizes, label, auto-highlight, clear button, groups, multiple selection, popup input, forms, start addons and a select-style trigger.

## Common pitfalls

- Mixing select and combobox APIs without validating item/value wiring.
- Using object values without stable string serialization where needed.
- Missing empty/loading states for remote or filtered datasets.
- Using `createComboboxItems`; it doesn't exist here.
- Omitting `ComboboxList` around results (unlike `SelectPopup`, `ComboboxPopup` doesn't render its own list).

## Useful particle references

- disabled: `p-combobox-2`
- small size: `p-combobox-3`
- large size: `p-combobox-4`
- with label: `p-combobox-5`
- auto highlight: `p-combobox-6`
- with clear button: `p-combobox-7`
- with groups: `p-combobox-8`
- with multiple selection (chips): `p-combobox-9`
- input inside popup: `p-combobox-10`
- forms: `p-combobox-11`, `p-combobox-12`
- start addon: `p-combobox-13`, `p-combobox-14`
- select-style trigger: `p-combobox-18`
- related search/selection references: `p-autocomplete-1`, `p-select-1`, `p-input-group-1`
