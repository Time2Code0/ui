# Styling rules

## Core rules

- Use the semantic tokens below (`text-foreground-muted`, `bg-destructive`), never raw palette classes (`bg-blue-500`) for UI states.
- Reach for a component's `variant`, `size` and `shape` props before overriding classes.
- Let the parent own spacing: `flex flex-col gap-*` or `grid gap-*` instead of `space-y-*`. Negative spacing for intentional overlap is fine.
- Use logical spacing: `ms-*`/`me-*`/`ps-*`/`pe-*` instead of `ml-*`/`mr-*`/`pl-*`/`pr-*`, including `ms-auto`.
- Use `size-*` for square sizing.
- Combine conditional classes with `cn()` (from the `cn` package).
- Don't repeat what a component already sets: a plain `border` already has the right color, and many parts already lay out and size their icons. Check the component file before adding layout or icon classes.
- Size icons with `size-*` classes, not a numeric `size` prop, and only where the component doesn't already size them.
- Mark decorative icons `aria-hidden="true"`. Don't hide icons that carry meaning; name them instead.
- Style a child from a component's state with `data-slot` selectors and `in-*` variants rather than `group`: `in-[[data-slot=button]:hover]:translate-x-0.5`.
- Cancel/close buttons in Dialog, AlertDialog and Drawer footers use `variant="ghost"`. Keep `variant="outline"` for triggers that open overlays.
- Use Tailwind CSS v4 syntax. `--alpha()` and `--spacing()` are valid Tailwind v4 functions; don't rewrite them to `color-mix()`, `rgba()` or pixel values.

## Do / Don't

```tsx
// Do
<Button size="sm" variant="outline" />
<div className="flex flex-col gap-3" />
<p className="text-foreground-muted text-sm" />
<Button>
  Save
  <Icon
    aria-hidden="true"
    className="transition-transform in-[[data-slot=button]:hover]:translate-x-0.5"
    icon={ArrowRight01Icon}
  />
</Button>

// Don't
<Button className="bg-blue-500 text-white" />
<div className="space-y-3" />
<p className="text-muted-foreground" />
<Icon icon={ArrowRight01Icon} size={16} />
<Button className="group">…</Button>
```

# Token reference

Each token is a Tailwind CSS theme variable, defined in an `@theme` block for light mode and overridden in a `.dark` block for dark mode. Every token works as a utility class (`text-foreground-muted`) and as a CSS variable (`var(--color-foreground-muted)`). There is no `:root` mapping layer like in shadcn/ui.

## Base tokens

| Token | Used for |
| --- | --- |
| `background` | The page and raised surfaces, such as cards, popovers and dialogs |
| `background-muted` | Recessed surfaces, such as dialog footers and input group addons |
| `foreground` | Text and icons, and at low opacity, borders, rings and subtle fills |
| `foreground-muted` | Secondary text, such as descriptions, placeholders and labels |
| `accent` | Hover, highlighted and pressed states of menu items, buttons and options |
| `primary` | The brand color, used sparingly, mostly by marketing components |
| `secondary` | A second brand color, used alongside `primary` |

There is no border token. Borders are `foreground` at 10% opacity (`border-foreground/10`), which the stylesheet sets as the default border color for every element.

## Status tokens

`destructive`, `info`, `success` and `warning` each come in four tokens:

| Token | Used for |
| --- | --- |
| `destructive` | Solid fills and icons |
| `destructive-foreground` | Text on a tinted surface, such as alert and badge text |
| `destructive-background` | Tinted surfaces, such as alerts and destructive menu items |
| `destructive-subtel` | Stronger tints, such as badges, alert frames and the focus ring of invalid fields |

`subtel` is spelled this way in the token names. Don't correct it to `subtle`, or the class won't exist.

Example: a destructive badge uses `bg-destructive-subtel text-destructive-foreground`.

## Chart tokens

Charts read their series colors from `chart-1` to `chart-5`. Everything else in a chart, such as grid lines, labels and tooltips, uses the base tokens.

## Mapping from shadcn/ui

| shadcn/ui | time2code/ui |
| --- | --- |
| `bg-card`, `bg-popover` | `bg-background` |
| `bg-muted` | `bg-background-muted` |
| `text-muted-foreground` | `text-foreground-muted` |
| `bg-primary`, `text-primary-foreground` | `bg-foreground`, `text-background` |
| `border-border`, `border-input` | `border-foreground/10` |
| `ring-ring` | `ring-foreground` |
| `var(--foreground)` | `var(--color-foreground)` |

shadcn/ui's `primary` is the dark, neutral color of default buttons. In time2code/ui that role belongs to `foreground`, and `primary` is the brand color.

## Dark mode

Dark mode is class-based: `@custom-variant dark (&:is(.dark *));` applies the `.dark` overrides when an ancestor has the `dark` class. In Next.js, a `ThemeProvider` built on next-themes sets that class on `<html>`. Components need no `dark:` classes for colors.

## Root layout

For Base UI portals and backdrops:

- `relative` on `<body>` (iOS Safari needs it for portaled backdrops).
- `relative isolate` on the app's root element inside `<body>`, so popups stack above the page.
- `ToastProvider` (and `AnchoredToastProvider` if used) around the app.

`npx time2code create` sets this up.

## Fonts

`font-sans` and `font-mono` read `--font-sans` and `--font-mono`. These point at `--font-geist-sans` and `--font-geist-mono`, which `next/font` sets in the root layout. Keep those variable names when changing the font, or remap `--font-sans` and `--font-mono` in the theme.
