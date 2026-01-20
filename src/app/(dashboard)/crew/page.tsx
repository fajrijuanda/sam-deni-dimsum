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
        <div className="space-y-6 pb-20 md:pb-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                    Dashboard Penjualan
                </h1>
                <p className="text-slate-500 mt-1">Crew Outlet - Pantau penjualan harian</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
                <GlassCard className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs opacity-80">Penjualan Hari Ini</p>
                            <p className="text-lg font-bold">{formatCurrency(stats.todaySales)}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs opacity-80">Item Terjual Hari Ini</p>
                            <p className="text-2xl font-bold">{stats.todayItems} pcs</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs opacity-80">Total Minggu Ini</p>
                            <p className="text-lg font-bold">{formatCurrency(stats.weekSales)}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-white border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Produk Terlaris</p>
                            <p className="text-sm font-bold">{stats.topProduct}</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Quick Actions */}
            <GlassCard className="p-4 bg-white border border-slate-200">
                <h2 className="font-semibold text-lg mb-4">Input Penjualan</h2>
                <Link href="/crew/penjualan">
                    <Button className="w-full py-6 text-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                        <ClipboardList className="w-5 h-5 mr-2" />
                        Input Penjualan Sekarang
                    </Button>
                </Link>
            </GlassCard>

            {/* Recent Sales */}
            <GlassCard className="p-4 bg-white border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-red-500" />
                        <h2 className="font-semibold text-lg">Penjualan Terbaru</h2>
                    </div>
                    <Link href="/crew/penjualan" className="text-sm text-red-600 hover:underline flex items-center gap-1">
                        Lihat Semua <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="space-y-3">
                    {sales.map((sale) => (
                        <div
                            key={sale.id}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                    <ShoppingCart className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{sale.product}</p>
                                    <p className="text-xs text-slate-500">{formatDate(sale.date)} • {sale.qty} pcs</p>
                                </div>
                            </div>
                            <p className="font-bold text-green-600">{formatCurrency(sale.amount)}</p>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    )
}
