"use client"

import { useState, useMemo } from "react"
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    ShoppingCart,
    Users,
    Store,
    Package,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Flame,
    Award
} from "lucide-react"
import { GlassCard } from "@/components/shared/GlassCard"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Mock analytics data
const topProducts = [
    { name: "Paket Reguler", sold: 245, revenue: 2450000, growth: 12.5 },
    { name: "Paket Kenyang", sold: 180, revenue: 3600000, growth: 8.3 },
    { name: "Gyoza Kukus Reguler", sold: 156, revenue: 1560000, growth: -2.1 },
    { name: "Dimsum Mentai", sold: 98, revenue: 2940000, growth: 25.4 },
    { name: "Wonton Kuah", sold: 87, revenue: 870000, growth: 5.7 },
]

const outletPerformance = [
    { name: "Sam Deni - Pusat", revenue: 8500000, transactions: 425, avgTicket: 20000 },
    { name: "Sam Deni - Bandung", revenue: 6200000, transactions: 310, avgTicket: 20000 },
]

const weeklyTrend = [
    { day: "Sen", sales: 1200000 },
    { day: "Sel", sales: 1400000 },
    { day: "Rab", sales: 1100000 },
    { day: "Kam", sales: 1600000 },
    { day: "Jum", sales: 1800000 },
    { day: "Sab", sales: 2200000 },
    { day: "Min", sales: 2400000 },
]

export default function AnalyticsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState("week")

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const stats = useMemo(() => {
        const totalSales = weeklyTrend.reduce((sum, d) => sum + d.sales, 0)
        const totalTransactions = outletPerformance.reduce((sum, o) => sum + o.transactions, 0)
        const totalProductsSold = topProducts.reduce((sum, p) => sum + p.sold, 0)
        const avgTicketSize = totalSales / totalTransactions

        return {
            totalSales,
            totalTransactions,
            totalProductsSold,
            avgTicketSize,
            salesGrowth: 15.3,
            transactionGrowth: 8.7
        }
    }, [])

    const maxSales = Math.max(...weeklyTrend.map(d => d.sales))

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                        Analytics
                    </h1>
                    <p className="text-slate-500 mt-1">Insight performa bisnis dan tren penjualan</p>
                </div>
                <div className="flex items-center gap-2">
                    <Label className="text-sm text-slate-500">Periode:</Label>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Hari Ini</SelectItem>
                            <SelectItem value="week">Minggu Ini</SelectItem>
                            <SelectItem value="month">Bulan Ini</SelectItem>
                            <SelectItem value="year">Tahun Ini</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassCard className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white border-none shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-80">Total Penjualan</p>
                            <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalSales)}</p>
                            <div className="flex items-center gap-1 mt-2 text-xs">
                                <ArrowUpRight className="w-3 h-3" />
                                <span>+{stats.salesGrowth}%</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-80">Total Transaksi</p>
                            <p className="text-2xl font-bold mt-1">{stats.totalTransactions}</p>
                            <div className="flex items-center gap-1 mt-2 text-xs">
                                <ArrowUpRight className="w-3 h-3" />
                                <span>+{stats.transactionGrowth}%</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Item Terjual</p>
                            <p className="text-xl font-bold">{stats.totalProductsSold} pcs</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Avg. Ticket</p>
                            <p className="text-xl font-bold">{formatCurrency(stats.avgTicketSize)}</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Sales Trend */}
                <GlassCard className="p-4 bg-white border border-slate-200/50">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="w-5 h-5 text-red-500" />
                        <h3 className="font-semibold text-lg">Tren Penjualan Mingguan</h3>
                    </div>
                    <div className="flex items-end justify-between gap-2 h-48 pt-4">
                        {weeklyTrend.map((day, idx) => {
                            const height = (day.sales / maxSales) * 100
                            return (
                                <div key={idx} className="flex flex-col items-center flex-1">
                                    <div
                                        className="w-full bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg transition-all hover:from-red-600 hover:to-red-500 cursor-pointer"
                                        style={{ height: `${height}%` }}
                                        title={formatCurrency(day.sales)}
                                    />
                                    <span className="text-xs text-slate-500 mt-2">{day.day}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-sm">
                        <span className="text-slate-500">Total: <span className="font-semibold text-slate-800">{formatCurrency(stats.totalSales)}</span></span>
                        <span className="text-green-600 flex items-center gap-1">
                            <ArrowUpRight className="w-4 h-4" /> 15.3% vs minggu lalu
                        </span>
                    </div>
                </GlassCard>

                {/* Top Products */}
                <GlassCard className="p-4 bg-white border border-slate-200/50">
                    <div className="flex items-center gap-2 mb-4">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <h3 className="font-semibold text-lg">Produk Terlaris</h3>
                    </div>
                    <div className="space-y-3">
                        {topProducts.map((product, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${idx === 0 ? 'bg-amber-400 text-amber-900' :
                                            idx === 1 ? 'bg-slate-300 text-slate-700' :
                                                idx === 2 ? 'bg-amber-600 text-amber-100' :
                                                    'bg-slate-200 text-slate-600'
                                        }`}>
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{product.name}</p>
                                        <p className="text-xs text-slate-500">{product.sold} terjual</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-sm">{formatCurrency(product.revenue)}</p>
                                    <p className={`text-xs flex items-center justify-end gap-1 ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                        {Math.abs(product.growth)}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            {/* Outlet Performance */}
            <GlassCard className="p-4 bg-white border border-slate-200/50">
                <div className="flex items-center gap-2 mb-4">
                    <Store className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-lg">Performa per Outlet</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {outletPerformance.map((outlet, idx) => (
                        <div key={idx} className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold">{outlet.name}</h4>
                                {idx === 0 && (
                                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full flex items-center gap-1">
                                        <Award className="w-3 h-3" /> Top Outlet
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-slate-500">Revenue</p>
                                    <p className="font-bold text-green-600">{formatCurrency(outlet.revenue)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Transaksi</p>
                                    <p className="font-bold text-blue-600">{outlet.transactions}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Avg Ticket</p>
                                    <p className="font-bold text-slate-700">{formatCurrency(outlet.avgTicket)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    )
}
