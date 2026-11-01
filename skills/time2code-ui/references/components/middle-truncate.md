# Middle Truncate

## When to use

- Strings where both the start and the end matter: file paths, URLs, deployment IDs, commit hashes, prefixed branch names.

## When NOT to use

- Prose, descriptions and headings. Truncate those at the end with Tailwind's `truncate`.

## Install

```bash
npx time2code add middle-truncate
```

## Canonical imports

```tsx
import { MiddleTruncate } from "@/components/ui/middle-truncate"
```

## Minimal pattern

```tsx
<div className="w-48">
  <MiddleTruncate value="2b0874e797d7c2a4092d0033ee0c2f0f9aef2869" />
</div>
```

It fills the width it's given and only truncates when the string doesn't fit, so constrain it with a parent width or `max-w-*`. It accepts every `span` prop except `children`; the text goes in `value`.

## Patterns

- Pair it with a tooltip or a copy action when people may need the full string.
- When truncated, screen readers get the full string and a native `title` shows it on hover. Pass `title={undefined}` from a client component when you add your own tooltip.
- Copying a selection that includes the `…` copies the matching part of the original string.
- Add an `aria-label` when it sits inside a focusable control.

## Common pitfalls

- Passing the text as children instead of `value`.
- Nesting it inside another `text-overflow: ellipsis` (`truncate`) container.
- Changing the container width on hover, which moves the truncation point.
- Using `text-transform` or `font-feature-settings` on it; measurement ignores them, so the cut can be slightly off.

## Useful particle references

- adjustable width with tooltips: `p-middle-truncate-1`
