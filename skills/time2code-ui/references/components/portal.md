# Portal

## When to use

- Custom content that has to escape a parent's `overflow` or stacking context, such as a floating panel or a full-screen overlay.

## When NOT to use

- For overlay components. Dialog, Popover, Menu, Tooltip and the other popups already portal their content (and take `portalProps`; see [portal-props.md](../portal-props.md)).

## Install

```bash
npx time2code add portal
```

## Canonical imports

```tsx
import { Portal } from "@/components/ui/portal"
```

## Minimal pattern

```tsx
<Portal className="fixed right-4 bottom-4">Floating content</Portal>
```

`Portal` wraps its children in a `div` (which takes every `div` prop) and moves it into `document.body`. It renders nothing on the server or during the first client render, so it never causes a hydration mismatch.

## Patterns

Custom container: keep the target element in state so the portal re-renders once it exists.

```tsx
const [container, setContainer] = useState<HTMLDivElement | null>(null)

<>
  <Portal container={container}>Moved content</Portal>
  <div ref={setContainer} />
</>
```

## Common pitfalls

- Wrapping a `DialogPopup` or `PopoverPopup` in `Portal`; they are already portaled.
- Passing `ref.current` as `container`; it is `null` on the first render and doesn't trigger a re-render.
- Expecting portaled content in the server HTML.

## Useful particle references

- into `document.body`: `p-portal-1`
- into a custom container: `p-portal-2`
