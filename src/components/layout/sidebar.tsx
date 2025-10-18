
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import {
  LayoutDashboard,
  CheckCheck,
  Activity,
  HeartPulse,
  CircleOff,
  BrainCircuit,
  Settings,
  LogOut,
  CalendarCheck,
  Zap,
  Database,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/validation", icon: CheckCheck, label: "Validation" },
  { href: "/monitoring", icon: Activity, label: "Monitoring" },
  { href: "/health", icon: HeartPulse, label: "Tool Health" },
  { href: "/breakdowns", icon: CircleOff, label: "Breakdowns" },
  { href: "/preventive-maintenance", icon: CalendarCheck, label: "PM Planning" },
  { href: "/zbm", icon: Zap, label: "ZBM Overhaul" },
  { href: "/analytics", icon: BrainCircuit, label: "Analytics" },
  { href: "/assets-management", icon: Package, label: "Assets Management" },
  { href: "/master-data", icon: Database, label: "Master Data" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
    >
      <SidebarHeader className="p-4">
        <Logo textClassName="text-sidebar-foreground group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  data-active={pathname.startsWith(item.href)}
                  tooltip={item.label}
                  className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                  variant="ghost"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
         <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/settings">
                <SidebarMenuButton
                  data-active={pathname.startsWith("/settings")}
                  tooltip="Settings"
                  className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                  variant="ghost"
                >
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/">
                  <SidebarMenuButton
                      tooltip="Logout"
                      className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      variant="ghost"
                  >
                          <LogOut className="h-5 w-5" />
                          <span>Logout</span>
                  </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
