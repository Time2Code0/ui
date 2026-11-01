# Calendar

## When to use

- Date selection interfaces and calendar-based scheduling UIs.
- Single-date, range, and constrained date picking patterns.

## Install

```bash
npx time2code add calendar
```

## Canonical imports

```tsx
import { Calendar, type DateRange } from "@/components/ui/calendar"
```

`Calendar` wraps `@daypicker/react` (not `react-day-picker`) and re-exports its `DateRange`, `DayOfWeek` and `DropdownProps` types. Import them from the calendar file.

## Minimal pattern

```tsx
<Calendar mode="single" />
```

## Patterns from particles

### Key patterns

Single date selection with state:

```tsx
const [date, setDate] = useState<Date | undefined>()

<Calendar mode="single" selected={date} onSelect={setDate} />
```

Date range selection:

```tsx
const [range, setRange] = useState<DateRange | undefined>()

<Calendar mode="range" selected={range} onSelect={setRange} />
```

Cell size: set `--cell-size` on the calendar (default `--spacing(9)`):

```tsx
<Calendar className="[--cell-size:--spacing(11)]" mode="single" />
```

Date picker: there is no date picker component. Compose `Calendar` inside a `Popover` with a `Button` trigger (see the `p-date-picker-*` particles and https://ui.time2code.dev/docs/ui/date-picker.md).

### More examples

See `p-calendar-1` through `p-calendar-6` for cell size, range, dropdown navigation, and month/year select patterns, and `p-date-picker-1` through `p-date-picker-6` for popover date pickers.

## Common pitfalls

- Using calendar for free-text date input flows better handled by date fields.
- Missing locale/disabled-date constraints for business rules.
- Treating calendar as date-time picker without explicit time UI.

## Useful particle references

- basic calendar: `p-calendar-1`
- custom cell size: `p-calendar-2`
- date range selection: `p-calendar-3`
- dropdown navigation: `p-calendar-4`
- select dropdown for month/year: `p-calendar-5`
- combobox dropdown for month/year: `p-calendar-6`
- date pickers (single, range, field, presets, input, close on select): `p-date-picker-1` through `p-date-picker-6`
