import {
  Calendar03Icon,
  CommandIcon,
  Home01Icon,
  InboxIcon,
  Search01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/ui/icon";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/registry/ui/sidebar";

const items = [
  { icon: Home01Icon, title: "Home" },
  { icon: InboxIcon, title: "Inbox" },
  { icon: Calendar03Icon, title: "Calendar" },
  { icon: Search01Icon, title: "Search" },
  { icon: Settings01Icon, title: "Settings" },
];

export function Particle() {
  return (
    // The transform keeps the fixed sidebar inside the preview.
    <div className="h-120 w-full overflow-hidden rounded-xl border [transform:translateZ(0)]">
      <SidebarProvider className="h-full min-h-0">
        <Sidebar className="h-full" collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                    <Icon icon={CommandIcon} />
                  </div>
                  <span className="font-semibold">Acme Inc</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item, index) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={index === 0}
                        tooltip={item.title}
                      >
                        <Icon icon={item.icon} />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-3">
            <SidebarTrigger />
            <span className="font-medium text-sm">Home</span>
          </header>
          <div className="flex flex-1 flex-col gap-3 p-4">
            <div className="h-24 rounded-lg bg-background-muted" />
            <div className="flex-1 rounded-lg bg-background-muted" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
