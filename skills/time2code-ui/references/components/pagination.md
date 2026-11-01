# Pagination

## When to use

- Paged navigation over long result sets.
- Prev/next and index controls paired with data tables/lists.

## Install

```bash
npx time2code add pagination
```

## Canonical imports

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
```

## Minimal pattern

```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

## Patterns from particles

### Key patterns

Full pagination with active page:

```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

Pagination links render `<a>` elements styled with `buttonVariants` (`ghost`, or `outline` when `isActive`). For client-side navigation, compose them with the project's `Link`: `<PaginationLink isActive render={<Link href="?page=2" />}>2</PaginationLink>`. `PaginationLink` takes a Button `size` (default `icon`).

For a client-state pager (no URLs), use `Button`s with `onClick` and `disabled` at the boundaries instead of links.

### More examples

See `p-pagination-1`.

## Common pitfalls

- Using pagination controls without synchronizing data/page state.
- Mixing pagination with infinite-scroll UX in the same surface.
- Missing disabled-state handling on prev/next boundaries.

## Useful particle references

- pagination example: `p-pagination-1`
