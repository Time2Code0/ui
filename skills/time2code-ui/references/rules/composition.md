# Composition rules

Use this when composing UI from several components.

## Core rules

- Compose existing components instead of writing wrappers that duplicate their behavior.
- For trigger-based components (Dialog, Menu, Select, Popover, Tooltip), follow each component's trigger/popup hierarchy. Don't mix patterns across components.
- Compose with `render`, never `asChild`. Put the label inside the rendered element: `<DialogTrigger render={<Button variant="outline">Edit</Button>} />`. In client components, `<DialogTrigger render={<Button variant="outline" />}>Edit</DialogTrigger>` works too; in server components the trigger's children are lost, so always prefer the first form.
- Links stay links. Style a link as a button with `buttonVariants()`; don't render it through `Button`. Parts that render anchors (`BreadcrumbLink`, `MenuLinkItem`, `SidebarMenuButton`, …) take `render={<Link href="…" />}`.
- Keep the full structure the component expects (title/description in dialogs, `SelectValue` in `SelectTrigger`, `ComboboxList` in `ComboboxPopup`). Don't add parts the component already renders.
- For overlays, keep displayed content through the exit transition. Change open state through `onOpenChange`; defer close-time cleanup or unmounting until `onOpenChangeComplete(false)`. `keepMounted` is a separate portal option for keeping DOM while fully closed and isn't needed for ordinary transitions.
- Open a dialog from a menu item by setting state; render the `Dialog`/`AlertDialog` as a sibling of the `Menu`, never inside `MenuPopup`.
- For detached triggers, use the component's `*CreateHandle` (`DialogCreateHandle`, `PopoverCreateHandle`, `TooltipCreateHandle`, …) or controlled `open` + `onOpenChange`.

## Caller-owned and built-in parts

| Composition | Caller supplies | Component includes |
| --- | --- | --- |
| Progress or Meter with custom children | Track and indicator, if the bar should stay next to a label or value | Default track and indicator only when there are no children |
| Combobox or Autocomplete results | `ComboboxList` / `AutocompleteList` around results | `SelectPopup` renders its own list |
| Tabs | Tabs and panels with matching values | `TabsList` renders its active indicator |
| Combobox chips | Chip content | `ComboboxChip` renders its remove button |
| Scrollable content | Content | `ScrollArea` renders the viewport and scrollbars; `DialogPanel` and `DrawerPanel` wrap a `ScrollArea` |
| Overlay close button | A close control in `DrawerPopup` when wanted (`showCloseButton` or `DrawerClose`) | `DialogPopup` shows one by default |
| Segmented control | The behavior element in `render` (radio, link, toggle) | The sliding indicator |

## Patterns

### Trigger + popup

```tsx
<Dialog>
  <DialogTrigger render={<Button variant="outline">Open</Button>} />
  <DialogPopup>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    <DialogPanel>Body</DialogPanel>
  </DialogPopup>
</Dialog>
```

### Form in an overlay

Keep the header outside the form and wrap panel and footer in `<Form className="contents">`, so the popup's flex column still sees three sections:

```tsx
<DialogPopup>
  <DialogHeader>…</DialogHeader>
  <Form className="contents" onSubmit={handleSubmit}>
    <DialogPanel>…fields…</DialogPanel>
    <DialogFooter>
      <DialogClose render={<Button variant="ghost">Cancel</Button>} />
      <Button type="submit">Save</Button>
    </DialogFooter>
  </Form>
</DialogPopup>
```

Footers are `flex-col-reverse` on mobile and right-aligned from `sm` up, so write Cancel first and the primary action last.

### Responsive overlays

Use `Dialog` (or `Menu`) on desktop and `Drawer` (or `DrawerMenu`) on mobile, switching with `useMediaQuery("max-md")` from `@/hooks/use-media-query` (`npx time2code add use-media-query`). Keep the same form structure in both.

### Grouped controls

For connected controls, put the dedicated separator between adjacent items:

```tsx
<Group aria-label="Clipboard">
  <Button variant="outline">Copy</Button>
  <GroupSeparator />
  <Button variant="outline">Paste</Button>
</Group>
```

See [group.md](../components/group.md) and [toggle-group.md](../components/toggle-group.md) for vertical orientation and the default Toggle Group exception.

### Portal forwarding

Only some popups and the toast providers take `portalProps`. See [portal-props.md](../portal-props.md).

## Anti-patterns

- Building custom dropdown or dialog behavior instead of using the components.
- Writing `asChild`, `*Content` or other shadcn/ui and Radix names without checking the time2code/ui part names.
- Omitting parts the caller has to supply, or duplicating parts a component already renders.
