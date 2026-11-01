# Portal forwarding (`portalProps`)

Composed popups wrap Base UI's `Portal` inside their `*Popup` part, and the toast providers do the same for their viewports. These surfaces take an optional `portalProps` object, which is spread onto the internal `Portal`.

Use it when you need portal-level behavior from Base UI, for example:

- **`keepMounted`**: keep the portal mounted while closed, where that component's `Portal` supports it.
- **`container`**: render the popup into a specific DOM node (stacking contexts, micro-frontends, shadow DOM).
- Other props of that component's `Portal.Props`, including `className` and `ref`.

## Surfaces that take `portalProps`

- **Modals and overlays:** `DialogPopup`, `AlertDialogPopup`, `DrawerPopup`, `SheetPopup`, `CommandDialogPopup`
- **Floating layers:** `MenuPopup`, `ContextMenuPopup`, `PopoverPopup`, `TooltipPopup`, `PreviewCardPopup`, `AutocompletePopup`, `ComboboxPopup`, `SelectPopup`
- **Toasts (providers, not popups):** `ToastProvider`, `AnchoredToastProvider`, forwarded to the internal `Toast.Portal` of the stacked and anchored viewports

No other component takes `portalProps`. For portal control anywhere else, compose the Base UI parts yourself. For custom content that isn't a popup, use the [Portal](components/portal.md) component.

## Positioner vs portal

`portalProps` only affects the portal node. To change placement, use the popup's `side`, `align`, `sideOffset`, `alignOffset` and `anchor` props.
