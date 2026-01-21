"use client"

import { useState, useRef, useMemo } from "react"
import { Plus, Upload, Calendar, TrendingUp, TrendingDown, DollarSign, Store, Filter } from "lucide-react"
import { GlassCard } from "@/components/shared/GlassCard"
import { DataTable } from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Type for Sales Record
interface SalesRecord {
    id: string
    date: string
    outletName: string
    cashIn: number      // Total Cash In (+Qris)
    cashValue?: number  // Cash component
    qrisValue?: number  // Qris component
    cashOut: number     // Total Cash Out
    netIncome: number   // Pemasukan Bersih
    createdAt: string
}

interface WeeklySales {
    id: string
    week: string
    cashIn: number
    cashOut: number
    netIncome: number
    count: number
}

interface MonthlySales {
    id: string
    month: string
    cashIn: number
    cashOut: number
    netIncome: number
    count: number
}

// Mock data
const initialSales: SalesRecord[] = [
    { id: "1", date: "2025-12-07", outletName: "Sam Deni Dimsum - Pusat", cashIn: 280000, cashValue: 180000, qrisValue: 100000, cashOut: 44000, netIncome: 236000, createdAt: "2025-12-07" },
    { id: "2", date: "2025-12-06", outletName: "Sam Deni Dimsum - Pusat", cashIn: 395000, cashValue: 300000, qrisValue: 95000, cashOut: 0, netIncome: 395000, createdAt: "2025-12-06" },
    { id: "3", date: "2025-12-05", outletName: "Sam Deni Dimsum - Pusat", cashIn: 510000, cashValue: 400000, qrisValue: 110000, cashOut: 13000, netIncome: 497000, createdAt: "2025-12-05" },
    { id: "4", date: "2025-12-04", outletName: "Sam Deni Dimsum - Pusat", cashIn: 169000, cashValue: 100000, qrisValue: 69000, cashOut: 0, netIncome: 169000, createdAt: "2025-12-04" },
    { id: "5", date: "2025-12-03", outletName: "Sam Deni Dimsum - Pusat", cashIn: 330000, cashValue: 330000, qrisValue: 0, cashOut: 0, netIncome: 330000, createdAt: "2025-12-03" },
]

// Mock outlets
const outlets = [
    { id: "1", name: "Sam Deni Dimsum - Pusat" },
    { id: "2", name: "Sam Deni Dimsum - Bandung" },
    { id: "3", name: "Sam Deni Dimsum - Surabaya" },
]

