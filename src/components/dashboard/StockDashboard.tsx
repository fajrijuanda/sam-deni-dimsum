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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data items
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
    { id: "6", type: "masuk", product: "Lumpia Kulit Tahu", qty: 30, date: "2026-01-19" },
    { id: "7", type: "keluar", product: "Ekado Puyuh", qty: 20, date: "2026-01-19" },
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
                    <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md">
                        <Package className="w-4 h-4 mr-2" />
                        {role === 'admin' ? 'Kelola Inventory' : 'Input Stok'}
                    </Button>
                </Link>
            </div>

            {/* Stats Cards - Responsive Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <GlassCard className="p-4 md:p-6 bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg transform transition-all hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                            <p className="text-xs md:text-sm opacity-80 font-medium mb-1">Stok Masuk</p>
                            <p className="text-xl md:text-3xl font-bold">{stats.todayMasuk}</p>
                        </div>
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/20 flex items-center justify-center self-end md:self-center">
                            <TrendingUp className="w-4 h-4 md:w-6 md:h-6" />
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 md:p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg transform transition-all hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                            <p className="text-xs md:text-sm opacity-80 font-medium mb-1">Stok Keluar</p>
                            <p className="text-xl md:text-3xl font-bold">{stats.todayKeluar}</p>
                        </div>
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/20 flex items-center justify-center self-end md:self-center">
                            <TrendingDown className="w-4 h-4 md:w-6 md:h-6" />
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 md:p-6 bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none shadow-lg transform transition-all hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                            <p className="text-xs md:text-sm opacity-80 font-medium mb-1">Stok Kembali</p>
                            <p className="text-xl md:text-3xl font-bold">{stats.todayKembali}</p>
                        </div>
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/20 flex items-center justify-center self-end md:self-center">
                            <RotateCcw className="w-4 h-4 md:w-6 md:h-6" />
                        </div>
                    </div>
                </GlassCard>

                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-2 h-full">
                        <div>
                            <p className="text-xs md:text-sm text-slate-500 font-medium mb-1">Total Minggu Ini</p>
                            <p className="text-xl md:text-3xl font-bold text-slate-800">{stats.weekTotal}</p>
                        </div>
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-purple-100 flex items-center justify-center self-end md:self-center">
                            <BarChart3 className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Movements Section */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Calendar className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-800">Pergerakan Terbaru</CardTitle>
                            <p className="text-sm text-slate-500">History pergerakan stok hari ini</p>
                        </div>
                    </div>
                    <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" asChild>
                        <Link href={baseUrl}>
                            Lihat Semua <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </CardHeader>

                {/* Mobile View (List) */}
                <div className="md:hidden divide-y divide-slate-100">
                    {movements.map((movement) => {
                        const style = getMovementStyle(movement.type)
                        const Icon = style.icon
                        return (
                            <div
                                key={movement.id}
                                className="flex items-center justify-between p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg ${style.bg} flex items-center justify-center shrink-0`}>
                                        <Icon className={`w-5 h-5 ${style.text}`} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-slate-900">{movement.product}</p>
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Waktu</TableHead>
                                <TableHead className="w-[150px]">Tipe</TableHead>
                                <TableHead>Produk</TableHead>
                                <TableHead className="text-right">Jumlah</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {movements.map((movement) => {
                                const style = getMovementStyle(movement.type)
                                const Icon = style.icon
                                return (
                                    <TableRow key={movement.id} className="cursor-pointer hover:bg-slate-50">
                                        <TableCell className="font-medium text-slate-600">
                                            {formatDate(movement.date)}
                                        </TableCell>
                                        <TableCell>
                                            <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
                                                <Icon className="w-3 h-3" />
                                                <span className="capitalize">{movement.type}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-900 font-medium">
                                            {movement.product}
                                        </TableCell>
                                        <TableCell className={`text-right font-bold ${style.text}`}>
                                            {movement.type === "keluar" ? "-" : "+"}{movement.qty}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}
