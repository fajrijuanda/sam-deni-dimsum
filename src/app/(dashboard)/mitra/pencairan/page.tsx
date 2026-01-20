"use client"

import { useState, useMemo } from "react"
import {
    Wallet,
    Calendar,
    TrendingUp,
    Clock,
    CheckCircle,
    Filter
} from "lucide-react"
import { GlassCard } from "@/components/shared/GlassCard"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DISBURSEMENT_STATUS } from "@/lib/constants"
import { formatCurrency, formatDate } from "@/lib/formatting"
import type { Disbursement } from "@/lib/types"

// Mock data untuk demo
const MOCK_DISBURSEMENTS: Disbursement[] = [
    { id: "1", mitraId: "m1", month: "2026-01", amount: 15000000, status: "pending", processedAt: null, notes: null },
    { id: "2", mitraId: "m1", month: "2025-12", amount: 18500000, status: "completed", processedAt: "2026-01-05", notes: "Transfer BCA" },
    { id: "3", mitraId: "m1", month: "2025-11", amount: 16200000, status: "completed", processedAt: "2025-12-05", notes: "Transfer BCA" },
    { id: "4", mitraId: "m1", month: "2025-10", amount: 14800000, status: "completed", processedAt: "2025-11-05", notes: "Transfer BCA" },
    { id: "5", mitraId: "m1", month: "2025-09", amount: 17100000, status: "completed", processedAt: "2025-10-05", notes: "Transfer BCA" },
    { id: "6", mitraId: "m1", month: "2025-08", amount: 15900000, status: "completed", processedAt: "2025-09-05", notes: "Transfer Mandiri" },
]

const YEAR_OPTIONS = ["2026", "2025", "2024"]

export default function MitraPencairanPage() {
    const [selectedYear, setSelectedYear] = useState("2026")
    const [disbursements] = useState<Disbursement[]>(MOCK_DISBURSEMENTS)

    // Filter by year
    const filteredData = useMemo(() => {
        return disbursements.filter(d => d.month.startsWith(selectedYear))
    }, [disbursements, selectedYear])

    // Stats
    const stats = useMemo(() => {
        const yearData = disbursements.filter(d => d.month.startsWith(selectedYear))
        const completed = yearData.filter(d => d.status === "completed")
        const pending = yearData.filter(d => d.status === "pending")

        return {
            total: completed.reduce((sum, d) => sum + d.amount, 0),
            pending: pending.reduce((sum, d) => sum + d.amount, 0),
            count: yearData.length,
            completedCount: completed.length,
        }
    }, [disbursements, selectedYear])

    const getStatusBadge = (status: Disbursement["status"]) => {
        const statusConfig = DISBURSEMENT_STATUS[status]
        return (
            <Badge variant="outline" className={statusConfig.color}>
                {statusConfig.label}
            </Badge>
        )
    }

    const formatMonth = (monthStr: string) => {
        const [year, month] = monthStr.split('-')
        const date = new Date(parseInt(year), parseInt(month) - 1)
        return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    }

    return (
        <div className="space-y-6 pb-20 md:pb-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                    History Pencairan
                </h1>
                <p className="text-slate-500 mt-1">Riwayat pencairan komisi bulanan Anda</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
                <GlassCard className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white border-none">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs opacity-80">Total Cair {selectedYear}</p>
                            <p className="text-lg font-bold">{formatCurrency(stats.total)}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs opacity-80">Menunggu Cair</p>
                            <p className="text-lg font-bold">{formatCurrency(stats.pending)}</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Filter */}
            <GlassCard className="p-4 bg-white border border-slate-200">
                <div className="flex items-center gap-4">
                    <Label className="flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Tahun
                    </Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {YEAR_OPTIONS.map(year => (
                                <SelectItem key={year} value={year}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </GlassCard>

            {/* Disbursement List */}
            <GlassCard className="p-4 bg-white border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                    <Wallet className="w-5 h-5 text-red-500" />
                    <h2 className="font-semibold text-lg">Daftar Pencairan</h2>
                </div>

                <div className="space-y-3">
                    {filteredData.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            Tidak ada data pencairan untuk tahun {selectedYear}
                        </div>
                    ) : (
                        filteredData.map((disbursement) => (
                            <div
                                key={disbursement.id}
                                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${disbursement.status === "completed"
                                            ? "bg-green-100"
                                            : "bg-amber-100"
                                        }`}>
                                        {disbursement.status === "completed" ? (
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <Clock className="w-5 h-5 text-amber-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium">{formatMonth(disbursement.month)}</p>
                                        <p className="text-xs text-slate-500">
                                            {disbursement.processedAt
                                                ? `Cair: ${formatDate(disbursement.processedAt)}`
                                                : "Belum diproses"
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">{formatCurrency(disbursement.amount)}</p>
                                    {getStatusBadge(disbursement.status)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </GlassCard>

            {/* Summary */}
            <GlassCard className="p-4 bg-slate-800 text-white border-none">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm opacity-70">Total {stats.completedCount} Pencairan</p>
                        <p className="text-xs opacity-50">Tahun {selectedYear}</p>
                    </div>
                    <p className="text-2xl font-bold">{formatCurrency(stats.total)}</p>
                </div>
            </GlassCard>
        </div>
    )
}
