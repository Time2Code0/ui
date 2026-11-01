# Tooltip

## When to use

- Short helper text on hover/focus for controls and icons.
- Non-blocking contextual hints without modal behavior.

## When NOT to use

- If the content is interactive (links, buttons) -> use Popover instead.
- If the content is rich (images, forms) -> use PreviewCard or Popover instead.
- If the hint should persist until dismissed -> use Popover instead.

## Install

```bash
npx time2code add tooltip
```

## Canonical imports

```tsx
import {
  Tooltip,
  TooltipCreateHandle,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
```

## Minimal pattern

```tsx
<Tooltip>
  <TooltipTrigger render={<Button variant="outline" />}>
    Hover me
  </TooltipTrigger>
  <TooltipPopup>Helpful hint</TooltipPopup>
</Tooltip>
```

## Patterns from particles

- **Portal forwarding**: optional `portalProps` on `TooltipPopup` → Base UI `Tooltip.Portal` (`keepMounted`, `container`, …). See [portal-props.md](../portal-props.md).

### Key patterns

Tooltip on an icon-only button:

```tsx
<Tooltip>
  <TooltipTrigger render={<Button size="icon" variant="ghost" aria-label="Settings" />}>
    <Icon aria-hidden="true" icon={Settings01Icon} />
  </TooltipTrigger>
  <TooltipPopup>Settings</TooltipPopup>
</Tooltip>
```

Tooltip explaining why a button is disabled:

```tsx
<Tooltip>
  <TooltipTrigger render={<span className="inline-flex" tabIndex={0} />}>
    <Button disabled>Publish</Button>
  </TooltipTrigger>
  <TooltipPopup>Add a title before publishing</TooltipPopup>
</Tooltip>
```

- A disabled `Button` sets the native `disabled` attribute and `pointer-events-none`, so it never receives hover or focus. Putting `TooltipTrigger render={<Button disabled />}` directly on it means the tooltip never opens.
- Render the trigger as a wrapper `span` instead (`TooltipTrigger` renders a `<button>` by default, which cannot contain another button). Hover passes through the disabled button to the span.
- `tabIndex={0}` keeps the reason reachable by keyboard, since the disabled button is skipped in tab order. Use `inline-flex` (or `block`/`w-full` for full-width buttons) so the wrapper matches the button's box.
- When the button becomes enabled, drop the wrapper or render the tooltip only while disabled, so the span does not add an extra tab stop.

Grouped tooltips (shared delay/provider):

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Item 1</TooltipTrigger>
    <TooltipPopup>Hint 1</TooltipPopup>
  </Tooltip>
  <Tooltip>
    <TooltipTrigger>Item 2</TooltipTrigger>
    <TooltipPopup>Hint 2</TooltipPopup>
  </Tooltip>
</TooltipProvider>
```

### More examples

See `p-tooltip-1` through `p-tooltip-3` for basic, grouped, and animated tooltip patterns. Use `TooltipCreateHandle` for detached triggers that share one popup (`p-tooltip-3`).

## Common pitfalls

- Placing interactive controls inside tooltip content (tooltip should stay informational).
- Relying on tooltip as sole label for icon-only controls (still provide accessible name).
- Using tooltip for long-form content that should be popover/dialog.
- Attaching a tooltip trigger directly to a disabled button; wrap it in a focusable `span` trigger instead (see above).

## Useful particle references

- basic: `p-tooltip-1`
- grouped tooltips: `p-tooltip-2`
- animated tooltip across a toggle group: `p-tooltip-3`
- tooltips on avatars: `p-avatar-20`, `p-avatar-21`
- cross-overlay references: `p-dialog-1`, `p-popover-1`, `p-menu-2`
