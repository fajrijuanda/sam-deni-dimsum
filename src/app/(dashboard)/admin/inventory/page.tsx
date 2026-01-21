"use client"

import { useState, useMemo } from "react"
import { Plus, Pencil, Trash2, Package, Box, AlertTriangle, CheckCircle, Minus } from "lucide-react"
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

// Type for Inventory Item
interface InventoryItem {
    id: string
    name: string
    category: "bahan_baku" | "kemasan" | "bumbu" | "lainnya"
    unit: string
    currentStock: number
    minStock: number
    price: number
    lastUpdated: string
}

// Mock data for inventory
const initialInventory: InventoryItem[] = [
    {
        id: "1",
        name: "Tepung Terigu",
        category: "bahan_baku",
        unit: "kg",
        currentStock: 50,
        minStock: 20,
        price: 15000,
        lastUpdated: "2025-01-05",
    },
    {
        id: "2",
        name: "Daging Ayam",
        category: "bahan_baku",
        unit: "kg",
        currentStock: 15,
        minStock: 10,
        price: 45000,
        lastUpdated: "2025-01-05",
    },
    {
        id: "3",
        name: "Udang Segar",
        category: "bahan_baku",
        unit: "kg",
        currentStock: 5,
        minStock: 8,
        price: 120000,
        lastUpdated: "2025-01-04",
    },
    {
        id: "4",
        name: "Kulit Dimsum",
        category: "bahan_baku",
        unit: "pack",
        currentStock: 100,
        minStock: 50,
        price: 25000,
        lastUpdated: "2025-01-05",
    },
    {
        id: "5",
        name: "Box Kemasan Medium",
        category: "kemasan",
        unit: "pcs",
        currentStock: 200,
        minStock: 100,
        price: 3000,
        lastUpdated: "2025-01-03",
    },
    {
        id: "6",
        name: "Plastik Wrap",
        category: "kemasan",
        unit: "roll",
        currentStock: 8,
        minStock: 10,
        price: 35000,
        lastUpdated: "2025-01-02",
    },
    {
        id: "7",
        name: "Kecap Asin",
        category: "bumbu",
        unit: "liter",
        currentStock: 12,
        minStock: 5,
        price: 28000,
        lastUpdated: "2025-01-04",
    },
    {
        id: "8",
        name: "Minyak Wijen",
        category: "bumbu",
        unit: "liter",
        currentStock: 3,
        minStock: 5,
        price: 85000,
        lastUpdated: "2025-01-03",
    },
    {
        id: "9",
        name: "Saus Sambal",
        category: "bumbu",
        unit: "botol",
        currentStock: 25,
        minStock: 15,
        price: 18000,
        lastUpdated: "2025-01-05",
    },
    {
        id: "10",
        name: "Tusuk Sate Bambu",
        category: "lainnya",
        unit: "pack",
        currentStock: 30,
        minStock: 20,
        price: 8000,
        lastUpdated: "2025-01-01",
    },
]

const categoryLabels: Record<string, string> = {
    bahan_baku: "Bahan Baku",
    kemasan: "Kemasan",
    bumbu: "Bumbu",
    lainnya: "Lainnya",
}

