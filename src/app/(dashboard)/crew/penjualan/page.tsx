"use client"

import { useState } from "react"
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

// Products with prices
const products = [
    { id: "1", name: "Paket Reguler", category: "paket", price: 10000 },
    { id: "2", name: "Paket Kenyang", category: "paket", price: 20000 },
    { id: "3", name: "Dimsum Mentai", category: "paket", price: 30000 },
    { id: "4", name: "Gyoza Mentai", category: "paket", price: 25000 },
    { id: "5", name: "Gyoza Kukus Reguler", category: "gyoza", price: 10000 },
    { id: "6", name: "Gyoza Kukus Kenyang", category: "gyoza", price: 20000 },
    { id: "7", name: "Gyoza Goreng Reguler", category: "gyoza", price: 10000 },
    { id: "8", name: "Gyoza Goreng Kenyang", category: "gyoza", price: 20000 },
    { id: "9", name: "Wonton Kuah", category: "wonton", price: 10000 },
    { id: "10", name: "Wonton Goreng", category: "wonton", price: 10000 },
]

// Mock outlets
const outlets = [
    { id: "1", name: "Sam Deni Dimsum - Pusat" },
    { id: "2", name: "Sam Deni Dimsum - Bandung" },
    { id: "3", name: "Sam Deni Dimsum - Surabaya" },
]

interface SaleEntry {
    productId: string
    quantity: number
    price: number
}

export default function BoothPenjualanPage() {
    const [selectedOutlet, setSelectedOutlet] = useState("")
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [entries, setEntries] = useState<SaleEntry[]>(
        products.map(p => ({ productId: p.id, quantity: 0, price: p.price }))
    )
    const [cashAmount, setCashAmount] = useState("")
    const [qrisAmount, setQrisAmount] = useState("")
    const [pengeluaran, setPengeluaran] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

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

        // TODO: Submit to Supabase and sync to Google Sheets
        console.log("Submitting:", {
            outlet: selectedOutlet,
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

        // Reset form after success
        setTimeout(() => {
            setShowSuccess(false)
            setEntries(products.map(p => ({ productId: p.id, quantity: 0, price: p.price })))
            setCashAmount("")
            setQrisAmount("")
            setPengeluaran("")
        }, 2000)
    }

    return (
        <div className="space-y-6 pb-24">
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
                    {/* Paket Section */}
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                        <h4 className="font-medium text-red-700 mb-3">Paket</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {products.filter(p => p.category === "paket").map(product => (
                                <div key={product.id} className="flex items-center justify-between bg-white p-2 rounded-lg">
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

                    {/* Gyoza Section */}
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                        <h4 className="font-medium text-amber-700 mb-3">Gyoza</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {products.filter(p => p.category === "gyoza").map(product => (
                                <div key={product.id} className="flex items-center justify-between bg-white p-2 rounded-lg">
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

                    {/* Wonton Section */}
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <h4 className="font-medium text-blue-700 mb-3">Wonton</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {products.filter(p => p.category === "wonton").map(product => (
                                <div key={product.id} className="flex items-center justify-between bg-white p-2 rounded-lg">
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

            {/* Submit Section - Fixed at bottom */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-slate-200 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="grid grid-cols-4 gap-3 text-center">
                        <div className="bg-amber-50 px-3 py-2 rounded-lg">
                            <p className="text-xs text-amber-600">Est. dari Menu</p>
                            <p className="text-lg font-bold text-amber-700">{formatCurrency(estimatedRevenue)}</p>
                        </div>
                        <div className="bg-green-50 px-3 py-2 rounded-lg">
                            <p className="text-xs text-green-600">Total Pemasukan</p>
                            <p className="text-lg font-bold text-green-700">{formatCurrency(totalPemasukan)}</p>
                        </div>
                        <div className="bg-red-50 px-3 py-2 rounded-lg">
                            <p className="text-xs text-red-600">Pengeluaran</p>
                            <p className="text-lg font-bold text-red-700">{formatCurrency(totalPengeluaran)}</p>
                        </div>
                        <div className="bg-blue-50 px-3 py-2 rounded-lg">
                            <p className="text-xs text-blue-600">Netto</p>
                            <p className="text-lg font-bold text-blue-700">{formatCurrency(netIncome)}</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || showSuccess}
                        className={`px-8 py-6 text-lg ${showSuccess
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
