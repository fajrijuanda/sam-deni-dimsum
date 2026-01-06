"use client"

import { useState, useMemo } from "react"
import { Plus, Pencil, Trash2, Users, Store, Wallet, Clock, AlertTriangle, Calendar, Building, CreditCard } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Type for Mitra
interface Mitra {
    id: string
    name: string
    email: string
    phone: string
    type: "outlet" | "investasi"
    // For outlet type
    outletId?: string
    outletName?: string
    // For investasi type
    modalAmount?: number
    // Bank Account
    bankName: string
    bankAccountNumber: string
    bankAccountName: string
    payoutDay: number // Day of month for payout (1-28)
    // Common
    startDate: string
    createdAt: string
}

// Mock outlets that are owned by company (available for mitra assignment)
const companyOutlets = [
    { id: "o1", name: "Sam Deni Dimsum - Pusat" },
    { id: "o2", name: "Sam Deni Dimsum - Bandung" },
    { id: "o3", name: "Sam Deni Dimsum - Surabaya" },
]

// Bank list in Indonesia
const bankList = [
    { id: "bca", name: "BCA" },
    { id: "bri", name: "BRI" },
    { id: "bni", name: "BNI" },
    { id: "mandiri", name: "Mandiri" },
    { id: "cimb", name: "CIMB Niaga" },
    { id: "danamon", name: "Danamon" },
    { id: "permata", name: "Permata" },
    { id: "btn", name: "BTN" },
    { id: "ocbc", name: "OCBC NISP" },
    { id: "bsi", name: "BSI (Bank Syariah Indonesia)" },
]

// Mock data for mitra
const initialMitra: Mitra[] = [
    {
        id: "1",
        name: "Fajri Yanuar Shiddiq Juanda",
        email: "fajri@example.com",
        phone: "081234567890",
        type: "outlet",
        outletId: "o1",
        outletName: "Sam Deni Dimsum - Pusat",
        bankName: "BCA",
        bankAccountNumber: "1234567890",
        bankAccountName: "Fajri Yanuar S J",
        payoutDay: 22,
        startDate: "2024-11-22",
        createdAt: "2024-11-22",
    },
    {
        id: "2",
        name: "Budi Setiawan",
        email: "budi@example.com",
        phone: "082345678901",
        type: "outlet",
        outletId: "o2",
        outletName: "Sam Deni Dimsum - Bandung",
        bankName: "BRI",
        bankAccountNumber: "0987654321",
        bankAccountName: "Budi Setiawan",
        payoutDay: 15,
        startDate: "2024-06-15",
        createdAt: "2024-06-15",
    },
    {
        id: "3",
        name: "Dewi Kartika",
        email: "dewi@example.com",
        phone: "083456789012",
        type: "investasi",
        modalAmount: 50000000,
        bankName: "Mandiri",
        bankAccountNumber: "1122334455",
        bankAccountName: "Dewi Kartika",
        payoutDay: 1,
        startDate: "2024-08-01",
        createdAt: "2024-08-01",
    },
    {
        id: "4",
        name: "Ahmad Rizky",
        email: "ahmad@example.com",
        phone: "084567890123",
        type: "investasi",
        modalAmount: 100000000,
        bankName: "BNI",
        bankAccountNumber: "9988776655",
        bankAccountName: "Ahmad Rizky",
        payoutDay: 1,
        startDate: "2023-12-01",
        createdAt: "2023-12-01",
    },
    {
        id: "5",
        name: "Siti Nurhaliza",
        email: "siti@example.com",
        phone: "085678901234",
        type: "outlet",
        outletId: "o3",
        outletName: "Sam Deni Dimsum - Surabaya",
        bankName: "BCA",
        bankAccountNumber: "5566778899",
        bankAccountName: "Siti Nurhaliza",
        payoutDay: 1,
        startDate: "2025-01-01",
        createdAt: "2025-01-01",
    },
]

