# Avatar

## When to use

- Identity visuals for users/teams in compact spaces.
- Image + fallback initials patterns in cards, lists, and menus.
- Overlapping stacks of people (`AvatarGroup`).

## Install

```bash
npx time2code add avatar
```

## Canonical imports

```tsx
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
```

## Minimal pattern

```tsx
<Avatar>
  <AvatarImage alt="Jane Doe" src="/avatars/01.png" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

Use `keepMounted` on `AvatarImage` when the image relies on native lazy loading (`loading="lazy"`) or `next/image`. The fallback stays visible while the image loads or if it fails.

## Patterns from particles

### Key patterns

Size comes from the `--avatar-size` custom property, and the fallback's font size scales with it. Set it on the avatar, or on a parent so every avatar inside inherits it:

```tsx
<Avatar className="[--avatar-size:--spacing(12)]">
  <AvatarImage alt="Jane Doe" src="/avatar.png" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

Interactive avatar: use `render` instead of wrapping it in a button or link. It needs an accessible name; `alt` supplies one, a fallback-only avatar needs `aria-label`:

```tsx
<Avatar render={<button type="button" />}>…</Avatar>
<Avatar render={<a href="/people/ada" />}>…</Avatar>
```

Overlapping group. Avatars are separated by a transparent masked gap, not a ring, so the stack works on any background:

```tsx
<AvatarGroup className="[--avatar-size:--spacing(10)]" topmost="last">
  <Avatar>
    <AvatarImage alt="Frida Kahlo" src="/user-1.png" />
    <AvatarFallback>FK</AvatarFallback>
  </Avatar>
  <Avatar>
    <AvatarImage alt="Nadia Ekman" src="/user-2.png" />
    <AvatarFallback>NE</AvatarFallback>
  </Avatar>
  <AvatarGroupCount>+2</AvatarGroupCount>
</AvatarGroup>
```

- `topmost` (`"first"` default, or `"last"`) picks which end of the stack stays a whole circle.
- Tune the layout with `--avatar-overlap`, `--avatar-gap` and `--avatar-nudge` on the group.

### More examples

See `p-avatar-1` through `p-avatar-21` for sizes, radii, fallbacks, interactive avatars, status dots, badges and groups.

## Common pitfalls

- Omitting `AvatarFallback`, causing broken image states with no identity fallback.
- Using non-descriptive `alt` text on `AvatarImage` in accessible contexts.
- Sizing avatars with `size-*` classes instead of `--avatar-size`. The fallback text and the group mask both read `--avatar-size`.
- Sizing avatars inside an `AvatarGroup` individually. Every avatar in a group must be the same size; set `--avatar-size` on the group.
- Building stacks with `-space-x-*` and `ring-2 ring-background`. Use `AvatarGroup`.
- Putting a status dot or badge on a clipped avatar in a group. It gets cropped; put it on the avatar that stays whole (the first with `topmost="first"`, the last with `topmost="last"`).
- Wrapping an avatar in `<button>` or `<a>` instead of using `render`.

## Useful particle references

- image + fallback: `p-avatar-1`
- fallback only / icon fallback: `p-avatar-2`, `p-avatar-6`
- sizes / sized from a parent: `p-avatar-3`, `p-avatar-19`
- radii: `p-avatar-4`
- rendered as a button / link: `p-avatar-17`, `p-avatar-18`
- with tooltip: `p-avatar-20`
- status dots and badges: `p-avatar-7` through `p-avatar-12`
- groups: `p-avatar-5`, `p-avatar-13` through `p-avatar-16`, `p-avatar-21`
