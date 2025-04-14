import { Calendar, Home, Newspaper, Search } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Resumen",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Calendario",
    url: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Buscar",
    url: "/dashboard/search",
    icon: Search,
  },
  {
    title: "Explorar",
    url: "/dashboard/explore",
    icon: Newspaper,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="mt-14 bg-white">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel>Finanzas Inteligentes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
