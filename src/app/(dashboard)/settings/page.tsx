"use client"

import { useEffect, useState } from "react"
import {
    Settings,
    User,
    Bell,
    Shield,
    Palette,
    Database,
    Save,
    LogOut,
    Building2,
    CheckCircle
} from "lucide-react"
import { GlassCard } from "@/components/shared/GlassCard"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase-browser"
import { AppTheme, applyTheme, getStoredTheme, storeTheme } from "@/lib/theme"
import {
    ProfileSettings,
    BusinessSettings,
    NotificationSettings,
    AppearanceSettings,
    IntegrationSettings,
    SecuritySettings
} from "@/components/settings"
import type {
    UserProfile,
    BusinessSettings as BusinessSettingsType,
    NotificationSettings as NotificationSettingsType,
    IntegrationSettings as IntegrationSettingsType
} from "@/lib/types"

// Tab configuration with icons
const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "business", label: "Bisnis", icon: Building2 },
    { id: "notifications", label: "Notifikasi", icon: Bell },
    { id: "appearance", label: "Tampilan", icon: Palette },
    { id: "integrations", label: "Integrasi", icon: Database },
    { id: "security", label: "Keamanan", icon: Shield },
] as const

type TabId = typeof tabs[number]["id"]

export default function SettingsPage() {
    const supabase = createClient()
    const [activeTab, setActiveTab] = useState<TabId>("profile")
    const [isSaving, setIsSaving] = useState(false)
    const [showSaved, setShowSaved] = useState(false)

    // Profile settings state
    const [profile, setProfile] = useState<UserProfile>({
        name: "Admin Sam Deni",
        email: "admin@samdenidimsum.com",
        phone: "0851-1778-4817",
        role: "Super Admin"
    })

    // Business settings state
    const [business, setBusiness] = useState<BusinessSettingsType>({
        name: "Sam Deni Dimsum",
        address: "Jl. Dimsum Raya No. 123, Jakarta",
        phone: "0851-1778-4817",
        openHours: "11:00",
        closeHours: "21:00"
    })

    // Notification settings state
    const [notifications, setNotifications] = useState<NotificationSettingsType>({
        emailNotifications: true,
        lowStockAlert: true,
        dailySalesReport: true,
        newOrderAlert: false
    })

    // Appearance settings state
    const [appearance, setAppearance] = useState<AppTheme>("system")

    // Integration settings state
    const [integrations, setIntegrations] = useState<IntegrationSettingsType>({
        googleSheetsConnected: false,
        spreadsheetId: "",
        lastSync: null
    })

    useEffect(() => {
        setAppearance(getStoredTheme())
    }, [])

    const handleSave = async () => {
        setIsSaving(true)
        // Simulate saving
        await new Promise(resolve => setTimeout(resolve, 1000))
        storeTheme(appearance)
        applyTheme(appearance)
        setIsSaving(false)
        setShowSaved(true)
        setTimeout(() => setShowSaved(false), 2000)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.href = "/login"
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case "profile":
                return <ProfileSettings profile={profile} onProfileChange={setProfile} />
            case "business":
                return <BusinessSettings business={business} onBusinessChange={setBusiness} />
            case "notifications":
                return <NotificationSettings notifications={notifications} onNotificationsChange={setNotifications} />
            case "appearance":
                return <AppearanceSettings appearance={appearance} onAppearanceChange={setAppearance} />
            case "integrations":
                return <IntegrationSettings integrations={integrations} onIntegrationsChange={setIntegrations} />
            case "security":
                return <SecuritySettings />
            default:
                return null
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                        Pengaturan
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola preferensi akun dan aplikasi</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                >
                    {isSaving ? (
                        "Menyimpan..."
                    ) : showSaved ? (
                        <><CheckCircle className="w-4 h-4 mr-2" /> Tersimpan</>
                    ) : (
                        <><Save className="w-4 h-4 mr-2" /> Simpan Perubahan</>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <GlassCard className="p-4 bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 lg:col-span-1 h-fit">
                    <nav className="space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${activeTab === tab.id
                                    ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                        <hr className="my-3 border-slate-200 dark:border-slate-700" />
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            Keluar
                        </button>
                    </nav>
                </GlassCard>

                {/* Content Area */}
                <GlassCard className="p-6 bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 lg:col-span-3">
                    {renderTabContent()}
                </GlassCard>
            </div>
        </div>
    )
}
