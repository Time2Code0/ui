# Loading

## When to use

- Indeterminate loading indicators (spinners). There is no separate `spinner` component; spinners live in `loading`.

## When NOT to use

- If progress can be measured -> use Progress instead.
- If the final layout is known -> use Skeleton instead.
- For a busy button -> use the `loading` prop on `Button`.

## Install

```bash
npx time2code add loading
```

## Canonical imports

```tsx
import {
  Spinner,
  SpinnerCircle,
  SpinnerCircleFilled,
  SpinnerEllipsis,
} from "@/components/ui/loading"
```

## Minimal pattern

```tsx
<Spinner />
```

## Patterns

- `Spinner`: eight bars rotating in steps. `Button`'s `loading` state uses it.
- `SpinnerCircle`: a circular arc. `SpinnerCircleFilled`: the arc on a faded track.
- `SpinnerEllipsis`: three pulsing dots (a `div`; dots are `size-2`).
- All of them render `role="status"` and `aria-label="Loading"`, inherit `currentColor`, and are sized with `size-*` classes (default `size-4`).
- In an input group, put the spinner in an `InputGroupAddon` (see `p-input-group-16`).

## Common pitfalls

- Importing from `@/components/ui/spinner`; the file is `loading`.
- Building a spinner from an icon with `animate-spin`.
- Showing a spinner for content whose shape is known; a skeleton avoids layout shift.

## Useful particle references

- stepped spinner: `p-loading-1`
- circle / circle with track: `p-loading-2`, `p-loading-3`
- ellipsis: `p-loading-4`
- button with manual spinner: `p-button-18`
- input group with spinner: `p-input-group-16`
