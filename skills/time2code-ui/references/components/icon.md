# Icon

## When to use

- Every icon in a time2code/ui project. Icons come from `@hugeicons/core-free-icons` and render through `Icon`.

## Install

```bash
npx time2code add icon
```

Components that need icons install `icon` and `@hugeicons/core-free-icons` themselves.

## Canonical imports

```tsx
import { Settings01Icon } from "@hugeicons/core-free-icons"

import { Icon } from "@/components/ui/icon"
```

## Minimal pattern

```tsx
<Icon aria-hidden="true" icon={Settings01Icon} />
```

`Icon` wraps `HugeiconsIcon` with `size={16}`, `strokeWidth={2}` and `color="currentColor"`. It accepts every `HugeiconsIcon` prop.

## Patterns

- **Decorative vs meaningful**: `Icon` sets no ARIA attributes. Add `aria-hidden="true"` when nearby text says the same thing. When the icon is the only carrier of meaning, name it with `role="img"` and `aria-label`, or put `aria-label` on the surrounding button.
- **Sizing**: components size their icons (`Button`, `Badge`, menu items, input group addons). Leave those alone. Elsewhere, use a `size-*` class (`<Icon className="size-5" … />`), not a numeric `size` prop.
- **Color**: icons inherit `currentColor`. Set color on the parent or with a `text-*` token class.
- **Finding names**: Hugeicons names end in `Icon` and often carry a number (`Search01Icon`, `Cancel01Icon`, `Add01Icon`, `Tick02Icon`, `MoreHorizontalIcon`, `InformationCircleIcon`). Some lucide-style names exist as aliases (`XIcon`, `PlusIcon`, `ChevronDownIcon`), many don't. Check the package's types (`node_modules/@hugeicons/core-free-icons/dist/types/index.d.ts`) or https://hugeicons.com/icons before using a name.

## Common pitfalls

- Installing `lucide-react` or another icon set, or importing lucide components (`<SearchIcon />`) directly.
- Rendering `HugeiconsIcon` directly instead of `Icon`, which loses the shared defaults.
- Passing `size={20}` instead of a `size-*` class, which fights component icon sizing.
- Leaving decorative icons exposed to screen readers.
