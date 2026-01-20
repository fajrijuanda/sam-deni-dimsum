"use client"

import { Bell, Mail, AlertCircle, FileSpreadsheet } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import type { NotificationSettings as NotificationSettingsType } from "@/lib/types"

interface NotificationSettingsProps {
    notifications: NotificationSettingsType
    onNotificationsChange: (notifications: NotificationSettingsType) => void
}

interface NotificationItemProps {
    icon: React.ComponentType<{ className?: string }>
    title: string
    description: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
}

function NotificationItem({
    icon: Icon,
    title,
    description,
    checked,
    onCheckedChange
}: NotificationItemProps) {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-slate-500" />
                <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-sm text-slate-500">{description}</p>
                </div>
            </div>
            <Switch checked={checked} onCheckedChange={onCheckedChange} />
        </div>
    )
}

export function NotificationSettings({
    notifications,
    onNotificationsChange
}: NotificationSettingsProps) {
    const handleChange = (field: keyof NotificationSettingsType, value: boolean) => {
        onNotificationsChange({ ...notifications, [field]: value })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-semibold">Preferensi Notifikasi</h2>
            </div>

            <div className="space-y-4">
                <NotificationItem
                    icon={Mail}
                    title="Notifikasi Email"
                    description="Terima notifikasi via email"
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => handleChange("emailNotifications", checked)}
                />

                <NotificationItem
                    icon={AlertCircle}
                    title="Peringatan Stok Rendah"
                    description="Notifikasi saat stok menipis"
                    checked={notifications.lowStockAlert}
                    onCheckedChange={(checked) => handleChange("lowStockAlert", checked)}
                />

                <NotificationItem
                    icon={FileSpreadsheet}
                    title="Laporan Penjualan Harian"
                    description="Kirim ringkasan setiap hari"
                    checked={notifications.dailySalesReport}
                    onCheckedChange={(checked) => handleChange("dailySalesReport", checked)}
                />
            </div>
        </div>
    )
}