export default function InventoryPage() {
    const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isStockDialogOpen, setIsStockDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
    const [stockItem, setStockItem] = useState<InventoryItem | null>(null)
    const [stockChange, setStockChange] = useState({ type: "add" as "add" | "minus", amount: "" })
    const [formData, setFormData] = useState({
        name: "",
        category: "bahan_baku" as InventoryItem["category"],
        unit: "",
        currentStock: "",
        minStock: "",
        price: "",
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

    // Calculate stats
    const stats = useMemo(() => {
        const lowStock = inventory.filter(i => i.currentStock <= i.minStock)
        const totalValue = inventory.reduce((acc, i) => acc + (i.currentStock * i.price), 0)

        return {
            total: inventory.length,
            lowStock: lowStock.length,
            adequate: inventory.length - lowStock.length,
            totalValue,
        }
    }, [inventory])

    const getStockStatus = (item: InventoryItem) => {
        if (item.currentStock <= item.minStock) {
            return (
                <Badge className="bg-red-500 text-white hover:bg-red-600 border-none">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Stok Rendah
                </Badge>
            )
        }
        return (
            <Badge className="bg-green-500 text-white hover:bg-green-600 border-none">
                <CheckCircle className="w-3 h-3 mr-1" /> Cukup
            </Badge>
        )
    }

    const getCategoryBadge = (category: string) => {
        const colors: Record<string, string> = {
            bahan_baku: "bg-blue-100 text-blue-700 border-blue-200",
            kemasan: "bg-purple-100 text-purple-700 border-purple-200",
            bumbu: "bg-orange-100 text-orange-700 border-orange-200",
            lainnya: "bg-slate-100 text-slate-700 border-slate-200",
        }
        return (
            <Badge variant="outline" className={colors[category]}>
                {categoryLabels[category]}
            </Badge>
        )
    }

    const handleOpenDialog = (item?: InventoryItem) => {
        if (item) {
            setEditingItem(item)
            setFormData({
                name: item.name,
                category: item.category,
                unit: item.unit,
                currentStock: item.currentStock.toString(),
                minStock: item.minStock.toString(),
                price: item.price.toString(),
            })
        } else {
            setEditingItem(null)
            setFormData({
                name: "",
                category: "bahan_baku",
                unit: "",
                currentStock: "",
                minStock: "",
                price: "",
            })
        }
        setIsDialogOpen(true)
    }

    const handleOpenStockDialog = (item: InventoryItem) => {
        setStockItem(item)
        setStockChange({ type: "add", amount: "" })
        setIsStockDialogOpen(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (editingItem) {
            setInventory(inventory.map(i =>
                i.id === editingItem.id
                    ? {
                        ...i,
                        name: formData.name,
                        category: formData.category,
                        unit: formData.unit,
                        currentStock: parseFloat(formData.currentStock),
                        minStock: parseFloat(formData.minStock),
                        price: parseFloat(formData.price),
                        lastUpdated: new Date().toISOString().split('T')[0],
                    }
                    : i
            ))
        } else {
            const newItem: InventoryItem = {
                id: Date.now().toString(),
                name: formData.name,
                category: formData.category,
                unit: formData.unit,
                currentStock: parseFloat(formData.currentStock),
                minStock: parseFloat(formData.minStock),
                price: parseFloat(formData.price),
                lastUpdated: new Date().toISOString().split('T')[0],
            }
            setInventory([...inventory, newItem])
        }

        setIsDialogOpen(false)
        setEditingItem(null)
    }

    const handleStockUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!stockItem) return

        const amount = parseFloat(stockChange.amount)
        const newStock = stockChange.type === "add"
            ? stockItem.currentStock + amount
            : Math.max(0, stockItem.currentStock - amount)

        setInventory(inventory.map(i =>
            i.id === stockItem.id
                ? { ...i, currentStock: newStock, lastUpdated: new Date().toISOString().split('T')[0] }
                : i
        ))

        setIsStockDialogOpen(false)
        setStockItem(null)
    }

    const handleDelete = (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus item ini?")) {
            setInventory(inventory.filter(i => i.id !== id))
        }
    }

    // Table columns configuration
    const columns = [
        {
            key: "name" as keyof InventoryItem,
            label: "Item",
            className: "min-w-[180px]",
            render: (item: InventoryItem) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 dark:text-white">
                        {item.name}
                    </span>
                    <span className="text-xs text-slate-500 sm:hidden mt-0.5">
                        {getCategoryBadge(item.category)}
                    </span>
                </div>
            ),
        },
        {
            key: "category" as keyof InventoryItem,
            label: "Kategori",
            className: "hidden sm:table-cell",
            render: (item: InventoryItem) => getCategoryBadge(item.category),
        },
        {
            key: "currentStock" as keyof InventoryItem,
            label: "Stok",
            className: "text-center",
            render: (item: InventoryItem) => (
                <div className="flex flex-col items-center">
                    <span className="font-bold text-lg text-slate-900 dark:text-white">
                        {item.currentStock}
                    </span>
                    <span className="text-xs text-slate-500">{item.unit}</span>
                </div>
            ),
        },
        {
            key: "minStock" as keyof InventoryItem,
            label: "Min. Stok",
            className: "hidden md:table-cell text-center",
            render: (item: InventoryItem) => (
                <span className="text-slate-600 dark:text-slate-400">
                    {item.minStock} {item.unit}
                </span>
            ),
        },
        {
            key: "status" as string,
            label: "Status",
            render: (item: InventoryItem) => getStockStatus(item),
        },
        {
            key: "price" as keyof InventoryItem,
            label: "Harga",
            className: "hidden lg:table-cell text-right",
            render: (item: InventoryItem) => (
                <span className="text-slate-700 dark:text-slate-300">
                    {formatCurrency(item.price)}/{item.unit}
                </span>
            ),
        },
        {
            key: "actions" as string,
            label: "Aksi",
            className: "text-right w-[130px]",
            render: (item: InventoryItem) => (
                <div className="flex items-center justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenStockDialog(item)}
                        className="h-8 w-8 text-slate-500 hover:text-green-600 hover:bg-green-50"
                        title="Update Stok"
                    >
                        <Package className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(item)}
                        className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                        title="Edit"
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                        title="Hapus"
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
                        Inventaris
                    </h1>
                    <p className="text-slate-500 mt-1">Kelola stok bahan baku dan perlengkapan</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => handleOpenDialog()}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Item
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Box className="w-5 h-5 text-red-500" />
                                    {editingItem ? "Edit Item" : "Tambah Item Baru"}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingItem
                                        ? "Perbarui informasi item inventori."
                                        : "Tambahkan item baru ke inventori."
                                    }
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Item</Label>
                                    <Input
                                        id="name"
                                        placeholder="Tepung Terigu"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="category">Kategori</Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(value) => setFormData({ ...formData, category: value as InventoryItem["category"] })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Kategori" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="bahan_baku">Bahan Baku</SelectItem>
                                                <SelectItem value="kemasan">Kemasan</SelectItem>
                                                <SelectItem value="bumbu">Bumbu</SelectItem>
                                                <SelectItem value="lainnya">Lainnya</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="unit">Satuan</Label>
                                        <Input
                                            id="unit"
                                            placeholder="kg, pcs, liter"
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="currentStock">Stok Saat Ini</Label>
                                        <Input
                                            id="currentStock"
                                            type="number"
                                            placeholder="50"
                                            value={formData.currentStock}
                                            onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="minStock">Minimal Stok</Label>
                                        <Input
                                            id="minStock"
                                            type="number"
                                            placeholder="20"
                                            value={formData.minStock}
                                            onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="price">Harga per Satuan (Rp)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="15000"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white">
                                    {editingItem ? "Simpan Perubahan" : "Tambah Item"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stock Update Dialog */}
            <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <form onSubmit={handleStockUpdate}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-green-500" />
                                Update Stok
                            </DialogTitle>
                            <DialogDescription>
                                {stockItem?.name} - Stok saat ini: {stockItem?.currentStock} {stockItem?.unit}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Jenis Update</Label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant={stockChange.type === "add" ? "default" : "outline"}
                                        className={stockChange.type === "add" ? "bg-green-500 hover:bg-green-600" : ""}
                                        onClick={() => setStockChange({ ...stockChange, type: "add" })}
                                    >
                                        <Plus className="w-4 h-4 mr-1" /> Tambah
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={stockChange.type === "minus" ? "default" : "outline"}
                                        className={stockChange.type === "minus" ? "bg-red-500 hover:bg-red-600" : ""}
                                        onClick={() => setStockChange({ ...stockChange, type: "minus" })}
                                    >
                                        <Minus className="w-4 h-4 mr-1" /> Kurangi
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="amount">Jumlah ({stockItem?.unit})</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="10"
                                    value={stockChange.amount}
                                    onChange={(e) => setStockChange({ ...stockChange, amount: e.target.value })}
                                    required
                                />
                            </div>

                            {stockChange.amount && stockItem && (
                                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Stok setelah update:{" "}
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            {stockChange.type === "add"
                                                ? stockItem.currentStock + parseFloat(stockChange.amount || "0")
                                                : Math.max(0, stockItem.currentStock - parseFloat(stockChange.amount || "0"))
                                            } {stockItem.unit}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsStockDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className={stockChange.type === "add"
                                    ? "bg-green-500 hover:bg-green-600 text-white"
                                    : "bg-red-500 hover:bg-red-600 text-white"
                                }
                            >
                                {stockChange.type === "add" ? "Tambah Stok" : "Kurangi Stok"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <GlassCard className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <Box className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total Item</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white border-none shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Stok Rendah</p>
                            <p className="text-2xl font-bold">{stats.lowStock}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-amber-400 to-amber-500 text-amber-900 border-none shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/30 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Stok Cukup</p>
                            <p className="text-2xl font-bold">{stats.adequate}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-slate-700 to-slate-800 text-white border-none shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Nilai Stok</p>
                            <p className="text-lg font-bold">{formatCurrency(stats.totalValue)}</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* DataTable */}
            <GlassCard className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200/50">
                <DataTable
                    data={inventory}
                    columns={columns}
                    searchKey="name"
                    searchPlaceholder="Cari item..."
                    emptyMessage="Belum ada item inventori"
                    emptyIcon={<Box className="w-12 h-12" />}
                />
            </GlassCard>
        </div>
    )
}
