# Command

## When to use

- Command palette and keyboard-navigable action menus.
- Fast action discovery for power-user and app shortcut workflows.

## When NOT to use

- If the list is a simple set of actions without search -> use Menu instead.
- If the user is selecting from a predefined list -> use Select or Combobox instead.
- If the flow is a data form -> use Form instead.

## Install

```bash
npx time2code add command
```

## Canonical imports

```tsx
import {
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
```

## Minimal pattern

```tsx
const items = [
  { value: "linear", label: "Linear" },
  { value: "figma", label: "Figma" },
  { value: "slack", label: "Slack" },
]

<CommandDialog>
  <CommandDialogTrigger render={<Button variant="outline" />}>
    Open Command Palette
  </CommandDialogTrigger>

  <CommandDialogPopup>
    <Command items={items}>
      <CommandInput placeholder="Search..." />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        {(item) => (
          <CommandItem key={item.value} value={item.value}>
            {item.label}
          </CommandItem>
        )}
      </CommandList>
    </Command>
  </CommandDialogPopup>
</CommandDialog>
```

## Patterns from particles

- **Portal forwarding**: optional `portalProps` on `CommandDialogPopup` → Base UI `Dialog.Portal` (`keepMounted`, `container`, …). See [portal-props.md](../portal-props.md).

### Key patterns

Command with grouped sections:

```tsx
<Command items={items}>
  <CommandInput placeholder="Type a command..." />
  <CommandEmpty>No results found.</CommandEmpty>
  <CommandList>
    <CommandGroup>
      <CommandGroupLabel>Suggestions</CommandGroupLabel>
      <CommandCollection>
        {(item) => (
          <CommandItem key={item.value} value={item.value}>
            {item.label}
          </CommandItem>
        )}
      </CommandCollection>
    </CommandGroup>
  </CommandList>
</Command>
```

Use `CommandDialog` + `CommandDialogTrigger` + `CommandDialogPopup` to wrap `Command` in a dialog overlay. Use controlled `open`/`onOpenChange` state for keyboard-shortcut activation.

### More examples

See `p-command-1` for a dialog palette with grouped actions.

## Common pitfalls

- Using command list without clear grouping and action labels.
- Binding critical destructive actions without confirmation pathway.
- Missing keyboard accessibility checks for arrow/select/escape interactions.
- Reaching for `cmdk`. `Command` is built on Base UI Autocomplete, so items, filtering and groups follow the Autocomplete API.

## Useful particle references

- command palette in a dialog: `p-command-1`
- related search/selection references: `p-autocomplete-1`, `p-select-1`, `p-input-group-1`
