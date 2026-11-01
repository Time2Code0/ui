# Button

## When to use

- Primary and secondary action triggers.
- Icon, loading, and shortcut-enhanced actions across forms and toolbars.

## Install

```bash
npx time2code add button
```

## Canonical imports

```tsx
import { Button } from "@/components/ui/button"
```

## Minimal pattern

```tsx
<Button type="button">Button</Button>
```

`Button` defaults to `type="button"` when rendered as the native button part. In form flows, set `type` explicitly (`button` / `submit` / `reset`) to match intent, especially when using `render` composition.

## Patterns from particles

### Key patterns

Variants are set via the `variant` prop:

```tsx
<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="animated-link">Animated link</Button>
```

`unstyled` keeps only the base layout, for buttons that bring their own look.

Sizes: `xs`, `sm`, `default`, `lg`, `xl`, and `icon-xs`, `icon-sm`, `icon`, `icon-lg`, `icon-xl` for icon-only buttons. `shape` sets the radius: `default`, `full` (pill) or `none`.

Icon-only button (always needs `aria-label`):

```tsx
<Button aria-label="Close" size="icon" variant="ghost">
  <Icon aria-hidden="true" icon={Cancel01Icon} />
</Button>
```

Button with icon and text (the button sizes and dims the icon, so don't add `size-*` or opacity classes):

```tsx
<Button>
  <Icon aria-hidden="true" icon={Add01Icon} />
  Add Item
</Button>
```

### Links stay links

Never render a link through `Button` (`<Button render={<Link />}>`). Apply `buttonVariants()` to the link instead. It takes the same `variant`, `size` and `shape` options:

```tsx
import { buttonVariants } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

<Link className={buttonVariants({ variant: "outline" })} href="/login">
  Login
</Link>
```

### Loading state

Built-in `loading` prop (disables and shows spinner automatically):

```tsx
<Button loading={isLoading} onClick={handleClick}>Submit</Button>
```

Composite approach (manual `Spinner` from `@/components/ui/loading` + `disabled`):

```tsx
<Button disabled>
  <Spinner />
  Loading...
</Button>
```

Prefer the `loading` prop for typical async actions. Use the composite approach when you need custom spinner placement or label.

### Server components

`button.tsx` has no `"use client"`, so `buttonVariants()` can be called from server components. When a server component passes a `Button` to a trigger's `render` prop, put the label inside the `Button` (`render={<Button>Open</Button>}`); children on the trigger are lost there.

## Common pitfalls

- Omitting explicit `type` inside forms/dialogs and triggering unintended submit behavior.
- Using icon-only buttons without `aria-label` on the button.
- Rendering a link through `Button` instead of styling the link with `buttonVariants()`.
- Using shadcn/ui sizes or variants that don't exist here, such as `destructive-outline`.
- Expecting a disabled button to show a tooltip: `disabled` sets the native attribute plus `pointer-events-none`, so the button gets no hover or focus. Wrap it in a focusable `span` rendered as the `TooltipTrigger` (see [tooltip.md](./tooltip.md)).
- Rebuilding button state styling with ad-hoc classes instead of variants/sizes.
- Using `SelectButton` as if it were a general-purpose `Button`; `SelectButton` is a select-flavored trigger helper and should be treated as a `select`/`combobox` pattern.

## Useful particle references

- variants: `p-button-1` through `p-button-4`, `p-button-6`, `p-button-7`, `p-button-43` (animated link)
- sizes: `p-button-8` through `p-button-11`
- icon-only sizes: `p-button-13` through `p-button-15`
- disabled / with icon: `p-button-12`, `p-button-16`
- link styled as a button: `p-button-17`
- composite loading (Spinner + disabled): `p-button-18`
- built-in loading prop: `p-button-41`
- shapes: `p-button-42`
