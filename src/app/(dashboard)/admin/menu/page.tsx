"use client"

import { useState, useEffect, useMemo } from "react"
import { Plus, Pencil, Trash2, Search, UtensilsCrossed, Filter, Box, CheckCircle, AlertTriangle } from "lucide-react"
import { GlassCard } from "@/components/shared/GlassCard"
import { DataTable } from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { createClient } from "@/lib/supabase-browser"
import { MENU_CATEGORIES } from "@/lib/constants"
import { formatCurrency, getCategoryLabel, getCategoryBadgeStyle } from "@/lib/formatting"
import type { Product, ProductFormData } from "@/lib/types"
export default function AdminMenuPage() {
    const supabase = createClient()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        variant: "",
        price: "",
        pcsPerPortion: "",
    })

    // Fetch products on load
    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('category', { ascending: true })
                .order('name', { ascending: true })

            if (error) throw error

            if (data) {
                // Map snake_case DB columns to camelCase frontend interface
                const mappedProducts: Product[] = data.map(p => ({
                    id: p.id,
                    name: p.name,
                    category: p.category,
                    variant: p.variant || "",
                    price: p.price,
                    pcsPerPortion: p.pcs_per_portion || 1,
                    isActive: p.is_active
                }))
                setProducts(mappedProducts)
            }
        } catch (error) {
            console.error("Error fetching products:", error)
            alert("Gagal mengambil data menu")
        } finally {
            setLoading(false)
        }
    }

    const getCategoryBadge = (category: string) => {
        return (
            <Badge variant="outline" className={getCategoryBadgeStyle(category)}>
                {getCategoryLabel(category)}
            </Badge>
        )
    }

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === "all" || p.category === selectedCategory
        return matchesSearch && matchesCategory
    })

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

    const handleDelete = async (id: string) => {
        if (confirm("Yakin ingin menghapus menu ini?")) {
            try {
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', id)

                if (error) throw error

                // Update local state
                setProducts(prev => prev.filter(p => p.id !== id))
            } catch (error) {
                console.error("Error deleting product:", error)
                alert("Gagal menghapus menu")
            }
        }
    }

    const handleSubmit = async () => {
        if (!formData.name || !formData.category) {
            alert("Nama dan kategori wajib diisi!")
            return
        }

        const payload = {
            name: formData.name,
            category: formData.category,
            variant: formData.variant || null,
            price: parseInt(formData.price) || 0,
            pcs_per_portion: parseInt(formData.pcsPerPortion) || 1,
        }

        try {
            if (editingProduct) {
                // Update
                const { error } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', editingProduct.id)

                if (error) throw error

                fetchProducts() // Refresh to ensure sync
            } else {
                // Add new
                const { error } = await supabase
                    .from('products')
                    .insert([payload])

                if (error) throw error

                fetchProducts() // Refresh to ensure sync
            }
            setIsDialogOpen(false)
        } catch (error) {
            console.error("Error saving product:", error)
            alert("Gagal menyimpan data menu")
        }
    }

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            // Optimistic update
            setProducts(prev => prev.map(p =>
                p.id === id ? { ...p, isActive: !currentStatus } : p
            ))

            const { error } = await supabase
                .from('products')
                .update({ is_active: !currentStatus })
                .eq('id', id)

            if (error) {
                // Revert on error
                setProducts(prev => prev.map(p =>
                    p.id === id ? { ...p, isActive: currentStatus } : p
                ))
                throw error
            }
        } catch (error) {
            console.error("Error updating status:", error)
            alert("Gagal mengubah status aktif")
        }
    }

    // Stats
    const stats = useMemo(() => {
        return {
            total: products.length,
            active: products.filter(p => p.isActive).length,
            paket: products.filter(p => p.category === "paket").length,
            dimsum: products.filter(p => p.category === "dimsum").length,
        }
    }, [products])

    const columns = [
        {
            key: "name",
            label: "Nama Menu",
            render: (product: Product) => (
                <div className="flex flex-col">
                    <span className={`font-medium ${!product.isActive ? 'text-slate-400 line-through' : ''}`}>
                        {product.name}
                    </span>
                    {!product.isActive && (
                        <span className="text-xs text-red-500">Nonaktif</span>
                    )}
                </div>
            )
        },
        {
            key: "category",
            label: "Kategori",
            render: (product: Product) => getCategoryBadge(product.category)
        },
        {
            key: "price",
            label: "Harga",
            render: (product: Product) => (
                <span className="font-medium">
                    {formatCurrency(product.price)}
                    <span className="text-slate-400 text-xs ml-1">/{product.pcsPerPortion}pcs</span>
                </span>
            )
        },
        {
            key: "actions",
            label: "Aksi",
            render: (product: Product) => (
                <div className="flex items-center gap-2 justify-end">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActive(product.id, product.isActive)}
                        className={product.isActive ? "text-green-600 hover:bg-green-50" : "text-slate-400 hover:bg-slate-50"}
                        title={product.isActive ? "Nonaktifkan" : "Aktifkan"}
                    >
                        {product.isActive ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                        className="text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-500 hover:text-red-500 hover:bg-red-50"
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
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
                                        {MENU_CATEGORIES.filter(c => c.value !== 'all').map(cat => (
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
                                    <p className="text-xs text-slate-500">Masukan harga per porsi/pcs</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Jumlah (pcs/porsi)</Label>
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

            {/* Stats Cards - Matches Inventory Design */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <GlassCard className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <UtensilsCrossed className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total Menu</p>
                            <p className="text-2xl font-bold">{stats.total}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Menu Aktif</p>
                            <p className="text-2xl font-bold">{stats.active}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white border-none shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <Box className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Paket</p>
                            <p className="text-2xl font-bold">{stats.paket}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-slate-700 to-slate-800 text-white border-none shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <UtensilsCrossed className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Dimsum</p>
                            <p className="text-2xl font-bold">{stats.dimsum}</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Filter and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <GlassCard className="flex-1 p-2 bg-white border border-slate-200 flex items-center gap-2">
                    <Search className="w-5 h-5 text-slate-400 ml-2" />
                    <Input
                        placeholder="Cari nama menu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-none shadow-none focus-visible:ring-0"
                    />
                </GlassCard>
                <GlassCard className="w-full sm:w-[200px] p-2 bg-white border border-slate-200">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="border-none shadow-none focus:ring-0">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-slate-500" />
                                <SelectValue placeholder="Kategori" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {MENU_CATEGORIES.map(cat => (
                                <SelectItem key={cat.value} value={cat.value}>
                                    {cat.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </GlassCard>
            </div>

            {/* Table */}
            <GlassCard className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200/50">
                {loading ? (
                    <div className="text-center py-8 text-slate-500">Memuat data menu...</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredProducts}
                    />
                )}
            </GlassCard>
        </div>
    )
}
