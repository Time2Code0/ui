# Link

## When to use

- Every in-app or external link in a Next.js project. `Link` is a drop-in replacement for `next/link`.

## Install

```bash
npx time2code add link
```

## Canonical imports

```tsx
import { Link } from "@/components/ui/link"
```

## Minimal pattern

```tsx
<Link href="/docs">Docs</Link>
```

## Patterns

- **External links**: `Link` adds `target="_blank"` and `rel="noopener noreferrer"` when the `href` points to another site, or uses `mailto:` or `tel:`. Passing `target` or `rel` yourself overrides that.
- **Link styled as a button**: apply `buttonVariants()` to the link. Never render a link through `Button`:

  ```tsx
  <Link className={buttonVariants({ variant: "outline" })} href="/login">
    Login
  </Link>
  ```

- **Inside other components**: parts that render anchors take `render={<Link href="…" />}` (`BreadcrumbLink`, `MenuLinkItem`, `ContextMenuLinkItem`, `SidebarMenuButton`, `PaginationLink`, `Badge`, `SegmentedControlItem`, `PreviewCardTrigger`).

## Common pitfalls

- `<Button render={<Link />}>`: use `buttonVariants()` on the link.
- Importing `next/link` directly and losing the external-link handling.
- URL-object `href`s: only the `pathname` is used.

## Useful particle references

- internal, external and mailto links: `p-link-1`
- link styled as a button: `p-button-17`
