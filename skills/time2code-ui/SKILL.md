---
name: time2code-ui
description: Build React interfaces with time2code/ui, a Base UI and Tailwind CSS v4 component library distributed as a shadcn registry. Use when adding, composing or styling time2code/ui components (imports from @/components/ui, @/components/charts or @/components/marketing; charts also have the time2code-charts skill) such as buttons, dialogs, drawers, selects, comboboxes, forms, menus, tabs, inputs and toasts, when running the time2code CLI, or when moving shadcn/ui or Radix UI code to time2code/ui.
---

# time2code/ui

time2code/ui is a collection of React components built on [Base UI](https://base-ui.com) and styled with Tailwind CSS v4. Like shadcn/ui, the source code of each component is copied into the project, so the files in `components/ui` belong to the project and can be edited.

The APIs look like shadcn/ui, but they aren't the same. Don't write shadcn/ui or Radix UI code from memory. Follow the rules below, read the component's guide, and read the component's file in the project before using a prop you aren't sure about.

## Related skills

This is the primary time2code/ui skill: installation, the CLI, styling, tokens and the UI components. Two companion skills build on it:

| Skill | Use it for |
| --- | --- |
| `time2code-charts` | Charts, sparklines and chart add-ons in `@/components/charts`. Its rules for installation and styling defer to this skill. |
| `time2code-particles` | An index of every particle (working example) for UI components, charts, marketing components and hooks, with JSON URLs. |

When the companion skills are installed next to this one, they are at `../time2code-charts/SKILL.md` and `../time2code-particles/SKILL.md`. Install them together with `npx skills add time2code0/ui` (select all three). Marketing components (`@/components/marketing`) and hooks have no skill of their own yet; use their particles and the docs.

## Workflow

1. Work out what the UI needs: a single control, an overlay, a form, feedback, or a layout.
2. Find the components in [references/components.md](references/components.md) and read their guides in `references/components/<name>.md`.
3. Check `components/ui` (or `src/components/ui`) for the files. Add missing ones with the CLI.
4. Base the code on a particle (`p-<component>-<n>`, listed in each guide and indexed in `time2code-particles`) when one matches. See [references/cli.md](references/cli.md#reading-particle-source) for how to read one.
5. Write the code with the documented imports and props.
6. Check it against the checklist at the end of this file.

## Adding components

```bash
npx time2code add button dialog
```

- The CLI needs no `components.json`. It reads the import alias from `tsconfig.json` and installs npm dependencies and the components each one needs.
- Files go to `components/ui`, `components/charts`, `components/marketing` and `hooks`.
- In a monorepo root, pass the workspace with `--cwd apps/web`. Use `-y` to skip prompts.
- To start a new Next.js app that is already set up, use `npx time2code create my-app`.
- Form is the `form-baseui` item, imported from `@/components/ui/form-baseui`. Spinners are in `loading`.

If the project uses the shadcn CLI instead, use the `@time2code` namespace: `npx shadcn@latest add @time2code/button`.

Never install time2code/ui as an npm package. It isn't one. More in [references/cli.md](references/cli.md).

## Critical rules

### Use `render`, not `asChild`

Base UI composes a part with another element through the `render` prop. Put the label inside the rendered element:

```tsx
<DialogTrigger render={<Button variant="outline">Edit profile</Button>} />
<DialogClose render={<Button variant="ghost">Cancel</Button>} />
```

### Popups are called `*Popup`

The floating part is `DialogPopup`, `PopoverPopup`, `MenuPopup` or `SelectPopup`, not `*Content`. Other renamed parts: `CardPanel`, `AccordionPanel`, `TabsTab`/`TabsPanel`, `Radio`. Dialogs have a fixed structure:

```tsx
<Dialog>
  <DialogTrigger render={<Button>Open</Button>} />
  <DialogPopup>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogPanel>Content</DialogPanel>
    <DialogFooter>
      <DialogClose render={<Button variant="ghost">Cancel</Button>} />
      <Button>Save</Button>
    </DialogFooter>
  </DialogPopup>
</Dialog>
```

### Links stay links

To make a link look like a button, apply `buttonVariants()` to the link. Don't render a link through `Button`:

```tsx
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

<Link className={buttonVariants({ variant: "outline" })} href="/login">
  Login
</Link>;
```

`Button` takes `variant` (`default`, `secondary`, `outline`, `ghost`, `link`, `animated-link`, `destructive`, `unstyled`), `size` (`xs`, `sm`, `default`, `lg`, `xl`, and `icon-xs` to `icon-xl` for icon-only buttons), `shape` (`default`, `full`, `none`) and `loading`.

### Icons

Icons come from `@hugeicons/core-free-icons` and render through the `Icon` component:

```tsx
import { Settings01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/components/ui/icon";

<Icon aria-hidden="true" icon={Settings01Icon} />;
```

Don't add lucide-react or another icon set. `Icon` doesn't hide itself from screen readers, so add `aria-hidden="true"` to decorative icons. See [references/components/icon.md](references/components/icon.md).

### Other rules

- Don't invent APIs. If a prop isn't in the guide, check the component file.
- Use Drawer (`position` on the root) for new edge panels rather than Sheet.
- Use `Field` with `FieldLabel` and `FieldError` for form controls, and pass the error message to `FieldError` explicitly.
- Set `type` on every `Button` inside forms and on every `Input`.
- Open dialogs from menu items through state, with the dialog as a sibling of the `Menu`.
- Prefer the styled exports. Reach for raw Base UI parts (`@base-ui/react/<component>`) only for custom compositions.

## Styling rules

The components use time2code/ui's own color tokens, not the shadcn/ui ones. Classes like `text-muted-foreground`, `bg-card`, `bg-popover` or `bg-primary` either don't exist or mean something else.

- `bg-background` for the page, cards, popovers and dialogs. `bg-background-muted` for recessed surfaces.
- `text-foreground` for text. `text-foreground-muted` for secondary text.
- `bg-accent` for hover and pressed states.
- Borders default to `foreground` at 10% opacity, so a plain `border` class is usually enough.
- CSS variables are prefixed with `--color-`, as in `var(--color-foreground)`.
- Leave `primary` and `secondary` for brand accents. UI components stay neutral.
- Don't add `dark:` classes for colors. The tokens switch with the mode.

For the full token list, status colors, the shadcn/ui mapping and general class conventions, read [references/rules/styling.md](references/rules/styling.md).

## Rule references

Read these when the task touches the area:

- [references/rules/styling.md](references/rules/styling.md): tokens, class conventions, icons, root layout, fonts
- [references/rules/composition.md](references/rules/composition.md): trigger/popup hierarchies, forms in overlays, responsive overlays, grouped controls
- [references/rules/forms.md](references/rules/forms.md): Field, Form, validation, input groups
- [references/rules/migration.md](references/rules/migration.md): shadcn/ui and Radix UI to time2code/ui
- [references/portal-props.md](references/portal-props.md): `portalProps` on popups and toast providers

## High-risk components

Read these guides before using them. They have the most composition traps:

- [dialog.md](references/components/dialog.md): structure, forms in dialogs, responsive dialog/drawer
- [menu.md](references/components/menu.md): link items, checkbox/radio items, submenus, confirm dialogs
- [select.md](references/components/select.md): `items`-first pattern, labels, multiple and object values
- [combobox.md](references/components/combobox.md): lists, chips, triggers
- [field.md](references/components/field.md) and [form.md](references/components/form.md): validation with native constraints or a schema library
- [input-group.md](references/components/input-group.md): DOM order and addon alignment
- [toast.md](references/components/toast.md): `toastManager`, providers, anchored toasts
- [segmented-control.md](references/components/segmented-control.md): choose radio, link or toggle semantics first

## Project setup

If popups render behind the page or backdrops don't cover the screen, check the root layout:

- `relative` on `<body>`.
- `relative isolate` on the app's root element inside `<body>`.
- `ToastProvider` around the app if the project uses toasts.

## Checklist

Before returning code:

- Imports and props match the component guides and files.
- The composition is complete: required parts are present, and parts the component renders itself aren't duplicated.
- No shadcn/ui leftovers: `asChild`, `*Content`, lucide icons, shadcn/ui color tokens.
- Buttons and inputs have an explicit `type`; icon-only controls have an `aria-label`; decorative icons have `aria-hidden="true"`.
- Forms label every control and show errors through `FieldError`.

## More information

- Documentation: https://ui.time2code.dev/docs
- Any docs page as Markdown: append `.md`, as in https://ui.time2code.dev/docs/ui/dialog.md
- All documentation as Markdown: https://ui.time2code.dev/llms-full.txt
- MCP server for listing, searching and viewing components and examples: `npx time2code mcp init`
