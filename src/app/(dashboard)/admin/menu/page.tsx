"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Search, UtensilsCrossed } from "lucide-react"
import { GlassCard } from "@/components/shared/GlassCard"
import { DataTable } from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
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

interface Product {
    id: string
    name: string
    category: string
    variant: string
    price: number
    pcsPerPortion: number
    isActive: boolean
}

// Initial products from database
const initialProducts: Product[] = [
    { id: "1", name: "Paket Reguler", category: "paket", variant: "reguler", price: 10000, pcsPerPortion: 3, isActive: true },
    { id: "2", name: "Paket Kenyang", category: "paket", variant: "kenyang", price: 20000, pcsPerPortion: 7, isActive: true },
    { id: "3", name: "Dimsum Mentai", category: "paket", variant: "dimsum_mentai", price: 30000, pcsPerPortion: 6, isActive: true },
    { id: "4", name: "Gyoza Mentai", category: "paket", variant: "gyoza_mentai", price: 25000, pcsPerPortion: 7, isActive: true },
    { id: "5", name: "Gyoza Kukus Reguler", category: "gyoza", variant: "kukus_reguler", price: 10000, pcsPerPortion: 4, isActive: true },
    { id: "6", name: "Gyoza Kukus Kenyang", category: "gyoza", variant: "kukus_kenyang", price: 20000, pcsPerPortion: 10, isActive: true },
    { id: "7", name: "Gyoza Goreng Reguler", category: "gyoza", variant: "goreng_reguler", price: 10000, pcsPerPortion: 4, isActive: true },
    { id: "8", name: "Gyoza Goreng Kenyang", category: "gyoza", variant: "goreng_kenyang", price: 20000, pcsPerPortion: 10, isActive: true },
    { id: "9", name: "Wonton Kuah", category: "wonton", variant: "kuah", price: 10000, pcsPerPortion: 8, isActive: true },
    { id: "10", name: "Wonton Goreng", category: "wonton", variant: "goreng", price: 10000, pcsPerPortion: 8, isActive: true },
    { id: "11", name: "Dimsum Udang", category: "dimsum", variant: "udang", price: 0, pcsPerPortion: 1, isActive: true },
    { id: "12", name: "Dimsum Wortel", category: "dimsum", variant: "wortel", price: 0, pcsPerPortion: 1, isActive: true },
    { id: "13", name: "Dimsum Jamur", category: "dimsum", variant: "jamur", price: 0, pcsPerPortion: 1, isActive: true },
    { id: "14", name: "Dimsum Keju", category: "dimsum", variant: "keju", price: 0, pcsPerPortion: 1, isActive: true },
    { id: "15", name: "Dimsum Crabstick", category: "dimsum", variant: "crabstick", price: 0, pcsPerPortion: 1, isActive: true },
    { id: "16", name: "Lumpia Basah", category: "dimsum", variant: "lumpia", price: 0, pcsPerPortion: 1, isActive: true },
]

const categories = [
    { value: "paket", label: "Paket" },
    { value: "gyoza", label: "Gyoza" },
    { value: "wonton", label: "Wonton" },
    { value: "dimsum", label: "Dimsum (Varian)" },
]

