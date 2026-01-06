"use client"

import { useState, useMemo } from "react"
import { Plus, Package, Truck, CheckCircle, Clock, X, Eye, Search, Filter } from "lucide-react"
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
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Types
interface OrderItem {
    productName: string
    quantity: number
    unitPrice: number
    subtotal: number
}

interface RestockOrder {
    id: string
    mitraId: string
    mitraName: string
    mitraPhone: string
    orderDate: string
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
    items: OrderItem[]
    totalItemsCost: number
    shippingAddress: string
    shippingCity: string
    shippingCourier: string
    shippingService: string
    shippingCost: number
    trackingNumber: string | null
    paymentStatus: "unpaid" | "paid" | "refunded"
    totalAmount: number
}

// Mock mitra rumahan
const mitraRumahan = [
    { id: "mr1", name: "Rina Susanti", phone: "081111222333", city: "Jakarta" },
    { id: "mr2", name: "Agus Hermawan", phone: "082222333444", city: "Bandung" },
    { id: "mr3", name: "Linda Wijaya", phone: "083333444555", city: "Surabaya" },
]

// Mock products
const products = [
    { id: "p1", name: "Dimsum Ayam (Isi 10)", price: 25000 },
    { id: "p2", name: "Dimsum Udang (Isi 10)", price: 35000 },
    { id: "p3", name: "Dimsum Mix (Isi 20)", price: 45000 },
    { id: "p4", name: "Siomay Premium (Isi 15)", price: 40000 },
    { id: "p5", name: "Hakau Udang (Isi 10)", price: 38000 },
    { id: "p6", name: "Saus Kacang (500ml)", price: 15000 },
    { id: "p7", name: "Saus Sambal (250ml)", price: 12000 },
]

// Mock orders
const initialOrders: RestockOrder[] = [
    {
        id: "1",
        mitraId: "mr1",
        mitraName: "Rina Susanti",
        mitraPhone: "081111222333",
        orderDate: "2025-01-05",
        status: "pending",
        items: [
            { productName: "Dimsum Ayam (Isi 10)", quantity: 10, unitPrice: 25000, subtotal: 250000 },
            { productName: "Dimsum Udang (Isi 10)", quantity: 5, unitPrice: 35000, subtotal: 175000 },
        ],
        totalItemsCost: 425000,
        shippingAddress: "Jl. Menteng No. 15",
        shippingCity: "Jakarta",
        shippingCourier: "JNE",
        shippingService: "REG",
        shippingCost: 25000,
        trackingNumber: null,
        paymentStatus: "unpaid",
        totalAmount: 450000,
    },
    {
        id: "2",
        mitraId: "mr2",
        mitraName: "Agus Hermawan",
        mitraPhone: "082222333444",
        orderDate: "2025-01-04",
        status: "shipped",
        items: [
            { productName: "Dimsum Mix (Isi 20)", quantity: 8, unitPrice: 45000, subtotal: 360000 },
            { productName: "Saus Kacang (500ml)", quantity: 10, unitPrice: 15000, subtotal: 150000 },
        ],
        totalItemsCost: 510000,
        shippingAddress: "Jl. Braga No. 88",
        shippingCity: "Bandung",
        shippingCourier: "SiCepat",
        shippingService: "HALU",
        shippingCost: 18000,
        trackingNumber: "JX0012345678",
        paymentStatus: "paid",
        totalAmount: 528000,
    },
    {
        id: "3",
        mitraId: "mr3",
        mitraName: "Linda Wijaya",
        mitraPhone: "083333444555",
        orderDate: "2025-01-03",
        status: "delivered",
        items: [
            { productName: "Siomay Premium (Isi 15)", quantity: 15, unitPrice: 40000, subtotal: 600000 },
        ],
        totalItemsCost: 600000,
        shippingAddress: "Jl. Tunjungan No. 45",
        shippingCity: "Surabaya",
        shippingCourier: "JNT",
        shippingService: "EZ",
        shippingCost: 22000,
        trackingNumber: "JT0098765432",
        paymentStatus: "paid",
        totalAmount: 622000,
    },
]

