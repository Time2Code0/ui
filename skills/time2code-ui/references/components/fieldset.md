# Fieldset

## When to use

- Grouped related controls under one legend/description.
- Complex forms requiring semantic grouping for radios/checkboxes.

## Install

```bash
npx time2code add fieldset
```

## Canonical imports

```tsx
import {
  Fieldset,
  FieldsetLegend,
  FieldsetSeparator,
} from "@/components/ui/fieldset"
```

## Minimal pattern

```tsx
<Fieldset>
  <FieldsetLegend>Fieldset legend</FieldsetLegend>
</Fieldset>
```

## Patterns from particles

### Key patterns

Fieldset grouping related fields:

```tsx
<Fieldset>
  <FieldsetLegend>Personal Information</FieldsetLegend>
  <Field name="firstName">
    <FieldLabel>First name</FieldLabel>
    <Input type="text" />
  </Field>
  <Field name="lastName">
    <FieldLabel>Last name</FieldLabel>
    <Input type="text" />
  </Field>
</Fieldset>
```

Always include `FieldsetLegend` as the accessible group heading.

`FieldsetSeparator` divides groups of fields. Children render as a centered label on the line:

```tsx
<FieldsetSeparator>Or</FieldsetSeparator>
```

### More examples

See `p-fieldset-1` and `p-fieldset-2` (labeled separator).

## Common pitfalls

- Using ad-hoc div wrappers instead of semantic fieldset for grouped controls.
- Omitting `FieldsetLegend`, reducing accessibility context.
- Placing unrelated controls inside one fieldset, hurting form clarity.

## Useful particle references

- fieldset with multiple fields: `p-fieldset-1`
- labeled separator: `p-fieldset-2`
- form composition references: `p-form-1`, `p-form-2`
