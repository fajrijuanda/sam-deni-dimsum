"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
    ClipboardList,
    Package,
    UserCheck,
    Home,
    Wallet,
    Settings
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { UserRole, MobileMenuItem } from "@/lib/types"

/**
 * Menu configuration per role
 * Each role has its own set of menu items for the mobile taskbar
 */
const ROLE_MENUS: Record<Exclude<UserRole, "admin">, MobileMenuItem[]> = {
    crew: [
        { id: "dashboard", label: "Dashboard", href: "/crew", icon: Home },
        { id: "penjualan", label: "Penjualan", href: "/crew/penjualan", icon: ClipboardList },
        { id: "presensi", label: "Presensi", href: "/crew/presensi", icon: UserCheck },
        { id: "settings", label: "Pengaturan", href: "/settings", icon: Settings },
    ],
    staff: [
        { id: "dashboard", label: "Dashboard", href: "/staff", icon: Home },
        { id: "stok", label: "Input Stok", href: "/staff/stok", icon: Package },
        { id: "presensi", label: "Presensi", href: "/staff/presensi", icon: UserCheck },
        { id: "settings", label: "Pengaturan", href: "/settings", icon: Settings },
    ],
    mitra: [
        { id: "dashboard", label: "Dashboard", href: "/mitra", icon: Home },
        { id: "pencairan", label: "Pencairan", href: "/mitra/pencairan", icon: Wallet },
        { id: "restock", label: "Restock", href: "/mitra/restock", icon: Package },
        { id: "settings", label: "Pengaturan", href: "/settings", icon: Settings },
    ],
}

interface MobileTaskbarProps {
    role: Exclude<UserRole, "admin">
}

/**
 * Mobile bottom taskbar component
 * Only visible on mobile screens (md breakpoint and below)
 * Replaces sidebar navigation for crew, staff, and mitra roles
 */
export function MobileTaskbar({ role }: MobileTaskbarProps) {
    const pathname = usePathname()
    const menuItems = ROLE_MENUS[role] || []

    if (menuItems.length === 0) return null

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-slate-200 shadow-lg"
            aria-label="Mobile navigation"
        >
            <div className="flex items-center justify-around px-2 py-1 safe-area-bottom">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/mitra" && pathname.startsWith(item.href))
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center py-2 px-3 min-w-[64px] rounded-lg transition-all",
                                isActive
                                    ? "text-red-600 bg-red-50"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                            )}
                        >
                            <Icon className={cn(
                                "w-5 h-5 mb-0.5",
                                isActive && "text-red-600"
                            )} />
                            <span className={cn(
                                "text-[10px] font-medium",
                                isActive && "text-red-600"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