export default function RestockOrdersPage() {
    const [orders, setOrders] = useState<RestockOrder[]>(initialOrders)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<RestockOrder | null>(null)
    const [statusFilter, setStatusFilter] = useState<string>("all")

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

    // Stats
    const stats = useMemo(() => {
        return {
            total: orders.length,
            pending: orders.filter(o => o.status === "pending").length,
            shipped: orders.filter(o => o.status === "shipped").length,
            delivered: orders.filter(o => o.status === "delivered").length,
            totalRevenue: orders.filter(o => o.paymentStatus === "paid").reduce((acc, o) => acc + o.totalAmount, 0),
        }
    }, [orders])

    // Filtered orders
    const filteredOrders = useMemo(() => {
        if (statusFilter === "all") return orders
        return orders.filter(o => o.status === statusFilter)
    }, [orders, statusFilter])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <Badge className="bg-amber-400 text-amber-900"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
            case "processing":
                return <Badge className="bg-blue-500 text-white"><Package className="w-3 h-3 mr-1" />Diproses</Badge>
            case "shipped":
                return <Badge className="bg-purple-500 text-white"><Truck className="w-3 h-3 mr-1" />Dikirim</Badge>
            case "delivered":
                return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Diterima</Badge>
            case "cancelled":
                return <Badge className="bg-red-500 text-white"><X className="w-3 h-3 mr-1" />Dibatalkan</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    const getPaymentBadge = (status: string) => {
        switch (status) {
            case "paid":
                return <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">Lunas</Badge>
            case "unpaid":
                return <Badge variant="outline" className="border-red-500 text-red-600 bg-red-50">Belum Bayar</Badge>
            case "refunded":
                return <Badge variant="outline" className="border-slate-500 text-slate-600 bg-slate-50">Refund</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const handleViewDetail = (order: RestockOrder) => {
        setSelectedOrder(order)
        setIsDetailOpen(true)
    }

    const handleUpdateStatus = (orderId: string, newStatus: RestockOrder["status"]) => {
        setOrders(orders.map(o =>
            o.id === orderId ? { ...o, status: newStatus } : o
        ))
    }

    const handleUpdatePayment = (orderId: string) => {
        setOrders(orders.map(o =>
            o.id === orderId ? { ...o, paymentStatus: "paid" } : o
        ))
    }

    // Table columns
    const columns = [
        {
            key: "orderDate" as keyof RestockOrder,
            label: "Tanggal",
            render: (order: RestockOrder) => (
                <span className="text-slate-600 dark:text-slate-400">
                    {formatDate(order.orderDate)}
                </span>
            ),
        },
        {
            key: "mitraName" as keyof RestockOrder,
            label: "Mitra",
            className: "min-w-[150px]",
            render: (order: RestockOrder) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 dark:text-white">{order.mitraName}</span>
                    <span className="text-xs text-slate-500">{order.shippingCity}</span>
                </div>
            ),
        },
        {
            key: "items" as keyof RestockOrder,
            label: "Items",
            className: "hidden md:table-cell",
            render: (order: RestockOrder) => (
                <span className="text-slate-600">{order.items.length} produk</span>
            ),
        },
        {
            key: "totalAmount" as keyof RestockOrder,
            label: "Total",
            render: (order: RestockOrder) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(order.totalAmount)}
                    </span>
                    <span className="text-xs text-slate-500">
                        +{formatCurrency(order.shippingCost)} ongkir
                    </span>
                </div>
            ),
        },
        {
            key: "status" as keyof RestockOrder,
            label: "Status",
            render: (order: RestockOrder) => getStatusBadge(order.status),
        },
        {
            key: "paymentStatus" as keyof RestockOrder,
            label: "Pembayaran",
            className: "hidden sm:table-cell",
            render: (order: RestockOrder) => getPaymentBadge(order.paymentStatus),
        },
        {
            key: "actions" as string,
            label: "Aksi",
            className: "text-right w-[100px]",
            render: (order: RestockOrder) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetail(order)}
                    className="text-blue-600 hover:bg-blue-50"
                >
                    <Eye className="w-4 h-4 mr-1" /> Detail
                </Button>
            ),
        },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                        Pesanan Restock
                    </h1>
                    <p className="text-slate-500 mt-1">Kelola pesanan produk dari mitra rumahan</p>
                </div>

                <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Pesanan
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <GlassCard className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total Pesanan</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-amber-400 to-amber-500 text-amber-900 border-none shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/30 flex items-center justify-center">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Pending</p>
                            <p className="text-2xl font-bold">{stats.pending}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <Truck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Dikirim</p>
                            <p className="text-2xl font-bold">{stats.shipped}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Diterima</p>
                            <p className="text-2xl font-bold">{stats.delivered}</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Diproses</SelectItem>
                            <SelectItem value="shipped">Dikirim</SelectItem>
                            <SelectItem value="delivered">Diterima</SelectItem>
                            <SelectItem value="cancelled">Dibatalkan</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* DataTable */}
            <GlassCard className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200/50">
                <DataTable
                    data={filteredOrders}
                    columns={columns}
                    searchKey="mitraName"
                    searchPlaceholder="Cari mitra..."
                    emptyMessage="Belum ada pesanan"
                    emptyIcon={<Package className="w-12 h-12" />}
                />
            </GlassCard>

            {/* Order Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    {selectedOrder && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center justify-between">
                                    <span>Detail Pesanan</span>
                                    {getStatusBadge(selectedOrder.status)}
                                </DialogTitle>
                                <DialogDescription>
                                    Order #{selectedOrder.id} • {formatDate(selectedOrder.orderDate)}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                {/* Mitra Info */}
                                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                                    <h4 className="font-semibold text-sm text-slate-500 mb-2">Informasi Mitra</h4>
                                    <p className="font-medium">{selectedOrder.mitraName}</p>
                                    <p className="text-sm text-slate-600">{selectedOrder.mitraPhone}</p>
                                    <p className="text-sm text-slate-600">{selectedOrder.shippingAddress}, {selectedOrder.shippingCity}</p>
                                </div>

                                {/* Items */}
                                <div>
                                    <h4 className="font-semibold text-sm text-slate-500 mb-2">Produk</h4>
                                    <div className="space-y-2">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-2 border rounded">
                                                <div>
                                                    <p className="font-medium">{item.productName}</p>
                                                    <p className="text-xs text-slate-500">{item.quantity} x {formatCurrency(item.unitPrice)}</p>
                                                </div>
                                                <span className="font-semibold">{formatCurrency(item.subtotal)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping */}
                                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                                    <h4 className="font-semibold text-sm text-purple-600 mb-2">Pengiriman</h4>
                                    <div className="flex justify-between">
                                        <span>{selectedOrder.shippingCourier} - {selectedOrder.shippingService}</span>
                                        <span className="font-semibold">{formatCurrency(selectedOrder.shippingCost)}</span>
                                    </div>
                                    {selectedOrder.trackingNumber && (
                                        <p className="mt-2 text-sm">
                                            No. Resi: <span className="font-mono font-bold">{selectedOrder.trackingNumber}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                                    <span className="font-semibold text-green-700">Total</span>
                                    <span className="text-xl font-bold text-green-700">{formatCurrency(selectedOrder.totalAmount)}</span>
                                </div>

                                {/* Payment Status */}
                                <div className="flex items-center justify-between">
                                    <span>Status Pembayaran:</span>
                                    {getPaymentBadge(selectedOrder.paymentStatus)}
                                </div>
                            </div>

                            <DialogFooter className="flex-col sm:flex-row gap-2">
                                {selectedOrder.paymentStatus === "unpaid" && (
                                    <Button
                                        variant="outline"
                                        className="border-green-500 text-green-600 hover:bg-green-50"
                                        onClick={() => {
                                            handleUpdatePayment(selectedOrder.id)
                                            setSelectedOrder({ ...selectedOrder, paymentStatus: "paid" })
                                        }}
                                    >
                                        Tandai Lunas
                                    </Button>
                                )}
                                {selectedOrder.status === "pending" && (
                                    <Button
                                        className="bg-blue-500 hover:bg-blue-600"
                                        onClick={() => {
                                            handleUpdateStatus(selectedOrder.id, "processing")
                                            setSelectedOrder({ ...selectedOrder, status: "processing" })
                                        }}
                                    >
                                        Proses Pesanan
                                    </Button>
                                )}
                                {selectedOrder.status === "processing" && (
                                    <Button
                                        className="bg-purple-500 hover:bg-purple-600"
                                        onClick={() => {
                                            handleUpdateStatus(selectedOrder.id, "shipped")
                                            setSelectedOrder({ ...selectedOrder, status: "shipped" })
                                        }}
                                    >
                                        Tandai Dikirim
                                    </Button>
                                )}
                                {selectedOrder.status === "shipped" && (
                                    <Button
                                        className="bg-green-500 hover:bg-green-600"
                                        onClick={() => {
                                            handleUpdateStatus(selectedOrder.id, "delivered")
                                            setSelectedOrder({ ...selectedOrder, status: "delivered" })
                                        }}
                                    >
                                        Tandai Diterima
                                    </Button>
                                )}
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