export default function MitraPage() {
    const [mitraList, setMitraList] = useState<Mitra[]>(initialMitra)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingMitra, setEditingMitra] = useState<Mitra | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        type: "outlet" as "outlet" | "investasi",
        outletId: "",
        modalAmount: "",
        bankName: "",
        bankAccountNumber: "",
        bankAccountName: "",
        payoutDay: "1",
        startDate: new Date().toISOString().split('T')[0],
    })

    const CONTRACT_MONTHS = 24 // 2 years

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

    // Calculate months remaining from start date
    const getMonthsRemaining = (startDate: string) => {
        const start = new Date(startDate)
        const now = new Date()
        const endDate = new Date(start)
        endDate.setMonth(endDate.getMonth() + CONTRACT_MONTHS)

        const diffTime = endDate.getTime() - now.getTime()
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))

        return Math.max(0, diffMonths)
    }

    // Get countdown badge color
    const getCountdownBadge = (monthsRemaining: number) => {
        if (monthsRemaining <= 0) {
            return <Badge className="bg-slate-500 text-white">Selesai</Badge>
        } else if (monthsRemaining <= 3) {
            return <Badge className="bg-red-500 text-white">{monthsRemaining} bulan lagi</Badge>
        } else if (monthsRemaining <= 6) {
            return <Badge className="bg-amber-500 text-white">{monthsRemaining} bulan lagi</Badge>
        } else {
            return <Badge className="bg-green-500 text-white">{monthsRemaining} bulan lagi</Badge>
        }
    }

    // Calculate stats
    const stats = useMemo(() => {
        const outletMitra = mitraList.filter(m => m.type === "outlet")
        const investasiMitra = mitraList.filter(m => m.type === "investasi")
        const expiringSoon = mitraList.filter(m => getMonthsRemaining(m.startDate) <= 3 && getMonthsRemaining(m.startDate) > 0)

        return {
            total: mitraList.length,
            outlet: outletMitra.length,
            investasi: investasiMitra.length,
            expiring: expiringSoon.length,
        }
    }, [mitraList])

    const handleOpenDialog = (mitra?: Mitra) => {
        if (mitra) {
            setEditingMitra(mitra)
            setFormData({
                name: mitra.name,
                email: mitra.email,
                phone: mitra.phone,
                type: mitra.type,
                outletId: mitra.outletId || "",
                modalAmount: mitra.modalAmount?.toString() || "",
                bankName: mitra.bankName,
                bankAccountNumber: mitra.bankAccountNumber,
                bankAccountName: mitra.bankAccountName,
                payoutDay: mitra.payoutDay.toString(),
                startDate: mitra.startDate,
            })
        } else {
            setEditingMitra(null)
            setFormData({
                name: "",
                email: "",
                phone: "",
                type: "outlet",
                outletId: "",
                modalAmount: "",
                bankName: "",
                bankAccountNumber: "",
                bankAccountName: "",
                payoutDay: "1",
                startDate: new Date().toISOString().split('T')[0],
            })
        }
        setIsDialogOpen(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const outlet = companyOutlets.find(o => o.id === formData.outletId)

        if (editingMitra) {
            setMitraList(mitraList.map(m =>
                m.id === editingMitra.id
                    ? {
                        ...m,
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        type: formData.type,
                        outletId: formData.type === "outlet" ? formData.outletId : undefined,
                        outletName: formData.type === "outlet" ? outlet?.name : undefined,
                        modalAmount: formData.type === "investasi" ? parseFloat(formData.modalAmount) : undefined,
                        bankName: formData.bankName,
                        bankAccountNumber: formData.bankAccountNumber,
                        bankAccountName: formData.bankAccountName,
                        payoutDay: parseInt(formData.payoutDay),
                        startDate: formData.startDate,
                    }
                    : m
            ))
        } else {
            const newMitra: Mitra = {
                id: Date.now().toString(),
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                type: formData.type,
                outletId: formData.type === "outlet" ? formData.outletId : undefined,
                outletName: formData.type === "outlet" ? outlet?.name : undefined,
                modalAmount: formData.type === "investasi" ? parseFloat(formData.modalAmount) : undefined,
                bankName: formData.bankName,
                bankAccountNumber: formData.bankAccountNumber,
                bankAccountName: formData.bankAccountName,
                payoutDay: parseInt(formData.payoutDay),
                startDate: formData.startDate,
                createdAt: new Date().toISOString().split('T')[0],
            }
            setMitraList([...mitraList, newMitra])
        }

        setIsDialogOpen(false)
        setEditingMitra(null)
    }

    const handleDelete = (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus mitra ini?")) {
            setMitraList(mitraList.filter(m => m.id !== id))
        }
    }

    // Table columns configuration
    const columns = [
        {
            key: "name" as keyof Mitra,
            label: "Mitra",
            className: "min-w-[200px]",
            render: (mitra: Mitra) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                        {mitra.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-white">
                            {mitra.name}
                        </span>
                        <span className="text-xs text-slate-500">{mitra.phone}</span>
                    </div>
                </div>
            ),
        },
        {
            key: "type" as keyof Mitra,
            label: "Jenis",
            render: (mitra: Mitra) => (
                mitra.type === "outlet" ? (
                    <Badge className="bg-amber-400 hover:bg-amber-500 text-amber-900 border-none">
                        <Store className="w-3 h-3 mr-1" /> Outlet
                    </Badge>
                ) : (
                    <Badge className="bg-slate-800 hover:bg-slate-900 text-white border-none">
                        <Wallet className="w-3 h-3 mr-1" /> Investasi
                    </Badge>
                )
            ),
        },
        {
            key: "detail" as string,
            label: "Detail Kemitraan",
            className: "min-w-[200px]",
            render: (mitra: Mitra) => (
                mitra.type === "outlet" ? (
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                            {mitra.outletName}
                        </span>
                        <span className="text-xs text-slate-500">Bagi hasil 30:70</span>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <span className="font-semibold text-green-600">
                            {formatCurrency(mitra.modalAmount || 0)}
                        </span>
                        <span className="text-xs text-slate-500">
                            Return: {formatCurrency((mitra.modalAmount || 0) * 0.1)}/bulan
                        </span>
                    </div>
                )
            ),
        },
        {
            key: "bank" as string,
            label: "Rekening",
            className: "hidden lg:table-cell min-w-[150px]",
            render: (mitra: Mitra) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">{mitra.bankName}</span>
                    </div>
                    <span className="text-xs text-slate-500">{mitra.bankAccountNumber}</span>
                    <span className="text-xs text-slate-400">a.n. {mitra.bankAccountName}</span>
                </div>
            ),
        },
        {
            key: "payout" as string,
            label: "Tgl Payout",
            className: "hidden md:table-cell",
            render: (mitra: Mitra) => (
                <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                    Tanggal {mitra.payoutDay}
                </Badge>
            ),
        },
        {
            key: "countdown" as string,
            label: "Sisa Kontrak",
            render: (mitra: Mitra) => getCountdownBadge(getMonthsRemaining(mitra.startDate)),
        },
        {
            key: "actions" as string,
            label: "Aksi",
            className: "text-right w-[100px]",
            render: (mitra: Mitra) => (
                <div className="flex items-center justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(mitra)}
                        className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(mitra.id)}
                        className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                        Manajemen Mitra
                    </h1>
                    <p className="text-slate-500 mt-1">Kelola kemitraan outlet dan investasi</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => handleOpenDialog()}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Mitra
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-red-500" />
                                    {editingMitra ? "Edit Mitra" : "Tambah Mitra Baru"}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingMitra
                                        ? "Perbarui informasi mitra di bawah ini."
                                        : "Isi informasi mitra baru. Kontrak berlaku 2 tahun."
                                    }
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                {/* Basic Info */}
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        placeholder="Nama mitra"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="email@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Telepon</Label>
                                        <Input
                                            id="phone"
                                            placeholder="08xxxxxxxxxx"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Partnership Type */}
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Jenis Kemitraan</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value) => setFormData({ ...formData, type: value as "outlet" | "investasi" })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Jenis" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="outlet">
                                                <div className="flex items-center gap-2">
                                                    <Store className="w-4 h-4 text-amber-500" />
                                                    Outlet (Bagi Hasil 30:70)
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="investasi">
                                                <div className="flex items-center gap-2">
                                                    <Wallet className="w-4 h-4 text-slate-600" />
                                                    Investasi (Return 10%/bulan)
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {formData.type === "outlet" && (
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
                                                {companyOutlets.map(outlet => (
                                                    <SelectItem key={outlet.id} value={outlet.id}>
                                                        {outlet.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-slate-500">
                                            Hanya outlet milik perusahaan yang bisa dipilih
                                        </p>
                                    </div>
                                )}

                                {formData.type === "investasi" && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="modal">Jumlah Modal</Label>
                                        <Input
                                            id="modal"
                                            type="number"
                                            placeholder="50000000"
                                            value={formData.modalAmount}
                                            onChange={(e) => setFormData({ ...formData, modalAmount: e.target.value })}
                                            required
                                        />
                                        <p className="text-xs text-slate-500">
                                            Return 10% per bulan selama 24 bulan
                                        </p>
                                    </div>
                                )}

                                {/* Bank Account Section */}
                                <div className="p-4 rounded-lg border border-blue-200 bg-blue-50/50 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-blue-600" />
                                        <Label className="text-blue-800 font-semibold">Informasi Rekening Payout</Label>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="bankName">Nama Bank</Label>
                                        <Select
                                            value={formData.bankName}
                                            onValueChange={(value) => setFormData({ ...formData, bankName: value })}
                                        >
                                            <SelectTrigger className="bg-white">
                                                <SelectValue placeholder="Pilih Bank" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bankList.map(bank => (
                                                    <SelectItem key={bank.id} value={bank.name}>
                                                        <div className="flex items-center gap-2">
                                                            <Building className="w-4 h-4 text-blue-500" />
                                                            {bank.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="bankAccountNumber">No. Rekening</Label>
                                            <Input
                                                id="bankAccountNumber"
                                                placeholder="1234567890"
                                                value={formData.bankAccountNumber}
                                                onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                                                className="bg-white"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="payoutDay">Tanggal Payout</Label>
                                            <Select
                                                value={formData.payoutDay}
                                                onValueChange={(value) => setFormData({ ...formData, payoutDay: value })}
                                            >
                                                <SelectTrigger className="bg-white">
                                                    <SelectValue placeholder="Tanggal" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                                                        <SelectItem key={day} value={day.toString()}>
                                                            Tanggal {day}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="bankAccountName">Nama Pemilik Rekening</Label>
                                        <Input
                                            id="bankAccountName"
                                            placeholder="Nama sesuai buku rekening"
                                            value={formData.bankAccountName}
                                            onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                                            className="bg-white"
                                            required
                                        />
                                    </div>

                                    <p className="text-xs text-blue-600">
                                        Payout akan dilakukan setiap bulan pada tanggal yang dipilih, dihitung dari tanggal bergabung.
                                    </p>
                                </div>

                                {/* Start Date */}
                                <div className="grid gap-2">
                                    <Label htmlFor="startDate">Tanggal Mulai Kontrak</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                    disabled={(formData.type === "outlet" && !formData.outletId) || !formData.bankName || !formData.bankAccountNumber}
                                >
                                    {editingMitra ? "Simpan Perubahan" : "Tambah Mitra"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <GlassCard className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total Mitra</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white border-none shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <Store className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Mitra Outlet</p>
                            <p className="text-2xl font-bold">{stats.outlet}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-amber-400 to-amber-500 text-amber-900 border-none shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/30 flex items-center justify-center">
                            <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Mitra Investasi</p>
                            <p className="text-2xl font-bold">{stats.investasi}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-slate-700 to-slate-800 text-white border-none shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Segera Habis</p>
                            <p className="text-2xl font-bold">{stats.expiring}</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* DataTable */}
            <GlassCard className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200/50">
                <DataTable
                    data={mitraList}
                    columns={columns}
                    searchKey="name"
                    searchPlaceholder="Cari mitra..."
                    emptyMessage="Belum ada mitra"
                    emptyIcon={<Users className="w-12 h-12" />}
                />
            </GlassCard>
        </div>
    )
}