export default function AdminMenuPage() {
    const [products, setProducts] = useState<Product[]>(initialProducts)
    const [searchQuery, setSearchQuery] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        variant: "",
        price: "",
        pcsPerPortion: "",
    })

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const getCategoryLabel = (category: string) => {
        return categories.find(c => c.value === category)?.label || category
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "paket": return "bg-red-100 text-red-700"
            case "gyoza": return "bg-amber-100 text-amber-700"
            case "wonton": return "bg-blue-100 text-blue-700"
            case "dimsum": return "bg-green-100 text-green-700"
            default: return "bg-slate-100 text-slate-700"
        }
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAdd = () => {
        setEditingProduct(null)
        setFormData({ name: "", category: "", variant: "", price: "", pcsPerPortion: "" })
        setIsDialogOpen(true)
    }

    const handleEdit = (product: Product) => {
        setEditingProduct(product)
        setFormData({
            name: product.name,
            category: product.category,
            variant: product.variant,
            price: product.price.toString(),
            pcsPerPortion: product.pcsPerPortion.toString(),
        })
        setIsDialogOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm("Yakin ingin menghapus menu ini?")) {
            setProducts(prev => prev.filter(p => p.id !== id))
        }
    }

    const handleSubmit = () => {
        if (!formData.name || !formData.category) {
            alert("Nama dan kategori wajib diisi!")
            return
        }

        if (editingProduct) {
            // Update
            setProducts(prev => prev.map(p =>
                p.id === editingProduct.id
                    ? {
                        ...p,
                        name: formData.name,
                        category: formData.category,
                        variant: formData.variant,
                        price: parseInt(formData.price) || 0,
                        pcsPerPortion: parseInt(formData.pcsPerPortion) || 1,
                    }
                    : p
            ))
        } else {
            // Add new
            const newProduct: Product = {
                id: Date.now().toString(),
                name: formData.name,
                category: formData.category,
                variant: formData.variant,
                price: parseInt(formData.price) || 0,
                pcsPerPortion: parseInt(formData.pcsPerPortion) || 1,
                isActive: true,
            }
            setProducts(prev => [...prev, newProduct])
        }

        setIsDialogOpen(false)
    }

    const toggleActive = (id: string) => {
        setProducts(prev => prev.map(p =>
            p.id === id ? { ...p, isActive: !p.isActive } : p
        ))
    }

    // Stats
    const totalProducts = products.length
    const activeProducts = products.filter(p => p.isActive).length
    const paketCount = products.filter(p => p.category === "paket").length
    const varianCount = products.filter(p => p.category === "dimsum").length

    const columns = [
        {
            key: "name",
            label: "Nama Menu",
            render: (product: Product) => (
                <div className="flex items-center gap-2">
                    <span className={`font-medium ${!product.isActive ? 'text-slate-400 line-through' : ''}`}>
                        {product.name}
                    </span>
                    {!product.isActive && (
                        <span className="px-2 py-0.5 text-xs bg-slate-200 text-slate-600 rounded">Nonaktif</span>
                    )}
                </div>
            )
        },
        {
            key: "category",
            label: "Kategori",
            render: (product: Product) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                    {getCategoryLabel(product.category)}
                </span>
            )
        },
        {
            key: "price",
            label: "Harga",
            render: (product: Product) => (
                <span className={product.price === 0 ? "text-slate-400" : "font-medium"}>
                    {product.price === 0 ? "Varian" : formatCurrency(product.price)}
                </span>
            )
        },
        {
            key: "pcsPerPortion",
            label: "Porsi (pcs)",
            render: (product: Product) => (
                <span className="text-slate-600">{product.pcsPerPortion} pcs</span>
            )
        },
        {
            key: "actions",
            label: "Aksi",
            render: (product: Product) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActive(product.id)}
                        className={product.isActive ? "text-green-600" : "text-slate-400"}
                    >
                        {product.isActive ? "Aktif" : "Nonaktif"}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product)}
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(product.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                        Manajemen Menu
                    </h1>
                    <p className="text-slate-500 mt-1">Kelola daftar menu produk Sam Deni Dimsum</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={handleAdd}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Tambah Menu
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingProduct ? "Edit Menu" : "Tambah Menu Baru"}
                            </DialogTitle>
                            <DialogDescription>
                                {editingProduct ? "Ubah detail menu yang sudah ada" : "Tambahkan menu baru ke daftar produk"}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>Nama Menu *</Label>
                                <Input
                                    placeholder="Contoh: Paket Super"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Kategori *</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Harga (Rp)</Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                    <p className="text-xs text-slate-500">0 untuk varian dimsum</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Jumlah (pcs)</Label>
                                    <Input
                                        type="number"
                                        placeholder="1"
                                        value={formData.pcsPerPortion}
                                        onChange={(e) => setFormData({ ...formData, pcsPerPortion: e.target.value })}
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleSubmit}
                                className="w-full bg-gradient-to-r from-red-500 to-red-600"
                            >
                                {editingProduct ? "Simpan Perubahan" : "Tambah Menu"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GlassCard className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white border-none">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-80">Total Menu</p>
                            <p className="text-2xl font-bold">{totalProducts}</p>
                        </div>
                        <UtensilsCrossed className="w-8 h-8 opacity-50" />
                    </div>
                </GlassCard>
                <GlassCard className="p-4 bg-white border border-slate-200">
                    <p className="text-sm text-slate-500">Menu Aktif</p>
                    <p className="text-2xl font-bold text-green-600">{activeProducts}</p>
                </GlassCard>
                <GlassCard className="p-4 bg-white border border-slate-200">
                    <p className="text-sm text-slate-500">Paket</p>
                    <p className="text-2xl font-bold text-amber-600">{paketCount}</p>
                </GlassCard>
                <GlassCard className="p-4 bg-white border border-slate-200">
                    <p className="text-sm text-slate-500">Varian Dimsum</p>
                    <p className="text-2xl font-bold text-blue-600">{varianCount}</p>
                </GlassCard>
            </div>

            {/* Search */}
            <GlassCard className="p-4 bg-white border border-slate-200">
                <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-slate-400" />
                    <Input
                        placeholder="Cari menu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-none shadow-none focus-visible:ring-0"
                    />
                </div>
            </GlassCard>

            {/* Table */}
            <DataTable
                columns={columns}
                data={filteredProducts}
            />
        </div>
    )
}
