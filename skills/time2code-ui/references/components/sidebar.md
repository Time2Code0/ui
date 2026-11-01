# Sidebar

## When to use

- Persistent app shell navigation and grouped links.
- Collapsible/structured side navigation for dashboard layouts.

## Install

```bash
npx time2code add sidebar
```

## Canonical imports

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
```

## Minimal pattern

```tsx
<SidebarProvider>
  <Sidebar>
    <SidebarHeader>Workspace</SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Dashboard</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <SidebarInset>{/* Main page content */}</SidebarInset>
</SidebarProvider>
```

## Patterns from particles

### Key patterns

Sidebar with grouped navigation and footer:

```tsx
<SidebarProvider>
  <Sidebar>
    <SidebarHeader>
      <h2 className="text-lg font-semibold">App Name</h2>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Main</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link href="/dashboard" />}>
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link href="/projects" />}>
                Projects
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>Settings</SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
  <SidebarInset>{/* Page content */}</SidebarInset>
</SidebarProvider>
```

Key composition rules:
- Wrap app with `SidebarProvider` at the layout level.
- Use `SidebarContent` (not "SidebarPanel") as the scrollable body between header/footer. It uses `ScrollArea` with `fill` so flex children (e.g. `mt-auto` footers) can pin to the bottom.
- Navigation items use `SidebarMenu` > `SidebarMenuItem` > `SidebarMenuButton`.
- For link items, use `render` composition: `<SidebarMenuButton render={<Link href="..." />}>`. Do not use `asChild`; sidebar follows the same `render` pattern as the other components.
- Use `SidebarTrigger` for the collapse/expand toggle.
- Use `SidebarInset` for the main content area next to the sidebar.
- `SidebarRail` adds a slim hover-to-expand rail in collapsed state.
- `Sidebar` takes `side` (`left`, `right`), `variant` (`sidebar`, `floating`, `inset`) and `collapsible` (`offcanvas`, `icon`, `none`). With `collapsible="icon"`, give each `SidebarMenuButton` an icon and a `tooltip` so the collapsed rail stays usable.
- `SidebarProvider` stores the open state in a cookie and takes `defaultOpen`, or `open` + `onOpenChange`. `useSidebar()` exposes `state`, `open`, `isMobile`, `openMobile` and `toggleSidebar`.
- Nested items: `SidebarMenuSub` > `SidebarMenuSubItem` > `SidebarMenuSubButton`. Row extras: `SidebarMenuAction`, `SidebarMenuBadge`. Loading rows: `SidebarMenuSkeleton`.

### More examples

See `p-sidebar-1` through `p-sidebar-4`, and `p-breadcrumb-1`, `p-tabs-1`, `p-menu-1` for related app-shell patterns.

## Common pitfalls

- Using non-existent parts like "SidebarPanel" or "SidebarItem" -- the correct names are `SidebarContent` and `SidebarMenuItem`.
- Forgetting `SidebarProvider` wrapper, which manages collapse state and mobile responsiveness.
- Skipping the `SidebarMenu` > `SidebarMenuItem` > `SidebarMenuButton` hierarchy for nav items.
- Missing responsive collapse strategy for narrow/mobile layouts.
- Replacing `SidebarContent`'s scroll area with a raw `ScrollArea` without `fill` when the body uses `mt-auto` to pin footers—use `fill` (see scroll-area primitive docs).

## Useful particle references

- collapsing to icons: `p-sidebar-1`
- floating with submenu, badge and actions: `p-sidebar-2`
- inset: `p-sidebar-3`
- menu skeleton: `p-sidebar-4`
- app-shell references: `p-breadcrumb-1`, `p-tabs-1`, `p-menu-1`
