"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import { useEffect, useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, LogOut, Settings, User } from "lucide-react"

interface UserProfile {
    email: string
    name: string
    role: string
}

export function DashboardHeader() {
    const router = useRouter()
    const supabase = createClient()
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchUser() {
            const { data: { user: authUser } } = await supabase.auth.getUser()

            if (authUser) {
                // Try to get from users table first
                const { data: userData } = await supabase
                    .from('users')
                    .select('full_name, role')
                    .eq('id', authUser.id)
                    .single()

                setUser({
                    email: authUser.email || '',
                    name: userData?.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
                    role: userData?.role || authUser.user_metadata?.role || 'staff',
                })
            }
            setLoading(false)
        }

        fetchUser()
    }, [supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin': return 'Super Admin'
            case 'staff': return 'Staff'
            case 'mitra': return 'Mitra'
            default: return role
        }
    }

    return (
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between px-6 py-3">
                {/* Left side */}
                <div className="flex items-center gap-4">
                    <SidebarTrigger className="text-slate-600 hover:text-red-600 transition-colors" />
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
                    <span className="font-semibold text-slate-800 dark:text-white hidden sm:inline">
                        Sam Deni Dimsum Management System
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-white sm:hidden">
                        SDMS
                    </span>
                </div>

                {/* Right side - User Profile */}
                <div className="flex items-center gap-3">
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
                            <div className="w-20 h-4 rounded bg-slate-200 animate-pulse hidden sm:block" />
                        </div>
                    ) : user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors outline-none">
                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
                                    {getInitials(user.name)}
                                </div>
                                {/* Name and Role */}
                                <div className="hidden sm:flex flex-col items-start">
                                    <span className="text-sm font-medium text-slate-800 dark:text-white leading-tight">
                                        {user.name}
                                    </span>
                                    <span className="text-xs text-slate-500 leading-tight">
                                        {getRoleLabel(user.role)}
                                    </span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{user.name}</span>
                                        <span className="text-xs text-slate-500 font-normal">{user.email}</span>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">
                                    <User className="w-4 h-4 mr-2" />
                                    Profil Saya
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Pengaturan
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : null}
                </div>
            </div>
        </header>
    )
}
