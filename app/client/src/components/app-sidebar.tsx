"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  LayoutDashboard, 
  Utensils, 
  History, 
  PieChart, 
  Target, 
  Sparkles, 
  User, 
  FileText,
  Activity
} from "lucide-react"

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Meal History", url: "/dashboard/history", icon: History },
  { title: "Nutrition Analytics", url: "/dashboard/analytics", icon: PieChart },
  { title: "Health Profile", url: "/dashboard/profile", icon: User },
  { title: "Reports", url: "/dashboard/reports", icon: FileText },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props} className="border-r bg-white dark:bg-zinc-950">
      <SidebarHeader className="h-[--header-height] border-b border-border/50 flex items-center justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent data-[state=open]:bg-transparent">
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-green-600 text-white shadow-sm hover:bg-green-700 transition-colors">
                  <Activity className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-lg text-foreground tracking-tight">FIT KAKA</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4 gap-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive}
                  tooltip={item.title}
                  className={isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium" : "text-muted-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-foreground"}
                >
                  <Link href={item.url}>
                    <item.icon className="size-[18px]" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
