# Card

## When to use

- Structured surface sections for grouped content.
- Settings, dashboard, and preview layouts with header/panel/footer semantics.

## Install

```bash
npx time2code add card
```

## Canonical imports

```tsx
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardFrame,
  CardFrameAction,
  CardFrameDescription,
  CardFrameFooter,
  CardFrameHeader,
  CardFrameTitle,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card"
```

There is no `CardContent`. The body part is `CardPanel`.

## Minimal pattern

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardPanel>Content</CardPanel>
  <CardFooter>Footer</CardFooter>
</Card>
```

## Patterns from particles

### Key patterns

Card with form content:

```tsx
<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Create project</CardTitle>
    <CardDescription>Deploy your new project in one click.</CardDescription>
  </CardHeader>
  <CardPanel className="flex flex-col gap-4">
    <Field>
      <FieldLabel>Name</FieldLabel>
      <Input type="text" placeholder="My project" />
    </Field>
  </CardPanel>
  <CardFooter className="flex justify-end gap-2">
    <Button variant="ghost">Cancel</Button>
    <Button>Create</Button>
  </CardFooter>
</Card>
```

Keep `CardHeader`, `CardPanel`, and `CardFooter` as direct children of `Card` to preserve built-in spacing and layout.

Put header actions in `CardAction`, a sibling of `CardTitle` and `CardDescription` inside `CardHeader`; it is placed top-right via the header grid.

### CardFrame

`CardFrame` is a muted outer shell with its own header and footer around one or more inner `Card`s (or a `Table variant="card"`). Use it when a section needs a title row, an optional action, and a footnote outside the main surface.

```tsx
<CardFrame>
  <CardFrameHeader>
    <CardFrameTitle>Projects</CardFrameTitle>
    <CardFrameDescription>Manage your projects</CardFrameDescription>
    <CardFrameAction>
      <Button variant="outline">
        <Icon aria-hidden="true" icon={Add01Icon} />
        Add
      </Button>
    </CardFrameAction>
  </CardFrameHeader>
  <Card>
    <CardPanel>Content</CardPanel>
  </Card>
  <CardFrameFooter>Footnote or secondary info</CardFrameFooter>
</CardFrame>
```

- Keep `CardFrameHeader`, the inner `Card`(s), and `CardFrameFooter` as direct children of `CardFrame`; the frame clips, rounds, and removes shadows on direct `Card` children only.
- `CardFrameAction` goes inside `CardFrameHeader` as a sibling of the title and description; it sits in the second grid column, vertically centered.
- Do not use `CardHeader`/`CardFooter` on the frame itself; those belong to the inner `Card`.
- For tables, render `Table variant="card"` as a direct child of `CardFrame` (see the table guide, `p-table-6` and `p-table-7`).

## Common pitfalls

- Skipping `CardHeader`/`CardPanel`/`CardFooter` structure in composed cards.
- Mixing unrelated layout wrappers that break spacing between card sections.
- Using cards as generic wrappers when plain layout would be clearer.
- Writing `CardContent` from shadcn/ui; use `CardPanel`.
- Nesting a `Card` inside another wrapper within `CardFrame`, which skips the frame's clipping and radius rules for direct `Card` children.

## Useful particle references

- basic card with header and footer: `p-card-1`
- `CardFrame` with a table: `p-table-6`, `p-table-7`
