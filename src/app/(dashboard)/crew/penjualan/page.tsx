"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Banknote, CreditCard, Receipt, Save, Check, Minus } from "lucide-react"
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
import { createClient } from "@/lib/supabase-browser"

interface Product {
    id: string
    name: string
    category: string
    price: number
}

interface Outlet {
    id: string
    name: string
}

interface SaleEntry {
    productId: string
    quantity: number
    price: number
}

export default function BoothPenjualanPage() {
    const supabase = createClient()
    const [products, setProducts] = useState<Product[]>([])
    const [outlets, setOutlets] = useState<Outlet[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedOutlet, setSelectedOutlet] = useState("")
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [entries, setEntries] = useState<SaleEntry[]>([])
    const [cashAmount, setCashAmount] = useState("")
    const [qrisAmount, setQrisAmount] = useState("")
    const [pengeluaran, setPengeluaran] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)

                // Fetch Products
                const { data: productsData, error: productsError } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_active', true)
                    .order('category', { ascending: true })
                    .order('name', { ascending: true })

                if (productsError) throw productsError

                // Fetch Outlets
                const { data: outletsData, error: outletsError } = await supabase
                    .from('outlets')
                    .select('*')
                    .order('name', { ascending: true })

                if (outletsError) {
                    console.warn("Error fetching outlets, using mock data or empty:", outletsError)
                    // Optional: Validation if outlets table doesn't exist yet, but migration should have created it.
                }

                if (productsData) {
                    const mappedProducts = productsData.map(p => ({
                        id: p.id,
                        name: p.name,
                        category: p.category,
                        price: p.price
                    }))
                    setProducts(mappedProducts)

                    // Initialize entries with 0 quantity
                    setEntries(mappedProducts.map(p => ({
                        productId: p.id,
                        quantity: 0,
                        price: p.price
                    })))
                }

                if (outletsData) {
                    setOutlets(outletsData.map(o => ({ id: o.id, name: o.name })))
                } else {
                    // Fallback if no outlets in DB yet
                    setOutlets([
                        { id: "1", name: "Sam Deni Dimsum - Pusat" },
                        { id: "2", name: "Sam Deni Dimsum - Bandung" },
                    ])
                }

            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleQuantityChange = (productId: string, value: string) => {
        const qty = parseInt(value) || 0
        setEntries(prev => prev.map(e =>
            e.productId === productId ? { ...e, quantity: qty } : e
        ))
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    // Helper to get consistent colors for categories
    const getCategoryStyles = (category: string) => {
        const cat = category.toLowerCase()
        if (cat.includes("paket")) return "bg-red-50 border-red-100 text-red-700"
        if (cat.includes("gyoza")) return "bg-amber-50 border-amber-100 text-amber-700"
        if (cat.includes("wonton")) return "bg-blue-50 border-blue-100 text-blue-700"
        if (cat.includes("dimsum")) return "bg-green-50 border-green-100 text-green-700"
        return "bg-slate-50 border-slate-100 text-slate-700"
    }

    // Group products by category
    const groupedProducts = products.reduce((acc, product) => {
        const cat = product.category
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(product)
        return acc
    }, {} as Record<string, Product[]>)

    // Calculate totals
    const totalItemsSold = entries.reduce((sum, e) => sum + e.quantity, 0)
    const estimatedRevenue = entries.reduce((sum, e) => sum + (e.quantity * e.price), 0)
    const totalCash = parseInt(cashAmount) || 0
    const totalQris = parseInt(qrisAmount) || 0
    const totalPemasukan = totalCash + totalQris
    const totalPengeluaran = parseInt(pengeluaran) || 0
    const netIncome = totalPemasukan - totalPengeluaran

    const handleSubmit = async () => {
        if (!selectedOutlet) {
            alert("Pilih outlet terlebih dahulu!")
            return
        }

        if (totalPemasukan === 0) {
            alert("Masukkan nominal pemasukan!")
            return
        }

        setIsSubmitting(true)

        // TODO: Backend integration for submitting sales
        // Currently just logging
        console.log("Submitting:", {
            outlet_id: selectedOutlet,
            date,
            items: entries.filter(e => e.quantity > 0),
            cashAmount: totalCash,
            qrisAmount: totalQris,
            pengeluaran: totalPengeluaran,
            netIncome
        })

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        setIsSubmitting(false)
        setShowSuccess(true)

        // Reset form
        setTimeout(() => {
            setShowSuccess(false)
            setEntries(products.map(p => ({ productId: p.id, quantity: 0, price: p.price })))
            setCashAmount("")
            setQrisAmount("")
            setPengeluaran("")
        }, 2000)
    }

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Memuat data produk...</div>
    }

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] -m-6 sm:-m-8">
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                        Input Penjualan Harian
                    </h1>
                    <p className="text-slate-500 mt-1">Crew Outlet - Catat penjualan dan pemasukan harian</p>
                </div>

                {/* Outlet & Date Selection */}
                <GlassCard className="p-4 bg-white border border-slate-200/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <Label>Tanggal</Label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>
                </GlassCard>

                {/* Item Sales Input */}
                <GlassCard className="p-4 bg-white border border-slate-200/50">
                    <div className="flex items-center gap-2 mb-4">
                        <ShoppingCart className="w-5 h-5 text-red-500" />
                        <h3 className="font-semibold text-lg">Item Terjual</h3>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(groupedProducts).map(([category, items]) => {
                            const styleClass = getCategoryStyles(category)
                            // Extract text color class for title
                            const titleColorClass = styleClass.split(' ').find(c => c.startsWith('text-')) || 'text-slate-700'

                            return (
                                <div key={category} className={`${styleClass} p-3 rounded-lg border bg-opacity-50`}>
                                    <h4 className={`font-medium mb-3 capitalize ${titleColorClass}`}>{category}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {items.map(product => (
                                            <div key={product.id} className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm">
                                                <div>
                                                    <span className="font-medium text-sm">{product.name}</span>
                                                    <span className="text-xs text-slate-500 ml-2">{formatCurrency(product.price)}</span>
                                                </div>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    className="w-20 text-center"
                                                    value={entries.find(e => e.productId === product.id)?.quantity || 0}
                                                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Summary */}
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                        <span className="font-medium text-slate-600">Total Item Terjual</span>
                        <span className="text-xl font-bold text-slate-800">{totalItemsSold} pcs</span>
                    </div>
                </GlassCard>

                {/* Cash & QRIS Input */}
                <GlassCard className="p-4 bg-white border border-slate-200/50">
                    <div className="flex items-center gap-2 mb-4">
                        <Receipt className="w-5 h-5 text-green-500" />
                        <h3 className="font-semibold text-lg">Pemasukan & Pengeluaran</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Cash */}
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Banknote className="w-5 h-5 text-green-600" />
                                <Label className="font-medium text-green-700">Pemasukan Cash</Label>
                            </div>
                            <Input
                                type="number"
                                placeholder="0"
                                className="text-lg font-semibold"
                                value={cashAmount}
                                onChange={(e) => setCashAmount(e.target.value)}
                            />
                        </div>

                        {/* QRIS */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                <Label className="font-medium text-blue-700">Pemasukan QRIS</Label>
                            </div>
                            <Input
                                type="number"
                                placeholder="0"
                                className="text-lg font-semibold"
                                value={qrisAmount}
                                onChange={(e) => setQrisAmount(e.target.value)}
                            />
                        </div>

                        {/* Pengeluaran */}
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Minus className="w-5 h-5 text-red-600" />
                                <Label className="font-medium text-red-700">Pengeluaran</Label>
                            </div>
                            <Input
                                type="number"
                                placeholder="0"
                                className="text-lg font-semibold"
                                value={pengeluaran}
                                onChange={(e) => setPengeluaran(e.target.value)}
                            />
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Fixed Footer */}
            <div className="p-4 bg-white border-t border-slate-200 shadow-lg z-10 shrink-0">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center w-full sm:w-auto">
                        <div className="bg-amber-50 px-2 sm:px-3 py-2 rounded-lg">
                            <p className="text-xs text-amber-600">Est. Menu</p>
                            <p className="text-sm sm:text-lg font-bold text-amber-700">{formatCurrency(estimatedRevenue)}</p>
                        </div>
                        <div className="bg-green-50 px-2 sm:px-3 py-2 rounded-lg">
                            <p className="text-xs text-green-600">Pemasukan</p>
                            <p className="text-sm sm:text-lg font-bold text-green-700">{formatCurrency(totalPemasukan)}</p>
                        </div>
                        <div className="bg-red-50 px-2 sm:px-3 py-2 rounded-lg">
                            <p className="text-xs text-red-600">Keluar</p>
                            <p className="text-sm sm:text-lg font-bold text-red-700">{formatCurrency(totalPengeluaran)}</p>
                        </div>
                        <div className="bg-blue-50 px-2 sm:px-3 py-2 rounded-lg">
                            <p className="text-xs text-blue-600">Netto</p>
                            <p className="text-sm sm:text-lg font-bold text-blue-700">{formatCurrency(netIncome)}</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || showSuccess}
                        className={`w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg ${showSuccess
                            ? "bg-green-500 hover:bg-green-500"
                            : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                            } text-white`}
                    >
                        {isSubmitting ? (
                            <>Menyimpan...</>
                        ) : showSuccess ? (
                            <><Check className="w-5 h-5 mr-2" /> Tersimpan!</>
                        ) : (
                            <><Save className="w-5 h-5 mr-2" /> Simpan Penjualan</>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
