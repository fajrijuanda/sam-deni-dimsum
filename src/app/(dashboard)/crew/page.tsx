"use client"

import { useState } from "react"
import Link from "next/link"
import {
    ShoppingCart,
    TrendingUp,
    Package,
    ArrowRight,
    Calendar,
    DollarSign,
    ClipboardList
} from "lucide-react"
import { GlassCard } from "@/components/shared/GlassCard"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/formatting"

// Mock data untuk demo
const MOCK_SALES_SUMMARY = {
    todaySales: 2500000,
    todayItems: 85,
    weekSales: 15000000,
    topProduct: "Paket Kenyang",
}

const RECENT_SALES = [
    { id: "1", product: "Paket Kenyang", qty: 15, amount: 300000, date: "2026-01-20" },
    { id: "2", product: "Gyoza Goreng Reguler", qty: 20, amount: 200000, date: "2026-01-20" },
    { id: "3", product: "Dimsum Udang", qty: 25, amount: 250000, date: "2026-01-20" },
    { id: "4", product: "Wonton Kuah", qty: 12, amount: 120000, date: "2026-01-19" },
    { id: "5", product: "Paket Reguler", qty: 18, amount: 180000, date: "2026-01-19" },
]

export default function CrewDashboard() {
    const [stats] = useState(MOCK_SALES_SUMMARY)
    const [sales] = useState(RECENT_SALES)

    return (
        <div className="space-y-8">
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                        Dashboard Penjualan
                    </h1>
                    <p className="text-slate-500 mt-1">Crew Outlet - Pantau penjualan harian</p>
                </div>

                <Link href="/crew/penjualan">
                    <Button className="w-full md:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg">
                        <ClipboardList className="w-4 h-4 mr-2" />
                        Input Penjualan
                    </Button>
                </Link>
            </div>

            {/* Stats Cards - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassCard className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg transform transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs opacity-80 font-medium">Penjualan Hari Ini</p>
                            <p className="text-lg font-bold">{formatCurrency(stats.todaySales)}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg transform transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs opacity-80 font-medium">Item Terjual</p>
                            <p className="text-2xl font-bold">{stats.todayItems} pcs</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow-lg transform transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs opacity-80 font-medium">Total Minggu Ini</p>
                            <p className="text-lg font-bold">{formatCurrency(stats.weekSales)}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transform transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Produk Terlaris</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[120px]" title={stats.topProduct}>
                                {stats.topProduct}
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Recent Sales Section */}
            <GlassCard className="p-0 overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-red-500" />
                        <h2 className="font-semibold text-lg text-slate-900 dark:text-white">Penjualan Terbaru</h2>
                    </div>
                    <Link href="/crew/penjualan" className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 transition-colors">
                        Lihat Semua <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Mobile View (List) */}
                <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700">
                    {sales.map((sale) => (
                        <div
                            key={sale.id}
                            className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                    <ShoppingCart className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-slate-900 dark:text-white">{sale.product}</p>
                                    <p className="text-xs text-slate-500">{formatDate(sale.date)} • {sale.qty} pcs</p>
                                </div>
                            </div>
                            <p className="font-bold text-green-600 dark:text-green-400">{formatCurrency(sale.amount)}</p>
                        </div>
                    ))}
                </div>

                {/* Desktop View (Table) */}
                <div className="hidden md:block">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3">Tanggal</th>
                                <th className="px-6 py-3">Produk</th>
                                <th className="px-6 py-3 text-center">Qty</th>
                                <th className="px-6 py-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {sales.map((sale) => (
                                <tr key={sale.id} className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                        {formatDate(sale.date)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                        {sale.product}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800">
                                            {sale.qty} pcs
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-green-600 dark:text-green-400">
                                        {formatCurrency(sale.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    )
}

function Badge({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
            {children}
        </span>
    )
}
