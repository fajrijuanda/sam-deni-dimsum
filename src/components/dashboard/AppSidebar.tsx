"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { BarChart3, Box, Calculator, Home, Settings, ShoppingCart, Store, Users, Truck } from "lucide-react"
import { cn } from "@/lib/utils"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: Home,
    },
    {
        title: "Outlet",
        url: "/admin/outlets",
        icon: Store,
    },
    {
        title: "Sales",
        url: "/admin/sales",
        icon: ShoppingCart,
    },
    {
        title: "Inventory",
        url: "/admin/inventory",
        icon: Box,
    },
    {
        title: "User Management",
        url: "/admin/users",
        icon: Users,
    },
    {
        title: "Manajemen Mitra",
        url: "/admin/mitra",
        icon: Users,
    },
    {
        title: "Pesanan Restock",
        url: "/admin/restock",
        icon: Truck,
    },
    {
        title: "Laporan Keuangan",
        url: "/admin/finance",
        icon: Calculator,
    },
    {
        title: "Analytics",
        url: "/admin/analytics",
        icon: BarChart3,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    const pathname = usePathname()
    const { state } = useSidebar()
    const isCollapsed = state === "collapsed"

    return (
        <Sidebar
            variant="sidebar"
            collapsible="icon"
            className="border-none bg-gradient-to-b from-[#dc2626] via-[#7f1d1d] to-[#2b0808]"
        >
            {/* Header with Logo */}
            <SidebarHeader className={cn(
                "flex items-center justify-center transition-all duration-300",
                isCollapsed ? "p-1 pt-2" : "p-4 pb-6"
            )}>
                <div className={cn(
                    "flex items-center justify-center",
                    isCollapsed ? "w-10 h-10" : "h-20"
                )}>
                    <Image
                        src="/logo.png"
                        alt="Sam Deni Dimsum Logo"
                        width={isCollapsed ? 40 : 120}
                        height={isCollapsed ? 40 : 80}
                        className="object-contain drop-shadow-lg"
                        priority
                    />
                </div>
            </SidebarHeader>

            {/* Menu Content */}
            <SidebarContent className={cn(isCollapsed ? "px-1" : "px-2")}>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = pathname === item.url ||
                                    (item.url !== "/admin" && pathname.startsWith(item.url))

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.title}
                                            className={cn(
                                                "text-white/80 hover:text-white hover:bg-white/10",
                                                "transition-all duration-200 rounded-lg my-0.5",
                                                isCollapsed && "justify-center px-0",
                                                isActive && "bg-white/20 text-white font-semibold shadow-lg"
                                            )}
                                        >
                                            <a href={item.url} className={cn(
                                                "flex items-center py-2.5",
                                                isCollapsed ? "justify-center px-2" : "gap-3 px-3"
                                            )}>
                                                <item.icon className={cn(
                                                    "flex-shrink-0",
                                                    isCollapsed ? "w-5 h-5" : "w-5 h-5",
                                                    isActive ? "text-yellow-300" : "text-white/70"
                                                )} />
                                                {!isCollapsed && (
                                                    <span className="truncate">{item.title}</span>
                                                )}
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer - only show when expanded */}
            {!isCollapsed && (
                <SidebarFooter className="p-4 border-t border-white/10 bg-gradient-to-t from-black/30 to-transparent">
                    <p className="text-xs text-white/40 text-center">
                        &copy; 2026 PT Sam Deni Dimsum
                    </p>
                </SidebarFooter>
            )}
        </Sidebar>
    )
}


