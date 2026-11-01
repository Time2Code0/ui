# Input

## When to use

- Single-line text entry with variants and addons.
- Email/password/search/file and other typed input flows.

## Install

```bash
npx time2code add input
```

## Canonical imports

```tsx
import { Input } from "@/components/ui/input"
```

## Minimal pattern

```tsx
<Input aria-label="Email" type="email" placeholder="name@company.com" />
```

Always set `type` explicitly on `Input` (`text`, `email`, `password`, `search`, `file`, etc.). Do not rely on browser defaults.
For form fields, prefer wrapping `Input` with `Field` + `FieldLabel` + `FieldError` instead of standalone usage.

## Patterns from particles

### Key patterns

Field-wrapped input (preferred for forms):

```tsx
<Field>
  <FieldLabel>Email</FieldLabel>
  <Input type="email" placeholder="name@company.com" />
  <FieldError>Please enter a valid email.</FieldError>
</Field>
```

Input with addon (InputGroup):

```tsx
<InputGroup>
  <InputGroupInput aria-label="Search" placeholder="Search" type="search" />
  <InputGroupAddon>
    <Icon aria-hidden="true" icon={Search01Icon} />
  </InputGroupAddon>
</InputGroup>
```

Sizes: `sm`, `default`, `lg` (a number sets the native `size` attribute). `unstyled` removes the wrapper styling, for inputs placed inside custom surfaces. Always specify `type` explicitly.

### More examples

- small size: `p-input-2`
- large size: `p-input-3`
- disabled: `p-input-4`
- file: `p-input-5`
- with label: `p-input-6`
- with button (Group): `p-input-7`
- with start loading spinner: `p-input-12`
- form integration: `p-form-1`

## Common pitfalls

- Omitting explicit `type` and relying on browser defaults.
- Using icon-only affordances without label/aria context.
- Applying heavy class overrides before using built-in size/variant props.

## Useful particle references

See `p-input-1` through `p-input-7` and `p-input-12` for size/variant combinations, `p-form-1` for form integration.
