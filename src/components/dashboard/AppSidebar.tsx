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
    SidebarGroupLabel,
    useSidebar,
} from "@/components/ui/sidebar"
import { BarChart3, Box, Calculator, Home, Settings, ShoppingCart, Store, Users, Truck, Package, ClipboardList, UtensilsCrossed, Handshake, Briefcase, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

// Menu Structure Definition
type MenuItem = {
    title: string
    url: string
    icon: any
}

type MenuGroup = {
    label?: string
    items: MenuItem[]
}

const adminGroups: MenuGroup[] = [
    {
        label: "Dashboard",
        items: [
            { title: "Dashboard", url: "/admin", icon: Home },
        ]
    },
    {
        label: "Operasional",
        items: [
            { title: "Outlet", url: "/admin/outlets", icon: Store },
            { title: "Dashboard Stok", url: "/admin/stock", icon: Package },
            { title: "Pesanan Restock", url: "/admin/restock", icon: Truck },
            { title: "Rekap Presensi", url: "/admin/presensi", icon: ClipboardList },
        ]
    },
    {
        label: "Manajemen Produk",
        items: [
            { title: "Manajemen Menu", url: "/admin/menu", icon: UtensilsCrossed },
            { title: "Inventaris", url: "/admin/inventory", icon: Box },
            { title: "Manajemen Paket", url: "/admin/packages", icon: Briefcase },
        ]
    },
    {
        label: "Bisnis & Data",
        items: [
            { title: "Penjualan", url: "/admin/sales", icon: ShoppingCart },
            { title: "Laporan Keuangan", url: "/admin/finance", icon: Calculator },
            { title: "Analitik", url: "/admin/analytics", icon: BarChart3 },
        ]
    },
    {
        label: "Pengguna & Mitra",
        items: [
            { title: "Manajemen Mitra", url: "/admin/mitra", icon: Handshake },
            { title: "Manajemen Pengguna", url: "/admin/users", icon: Users },
        ]
    }
]

const staffItems: MenuItem[] = [
    { title: "Dashboard Stok", url: "/staff", icon: Home },
    { title: "Input Stok", url: "/staff/stok", icon: Package },
    { title: "Presensi", url: "/staff/presensi", icon: ClipboardList },
]

const crewItems: MenuItem[] = [
    { title: "Dashboard Penjualan", url: "/crew", icon: Home },
    { title: "Input Penjualan", url: "/crew/penjualan", icon: ClipboardList },
    { title: "Presensi", url: "/crew/presensi", icon: ClipboardList },
]

const mitraItems: MenuItem[] = [
    { title: "Dashboard", url: "/mitra", icon: Home },
    { title: "History Pencairan", url: "/mitra/pencairan", icon: ClipboardList },
    { title: "Restock", url: "/mitra/restock", icon: Package },
    { title: "Pengaturan", url: "/settings", icon: Settings },
]

export function AppSidebar({ userRole }: { userRole?: string | null }) {
    const pathname = usePathname()
    const { state } = useSidebar()
    const isCollapsed = state === "collapsed"

    // Determine content based on role
    const getMenuContent = () => {
        if (!userRole) return []

        if (userRole === "admin") {
            return adminGroups
        }

        // Convert flat items to single group for others
        const items = userRole === "staff" ? staffItems :
            userRole === "crew" ? crewItems :
                userRole === "mitra" ? mitraItems : []

        return [{ items }] // Return as single group without label
    }

    const menuGroups = getMenuContent()

    return (
        <Sidebar
            variant="sidebar"
            collapsible="icon"
            className="border-none bg-gradient-to-b from-[#dc2626] via-[#7f1d1d] to-[#2b0808] text-white"
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
                {menuGroups.map((group, groupIndex) => (
                    <SidebarGroup key={groupIndex} className="py-2">
                        {group.label && !isCollapsed && (
                            <SidebarGroupLabel className="text-white/50 text-xs font-medium px-4 uppercase tracking-wider mb-2">
                                {group.label}
                            </SidebarGroupLabel>
                        )}
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const isActive = pathname === item.url ||
                                        (item.url !== "/admin" && item.url !== "/staff" && item.url !== "/crew" && item.url !== "/mitra" && pathname.startsWith(item.url))

                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                tooltip={item.title}
                                                className={cn(
                                                    "text-white/80 hover:text-white hover:bg-white/10",
                                                    "transition-all duration-200 rounded-lg",
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
                ))}
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


