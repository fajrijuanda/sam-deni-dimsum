"use client"

import { useState } from "react"
import Link from "next/link"
import {
    Package,
    TrendingUp,
    TrendingDown,
    RotateCcw,
    ArrowRight,
    Calendar,
    BarChart3
} from "lucide-react"
import { GlassCard } from "@/components/shared/GlassCard"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/formatting"

// Mock data untuk demo
const MOCK_STOCK_SUMMARY = {
    todayMasuk: 150,
    todayKeluar: 120,
    todayKembali: 15,
    weekTotal: 850,
}

const RECENT_MOVEMENTS = [
    { id: "1", type: "masuk", product: "Dimsum Udang", qty: 50, date: "2026-01-20" },
    { id: "2", type: "keluar", product: "Gyoza Kukus Reguler", qty: 30, date: "2026-01-20" },
    { id: "3", type: "kembali", product: "Wonton Goreng", qty: 5, date: "2026-01-20" },
    { id: "4", type: "masuk", product: "Paket Kenyang", qty: 40, date: "2026-01-19" },
    { id: "5", type: "keluar", product: "Dimsum Keju", qty: 25, date: "2026-01-19" },
]

const getMovementStyle = (type: string) => {
    switch (type) {
        case "masuk":
            return { bg: "bg-green-100", text: "text-green-700", icon: TrendingUp }
        case "keluar":
            return { bg: "bg-blue-100", text: "text-blue-700", icon: TrendingDown }
        case "kembali":
            return { bg: "bg-amber-100", text: "text-amber-700", icon: RotateCcw }
        default:
            return { bg: "bg-slate-100", text: "text-slate-700", icon: Package }
    }
}

interface StockDashboardProps {
    role?: 'admin' | 'staff'
}

export function StockDashboard({ role = 'staff' }: StockDashboardProps) {
    const [stats] = useState(MOCK_STOCK_SUMMARY)
    const [movements] = useState(RECENT_MOVEMENTS)

    // Base URL for links
    const baseUrl = role === 'admin' ? '/admin/inventory' : '/staff/stok'

    return (
        <div className="space-y-6 pb-20 md:pb-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                    Dashboard Stok
                </h1>
                <p className="text-slate-500 mt-1">
                    {role === 'admin' ? 'Monitoring Stok Outlet & Produksi' : 'Staff Produksi - Pantau stok harian'}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
                <GlassCard className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs opacity-80">Stok Masuk Hari Ini</p>
                            <p className="text-2xl font-bold">{stats.todayMasuk} pcs</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <TrendingDown className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs opacity-80">Stok Keluar Hari Ini</p>
                            <p className="text-2xl font-bold">{stats.todayKeluar} pcs</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <RotateCcw className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs opacity-80">Stok Kembali</p>
                            <p className="text-2xl font-bold">{stats.todayKembali} pcs</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-white border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Total Minggu Ini</p>
                            <p className="text-2xl font-bold">{stats.weekTotal} pcs</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Quick Actions */}
            <GlassCard className="p-4 bg-white border border-slate-200">
                <h2 className="font-semibold text-lg mb-4">Input Stok</h2>
                <Link href={baseUrl}>
                    <Button className="w-full py-6 text-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                        <Package className="w-5 h-5 mr-2" />
                        {role === 'admin' ? 'Kelola Inventory' : 'Input Stok Sekarang'}
                    </Button>
                </Link>
            </GlassCard>

            {/* Recent Movements */}
            <GlassCard className="p-4 bg-white border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-red-500" />
                        <h2 className="font-semibold text-lg">Pergerakan Terbaru</h2>
                    </div>
                    <Link href={baseUrl} className="text-sm text-red-600 hover:underline flex items-center gap-1">
                        Lihat Semua <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="space-y-3">
                    {movements.map((movement) => {
                        const style = getMovementStyle(movement.type)
                        const Icon = style.icon
                        return (
                            <div
                                key={movement.id}
                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center`}>
                                        <Icon className={`w-4 h-4 ${style.text}`} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{movement.product}</p>
                                        <p className="text-xs text-slate-500">{formatDate(movement.date)}</p>
                                    </div>
                                </div>
                                <div className={`font-bold ${style.text}`}>
                                    {movement.type === "keluar" ? "-" : "+"}{movement.qty}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </GlassCard>
        </div>
    )
}
