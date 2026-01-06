"use client"

import { useState } from "react"
import { Package, ArrowDownToLine, ArrowUpFromLine, RotateCcw, Save, Check } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Product list based on menu
const products = [
    { id: "1", name: "Dimsum Udang", category: "dimsum" },
    { id: "2", name: "Dimsum Wortel", category: "dimsum" },
    { id: "3", name: "Dimsum Jamur", category: "dimsum" },
    { id: "4", name: "Dimsum Keju", category: "dimsum" },
    { id: "5", name: "Dimsum Crabstick", category: "dimsum" },
    { id: "6", name: "Lumpia Basah", category: "dimsum" },
    { id: "7", name: "Gyoza Kukus", category: "gyoza" },
    { id: "8", name: "Gyoza Goreng", category: "gyoza" },
    { id: "9", name: "Wonton Kuah", category: "wonton" },
    { id: "10", name: "Wonton Goreng", category: "wonton" },
]

// Mock outlets
const outlets = [
    { id: "1", name: "Sam Deni Dimsum - Pusat" },
    { id: "2", name: "Sam Deni Dimsum - Bandung" },
    { id: "3", name: "Sam Deni Dimsum - Surabaya" },
]

interface StockEntry {
    productId: string
    quantity: number
}

export default function CrewStokPage() {
    const [activeTab, setActiveTab] = useState("masuk")
    const [selectedOutlet, setSelectedOutlet] = useState("")
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [entries, setEntries] = useState<StockEntry[]>(
        products.map(p => ({ productId: p.id, quantity: 0 }))
    )
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const handleQuantityChange = (productId: string, value: string) => {
        const qty = parseInt(value) || 0
        setEntries(prev => prev.map(e => 
            e.productId === productId ? { ...e, quantity: qty } : e
        ))
    }

    const handleSubmit = async () => {
        if (!selectedOutlet) {
            alert("Pilih outlet terlebih dahulu!")
            return
        }

        const nonZeroEntries = entries.filter(e => e.quantity > 0)
        if (nonZeroEntries.length === 0) {
            alert("Masukkan minimal 1 item!")
            return
        }

        setIsSubmitting(true)
        
        // TODO: Submit to Supabase and sync to Google Sheets
        console.log("Submitting:", {
            type: activeTab,
            outlet: selectedOutlet,
            date,
            entries: nonZeroEntries
        })

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setIsSubmitting(false)
        setShowSuccess(true)
        
        // Reset form after success
        setTimeout(() => {
            setShowSuccess(false)
            setEntries(products.map(p => ({ productId: p.id, quantity: 0 })))
        }, 2000)
    }

    const totalItems = entries.reduce((sum, e) => sum + e.quantity, 0)

    const getTabIcon = (type: string) => {
        switch (type) {
            case "masuk": return <ArrowDownToLine className="w-4 h-4" />
            case "keluar": return <ArrowUpFromLine className="w-4 h-4" />
            case "kembali": return <RotateCcw className="w-4 h-4" />
            default: return <Package className="w-4 h-4" />
        }
    }

    const getTabColor = (type: string) => {
        switch (type) {
            case "masuk": return "text-green-600 bg-green-50 border-green-200"
            case "keluar": return "text-red-600 bg-red-50 border-red-200"
            case "kembali": return "text-amber-600 bg-amber-50 border-amber-200"
            default: return ""
        }
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                    Input Stok Harian
                </h1>
                <p className="text-slate-500 mt-1">Crew Produksi - Kelola stok masuk, keluar, dan kembali</p>
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

            {/* Stock Input Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1">
                    <TabsTrigger 
                        value="masuk" 
                        className="data-[state=active]:bg-green-500 data-[state=active]:text-white flex items-center gap-2"
                    >
                        <ArrowDownToLine className="w-4 h-4" />
                        Stok Masuk
                    </TabsTrigger>
                    <TabsTrigger 
                        value="keluar"
                        className="data-[state=active]:bg-red-500 data-[state=active]:text-white flex items-center gap-2"
                    >
                        <ArrowUpFromLine className="w-4 h-4" />
                        Stok Keluar
                    </TabsTrigger>
                    <TabsTrigger 
                        value="kembali"
                        className="data-[state=active]:bg-amber-500 data-[state=active]:text-white flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Stok Kembali
                    </TabsTrigger>
                </TabsList>

                {["masuk", "keluar", "kembali"].map(type => (
                    <TabsContent key={type} value={type} className="mt-4">
                        <GlassCard className={`p-4 border ${getTabColor(type)}`}>
                            <div className="flex items-center gap-2 mb-4">
                                {getTabIcon(type)}
                                <h3 className="font-semibold">
                                    {type === "masuk" && "Stok Masuk dari Pusat"}
                                    {type === "keluar" && "Stok Keluar (Terjual)"}
                                    {type === "kembali" && "Stok Kembali ke Pusat"}
                                </h3>
                            </div>

                            <div className="space-y-3">
                                {/* Dimsum Section */}
                                <div className="bg-white/50 p-3 rounded-lg">
                                    <h4 className="font-medium text-slate-700 mb-2">Dimsum</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {products.filter(p => p.category === "dimsum").map(product => (
                                            <div key={product.id} className="flex items-center gap-2">
                                                <Label className="flex-1 text-sm">{product.name}</Label>
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
                                <div className="bg-white/50 p-3 rounded-lg">
                                    <h4 className="font-medium text-slate-700 mb-2">Gyoza</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {products.filter(p => p.category === "gyoza").map(product => (
                                            <div key={product.id} className="flex items-center gap-2">
                                                <Label className="flex-1 text-sm">{product.name}</Label>
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
                                <div className="bg-white/50 p-3 rounded-lg">
                                    <h4 className="font-medium text-slate-700 mb-2">Wonton</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {products.filter(p => p.category === "wonton").map(product => (
                                            <div key={product.id} className="flex items-center gap-2">
                                                <Label className="flex-1 text-sm">{product.name}</Label>
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
                        </GlassCard>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Submit Section */}
            <GlassCard className="p-4 bg-white border border-slate-200/50 sticky bottom-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500">Total Item</p>
                        <p className="text-2xl font-bold text-slate-800">{totalItems} pcs</p>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || showSuccess}
                        className={`px-8 py-6 text-lg ${
                            showSuccess 
                                ? "bg-green-500 hover:bg-green-500" 
                                : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                        } text-white`}
                    >
                        {isSubmitting ? (
                            <>Menyimpan...</>
                        ) : showSuccess ? (
                            <><Check className="w-5 h-5 mr-2" /> Tersimpan!</>
                        ) : (
                            <><Save className="w-5 h-5 mr-2" /> Simpan Stok</>
                        )}
                    </Button>
                </div>
            </GlassCard>
        </div>
    )
}
