import {
  Home01Icon,
  InboxIcon,
  Settings01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/ui/icon";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/ui/sidebar";

const items = [
  { icon: Home01Icon, title: "Home" },
  { icon: InboxIcon, title: "Inbox" },
  { icon: Settings01Icon, title: "Settings" },
];

export function Particle() {
  return (
    <div className="h-120 w-full overflow-hidden rounded-xl border [transform:translateZ(0)]">
      <SidebarProvider className="h-full min-h-0">
        <Sidebar className="h-full" collapsible="icon" variant="inset">
          <SidebarContent>
            <SidebarGroup>
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
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Account">
                  <Icon icon={UserCircleIcon} />
                  <span>Account</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
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
