# Component index

Use this to pick the right component for a task. Each entry links to its guide in `components/`, with imports, minimal patterns, pitfalls and particle references.

For optional `portalProps` on popups and toast providers, see [portal-props.md](portal-props.md).

## Overlays and popups

- **Dialog**: centered modal that needs the user's attention. [dialog.md](components/dialog.md)
- **AlertDialog**: confirmation before a destructive or critical action. [alert-dialog.md](components/alert-dialog.md)
- **Drawer**: panel from an edge (bottom, top, left, right) with swipe gestures; also mobile action menus. [drawer.md](components/drawer.md)
- **Sheet**: older Dialog-based edge panel; prefer Drawer for new UI. [sheet.md](components/sheet.md)
- **Popover**: anchored, non-modal floating content. [popover.md](components/popover.md)
- **Tooltip**: short hint on hover or focus. [tooltip.md](components/tooltip.md)
- **PreviewCard**: rich preview of a link target on hover. [preview-card.md](components/preview-card.md)
- **Menu**: dropdown action list with groups, checkbox/radio items and submenus. [menu.md](components/menu.md)
- **ContextMenu**: right-click or long-press menu at the pointer. [context-menu.md](components/context-menu.md)
- **Command**: searchable command palette (not cmdk). [command.md](components/command.md)

## Selection and input

- **Select**: one choice from a predefined list, no search. [select.md](components/select.md)
- **Combobox**: searchable selection, single or multiple (chips). [combobox.md](components/combobox.md)
- **Autocomplete**: free text with suggestions. [autocomplete.md](components/autocomplete.md)
- **Input**: single-line text. [input.md](components/input.md)
- **Textarea**: multi-line text. [textarea.md](components/textarea.md)
- **InputGroup**: input or textarea with addons (icons, text, buttons, badges). [input-group.md](components/input-group.md)
- **OTPField**: one-time code in segmented slots. [otp-field.md](components/otp-field.md)
- **NumberField**: numeric entry with stepper buttons and scrubbing. [number-field.md](components/number-field.md)
- **Slider**: continuous value or range. [slider.md](components/slider.md)
- **Calendar**: date grid; date pickers compose it in a Popover. [calendar.md](components/calendar.md)
- **ColorPicker**: color area, sliders, wheel, fields, swatches and a CSS color input. [color-picker.md](components/color-picker.md)

## Forms and validation

- **Form**: form wrapper for validation and submission (`form-baseui`). [form.md](components/form.md)
- **Field**: label, description and error wired to one control. [field.md](components/field.md)
- **Fieldset**: group of controls with a legend and separators. [fieldset.md](components/fieldset.md)
- **Label**: accessible label for a control. [label.md](components/label.md)

## Toggles and choices

- **Checkbox**: single boolean. [checkbox.md](components/checkbox.md)
- **CheckboxGroup**: multiple selection from a set. [checkbox-group.md](components/checkbox-group.md)
- **RadioGroup**: one choice from a visible set. [radio-group.md](components/radio-group.md)
- **SegmentedControl**: segmented look over radio choices, navigation links or exclusive toggles; choose the behavior first. [segmented-control.md](components/segmented-control.md)
- **Switch**: on/off preference. [switch.md](components/switch.md)
- **Toggle**: pressable two-state button. [toggle.md](components/toggle.md)
- **ToggleGroup**: toggles with shared state. [toggle-group.md](components/toggle-group.md)

## Layout and navigation

- **Tabs**: panels switched by tabs. [tabs.md](components/tabs.md)
- **Accordion**: collapsible sections. [accordion.md](components/accordion.md)
- **Collapsible**: one expandable region. [collapsible.md](components/collapsible.md)
- **Sidebar**: app shell navigation. [sidebar.md](components/sidebar.md)
- **Breadcrumb**: location trail. [breadcrumb.md](components/breadcrumb.md)
- **Pagination**: page links. [pagination.md](components/pagination.md)
- **ScrollArea**: styled scroll container. [scroll-area.md](components/scroll-area.md)
- **Grid**: marketing layout grid with visible guides. [grid.md](components/grid.md)
- **Link**: `next/link` replacement that opens external links in a new tab. [link.md](components/link.md)
- **Portal**: render custom content into `document.body` or another node. [portal.md](components/portal.md)

## Content and display

- **Card**: content surface with header, panel and footer; `CardFrame` for a framed section. [card.md](components/card.md)
- **Table**: tabular data, plain or card style. [table.md](components/table.md)
- **Avatar**: user image with fallback; `AvatarGroup` for stacks. [avatar.md](components/avatar.md)
- **Badge**: status or label chip. [badge.md](components/badge.md)
- **Kbd**: keyboard shortcut keycaps. [kbd.md](components/kbd.md)
- **Separator**: divider. [separator.md](components/separator.md)
- **Group**: connected cluster of controls. [group.md](components/group.md)
- **Empty**: empty state with a next step. [empty.md](components/empty.md)
- **MiddleTruncate**: truncates in the middle for paths, IDs and hashes. [middle-truncate.md](components/middle-truncate.md)
- **Icon**: Hugeicons renderer used everywhere. [icon.md](components/icon.md)

## Feedback and status

- **Alert**: inline, persistent status message; `AlertFrame` adds a footer. [alert.md](components/alert.md)
- **Toast**: transient notification via `toastManager`. [toast.md](components/toast.md)
- **Progress**: task progress. [progress.md](components/progress.md)
- **Meter**: bounded measurement. [meter.md](components/meter.md)
- **Loading**: spinners (`Spinner`, `SpinnerCircle`, `SpinnerEllipsis`). [loading.md](components/loading.md)
- **Skeleton**: loading placeholder. [skeleton.md](components/skeleton.md)

## Actions

- **Button**: actions; `buttonVariants()` styles links as buttons. [button.md](components/button.md)

## Not covered here

- Charts (`@/components/charts`): use the `time2code-charts` skill.
- Marketing components (`@/components/marketing`) and hooks (`@/hooks`): no guides yet. Start from their particles in the `time2code-particles` skill (`references/marketing.md`, `references/hooks.md`) and the docs (https://ui.time2code.dev/llms.txt).
