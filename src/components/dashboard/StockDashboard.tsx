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
        <div className="space-y-8">
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                        Dashboard Stok
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {role === 'admin' ? 'Monitoring Stok Outlet & Produksi' : 'Staff Produksi - Pantau stok harian'}
                    </p>
                </div>

                <Link href={baseUrl}>
                    <Button className="w-full md:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md">
                        <Package className="w-4 h-4 mr-2" />
                        {role === 'admin' ? 'Kelola Inventory' : 'Input Stok'}
                    </Button>
                </Link>
            </div>

            {/* Stats Cards - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassCard className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg transform transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs opacity-80 font-medium">Stok Masuk</p>
                            <p className="text-2xl font-bold">{stats.todayMasuk} pcs</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg transform transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <TrendingDown className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs opacity-80 font-medium">Stok Keluar</p>
                            <p className="text-2xl font-bold">{stats.todayKeluar} pcs</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none shadow-lg transform transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <RotateCcw className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs opacity-80 font-medium">Stok Kembali</p>
                            <p className="text-2xl font-bold">{stats.todayKembali} pcs</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transform transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Minggu Ini</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.weekTotal} pcs</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Recent Movements Section */}
            <GlassCard className="p-0 overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-red-500" />
                        <h2 className="font-semibold text-lg text-slate-900 dark:text-white">Pergerakan Terbaru</h2>
                    </div>
                    <Link href={baseUrl} className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 transition-colors">
                        Lihat Semua <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Mobile View (List) */}
                <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700">
                    {movements.map((movement) => {
                        const style = getMovementStyle(movement.type)
                        const Icon = style.icon
                        return (
                            <div
                                key={movement.id}
                                className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg ${style.bg} flex items-center justify-center shrink-0`}>
                                        <Icon className={`w-5 h-5 ${style.text}`} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-slate-900 dark:text-white">{movement.product}</p>
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

                {/* Desktop View (Table) */}
                <div className="hidden md:block">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3">Waktu</th>
                                <th className="px-6 py-3">Tipe</th>
                                <th className="px-6 py-3">Produk</th>
                                <th className="px-6 py-3 text-right">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {movements.map((movement) => {
                                const style = getMovementStyle(movement.type)
                                const Icon = style.icon
                                return (
                                    <tr key={movement.id} className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                            {formatDate(movement.date)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded-full ${style.bg} flex items-center justify-center`}>
                                                    <Icon className={`w-3 h-3 ${style.text}`} />
                                                </div>
                                                <span className={`capitalize ${style.text} font-medium`}>{movement.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            {movement.product}
                                        </td>
                                        <td className={`px-6 py-4 text-right font-bold ${style.text}`}>
                                            {movement.type === "keluar" ? "-" : "+"}{movement.qty}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    )
}
