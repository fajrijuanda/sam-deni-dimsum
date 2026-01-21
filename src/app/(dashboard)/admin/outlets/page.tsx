"use client"

import { useState, useMemo } from "react"
import { Plus, Pencil, Trash2, MapPin, User, Store, Building2, Users, X } from "lucide-react"
import { GlassCard } from "@/components/shared/GlassCard"
import { DataTable } from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

// Type for Worker/Employee
interface Worker {
    id: string
    name: string
    phone: string
    role: string
}

// Type for Mitra
interface MitraOption {
    id: string
    name: string
}

// Type for Mitra Assignment
interface MitraAssignment {
    mitraId: string
    mitraName: string
    startDate: string
}

// Type for Outlet
interface Outlet {
    id: string
    name: string
    address: string
    workerId: string
    workerName: string
    workerPhone: string
    ownership: "company" | "mitra"
    mitraAssignments: MitraAssignment[] // Max 3 mitra per outlet
    status: "active" | "inactive"
    createdAt: string
}

// Mock workers data
const workers: Worker[] = [
    { id: "w1", name: "Budi Santoso", phone: "081234567890", role: "staff" },
    { id: "w2", name: "Siti Rahayu", phone: "082345678901", role: "staff" },
    { id: "w3", name: "Ahmad Hidayat", phone: "083456789012", role: "staff" },
    { id: "w4", name: "Dewi Lestari", phone: "084567890123", role: "staff" },
    { id: "w5", name: "Eko Prasetyo", phone: "085678901234", role: "staff" },
    { id: "w6", name: "Fitri Handayani", phone: "086789012345", role: "staff" },
]

// Mock mitra data (available for assignment)
const mitraList: MitraOption[] = [
    { id: "m1", name: "Fajri Yanuar Shiddiq Juanda" },
    { id: "m2", name: "Budi Setiawan" },
    { id: "m3", name: "Siti Nurhaliza" },
    { id: "m4", name: "Ahmad Rizky" },
    { id: "m5", name: "Dewi Kartika" },
]

// Mock data for outlets
const initialOutlets: Outlet[] = [
    {
        id: "1",
        name: "Sam Deni Dimsum - Pusat",
        address: "Jl. Sudirman No. 123, Jakarta Selatan",
        workerId: "w1",
        workerName: "Budi Santoso",
        workerPhone: "081234567890",
        ownership: "mitra",
        mitraAssignments: [
            { mitraId: "m1", mitraName: "Fajri Yanuar Shiddiq Juanda", startDate: "2024-11-22" },
            { mitraId: "m2", mitraName: "Budi Setiawan", startDate: "2024-11-22" },
        ],
        status: "active",
        createdAt: "2024-01-15",
    },
    {
        id: "2",
        name: "Sam Deni Dimsum - Bandung",
        address: "Jl. Braga No. 45, Bandung",
        workerId: "w2",
        workerName: "Siti Rahayu",
        workerPhone: "082345678901",
        ownership: "mitra",
        mitraAssignments: [
            { mitraId: "m3", mitraName: "Siti Nurhaliza", startDate: "2024-06-15" },
        ],
        status: "active",
        createdAt: "2024-02-20",
    },
    {
        id: "3",
        name: "Sam Deni Dimsum - Surabaya",
        address: "Jl. Tunjungan No. 78, Surabaya",
        workerId: "w3",
        workerName: "Ahmad Hidayat",
        workerPhone: "083456789012",
        ownership: "company",
        mitraAssignments: [],
        status: "inactive",
        createdAt: "2024-03-10",
    },
    {
        id: "4",
        name: "Sam Deni Dimsum - Yogyakarta",
        address: "Jl. Malioboro No. 56, Yogyakarta",
        workerId: "w4",
        workerName: "Dewi Lestari",
        workerPhone: "084567890123",
        ownership: "company",
        mitraAssignments: [],
        status: "active",
        createdAt: "2024-04-05",
    },
    {
        id: "5",
        name: "Sam Deni Dimsum - Semarang",
        address: "Jl. Pandanaran No. 32, Semarang",
        workerId: "w5",
        workerName: "Eko Prasetyo",
        workerPhone: "085678901234",
        ownership: "mitra",
        mitraAssignments: [
            { mitraId: "m4", mitraName: "Ahmad Rizky", startDate: "2025-01-01" },
            { mitraId: "m5", mitraName: "Dewi Kartika", startDate: "2025-01-01" },
            { mitraId: "m1", mitraName: "Fajri Yanuar Shiddiq Juanda", startDate: "2025-01-01" },
        ],
        status: "active",
        createdAt: "2024-05-12",
    },
    {
        id: "6",
        name: "Sam Deni Dimsum - Medan",
        address: "Jl. Imam Bonjol No. 88, Medan",
        workerId: "w6",
        workerName: "Fitri Handayani",
        workerPhone: "086789012345",
        ownership: "company",
        mitraAssignments: [],
        status: "inactive",
        createdAt: "2024-06-20",
    },
]

