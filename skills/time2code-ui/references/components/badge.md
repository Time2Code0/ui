# Badge

## When to use

- Short status/category labels and counts.
- Inline metadata chips paired with buttons, tables, and cards.

## Install

```bash
npx time2code add badge
```

## Canonical imports

```tsx
import { Badge } from "@/components/ui/badge"
```

## Minimal pattern

```tsx
<Badge>Badge</Badge>
```

## Patterns from particles

### Key patterns

Variants via the `variant` prop:

```tsx
<Badge>Default</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
```

Use `destructive` for a solid red badge and `error` for a tinted status badge. Sizes are `sm`, `default` and `lg`; `shape` is `default`, `full` (pill) or `none`.

Badge as a link (Badge renders a `span`, so composing it with `render` is fine):

```tsx
<Badge render={<Link href="/changelog" />}>New</Badge>
```

Badge with decorative icon:

```tsx
<Badge variant="outline">
  <Icon aria-hidden="true" icon={Tick02Icon} />
  Verified
</Badge>
```

Badge inside a button (use negative margin for alignment):

```tsx
<Button variant="outline">
  Messages
  <Badge className="-me-1" variant="outline">18</Badge>
</Button>
```

### More examples

See `p-badge-1` through `p-badge-14` for variants, sizes, icons, links, counts and shapes.

## Common pitfalls

- Using badge as interactive button without proper button semantics.
- Applying raw palette classes instead of semantic tokens/variants for status.
- Overloading badge content with long text that should be normal body copy.

## Useful particle references

- variants: `p-badge-1` through `p-badge-8`
- sizes: `p-badge-9` (small), `p-badge-10` (large)
- with icon / link / count: `p-badge-11`, `p-badge-12`, `p-badge-13`
- shapes: `p-badge-14`
