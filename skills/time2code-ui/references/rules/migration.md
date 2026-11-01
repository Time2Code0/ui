# Migrating from shadcn/ui and Radix UI

Use this when adapting code written for shadcn/ui or Radix UI.

## Core idea

time2code/ui looks like shadcn/ui, but its components are built on Base UI. Part names, composition, prop shapes and color tokens differ. Don't copy a shadcn/ui snippet and only change the import path.

## High-impact differences

- `asChild` → `render`, on parts that support it.
- `*Content` → `*Popup` (`DialogPopup`, `PopoverPopup`, `MenuPopup`, `SelectPopup`, `TooltipPopup`). There are no `*Content` aliases (`DrawerContent` exists but is a low-level Base UI part, not the popup).
- `CardContent` → `CardPanel`, `AccordionContent` → `AccordionPanel`, `CollapsibleContent` → `CollapsiblePanel`, `RadioGroupItem` → `Radio`, `TabsTrigger` → `TabsTab`, `TabsContent` → `TabsPanel`.
- `DropdownMenu*` → `Menu*` (`MenuTrigger`, `MenuPopup`, `MenuItem`, …). Menu actions use `onClick`, not `onSelect`.
- `Sheet` → prefer `Drawer` with `position` on the root.
- `Sonner` / `toast()` → `toastManager.add()` with `ToastProvider`.
- `cmdk` → `Command` (built on Base UI Autocomplete).
- `input-otp` → `OTPField` (see below).
- `lucide-react` → `@hugeicons/core-free-icons` rendered through `Icon`.
- shadcn/ui color tokens → time2code/ui tokens (see [styling.md](styling.md)). `text-muted-foreground`, `bg-card`, `bg-primary` don't mean the same thing here.
- No `*Primitive` re-exports except `RadioGroupPrimitive` and `RadioPrimitive` from `radio-group`. Import other Base UI parts from `@base-ui/react/<component>`.
- For Select, use the `items`-first pattern and put `placeholder` on `SelectValue`.

## Examples

### `asChild` → `render`

```tsx
// shadcn/ui
<DialogTrigger asChild>
  <Button variant="outline">Open</Button>
</DialogTrigger>

// time2code/ui
<DialogTrigger render={<Button variant="outline">Open</Button>} />
```

### Link buttons

```tsx
// shadcn/ui
<Button asChild>
  <Link href="/login">Login</Link>
</Button>

// time2code/ui
<Link className={buttonVariants()} href="/login">
  Login
</Link>
```

### Dropdown menu → Menu

```tsx
// shadcn/ui
<DropdownMenu>
  <DropdownMenuTrigger asChild><Button>Open</Button></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onSelect={handleOpen}>Open</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

// time2code/ui
<Menu>
  <MenuTrigger render={<Button>Open</Button>} />
  <MenuPopup>
    <MenuItem onClick={handleOpen}>Open</MenuItem>
  </MenuPopup>
</Menu>
```

### Select

```tsx
// shadcn/ui
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a framework" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="next">Next.js</SelectItem>
    <SelectItem value="vite">Vite</SelectItem>
  </SelectContent>
</Select>

// time2code/ui
const items = [
  { label: "Next.js", value: "next" },
  { label: "Vite", value: "vite" },
]

<Select items={items}>
  <SelectTrigger>
    <SelectValue placeholder="Select a framework" />
  </SelectTrigger>
  <SelectPopup>
    {items.map((item) => (
      <SelectItem key={item.value} value={item.value}>
        {item.label}
      </SelectItem>
    ))}
  </SelectPopup>
</Select>
```

### Toggle Group: `type` → `multiple`

```tsx
// shadcn/ui
<ToggleGroup type="single" defaultValue="daily">…</ToggleGroup>

// time2code/ui (values are always arrays)
<ToggleGroup defaultValue={["daily"]}>…</ToggleGroup>
```

### Slider: scalar values

```tsx
// shadcn/ui
<Slider defaultValue={[50]} max={100} step={1} />

// time2code/ui (an array only for ranges)
<Slider defaultValue={50} max={100} step={1} />
```

### Accordion: `type` and `collapsible`

```tsx
// shadcn/ui
<Accordion type="single" collapsible defaultValue="item-1">…</Accordion>

// time2code/ui (single-open and collapsible by default; add `multiple` for more)
<Accordion defaultValue={["item-1"]}>…</Accordion>
```

### OTP: `input-otp` → `OTPField`

```tsx
// shadcn/ui
<InputOTP maxLength={6} value={value} onChange={setValue}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
  </InputOTPGroup>
</InputOTP>

// time2code/ui
<Field>
  <FieldLabel>Verification code</FieldLabel>
  <OTPField length={6} onValueChange={setValue} value={value}>
    <OTPFieldInput />
    <OTPFieldInput aria-label="Character 2 of 6" />
    {/* one OTPFieldInput per character */}
  </OTPField>
</Field>
```

- There is no `InputOTPGroup`; `size="lg"` goes on `OTPField`.
- Render one `OTPFieldInput` per character, in order, without `index`.
- Remove the `input-otp` dependency.

### Toast

```tsx
// shadcn/ui (Sonner)
toast.success("Saved")

// time2code/ui
toastManager.add({ title: "Saved", type: "success" })
```

## Checklist

1. Confirm the imports and part names in the component guide.
2. Confirm the child structure (trigger/header/panel/footer, items, groups).
3. Confirm prop names and value shapes (arrays vs scalars).
4. Replace shadcn/ui tokens and lucide icons.
5. Compare with at least one particle.