const MAX_MITRA_PER_OUTLET = 3

export default function OutletsPage() {
    const [outlets, setOutlets] = useState<Outlet[]>(initialOutlets)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingOutlet, setEditingOutlet] = useState<Outlet | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        workerId: "",
        ownership: "company" as "company" | "mitra",
        mitraAssignments: [] as MitraAssignment[],
        status: "active" as "active" | "inactive",
    })
    const [selectedMitraId, setSelectedMitraId] = useState("")
    const [selectedMitraDate, setSelectedMitraDate] = useState(new Date().toISOString().split('T')[0])

    // Calculate stats
    const stats = useMemo(() => ({
        total: outlets.length,
        active: outlets.filter(o => o.status === "active").length,
        company: outlets.filter(o => o.ownership === "company").length,
        mitra: outlets.filter(o => o.ownership === "mitra").length,
    }), [outlets])

    // Get available workers (not assigned to any outlet, except current editing)
    const getAvailableWorkers = () => {
        const assignedWorkerIds = outlets
            .filter(o => editingOutlet ? o.id !== editingOutlet.id : true)
            .map(o => o.workerId)
        return workers.filter(w => !assignedWorkerIds.includes(w.id))
    }

    // Get available mitra (not already assigned to this outlet)
    const getAvailableMitra = () => {
        const assignedMitraIds = formData.mitraAssignments.map(m => m.mitraId)
        return mitraList.filter(m => !assignedMitraIds.includes(m.id))
    }

    const handleOpenDialog = (outlet?: Outlet) => {
        if (outlet) {
            setEditingOutlet(outlet)
            setFormData({
                name: outlet.name,
                address: outlet.address,
                workerId: outlet.workerId,
                ownership: outlet.ownership,
                mitraAssignments: [...outlet.mitraAssignments],
                status: outlet.status,
            })
        } else {
            setEditingOutlet(null)
            setFormData({
                name: "",
                address: "",
                workerId: "",
                ownership: "company",
                mitraAssignments: [],
                status: "active",
            })
        }
        setSelectedMitraId("")
        setSelectedMitraDate(new Date().toISOString().split('T')[0])
        setIsDialogOpen(true)
    }

    const handleAddMitra = () => {
        if (!selectedMitraId || formData.mitraAssignments.length >= MAX_MITRA_PER_OUTLET) return

        const mitra = mitraList.find(m => m.id === selectedMitraId)
        if (!mitra) return

        setFormData({
            ...formData,
            mitraAssignments: [
                ...formData.mitraAssignments,
                { mitraId: mitra.id, mitraName: mitra.name, startDate: selectedMitraDate }
            ]
        })
        setSelectedMitraId("")
        setSelectedMitraDate(new Date().toISOString().split('T')[0])
    }

    const handleRemoveMitra = (mitraId: string) => {
        setFormData({
            ...formData,
            mitraAssignments: formData.mitraAssignments.filter(m => m.mitraId !== mitraId)
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const worker = workers.find(w => w.id === formData.workerId)
        if (!worker) return

        if (editingOutlet) {
            setOutlets(outlets.map(o =>
                o.id === editingOutlet.id
                    ? {
                        ...o,
                        name: formData.name,
                        address: formData.address,
                        workerId: worker.id,
                        workerName: worker.name,
                        workerPhone: worker.phone,
                        ownership: formData.ownership,
                        mitraAssignments: formData.ownership === "mitra" ? formData.mitraAssignments : [],
                        status: formData.status,
                    }
                    : o
            ))
        } else {
            const newOutlet: Outlet = {
                id: Date.now().toString(),
                name: formData.name,
                address: formData.address,
                workerId: worker.id,
                workerName: worker.name,
                workerPhone: worker.phone,
                ownership: formData.ownership,
                mitraAssignments: formData.ownership === "mitra" ? formData.mitraAssignments : [],
                status: formData.status,
                createdAt: new Date().toISOString().split('T')[0],
            }
            setOutlets([...outlets, newOutlet])
        }

        setIsDialogOpen(false)
        setEditingOutlet(null)
    }

    const handleDelete = (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus outlet ini?")) {
            setOutlets(outlets.filter(o => o.id !== id))
        }
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    // Table columns configuration
    const columns = [
        {
            key: "name" as keyof Outlet,
            label: "Nama Outlet",
            className: "min-w-[180px]",
            render: (outlet: Outlet) => (
                <div className="flex flex-col">
                    <span className="font-medium text-slate-900 dark:text-white">
                        {outlet.name}
                    </span>
                    <span className="text-xs text-slate-500 md:hidden mt-0.5">
                        {outlet.address}
                    </span>
                </div>
            ),
        },
        {
            key: "address" as keyof Outlet,
            label: "Alamat",
            className: "hidden md:table-cell min-w-[200px]",
            render: (outlet: Outlet) => (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4 flex-shrink-0 text-slate-400" />
                    <span className="line-clamp-1">{outlet.address}</span>
                </div>
            ),
        },
        {
            key: "ownership" as keyof Outlet,
            label: "Kepemilikan",
            className: "min-w-[180px]",
            render: (outlet: Outlet) => (
                outlet.ownership === "company" ? (
                    <div className="flex items-center gap-2">
                        <Badge className="bg-slate-800 hover:bg-slate-900 text-white border-none">
                            <Building2 className="w-3 h-3 mr-1" /> Perusahaan
                        </Badge>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        <Badge className="bg-amber-400 hover:bg-amber-500 text-amber-900 border-none w-fit">
                            <Users className="w-3 h-3 mr-1" /> {outlet.mitraAssignments.length} Mitra
                        </Badge>
                        <div className="flex flex-wrap gap-1">
                            {outlet.mitraAssignments.map((m, idx) => (
                                <span key={m.mitraId} className="text-xs text-slate-500">
                                    {m.mitraName.split(' ')[0]}{idx < outlet.mitraAssignments.length - 1 ? ',' : ''}
                                </span>
                            ))}
                        </div>
                    </div>
                )
            ),
        },
        {
            key: "workerName" as keyof Outlet,
            label: "Pekerja",
            className: "hidden lg:table-cell min-w-[150px]",
            render: (outlet: Outlet) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-red-500" />
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                            {outlet.workerName}
                        </span>
                    </div>
                    <span className="text-xs text-slate-500 ml-6">
                        {outlet.workerPhone}
                    </span>
                </div>
            ),
        },
        {
            key: "status" as keyof Outlet,
            label: "Status",
            render: (outlet: Outlet) => (
                <Badge
                    variant={outlet.status === "active" ? "default" : "secondary"}
                    className={outlet.status === "active"
                        ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-100 border-slate-200"
                    }
                >
                    {outlet.status === "active" ? "Aktif" : "Tidak Aktif"}
                </Badge>
            ),
        },
        {
            key: "actions" as string,
            label: "Aksi",
            className: "text-right w-[100px]",
            render: (outlet: Outlet) => (
                <div className="flex items-center justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(outlet)}
                        className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(outlet.id)}
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
                        Outlet
                    </h1>
                    <p className="text-slate-500 mt-1">Kelola semua outlet Sam Deni Dimsum</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => handleOpenDialog()}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Outlet
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Store className="w-5 h-5 text-red-500" />
                                    {editingOutlet ? "Edit Outlet" : "Tambah Outlet Baru"}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingOutlet
                                        ? "Perbarui informasi outlet di bawah ini."
                                        : "Isi informasi outlet baru di bawah ini."
                                    }
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Outlet</Label>
                                    <Input
                                        id="name"
                                        placeholder="Sam Deni Dimsum - Cabang"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="address">Alamat</Label>
                                    <Textarea
                                        id="address"
                                        placeholder="Jl. Contoh No. 123, Kota"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="worker">Pekerja (PIC)</Label>
                                    <Select
                                        value={formData.workerId}
                                        onValueChange={(value) => setFormData({ ...formData, workerId: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Pekerja" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {editingOutlet && (
                                                <SelectItem value={editingOutlet.workerId}>
                                                    {editingOutlet.workerName} - {editingOutlet.workerPhone}
                                                </SelectItem>
                                            )}
                                            {getAvailableWorkers().map(worker => (
                                                <SelectItem key={worker.id} value={worker.id}>
                                                    {worker.name} - {worker.phone}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="ownership">Kepemilikan</Label>
                                    <Select
                                        value={formData.ownership}
                                        onValueChange={(value) => setFormData({
                                            ...formData,
                                            ownership: value as "company" | "mitra",
                                            mitraAssignments: value === "company" ? [] : formData.mitraAssignments
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Kepemilikan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="company">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-slate-600" />
                                                    Milik Perusahaan
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="mitra">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-amber-500" />
                                                    Milik Mitra (Max 3)
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {formData.ownership === "mitra" && (
                                    <div className="grid gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50/50">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-amber-800">Mitra Pemilik</Label>
                                            <span className="text-xs text-amber-600">
                                                {formData.mitraAssignments.length}/{MAX_MITRA_PER_OUTLET} mitra
                                            </span>
                                        </div>

                                        {/* Current Mitra List */}
                                        {formData.mitraAssignments.length > 0 && (
                                            <div className="flex flex-col gap-2">
                                                {formData.mitraAssignments.map((m) => (
                                                    <div key={m.mitraId} className="flex items-center justify-between p-2 bg-white rounded-md border">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-slate-800">{m.mitraName}</span>
                                                            <span className="text-xs text-slate-500">Mulai: {formatDate(m.startDate)}</span>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50"
                                                            onClick={() => handleRemoveMitra(m.mitraId)}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Add Mitra */}
                                        {formData.mitraAssignments.length < MAX_MITRA_PER_OUTLET && (
                                            <div className="flex flex-col gap-2 pt-2 border-t border-amber-200">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Select value={selectedMitraId} onValueChange={setSelectedMitraId}>
                                                        <SelectTrigger className="bg-white">
                                                            <SelectValue placeholder="Pilih Mitra" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {getAvailableMitra().map(mitra => (
                                                                <SelectItem key={mitra.id} value={mitra.id}>
                                                                    {mitra.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Input
                                                        type="date"
                                                        value={selectedMitraDate}
                                                        onChange={(e) => setSelectedMitraDate(e.target.value)}
                                                        className="bg-white"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="w-full border-amber-300 text-amber-700 hover:bg-amber-100"
                                                    onClick={handleAddMitra}
                                                    disabled={!selectedMitraId}
                                                >
                                                    <Plus className="w-4 h-4 mr-1" /> Tambah Mitra
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Aktif</SelectItem>
                                            <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                    disabled={!formData.workerId || (formData.ownership === "mitra" && formData.mitraAssignments.length === 0)}
                                >
                                    {editingOutlet ? "Simpan Perubahan" : "Tambah Outlet"}
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
                            <Store className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total Outlet</p>
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
                            <p className="text-sm opacity-80">Outlet Aktif</p>
                            <p className="text-2xl font-bold">{stats.active}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-amber-400 to-amber-500 text-amber-900 border-none shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/30 flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Milik Mitra</p>
                            <p className="text-2xl font-bold">{stats.mitra}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-slate-700 to-slate-800 text-white border-none shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Milik Perusahaan</p>
                            <p className="text-2xl font-bold">{stats.company}</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* DataTable */}
            <GlassCard className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200/50">
                <DataTable
                    data={outlets}
                    columns={columns}
                    searchKey="name"
                    searchPlaceholder="Cari outlet..."
                    emptyMessage="Belum ada outlet"
                    emptyIcon={<Store className="w-12 h-12" />}
                />
            </GlassCard>
        </div>
    )
}
