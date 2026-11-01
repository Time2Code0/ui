# Tabs

## When to use

- Mutually exclusive content panels in one region.
- Settings/detail screens split into scoped views.

## Install

```bash
npx time2code add tabs
```

## Canonical imports

```tsx
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs"
```

## Minimal pattern

```tsx
<Tabs defaultValue="tab-1">
  <TabsList>
    <TabsTab value="tab-1">Tab 1</TabsTab>
    <TabsTab value="tab-2">Tab 2</TabsTab>
    <TabsTab value="tab-3">Tab 3</TabsTab>
  </TabsList>
  <TabsPanel value="tab-1">Tab 1 content</TabsPanel>
  <TabsPanel value="tab-2">Tab 2 content</TabsPanel>
  <TabsPanel value="tab-3">Tab 3 content</TabsPanel>
</Tabs>
```

## Patterns from particles

### Key patterns

Controlled tabs with external state:

```tsx
const [value, setValue] = useState("tab-1")

<Tabs value={value} onValueChange={setValue}>
  <TabsList>
    <TabsTab value="tab-1">Tab 1</TabsTab>
    <TabsTab value="tab-2">Tab 2</TabsTab>
  </TabsList>
  <TabsPanel value="tab-1">Content 1</TabsPanel>
  <TabsPanel value="tab-2">Content 2</TabsPanel>
</Tabs>
```

Variants on `TabsList`: `default` (segmented pill) and `underline`. Sizes (`sm`, `default`, `lg`) are set on `TabsList` and inherited by its tabs. An individual `TabsTab` can override the inherited size.

```tsx
<TabsList size="sm">
  <TabsTab value="tab-1">Tab 1</TabsTab>
  <TabsTab size="lg" value="tab-2">Tab 2</TabsTab>
</TabsList>
```

Underline variant:

```tsx
<Tabs defaultValue="tab-1">
  <TabsList variant="underline">
    <TabsTab value="tab-1">Tab 1</TabsTab>
    <TabsTab value="tab-2">Tab 2</TabsTab>
  </TabsList>
  ...
</Tabs>
```

### More examples

- default (segmented) style: `p-tabs-1`
- underline variant: `p-tabs-2`
- vertical orientation: `p-tabs-3`
- underline with vertical orientation: `p-tabs-4`

## Common pitfalls

- Mismatching `TabsTab value` and `TabsPanel value` pairs.
- Using tabs for workflows that require route-level navigation instead.
- Using tabs for a form value or reversible filter just because it looks like a segmented control. Read `./segmented-control.md` and choose semantics first.
- Mounting expensive panel content without considering visibility/performance.

## Useful particle references

See `p-tabs-1` through `p-tabs-4` for variants and orientations. Related: `p-card-1`.
