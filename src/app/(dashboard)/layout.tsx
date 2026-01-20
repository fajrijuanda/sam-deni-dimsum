"use client"

import { useEffect, useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { MobileTaskbar } from "@/components/dashboard/MobileTaskbar"
import { createClient } from "@/lib/supabase-browser"
import { MOBILE_TASKBAR_ROLES } from "@/lib/constants"
import type { UserRole } from "@/lib/types"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [userRole, setUserRole] = useState<UserRole | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchUserRole() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Try to get role from users table
                const { data } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                const role = (data?.role || user.user_metadata?.role || 'staff') as UserRole
                setUserRole(role)
            }
            setLoading(false)
        }

        fetchUserRole()
    }, [])

    // Check if current role should use mobile taskbar
    const useMobileTaskbar = userRole &&
        MOBILE_TASKBAR_ROLES.includes(userRole as typeof MOBILE_TASKBAR_ROLES[number])

    return (
        <SidebarProvider>
            {/* Sidebar - hidden on mobile for mobile taskbar roles */}
            <div className={useMobileTaskbar ? "hidden md:block" : ""}>
                <AppSidebar />
            </div>

            <main className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-red-950/20">
                <DashboardHeader />
                {/* Content - add bottom padding for mobile taskbar */}
                <div className={`p-6 ${useMobileTaskbar ? "pb-24 md:pb-6" : ""}`}>
                    {children}
                </div>
            </main>

            {/* Mobile Taskbar - only for specific roles */}
            {useMobileTaskbar && !loading && userRole !== "admin" && (
                <MobileTaskbar role={userRole as Exclude<UserRole, "admin">} />
            )}
        </SidebarProvider>
    )
}