export default function SalesPage() {
    const [sales, setSales] = useState<SalesRecord[]>(initialSales)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("daily")
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Date filter state
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        outletId: "",
        cashValue: "",
        qrisValue: "",
        cashOut: "",
    })

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const formatMonth = (monthStr: string) => {
        const [year, month] = monthStr.split('-')
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('id-ID', {
            month: 'long',
            year: 'numeric'
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const outlet = outlets.find(o => o.id === formData.outletId)
        if (!outlet) return

        const cashValue = parseFloat(formData.cashValue) || 0
        const qrisValue = parseFloat(formData.qrisValue) || 0
        const cashOut = parseFloat(formData.cashOut) || 0
        const cashIn = cashValue + qrisValue // Auto calculate total

        const newSale: SalesRecord = {
            id: Date.now().toString(),
            date: formData.date,
            outletName: outlet.name,
            cashIn,
            cashValue,
            qrisValue,
            cashOut,
            netIncome: cashIn - cashOut,
            createdAt: new Date().toISOString().split('T')[0],
        }

        setSales([newSale, ...sales])
        setIsDialogOpen(false)
        setFormData({
            date: new Date().toISOString().split('T')[0],
            outletId: "",
            cashValue: "",
            qrisValue: "",
            cashOut: "",
        })
    }

    const handleImportClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            alert(`File "${file.name}" dipilih. Fitur import Excel akan segera tersedia.`)
        }
    }

    const handleClearFilter = () => {
        setDateFrom("")
        setDateTo("")
    }

    // Filter sales by date range
    const filteredSales = useMemo(() => {
        return sales.filter(sale => {
            if (dateFrom && sale.date < dateFrom) return false
            if (dateTo && sale.date > dateTo) return false
            return true
        })
    }, [sales, dateFrom, dateTo])

    // Calculate stats
    const totalCashIn = filteredSales.reduce((sum, s) => sum + s.cashIn, 0)
    const totalCashOut = filteredSales.reduce((sum, s) => sum + s.cashOut, 0)
    const totalNetIncome = filteredSales.reduce((sum, s) => sum + s.netIncome, 0)

    // Group data by period
    const dailySales = useMemo(() =>
        [...filteredSales].sort((a, b) => b.date.localeCompare(a.date)),
        [filteredSales]
    )

    const weeklySales = useMemo(() => {
        const grouped: { [key: string]: { cashIn: number; cashOut: number; netIncome: number; count: number } } = {}
        filteredSales.forEach(sale => {
            const date = new Date(sale.date)
            const weekStart = new Date(date)
            weekStart.setDate(date.getDate() - date.getDay())
            const key = weekStart.toISOString().split('T')[0]
            if (!grouped[key]) {
                grouped[key] = { cashIn: 0, cashOut: 0, netIncome: 0, count: 0 }
            }
            grouped[key].cashIn += sale.cashIn
            grouped[key].cashOut += sale.cashOut
            grouped[key].netIncome += sale.netIncome
            grouped[key].count++
        })
        return Object.entries(grouped)
            .map(([week, data]) => ({ id: week, week, ...data }))
            .sort((a, b) => b.week.localeCompare(a.week))
    }, [filteredSales])

    const monthlySales = useMemo(() => {
        const grouped: { [key: string]: { cashIn: number; cashOut: number; netIncome: number; count: number } } = {}
        filteredSales.forEach(sale => {
            const key = sale.date.substring(0, 7)
            if (!grouped[key]) {
                grouped[key] = { cashIn: 0, cashOut: 0, netIncome: 0, count: 0 }
            }
            grouped[key].cashIn += sale.cashIn
            grouped[key].cashOut += sale.cashOut
            grouped[key].netIncome += sale.netIncome
            grouped[key].count++
        })
        return Object.entries(grouped)
            .map(([month, data]) => ({ id: month, month, ...data }))
            .sort((a, b) => b.month.localeCompare(a.month))
    }, [filteredSales])

    // Column definitions
    const dailyColumns = [
        {
            key: "date" as keyof SalesRecord,
            label: "Tanggal",
            className: "min-w-[120px]",
            render: (sale: SalesRecord) => (
                <span className="font-medium text-slate-800 dark:text-white">
                    {formatDate(sale.date)}
                </span>
            ),
        },
        {
            key: "outletName" as keyof SalesRecord,
            label: "Outlet",
            className: "min-w-[180px] hidden sm:table-cell",
            render: (sale: SalesRecord) => (
                <span className="text-slate-700 dark:text-slate-300">{sale.outletName}</span>
            ),
        },
        {
            key: "cashIn" as keyof SalesRecord,
            label: "Pemasukan (Cash + QRIS)",
            className: "min-w-[180px]",
            render: (sale: SalesRecord) => (
                <div className="flex flex-col items-end">
                    <span className="font-bold text-green-600">{formatCurrency(sale.cashIn)}</span>
                    <div className="flex gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="bg-green-50 px-1.5 py-0.5 rounded text-green-700 border border-green-100">
                            Cash: {(sale.cashValue !== undefined) ? (sale.cashValue / 1000).toFixed(0) + 'k' : '?'}
                        </span>
                        <span className="bg-blue-50 px-1.5 py-0.5 rounded text-blue-700 border border-blue-100">
                            QRIS: {(sale.qrisValue !== undefined) ? (sale.qrisValue / 1000).toFixed(0) + 'k' : '?'}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            key: "cashOut" as keyof SalesRecord,
            label: "Cash Out",
            className: "text-right min-w-[120px]",
            render: (sale: SalesRecord) => (
                <span className={`font-medium ${sale.cashOut > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                    {sale.cashOut > 0 ? formatCurrency(sale.cashOut) : '-'}
                </span>
            ),
        },
        {
            key: "netIncome" as keyof SalesRecord,
            label: "Netto",
            className: "text-right min-w-[140px]",
            render: (sale: SalesRecord) => (
                <span className="font-bold text-blue-600">{formatCurrency(sale.netIncome)}</span>
            ),
        },
    ]

    const weeklyColumns = [
        {
            key: "week" as keyof WeeklySales,
            label: "Minggu (Mulai)",
            className: "min-w-[130px]",
            render: (week: WeeklySales) => (
                <span className="font-medium text-slate-800 dark:text-white">
                    {formatDate(week.week)}
                </span>
            ),
        },
        {
            key: "cashIn" as keyof WeeklySales,
            label: "Total Cash In",
            className: "text-right min-w-[130px]",
            render: (week: WeeklySales) => (
                <span className="font-semibold text-green-600">{formatCurrency(week.cashIn)}</span>
            ),
        },
        {
            key: "cashOut" as keyof WeeklySales,
            label: "Total Cash Out",
            className: "text-right min-w-[120px]",
            render: (week: WeeklySales) => (
                <span className={`font-medium ${week.cashOut > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                    {week.cashOut > 0 ? formatCurrency(week.cashOut) : '-'}
                </span>
            ),
        },
        {
            key: "netIncome" as keyof WeeklySales,
            label: "Pemasukan Bersih",
            className: "text-right min-w-[140px]",
            render: (week: WeeklySales) => (
                <span className="font-bold text-blue-600">{formatCurrency(week.netIncome)}</span>
            ),
        },
        {
            key: "count" as keyof WeeklySales,
            label: "Transaksi",
            className: "text-right",
            render: (week: WeeklySales) => (
                <span className="text-slate-700 dark:text-slate-300">{week.count}x</span>
            ),
        },
    ]

    const monthlyColumns = [
        {
            key: "month" as keyof MonthlySales,
            label: "Bulan",
            className: "min-w-[130px]",
            render: (month: MonthlySales) => (
                <span className="font-medium text-slate-800 dark:text-white">
                    {formatMonth(month.month)}
                </span>
            ),
        },
        {
            key: "cashIn" as keyof MonthlySales,
            label: "Total Cash In",
            className: "text-right min-w-[130px]",
            render: (month: MonthlySales) => (
                <span className="font-semibold text-green-600">{formatCurrency(month.cashIn)}</span>
            ),
        },
        {
            key: "cashOut" as keyof MonthlySales,
            label: "Total Cash Out",
            className: "text-right min-w-[120px]",
            render: (month: MonthlySales) => (
                <span className={`font-medium ${month.cashOut > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                    {month.cashOut > 0 ? formatCurrency(month.cashOut) : '-'}
                </span>
            ),
        },
        {
            key: "netIncome" as keyof MonthlySales,
            label: "Pemasukan Bersih",
            className: "text-right min-w-[140px]",
            render: (month: MonthlySales) => (
                <span className="font-bold text-blue-600">{formatCurrency(month.netIncome)}</span>
            ),
        },
        {
            key: "count" as keyof MonthlySales,
            label: "Transaksi",
            className: "text-right",
            render: (month: MonthlySales) => (
                <span className="text-slate-700 dark:text-slate-300">{month.count}x</span>
            ),
        },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                        Rekap Penjualan
                    </h1>
                    <p className="text-slate-500 mt-1">Kelola dan pantau pemasukan & pengeluaran harian</p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Import Excel Button */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".xlsx,.xls,.csv"
                        className="hidden"
                    />
                    <Button
                        variant="outline"
                        onClick={handleImportClick}
                        className="border-slate-300 hover:bg-slate-50"
                        aria-label="Import data dari Excel"
                    >
                        <Upload className="w-4 h-4 mr-2" aria-hidden="true" />
                        Import Excel
                    </Button>

                    {/* Add Sales Dialog */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg" aria-label="Input penjualan harian baru">
                                <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                                Input Harian
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[500px]">
                            <form onSubmit={handleSubmit}>
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-red-500" />
                                        Input Penjualan Harian
                                    </DialogTitle>
                                    <DialogDescription>
                                        Masukkan rincian pemasukan (Cash & QRIS) dan pengeluaran.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="date">Tanggal</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="outlet">Outlet</Label>
                                        <Select
                                            value={formData.outletId}
                                            onValueChange={(value) => setFormData({ ...formData, outletId: value })}
                                        >
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

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="cashValue">Pemasukan Cash</Label>
                                            <Input
                                                id="cashValue"
                                                type="number"
                                                placeholder="0"
                                                value={formData.cashValue}
                                                onChange={(e) => setFormData({ ...formData, cashValue: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="qrisValue">Pemasukan QRIS</Label>
                                            <Input
                                                id="qrisValue"
                                                type="number"
                                                placeholder="0"
                                                value={formData.qrisValue}
                                                onChange={(e) => setFormData({ ...formData, qrisValue: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Total Preview */}
                                    <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center border border-slate-100">
                                        <span className="text-sm font-medium text-slate-500">Total Pemasukan</span>
                                        <span className="font-bold text-green-600">
                                            {formatCurrency((parseFloat(formData.cashValue) || 0) + (parseFloat(formData.qrisValue) || 0))}
                                        </span>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="cashOut">Total Cash Out</Label>
                                        <Input
                                            id="cashOut"
                                            type="number"
                                            placeholder="22000"
                                            value={formData.cashOut}
                                            onChange={(e) => setFormData({ ...formData, cashOut: e.target.value })}
                                        />
                                        <p className="text-xs text-slate-500">Pengeluaran operasional harian</p>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Batal
                                    </Button>
                                    <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white">
                                        Simpan
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Date Filter */}
            <GlassCard className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200/50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Filter className="w-4 h-4" />
                        <span className="font-medium">Filter Tanggal:</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="dateFrom" className="text-sm text-slate-500">Dari</Label>
                            <Input
                                id="dateFrom"
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-[160px] h-9"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="dateTo" className="text-sm text-slate-500">Sampai</Label>
                            <Input
                                id="dateTo"
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-[160px] h-9"
                            />
                        </div>
                        {(dateFrom || dateTo) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearFilter}
                                className="text-slate-500 hover:text-slate-700"
                            >
                                Reset
                            </Button>
                        )}
                    </div>
                </div>
            </GlassCard>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <GlassCard className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total Transaksi</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{filteredSales.length}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white border-none shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Total Cash In</p>
                            <p className="text-2xl font-bold">{formatCurrency(totalCashIn)}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-amber-400 to-amber-500 text-amber-900 border-none shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/30 flex items-center justify-center">
                            <TrendingDown className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Total Cash Out</p>
                            <p className="text-2xl font-bold">{formatCurrency(totalCashOut)}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-slate-700 to-slate-800 text-white border-none shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Pemasukan Bersih</p>
                            <p className="text-2xl font-bold">{formatCurrency(totalNetIncome)}</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1">
                    <TabsTrigger
                        value="daily"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm"
                    >
                        <Calendar className="w-4 h-4 mr-2" />
                        Daily
                    </TabsTrigger>
                    <TabsTrigger
                        value="weekly"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm"
                    >
                        Weekly
                    </TabsTrigger>
                    <TabsTrigger
                        value="monthly"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm"
                    >
                        Monthly
                    </TabsTrigger>
                </TabsList>

                {/* Daily Tab */}
                <TabsContent value="daily" className="mt-4">
                    <GlassCard className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200/50">
                        <DataTable
                            data={dailySales}
                            columns={dailyColumns}
                            searchKey="outletName"
                            searchPlaceholder="Cari outlet..."
                            emptyMessage="Belum ada data penjualan"
                            emptyIcon={<DollarSign className="w-12 h-12" />}
                        />
                    </GlassCard>
                </TabsContent>

                {/* Weekly Tab */}
                <TabsContent value="weekly" className="mt-4">
                    <GlassCard className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200/50">
                        <DataTable
                            data={weeklySales}
                            columns={weeklyColumns}
                            emptyMessage="Belum ada data mingguan"
                            emptyIcon={<Calendar className="w-12 h-12" />}
                        />
                    </GlassCard>
                </TabsContent>

                {/* Monthly Tab */}
                <TabsContent value="monthly" className="mt-4">
                    <GlassCard className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200/50">
                        <DataTable
                            data={monthlySales}
                            columns={monthlyColumns}
                            emptyMessage="Belum ada data bulanan"
                            emptyIcon={<Calendar className="w-12 h-12" />}
                        />
                    </GlassCard>
                </TabsContent>
            </Tabs>
        </div>
    )
}
