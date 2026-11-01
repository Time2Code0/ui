# Drawer

## When to use

- Edge panels on desktop and mobile, including side panels and bottom drawers.
- Prefer it over Sheet for new edge panels.
- Form-heavy or multi-step overlays where popover is too constrained.

## When NOT to use

- If the overlay should be a centered modal -> use Dialog instead.
- If you need a simple confirmation -> use AlertDialog instead.

## Install

```bash
npx time2code add drawer
```

## Canonical imports

```tsx
import {
  Drawer,
  DrawerClose,
  DrawerCreateHandle,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerMenu,
  DrawerMenuCheckboxItem,
  DrawerMenuGroup,
  DrawerMenuGroupLabel,
  DrawerMenuItem,
  DrawerMenuRadioGroup,
  DrawerMenuRadioItem,
  DrawerMenuSeparator,
  DrawerPanel,
  DrawerPopup,
  DrawerMenuTrigger,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
```

## Minimal pattern

```tsx
<Drawer>
  <DrawerTrigger>Open</DrawerTrigger>
  <DrawerPopup>
    <DrawerHeader>
      <DrawerTitle>Drawer Title</DrawerTitle>
      <DrawerDescription>Drawer Description</DrawerDescription>
    </DrawerHeader>
    <DrawerPanel>Content</DrawerPanel>
    <DrawerFooter>
      <DrawerClose>Close</DrawerClose>
    </DrawerFooter>
  </DrawerPopup>
</Drawer>
```

## Patterns from particles

- **Position**: set `position` on the root (`"bottom"` default, `"top"`, `"left"`, `"right"`). It sets the swipe direction and flows to the parts through context. Snap points (`snapPoints`) only work for bottom drawers.
- **Popup variants**: `DrawerPopup variant="default" | "straight" | "inset"`. `straight` removes rounded corners, `inset` adds spacing around the drawer on desktop.
- **Close button**: `DrawerPopup` shows none by default. Pass `showCloseButton`, or add a `DrawerClose`.
- **Drag bar**: `showBar` on `DrawerPopup` shows a drag handle.
- **Scrolling**: `DrawerPanel` scrolls by default (`scrollable`, `scrollFade`); pass `scrollable={false}` for short content.
- **Text selection**: header, panel and footer take `allowSelection` so mouse text selection doesn't start a swipe.
- **Portal forwarding**: optional `portalProps` on `DrawerPopup` → Base UI `Drawer.Portal` (`keepMounted`, `container`, …). See [portal-props.md](../portal-props.md).

### Key patterns

Drawer with a visible drag handle:

```tsx
<Drawer>
  <DrawerTrigger render={<Button variant="outline" />}>Open Drawer</DrawerTrigger>
  <DrawerPopup showBar>
    <DrawerHeader>
      <DrawerTitle>Edit Profile</DrawerTitle>
      <DrawerDescription>Make changes to your profile here.</DrawerDescription>
    </DrawerHeader>
    <DrawerPanel>
      {/* Form content */}
    </DrawerPanel>
    <DrawerFooter>
      <DrawerClose render={<Button variant="ghost" />}>Cancel</DrawerClose>
      <Button>Save</Button>
    </DrawerFooter>
  </DrawerPopup>
</Drawer>
```

**Footer action order**: write Cancel first and the primary action last. `DrawerFooter` is `flex-col-reverse` on mobile and `sm:flex-row sm:justify-end` from `sm` up, so source order puts the primary action on the right on desktop and on top when stacked. The same applies to `DialogFooter` and `AlertDialogFooter`.

Side panel:

```tsx
<Drawer position="right">
  <DrawerTrigger render={<Button variant="outline">Filters</Button>} />
  <DrawerPopup showCloseButton variant="inset">
    …
  </DrawerPopup>
</Drawer>
```

Action menu inside a drawer: `DrawerMenu` mirrors the Menu API (`DrawerMenuItem`, `DrawerMenuGroup`, `DrawerMenuGroupLabel`, `DrawerMenuSeparator`, `DrawerMenuCheckboxItem`, `DrawerMenuRadioGroup`, `DrawerMenuRadioItem`). `DrawerMenuItem` doesn't close the drawer; compose it as `<DrawerClose render={<DrawerMenuItem />}>Edit</DrawerClose>` when it should. `DrawerMenuTrigger` opens a nested drawer.

Responsive drawer + dialog (drawer on mobile, dialog on desktop): see `p-drawer-12`. Responsive menu (Menu on desktop, DrawerMenu on mobile): see `p-drawer-13`. Both switch with `useMediaQuery("max-md")` from `@/hooks/use-media-query`.

### More examples

See `p-drawer-1`, `p-drawer-4` to `p-drawer-7`, `p-drawer-9` and `p-drawer-11` to `p-drawer-13` for inset, straight, scrollable, nested, snap points, mobile menu, and responsive patterns.

## Common pitfalls

- Choosing Sheet for new side panels; prefer Drawer with `position`. Use Dialog for centered modal flows.
- Setting `side` on the popup (Sheet's API); Drawer takes `position` on the root.
- Forgetting responsive switch logic when drawer is mobile-only variant.
- Putting the primary action before Cancel in `DrawerFooter`; the reversed mobile stack then puts Cancel on top and the primary on the left on desktop.
- Breaking section layout by putting the whole dialog in a block-level `<form>`; prefer **header outside**, **`Form className="contents"`** around **panel + footer** (see dialog.md and form.md).

## Useful particle references

- simple bottom drawer with close button: `p-drawer-1`
- inset variant: `p-drawer-4`
- straight variant: `p-drawer-5`
- scrollable content: `p-drawer-6`
- nested drawers: `p-drawer-7`
- snap points: `p-drawer-9`
- mobile menu: `p-drawer-11`
- responsive dialog: `p-drawer-12`
- responsive menu: `p-drawer-13`
- cross-overlay references: `p-dialog-1`, `p-popover-1`, `p-menu-2`
