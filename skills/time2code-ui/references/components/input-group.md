# Input Group

## When to use

- Inputs/textareas that need inline or block addons.
- Input composition with icons, buttons, labels, badges, and shortcuts.

## Install

```bash
npx time2code add input-group
```

## Canonical imports

```tsx
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
```

## Minimal pattern

```tsx
<InputGroup>
  <InputGroupInput type="email" placeholder="Email" />
  <InputGroupAddon>
    <Icon aria-hidden="true" icon={Mail01Icon} />
  </InputGroupAddon>
</InputGroup>
```

## DOM order convention

Keep `InputGroupInput` or `InputGroupTextarea` before `InputGroupAddon` in the DOM as the conventional composition order. The addon's focus handler searches the entire parent group with `querySelector`, so DOM order does not determine whether it finds the control. The `align` prop on `InputGroupAddon` controls visual placement: `inline-start` (default), `inline-end`, `block-start` and `block-end`.

## Patterns from particles

### Key patterns

Search input with icon:

```tsx
<InputGroup>
  <InputGroupInput aria-label="Search" placeholder="Search..." type="search" />
  <InputGroupAddon>
    <Icon aria-hidden="true" icon={Search01Icon} />
  </InputGroupAddon>
</InputGroup>
```

URL prefix with text addon:

```tsx
<InputGroup>
  <InputGroupInput placeholder="example.com" />
  <InputGroupAddon>
    <InputGroupText>https://</InputGroupText>
  </InputGroupAddon>
</InputGroup>
```

Input with interactive button addon:

```tsx
<InputGroup>
  <InputGroupInput placeholder="Enter value..." />
  <InputGroupAddon align="inline-end">
    <Button aria-label="Clear" size="icon-xs" variant="ghost">
      <Icon aria-hidden="true" icon={Cancel01Icon} />
    </Button>
  </InputGroupAddon>
</InputGroup>
```

Use `icon-xs` or `xs` buttons inside addons; the addon pulls them to the edge with negative margins.

Textarea with a toolbar row below it:

```tsx
<InputGroup>
  <InputGroupTextarea aria-label="Message" placeholder="Write a message…" />
  <InputGroupAddon align="block-end">
    <Button className="ms-auto" size="xs">Send</Button>
  </InputGroupAddon>
</InputGroup>
```

### More examples

See `p-input-group-1` through `p-input-group-17` and `p-input-group-29` for icons, text prefixes, interactive addons, textarea layouts, and stateful patterns.

## Common pitfalls

- Using `Input`/`Textarea` directly instead of `InputGroupInput`/`InputGroupTextarea`.
- Reversing the conventional input-first DOM order; the addon focus lookup searches the full group, and `align` controls visual placement.
- Missing explicit input types.
- Leaving an end addon on the default `align` (`inline-start`), which puts it before the input.

## Useful particle references

- icon addon + sizes: `p-input-group-1`, `p-input-group-2`, `p-input-group-13`, `p-input-group-14`
- prefix/suffix text addons (url/domain/currency): `p-input-group-3`, `p-input-group-4`, `p-input-group-5`, `p-input-group-6`
- interactive addons (tooltip/buttons/badge/kbd/inner label): `p-input-group-7` through `p-input-group-12`
- textarea with block addons: `p-input-group-17`
- disabled / loading: `p-input-group-15`, `p-input-group-16`
- password visibility toggle with tooltip: `p-input-group-29`

