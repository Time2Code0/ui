# Table

## When to use

- Structured tabular datasets.
- Sortable/filterable row and column displays.

## Install

```bash
npx time2code add table
```

## Canonical imports

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

## Minimal pattern

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Ada Lovelace</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Patterns from particles

Interactive data tables need TanStack Table (`npm install @tanstack/react-table`); the table component doesn't depend on it.


- **Semantic baseline**: start with `TableHeader`/`TableBody`/`TableRow`/`TableHead`/`TableCell`, then add `TableCaption` and `TableFooter` as needed.
- **Card variant**: set `variant="card"` on `Table` for rounded, card-like rows and separated borders (`p-table-5`). Combine with `CardFrame` for static tables in a card shell (`p-table-7`), or with TanStack Table inside `CardFrame` for row selection (`p-table-6`).
- **Status-rich rows**: combine `Badge` and decorative dots/icons for state columns while keeping text primary.
- **Interactive data grids**: pair the table parts with TanStack Table (`flexRender`, row models, selection state) for sorting/pagination/selection.
- **No-results state**: always render an explicit empty-state row with `colSpan` matching visible columns.
- **Fixed layout control**: use `className="table-fixed"` and column width styles when predictable column sizing is required.

## Common pitfalls

- Assuming `Table` itself provides sorting/filter/pagination state; these come from your data layer (for example TanStack Table).
- Mixing header/body cell semantics (`TableHead` in body rows or `TableCell` in headers).
- Forgetting to align `colSpan` with actual visible columns in footer/empty rows.
- Using table patterns where card/list layouts are more suitable on small screens without responsive handling.
- Omitting `aria-label` for row-selection checkboxes in interactive tables.

## Useful particle references

- basic semantic table with caption/footer: `p-table-1`
- card variant only (no shell): `p-table-5`
- `CardFrame` + static table: `p-table-7`
- `CardFrame` + TanStack + checkboxes: `p-table-6`

