# Grid

## When to use

- Marketing and landing layouts with visible guide lines between cells (the "blueprint" look).

## When NOT to use

- Ordinary page or form layout. Use Tailwind `grid`/`flex` utilities.

## Install

```bash
npx time2code add grid
```

## Canonical imports

```tsx
import { Grid } from "@/components/ui/grid"
```

`Grid` is a compound component: `Grid.System`, `Grid`, `Grid.Cell`, `Grid.Cross`, `Grid.Divider`.

## Minimal pattern

```tsx
<Grid.System>
  <Grid columns={3} rows={2}>
    <Grid.Cell>1</Grid.Cell>
    <Grid.Cell>2</Grid.Cell>
    <Grid.Cell>3</Grid.Cell>
  </Grid>
</Grid.System>
```

`Grid.System` draws the outer border and sets the guide styles (`guideWidth`, `debug`). Each `Grid` draws one guide per cell of its `columns` × `rows`, however many cells you pass.

## Patterns

- **Placement**: `Grid.Cell` takes `column` and `row` (CSS `grid-column`/`grid-row` values such as `"1/3"`); without them it takes the next free slot.
- **Solid cells**: `solid` removes the guides inside the area a cell spans. It needs `column` and `row`.
- **Responsive values**: `columns`, `rows`, `column` and `row` accept an object keyed by breakpoint (`xs`, `sm`, `md`, `lg`, `xl`, `2xl`): `columns={{ xs: 1, md: 2, lg: 3 }}`.
- **Sizing**: cells are square by default. `fitContent` lets rows grow with their content.
- **Decoration**: `Grid.Cross` marks a guide intersection (lines numbered like CSS grid lines). `hideGuides="row" | "column"` hides one direction. `Grid.Divider` spaces two grids inside one `Grid.System`.

## Common pitfalls

- Wrapping a `Grid.Cell` in another component or a fragment. `Grid` reads its direct children's `column`, `row` and `solid` props to work out which guides to hide.
- Setting `solid` without `column` and `row`.
- Using it for app layouts where the guides add noise.

## Useful particle references

- debug mode: `p-grid-1`
- responsive: `p-grid-2`
- solid cells / responsive solid cells: `p-grid-3`, `p-grid-4`
- overlapping cells: `p-grid-5`
- crosses: `p-grid-6`
- hidden guides: `p-grid-7`
- stacked grids with divider: `p-grid-8`
