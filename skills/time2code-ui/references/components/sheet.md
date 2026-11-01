# Sheet

Sheet is a Dialog-based panel that opens from an edge (`SheetPopup side="right" | "left" | "top" | "bottom"`). It is still in the registry, but [Drawer](drawer.md) covers the same use cases and adds swipe gestures, snap points and nested drawers. Prefer Drawer for new UI, including desktop side panels.

## Install

```bash
npx time2code add sheet
```

## Migrating an existing Sheet to Drawer

- Follow the Drawer guide and an existing Drawer particle for the complete composition.
- Replace Sheet parts with the corresponding Drawer parts; verify their props rather than performing a name-only replacement.
- Drawer placement is configured on the root with `position="right"` (or `left`, `top`, `bottom`), instead of `side` on `SheetPopup`.
- `DrawerPopup` does not show a close button by default. Use `showCloseButton` or provide a suitable `DrawerClose` action.
- Preserve accessible naming, form state, focus behavior, and exit-transition cleanup. Check scrolling and dismissal after migration.

Don't migrate or remove existing Sheet code unless asked.

## Useful particle references

- basic sheet: `p-sheet-1`
- inset: `p-sheet-2`
- positions: `p-sheet-3`
