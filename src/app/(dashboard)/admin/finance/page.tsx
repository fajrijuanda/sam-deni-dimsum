"use client"

import { useState, useMemo } from "react"
import {
    Calculator,
    TrendingUp,
    TrendingDown,
    DollarSign,
    CreditCard,
    Banknote,
    Calendar,
    Download,
    FileSpreadsheet,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react"
import { GlassCard } from "@/components/shared/GlassCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Mock financial data
const mockDailyData = [
    { date: "2026-01-01", cashIn: 850000, qrisIn: 320000, expenses: 150000, outlet: "Pusat" },
    { date: "2026-01-02", cashIn: 920000, qrisIn: 480000, expenses: 200000, outlet: "Pusat" },
    { date: "2026-01-03", cashIn: 780000, qrisIn: 350000, expenses: 175000, outlet: "Pusat" },
    { date: "2026-01-04", cashIn: 1100000, qrisIn: 520000, expenses: 250000, outlet: "Pusat" },
    { date: "2026-01-05", cashIn: 950000, qrisIn: 410000, expenses: 180000, outlet: "Pusat" },
    { date: "2026-01-06", cashIn: 1050000, qrisIn: 550000, expenses: 220000, outlet: "Pusat" },
]

const outlets = [
    { id: "all", name: "Semua Outlet" },
    { id: "pusat", name: "Sam Deni Dimsum - Pusat" },
    { id: "bandung", name: "Sam Deni Dimsum - Bandung" },
]

export default function FinancePage() {
    const [selectedOutlet, setSelectedOutlet] = useState("all")
    const [selectedPeriod, setSelectedPeriod] = useState("week")
    const [startDate, setStartDate] = useState("2026-01-01")
    const [endDate, setEndDate] = useState("2026-01-06")

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    // Calculate summary stats
    const stats = useMemo(() => {
        const totalCashIn = mockDailyData.reduce((sum, d) => sum + d.cashIn, 0)
        const totalQrisIn = mockDailyData.reduce((sum, d) => sum + d.qrisIn, 0)
        const totalExpenses = mockDailyData.reduce((sum, d) => sum + d.expenses, 0)
        const totalRevenue = totalCashIn + totalQrisIn
        const netProfit = totalRevenue - totalExpenses
        const profitMargin = (netProfit / totalRevenue) * 100

        // Mock comparison with previous period
        const prevRevenue = totalRevenue * 0.85
        const revenueGrowth = ((totalRevenue - prevRevenue) / prevRevenue) * 100

        return {
            totalRevenue,
            totalCashIn,
            totalQrisIn,
            totalExpenses,
            netProfit,
            profitMargin,
            revenueGrowth,
            avgDailyRevenue: totalRevenue / mockDailyData.length
        }
    }, [])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                        Laporan Keuangan
                    </h1>
                    <p className="text-slate-500 mt-1">Ringkasan keuangan dan arus kas bisnis</p>
                </div>
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                    <Download className="w-4 h-4 mr-2" /> Export Laporan
                </Button>
            </div>

            {/* Filters */}
            <GlassCard className="p-4 bg-white border border-slate-200/50">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label>Outlet</Label>
                        <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Outlet" />
                            </SelectTrigger>
                            <SelectContent>
                                {outlets.map(outlet => (
                                    <SelectItem key={outlet.id} value={outlet.id}>
                                        {outlet.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Periode</Label>
                        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Hari Ini</SelectItem>
                                <SelectItem value="week">Minggu Ini</SelectItem>
                                <SelectItem value="month">Bulan Ini</SelectItem>
                                <SelectItem value="custom">Kustom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Dari Tanggal</Label>
                        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Sampai Tanggal</Label>
                        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>
            </GlassCard>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassCard className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-80">Total Pendapatan</p>
                            <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</p>
                            <div className="flex items-center gap-1 mt-2 text-xs">
                                <ArrowUpRight className="w-3 h-3" />
                                <span>+{stats.revenueGrowth.toFixed(1)}% dari periode lalu</span>
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
                            <p className="text-sm opacity-80">Laba Bersih</p>
                            <p className="text-2xl font-bold mt-1">{formatCurrency(stats.netProfit)}</p>
                            <div className="flex items-center gap-1 mt-2 text-xs">
                                <span>Margin: {stats.profitMargin.toFixed(1)}%</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <Banknote className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Cash In</p>
                            <p className="text-xl font-bold">{formatCurrency(stats.totalCashIn)}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">QRIS In</p>
                            <p className="text-xl font-bold">{formatCurrency(stats.totalQrisIn)}</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Expenses & Avg Daily */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <GlassCard className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white border-none shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-80">Total Pengeluaran</p>
                            <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalExpenses)}</p>
                            <p className="text-xs mt-2 opacity-70">Biaya operasional, bahan baku, dll.</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-amber-400 to-amber-500 text-amber-900 border-none shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-80">Rata-rata Harian</p>
                            <p className="text-2xl font-bold mt-1">{formatCurrency(stats.avgDailyRevenue)}</p>
                            <p className="text-xs mt-2 opacity-70">Pendapatan per hari</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-white/30 flex items-center justify-center">
                            <Calendar className="w-6 h-6" />
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Daily Breakdown Table */}
            <GlassCard className="p-4 bg-white border border-slate-200/50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5 text-slate-500" />
                        <h3 className="font-semibold text-lg">Rincian Harian</h3>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-2 text-sm font-medium text-slate-500">Tanggal</th>
                                <th className="text-right py-3 px-2 text-sm font-medium text-slate-500">Cash</th>
                                <th className="text-right py-3 px-2 text-sm font-medium text-slate-500">QRIS</th>
                                <th className="text-right py-3 px-2 text-sm font-medium text-slate-500">Total</th>
                                <th className="text-right py-3 px-2 text-sm font-medium text-slate-500">Pengeluaran</th>
                                <th className="text-right py-3 px-2 text-sm font-medium text-slate-500">Netto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockDailyData.map((row, idx) => {
                                const total = row.cashIn + row.qrisIn
                                const netto = total - row.expenses
                                return (
                                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="py-3 px-2 text-sm font-medium">
                                            {new Date(row.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                                        </td>
                                        <td className="py-3 px-2 text-sm text-right text-green-600">{formatCurrency(row.cashIn)}</td>
                                        <td className="py-3 px-2 text-sm text-right text-blue-600">{formatCurrency(row.qrisIn)}</td>
                                        <td className="py-3 px-2 text-sm text-right font-medium">{formatCurrency(total)}</td>
                                        <td className="py-3 px-2 text-sm text-right text-red-600">{formatCurrency(row.expenses)}</td>
                                        <td className="py-3 px-2 text-sm text-right font-bold text-slate-800">{formatCurrency(netto)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="bg-slate-50 font-semibold">
                                <td className="py-3 px-2 text-sm">TOTAL</td>
                                <td className="py-3 px-2 text-sm text-right text-green-600">{formatCurrency(stats.totalCashIn)}</td>
                                <td className="py-3 px-2 text-sm text-right text-blue-600">{formatCurrency(stats.totalQrisIn)}</td>
                                <td className="py-3 px-2 text-sm text-right">{formatCurrency(stats.totalRevenue)}</td>
                                <td className="py-3 px-2 text-sm text-right text-red-600">{formatCurrency(stats.totalExpenses)}</td>
                                <td className="py-3 px-2 text-sm text-right font-bold">{formatCurrency(stats.netProfit)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </GlassCard>
        </div>
    )
}
