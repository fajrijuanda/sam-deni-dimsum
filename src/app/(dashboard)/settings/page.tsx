"use client"

import { useState, useEffect } from "react"
import {
    Settings,
    User,
    Bell,
    Shield,
    Palette,
    Database,
    Globe,
    Moon,
    Sun,
    Save,
    LogOut,
    Key,
    Mail,
    Building2,
    Phone,
    FileSpreadsheet,
    CheckCircle,
    AlertCircle
} from "lucide-react"
import { GlassCard } from "@/components/shared/GlassCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase-browser"

export default function SettingsPage() {
    const supabase = createClient()
    const [activeTab, setActiveTab] = useState("profile")
    const [isSaving, setIsSaving] = useState(false)
    const [showSaved, setShowSaved] = useState(false)

    // Profile settings
    const [profile, setProfile] = useState({
        name: "Admin Sam Deni",
        email: "admin@samdenidimsum.com",
        phone: "0851-1778-4817",
        role: "Super Admin"
    })

    // Business settings
    const [business, setBusiness] = useState({
        name: "Sam Deni Dimsum",
        address: "Jl. Dimsum Raya No. 123, Jakarta",
        phone: "0851-1778-4817",
        openHours: "11:00",
        closeHours: "21:00"
    })

    // Notification settings
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        lowStockAlert: true,
        dailySalesReport: true,
        newOrderAlert: false
    })

    // Appearance settings
    const [appearance, setAppearance] = checkTheme("light")

    function checkTheme(defaultTheme: string) {
        return useState(defaultTheme)
    }

    // Integration settings
    const [integrations, setIntegrations] = useState({
        googleSheetsConnected: false,
        spreadsheetId: "",
        lastSync: null as string | null
    })

    const tabs = [
        { id: "profile", label: "Profil", icon: User },
        { id: "business", label: "Bisnis", icon: Building2 },
        { id: "notifications", label: "Notifikasi", icon: Bell },
        { id: "appearance", label: "Tampilan", icon: Palette },
        { id: "integrations", label: "Integrasi", icon: Database },
        { id: "security", label: "Keamanan", icon: Shield },
    ]

    const handleSave = async () => {
        setIsSaving(true)
        // Simulate saving
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
        setShowSaved(true)
        setTimeout(() => setShowSaved(false), 2000)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.href = "/login"
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                        Pengaturan
                    </h1>
                    <p className="text-slate-500 mt-1">Kelola preferensi akun dan aplikasi</p>
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
                <GlassCard className="p-4 bg-white border border-slate-200/50 lg:col-span-1 h-fit">
                    <nav className="space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${activeTab === tab.id
                                        ? 'bg-red-50 text-red-600 font-medium'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                        <hr className="my-3 border-slate-200" />
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            Keluar
                        </button>
                    </nav>
                </GlassCard>

                {/* Content Area */}
                <GlassCard className="p-6 bg-white border border-slate-200/50 lg:col-span-3">
                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <User className="w-5 h-5 text-red-500" />
                                <h2 className="text-lg font-semibold">Profil Pengguna</h2>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-2xl font-bold">
                                    {profile.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold">{profile.name}</p>
                                    <p className="text-sm text-slate-500">{profile.role}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nama Lengkap</Label>
                                    <Input
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nomor Telepon</Label>
                                    <Input
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Input value={profile.role} disabled className="bg-slate-100" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Business Tab */}
                    {activeTab === "business" && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Building2 className="w-5 h-5 text-red-500" />
                                <h2 className="text-lg font-semibold">Informasi Bisnis</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Nama Bisnis</Label>
                                    <Input
                                        value={business.name}
                                        onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Alamat</Label>
                                    <Input
                                        value={business.address}
                                        onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Telepon Bisnis</Label>
                                    <Input
                                        value={business.phone}
                                        onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Jam Buka</Label>
                                        <Input
                                            type="time"
                                            value={business.openHours}
                                            onChange={(e) => setBusiness({ ...business, openHours: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Jam Tutup</Label>
                                        <Input
                                            type="time"
                                            value={business.closeHours}
                                            onChange={(e) => setBusiness({ ...business, closeHours: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === "notifications" && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Bell className="w-5 h-5 text-red-500" />
                                <h2 className="text-lg font-semibold">Preferensi Notifikasi</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-slate-500" />
                                        <div>
                                            <p className="font-medium">Notifikasi Email</p>
                                            <p className="text-sm text-slate-500">Terima notifikasi via email</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={notifications.emailNotifications}
                                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5 text-slate-500" />
                                        <div>
                                            <p className="font-medium">Peringatan Stok Rendah</p>
                                            <p className="text-sm text-slate-500">Notifikasi saat stok menipis</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={notifications.lowStockAlert}
                                        onCheckedChange={(checked) => setNotifications({ ...notifications, lowStockAlert: checked })}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <FileSpreadsheet className="w-5 h-5 text-slate-500" />
                                        <div>
                                            <p className="font-medium">Laporan Penjualan Harian</p>
                                            <p className="text-sm text-slate-500">Kirim ringkasan setiap hari</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={notifications.dailySalesReport}
                                        onCheckedChange={(checked) => setNotifications({ ...notifications, dailySalesReport: checked })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Appearance Tab */}
                    {activeTab === "appearance" && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Palette className="w-5 h-5 text-red-500" />
                                <h2 className="text-lg font-semibold">Tampilan</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label className="mb-3 block">Tema Aplikasi</Label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <button
                                            onClick={() => setAppearance("light")}
                                            className={`p-4 rounded-lg border-2 transition-all ${appearance === 'light' ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <Sun className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                                            <p className="text-sm font-medium text-center">Light</p>
                                        </button>
                                        <button
                                            onClick={() => setAppearance("dark")}
                                            className={`p-4 rounded-lg border-2 transition-all ${appearance === 'dark' ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <Moon className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                                            <p className="text-sm font-medium text-center">Dark</p>
                                        </button>
                                        <button
                                            onClick={() => setAppearance("system")}
                                            className={`p-4 rounded-lg border-2 transition-all ${appearance === 'system' ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <Settings className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                                            <p className="text-sm font-medium text-center">System</p>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Bahasa</Label>
                                    <Select defaultValue="id">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="id">🇮🇩 Bahasa Indonesia</SelectItem>
                                            <SelectItem value="en">🇬🇧 English</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Integrations Tab */}
                    {activeTab === "integrations" && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Database className="w-5 h-5 text-red-500" />
                                <h2 className="text-lg font-semibold">Integrasi</h2>
                            </div>

                            <div className="p-4 border border-slate-200 rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <FileSpreadsheet className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Google Sheets</p>
                                            <p className="text-sm text-slate-500">Sinkronisasi data ke spreadsheet</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${integrations.googleSheetsConnected
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {integrations.googleSheetsConnected ? 'Terhubung' : 'Tidak Terhubung'}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <Label>Spreadsheet ID</Label>
                                        <Input
                                            placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                                            value={integrations.spreadsheetId}
                                            onChange={(e) => setIntegrations({ ...integrations, spreadsheetId: e.target.value })}
                                        />
                                    </div>
                                    <Button variant="outline" className="w-full">
                                        {integrations.googleSheetsConnected ? 'Putuskan Koneksi' : 'Hubungkan Google Sheets'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === "security" && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className="w-5 h-5 text-red-500" />
                                <h2 className="text-lg font-semibold">Keamanan</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 border border-slate-200 rounded-lg">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Key className="w-5 h-5 text-slate-500" />
                                        <div>
                                            <p className="font-medium">Ubah Password</p>
                                            <p className="text-sm text-slate-500">Perbarui password akun Anda</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <Label>Password Lama</Label>
                                            <Input type="password" placeholder="••••••••" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Password Baru</Label>
                                            <Input type="password" placeholder="••••••••" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Konfirmasi Password Baru</Label>
                                            <Input type="password" placeholder="••••••••" />
                                        </div>
                                        <Button variant="outline" className="w-full">
                                            Ubah Password
                                        </Button>
                                    </div>
                                </div>

                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="font-medium text-red-700 mb-2">Zona Berbahaya</p>
                                    <p className="text-sm text-red-600 mb-3">Tindakan ini tidak dapat dibatalkan.</p>
                                    <Button variant="destructive" className="w-full">
                                        Hapus Akun
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </GlassCard>
            </div>
        </div>
    )
}
