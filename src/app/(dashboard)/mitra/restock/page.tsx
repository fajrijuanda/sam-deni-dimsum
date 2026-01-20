"use client"

import { useState } from "react"
import {
    Package,
    ShoppingCart,
    Plus,
    Minus,
    Search,
    Truck
} from "lucide-react"
import { GlassCard } from "@/components/shared/GlassCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/formatting"
import { Badge } from "@/components/ui/badge"

// Mock products (same as admin restock)
const PRODUCTS = [
    { id: "p1", name: "Dimsum Ayam (Isi 10)", price: 25000, image: "🥟" },
    { id: "p2", name: "Dimsum Udang (Isi 10)", price: 35000, image: "🍤" },
    { id: "p3", name: "Dimsum Mix (Isi 20)", price: 45000, image: "🍱" },
    { id: "p4", name: "Siomay Premium (Isi 15)", price: 40000, image: "🥘" },
    { id: "p5", name: "Hakau Udang (Isi 10)", price: 38000, image: "🥟" },
    { id: "p6", name: "Saus Kacang (500ml)", price: 15000, image: "🥜" },
    { id: "p7", name: "Saus Sambal (250ml)", price: 12000, image: "🌶️" },
]

export default function MitraRestockPage() {
    const [cart, setCart] = useState<Record<string, number>>({})
    const [searchQuery, setSearchQuery] = useState("")

    const handleQuantityChange = (productId: string, change: number) => {
        setCart(prev => {
            const currentQty = prev[productId] || 0
            const newQty = Math.max(0, currentQty + change)

            if (newQty === 0) {
                const newCart = { ...prev }
                delete newCart[productId]
                return newCart
            }

            return {
                ...prev,
                [productId]: newQty
            }
        })
    }

    const filteredProducts = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0)
    const totalPrice = Object.entries(cart).reduce((total, [id, qty]) => {
        const product = PRODUCTS.find(p => p.id === id)
        return total + (product ? product.price * qty : 0)
    }, 0)

    return (
        <div className="space-y-6 pb-24 md:pb-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                        Restock Produk
                    </h1>
                    <p className="text-slate-500 mt-1">Pesan stok produk untuk usaha Anda</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Cari produk..."
                        className="pl-9 w-full md:w-[300px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => {
                    const qty = cart[product.id] || 0

                    return (
                        <GlassCard key={product.id} className="p-4 bg-white border border-slate-200 flex flex-col justify-between">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-2xl border border-orange-100">
                                        {product.image}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{product.name}</h3>
                                        <p className="text-red-600 font-bold">{formatCurrency(product.price)}</p>
                                    </div>
                                </div>
                                {qty > 0 && (
                                    <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none">
                                        {qty} di keranjang
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-auto">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-full border-slate-300"
                                    onClick={() => handleQuantityChange(product.id, -1)}
                                    disabled={qty === 0}
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-8 text-center font-semibold text-lg">{qty}</span>
                                <Button
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() => handleQuantityChange(product.id, 1)}
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </GlassCard>
                    )
                })}
            </div>

            {/* Bottom Floating Cart */}
            {totalItems > 0 && (
                <div className="fixed bottom-20 md:bottom-6 left-0 right-0 px-4 md:px-6 z-40">
                    <GlassCard className="max-w-4xl mx-auto p-4 bg-slate-900/95 text-white border-none shadow-2xl backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center relative">
                                    <ShoppingCart className="w-5 h-5 text-white" />
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-red-600 rounded-full text-xs font-bold flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-white/60">Total Pembayaran</p>
                                    <p className="text-lg font-bold">{formatCurrency(totalPrice)}</p>
                                </div>
                            </div>
                            <Button className="bg-white text-red-700 hover:bg-slate-100 font-bold px-6">
                                Checkout <Truck className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </GlassCard>
                </div>
            )}
        </div>
    )
}
