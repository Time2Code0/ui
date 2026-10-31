import {
  DashboardSquare01Icon,
  Folder01Icon,
  InboxIcon,
  MoreHorizontalIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/ui/icon";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/ui/sidebar";

const projects = ["Design System", "Marketing Site", "Mobile App"];

export function Particle() {
  return (
    <div className="h-120 w-full overflow-hidden rounded-xl border bg-background-muted [transform:translateZ(0)]">
      <SidebarProvider className="h-full min-h-0">
        <Sidebar className="h-full" variant="floating">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <Icon icon={DashboardSquare01Icon} />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#">
                          <span>Overview</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#" isActive>
                          <span>Analytics</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#">
                          <span>Reports</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Icon icon={InboxIcon} />
                      <span>Inbox</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>24</SidebarMenuBadge>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarGroupAction title="Add project">
                <Icon icon={PlusSignIcon} />
                <span className="sr-only">Add project</span>
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  {projects.map((project) => (
                    <SidebarMenuItem key={project}>
                      <SidebarMenuButton>
                        <Icon icon={Folder01Icon} />
                        <span>{project}</span>
                      </SidebarMenuButton>
                      <SidebarMenuAction showOnHover>
                        <Icon icon={MoreHorizontalIcon} />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="bg-transparent">
          <header className="flex h-12 items-center gap-2 px-3">
            <SidebarTrigger />
            <span className="font-medium text-sm">Analytics</span>
          </header>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
