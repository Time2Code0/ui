# Preview Card

## When to use

- Hover/focus-triggered rich preview content.
- Contextual details for users/entities without full navigation.

## Install

```bash
npx time2code add preview-card
```

## Canonical imports

```tsx
import {
  PreviewCard,
  PreviewCardCreateHandle,
  PreviewCardPopup,
  PreviewCardTrigger,
} from "@/components/ui/preview-card"
```

## Minimal pattern

```tsx
<PreviewCard>
  <PreviewCardTrigger>Open Preview Card</PreviewCardTrigger>
  <PreviewCardPopup>Preview Card Content</PreviewCardPopup>
</PreviewCard>
```

## Patterns from particles

- **Portal forwarding**: optional `portalProps` on `PreviewCardPopup` → Base UI `PreviewCard.Portal` (`keepMounted`, `container`, …). See [portal-props.md](../portal-props.md).

### Key patterns

Preview card with rich content:

```tsx
<PreviewCard>
  <PreviewCardTrigger render={<a href="/user/johndoe" />}>
    @johndoe
  </PreviewCardTrigger>
  <PreviewCardPopup className="w-80">
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src="/avatar.png" alt="John Doe" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-semibold">John Doe</p>
        <p className="text-foreground-muted text-xs">Software Engineer</p>
      </div>
    </div>
  </PreviewCardPopup>
</PreviewCard>
```

For app links, compose the trigger with the project's `Link` (`render={<Link href="/user/johndoe" />}`). Use `PreviewCardCreateHandle` for detached triggers that share one popup.

### More examples

See `p-preview-card-1` for the core pattern.

## Common pitfalls

- Using preview card for critical workflows requiring explicit modal interaction.
- Missing accessible trigger labels when using icon-only triggers.
- Rendering heavy async content on every hover without throttling/caching strategy.

## Useful particle references

- preview card with popup: `p-preview-card-1`
