# Breadcrumb

## When to use

- Hierarchy/location indicators for current page context.
- Compact navigation trails for nested routes and detail pages.

## Install

```bash
npx time2code add breadcrumb
```

## Canonical imports

```tsx
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
```

## Minimal pattern

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbEllipsis />
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Patterns from particles

### Key patterns

App links: `BreadcrumbLink` renders an `<a>`. Compose it with the project's `Link` for client-side navigation:

```tsx
<BreadcrumbLink render={<Link href="/docs" />}>Docs</BreadcrumbLink>
```

Icon-only home link (requires `aria-label`):

```tsx
<BreadcrumbItem>
  <BreadcrumbLink aria-label="Home" href="/">
    <Icon aria-hidden="true" className="size-4" icon={Home01Icon} />
  </BreadcrumbLink>
</BreadcrumbItem>
```

Custom separator:

```tsx
<BreadcrumbSeparator>
  <Icon className="size-3.5" icon={SlashIcon} />
</BreadcrumbSeparator>
```

### More examples

See `p-breadcrumb-1` (with a menu on the ellipsis) and `p-breadcrumb-2` (custom separator).

## Common pitfalls

- Using breadcrumb as primary nav menu instead of contextual trail.
- Omitting `aria-label` on icon-only breadcrumb items.
- Adding deep breadcrumb chains without meaningful hierarchy.

## Useful particle references

- collapsed items in a menu: `p-breadcrumb-1`
- with custom separator: `p-breadcrumb-2`
