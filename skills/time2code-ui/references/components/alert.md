# Alert

## When to use

- Inline status messaging in content flows.
- Semantic feedback variants (`info`, `success`, `warning`, `error`) with optional icons and actions.

## When NOT to use

- If the message is transient and should auto-dismiss -> use Toast instead.
- If the message requires user action before proceeding -> use AlertDialog instead.
- If it's a brief hover hint -> use Tooltip instead.

## Install

```bash
npx time2code add alert
```

## Canonical imports

```tsx
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertFrame,
  AlertFrameAction,
  AlertFrameDescription,
  AlertFrameFooter,
  AlertTitle,
} from "@/components/ui/alert"
```

## Minimal pattern

```tsx
<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components and dependencies to your app using the cli.
  </AlertDescription>
</Alert>
```

## Patterns from particles

### Key patterns

When an icon uniquely conveys alert status, name it with `role="img"` and `aria-label`. Keep icons decorative with `aria-hidden="true"` when visible text already conveys the same meaning. `Icon` sets neither attribute, so choose one:

```tsx
<Alert variant="info">
  <Icon aria-label="Information" icon={InformationCircleIcon} role="img" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>You can add components using the CLI.</AlertDescription>
</Alert>
```

Variants: `default`, `info`, `success`, `warning`, `error`.

Alert with action buttons (use `AlertAction`):

```tsx
<Alert>
  <Icon aria-label="Information" icon={InformationCircleIcon} role="img" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>Describe what can be done about it here.</AlertDescription>
  <AlertAction>
    <Button size="xs" variant="ghost">Dismiss</Button>
    <Button size="xs">Ok</Button>
  </AlertAction>
</Alert>
```

Alert frame: `AlertFrame` wraps an `Alert` and adds a footer row below it. The frame doesn't pass its variant down, so give the inner `Alert` the same `variant`:

```tsx
<AlertFrame variant="info">
  <Alert variant="info">
    <AlertTitle>Scheduled maintenance</AlertTitle>
    <AlertDescription>The dashboard will be read-only on Sunday.</AlertDescription>
  </Alert>
  <AlertFrameFooter>
    <Icon aria-hidden="true" icon={InformationCircleIcon} />
    <AlertFrameDescription>No action is required.</AlertFrameDescription>
    <AlertFrameAction>
      <Button size="xs" variant="ghost">Learn more</Button>
    </AlertFrameAction>
  </AlertFrameFooter>
</AlertFrame>
```

`AlertFrame` shows an animated striped ribbon on hover. Pass `ribbon={false}` to turn it off.

### More examples

See `p-alert-1` through `p-alert-8` for all variants, action patterns and the alert frame.

## Common pitfalls

- Using alert variants for passive decoration instead of meaningful semantic status.
- Missing title/description structure in complex alerts, reducing scannability.
- Leaving a uniquely meaningful icon unnamed, or repeating status already provided by visible text.
- Giving `AlertFrame` a variant but not the `Alert` inside it, so the two colors don't match.

## Useful particle references

- with icon: `p-alert-2`
- with icon and action buttons: `p-alert-3`
- info alert: `p-alert-4`
- success alert: `p-alert-5`
- warning alert: `p-alert-6`
- error alert: `p-alert-7`
- alert frame with footer and action: `p-alert-8`
