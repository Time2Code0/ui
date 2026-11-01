# Dialog

## When to use

- Modal overlays that require user focus and explicit action.
- Multi-section popup flows with header/body/footer structure.

## When NOT to use

- If the overlay should slide from the edge -> use Drawer instead.
- If the interaction is a destructive confirmation -> use AlertDialog instead.
- If the content is non-blocking contextual info -> use Popover instead.

## Install

```bash
npx time2code add dialog
```

## Canonical imports

```tsx
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
```

## Minimal pattern

```tsx
<Dialog>
  <DialogTrigger render={<Button variant="outline" />}>Open Dialog</DialogTrigger>
  <DialogPopup>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog Description</DialogDescription>
    </DialogHeader>
    <DialogPanel>Content</DialogPanel>
    <DialogFooter>
      <DialogClose render={<Button variant="ghost" />}>Close</DialogClose>
    </DialogFooter>
  </DialogPopup>
</Dialog>
```

## Patterns from particles

- **Portal forwarding**: optional `portalProps` on `DialogPopup` → Base UI `Dialog.Portal` (`keepMounted`, `container`, …). See [portal-props.md](../portal-props.md).
- **Section structure invariant**: keep `DialogHeader`, `DialogPanel`, and `DialogFooter` as direct sections in `DialogPopup` to preserve built-in layout/styling behavior.
- **Form in dialog**: keep **`DialogHeader`** outside the form; wrap **`DialogPanel`** + **`DialogFooter`** in **`<Form className="contents">`** (or native `<form className="contents">`) so the popup’s flex column treats header, panel, and footer as direct layout sections.
- **Action buttons**: use `DialogClose` with `render={<Button ... />}` for cancel/close actions and set explicit `type` on submit/action buttons.
- **Scrollable content**: keep long content inside `DialogPanel` to preserve dialog scroll behavior.
- **Footer variants**: use `DialogFooter variant="bare"` when border/background framing should be removed.
- **Controlled open state**: for cross-component flows (for example menu item opens dialog), control with `open` + `onOpenChange`.
- **Detached trigger option (advanced)**: when the opener cannot live in the same subtree, create a handle with `DialogCreateHandle` and pass it to the triggers and the root, or control the dialog with `open` + `onOpenChange`, instead of forcing local `DialogTrigger` composition.
- **Close confirmation flow**: when unsaved changes exist, combine controlled `Dialog` with `AlertDialog` confirmation before closing.
- **Nested dialogs**: supported; use clear trigger hierarchy and consider disabling default close buttons with `showCloseButton={false}` when custom actions are preferred.
- **Close button**: `DialogPopup` shows a close button by default (`showCloseButton`); pass `closeProps` to change its `aria-label`.
- **Mobile placement**: `DialogPopup` sticks to the bottom of the screen on mobile (`bottomStickOnMobile`, default `true`).
- **Responsive dialog/drawer variant**: for form-heavy overlays, use `Dialog` on desktop and switch to `Drawer` on mobile (`useMediaQuery("max-md")` from `@/hooks/use-media-query`, installed with `npx time2code add use-media-query`), keeping the same `Form` structure in both.

## Common pitfalls

- Omitting `render={<Button ... />}` composition on trigger/close actions.
- Forgetting title/description structure in real dialogs.
- Wrapping dialog sections with extra containers that break `DialogHeader`/`DialogPanel`/`DialogFooter` layout; prefer **header outside**, **`Form className="contents"`** around **panel + footer** only.
- Putting large body content outside `DialogPanel` when scrolling is needed.
- Missing explicit button `type` inside dialog forms/actions.
- Using uncontrolled dialog patterns when the flow requires cross-component state coordination.
- Writing shadcn/ui parts (`DialogContent`, `asChild`) instead of `DialogPopup` and `render`.

## Useful particle references

- dialog with form: `p-dialog-1`
- open dialog from another primitive flow: `p-dialog-2` (menu -> dialog)
- nested dialogs: `p-dialog-3`
- close confirmation / unsaved changes flow: `p-dialog-4`
- long scrollable content in panel: `p-dialog-5`
- bare footer variant usage: `p-dialog-6`
- responsive dialog/drawer variant: `p-drawer-12`

