# Forms and inputs rules

Use this when building fields, input groups, validation states and forms.

## Core rules

- For form-bound controls, use `Field` composition (`Field`, `FieldLabel`, `FieldDescription`, `FieldError`) instead of standalone inputs.
- Group related controls (radio groups, checkbox groups, sections) in `Fieldset` with a `FieldsetLegend`.
- Set `type` on input-like controls (`type="text"`, `type="email"`, …) and on buttons (`button`, `submit` or `reset`).
- Set `name` on each field so its value is submitted.
- Keep labels accessible: a visible `FieldLabel` (or `Label` with `htmlFor`/`id`), or `aria-label` when there is no visible label.
- Keep validation state aligned between the field and the control (`invalid` on `Field`, the message in `FieldError`).
- `FieldError` renders nothing unless it has children or an `errors` array. Pass the message explicitly; an empty `<FieldError />` won't show the browser's validation message.

## Form component

The `Form` wrapper is the `form-baseui` registry item: `npx time2code add form-baseui`, imported from `@/components/ui/form-baseui`. It sets `noValidate` and runs each `Field`'s native constraint checks on submit. With a schema library (React Hook Form, TanStack Form, Zod), either drop constraint attributes from the controls or use a plain `<form noValidate>`. See [form.md](../components/form.md) and [field.md](../components/field.md).

## Input group rule

- In `InputGroup`, use `InputGroupInput`/`InputGroupTextarea` (not `Input`/`Textarea`) and keep them before `InputGroupAddon` in the DOM. Place addons visually with `align` (`inline-start` default, `inline-end`, `block-start`, `block-end`).

## OTP field rule

- Keep `length` on `OTPField` equal to the number of `OTPFieldInput` slots.

## Textarea rule

- `Textarea` already uses Base UI field control semantics. Put it straight inside `Field`; don't wire `FieldControl render={<textarea />}` for it.

## Do / Don't

```tsx
// Do
<Field name="email">
  <FieldLabel>Email</FieldLabel>
  <Input type="email" />
  <FieldError>Enter a valid email.</FieldError>
</Field>

<InputGroup>
  <InputGroupInput type="text" />
  <InputGroupAddon align="inline-end">{/* ... */}</InputGroupAddon>
</InputGroup>

// Don't
<Input placeholder="Email" />
<FieldError />
```

## Further reading

- Base UI forms handbook: https://base-ui.com/react/handbook/forms.md
