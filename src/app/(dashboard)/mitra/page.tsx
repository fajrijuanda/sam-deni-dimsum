"use client"

import Link from "next/link"
import {
    Home,
    TrendingUp,
    Clock,
    Wallet,
    ArrowRight,
    Package,
    BarChart3
} from "lucide-react"
import { GlassCard } from "@/components/shared/GlassCard"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/formatting"

// Mock data
const MOCK_STATS = {
    totalPencairan: 97500000,
    pendingPencairan: 15000000,
    totalPenjualan: 125000000,
    produkTerjual: 4500,
}

const RECENT_DISBURSEMENTS = [
    { month: "Januari 2026", amount: 15000000, status: "pending" },
    { month: "Desember 2025", amount: 18500000, status: "completed" },
    { month: "November 2025", amount: 16200000, status: "completed" },
]

export default function MitraDashboard() {
    return (
        <div className="space-y-6 pb-20 md:pb-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                    Dashboard Mitra
                </h1>
                <p className="text-slate-500 mt-1">Selamat datang, Partner. Pantau performa Anda di sini.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
                <GlassCard className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs opacity-80">Total Pencairan</p>
                            <p className="text-lg font-bold">{formatCurrency(MOCK_STATS.totalPencairan)}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs opacity-80">Menunggu Cair</p>
                            <p className="text-lg font-bold">{formatCurrency(MOCK_STATS.pendingPencairan)}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-white border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Total Penjualan</p>
                            <p className="text-lg font-bold">{formatCurrency(MOCK_STATS.totalPenjualan)}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-white border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Package className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Produk Terjual</p>
                            <p className="text-lg font-bold">{MOCK_STATS.produkTerjual.toLocaleString()} pcs</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Quick Actions */}
            <GlassCard className="p-4 bg-white border border-slate-200">
                <h2 className="font-semibold text-lg mb-4">Menu Cepat</h2>
                <div className="grid grid-cols-2 gap-3">
                    <Link href="/mitra/pencairan">
                        <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                            <Wallet className="w-6 h-6 text-red-500" />
                            <span className="text-sm">History Pencairan</span>
                        </Button>
                    </Link>
                    <Link href="/settings">
                        <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                            <Home className="w-6 h-6 text-slate-500" />
                            <span className="text-sm">Pengaturan</span>
                        </Button>
                    </Link>
                </div>
            </GlassCard>

            {/* Recent Disbursements */}
            <GlassCard className="p-4 bg-white border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-red-500" />
                        <h2 className="font-semibold text-lg">Pencairan Terbaru</h2>
                    </div>
                    <Link href="/mitra/pencairan" className="text-sm text-red-600 hover:underline flex items-center gap-1">
                        Lihat Semua <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="space-y-3">
                    {RECENT_DISBURSEMENTS.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                        >
                            <div>
                                <p className="font-medium text-sm">{item.month}</p>
                                <p className={`text-xs ${item.status === "completed" ? "text-green-600" : "text-amber-600"
                                    }`}>
                                    {item.status === "completed" ? "Sudah cair" : "Menunggu"}
                                </p>
                            </div>
                            <p className="font-bold">{formatCurrency(item.amount)}</p>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    )
}
