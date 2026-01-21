"use client"

import { GlassCard } from "@/components/shared/GlassCard"
import { BarChart3, Building2, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Users, Package } from "lucide-react"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from "recharts"

// Mock Data for Charts
const revenueData = [
    { name: 'Min 1', revenue: 15000000 },
    { name: 'Min 2', revenue: 22000000 },
    { name: 'Min 3', revenue: 18000000 },
    { name: 'Min 4', revenue: 28000000 },
    { name: 'Min 5', revenue: 25000000 },
    { name: 'Saatin', revenue: 32000000 },
]

const outletPerformance = [
    { name: 'Pusat', value: 45, color: '#ef4444' }, // red-500
    { name: 'Bandung', value: 30, color: '#f59e0b' }, // amber-500
    { name: 'Surabaya', value: 15, color: '#3b82f6' }, // blue-500
    { name: 'Jakarta', value: 10, color: '#10b981' }, // green-500
]

const topProducts = [
    { name: 'Dimsum Ayam', sales: 1200 },
    { name: 'Dimsum Udang', sales: 950 },
    { name: 'Lumpia Kulit Tahu', sales: 850 },
    { name: 'Hakau', sales: 600 },
    { name: 'Pao Pasir Mas', sales: 450 },
]

// Mock Transactions
const recentTransactions = [
    { id: 'TRX-001', outlet: 'Sam Deni Dimsum - Pusat', amount: 2500000, status: 'Success', date: 'Just now' },
    { id: 'TRX-002', outlet: 'Sam Deni Dimsum - Bandung', amount: 1800000, status: 'Success', date: '2 mins ago' },
    { id: 'TRX-003', outlet: 'Sam Deni Dimsum - Surabaya', amount: 3200000, status: 'Pending', date: '15 mins ago' },
    { id: 'TRX-004', outlet: 'Sam Deni Dimsum - Pusat', amount: 950000, status: 'Success', date: '1 hour ago' },
    { id: 'TRX-005', outlet: 'Sam Deni Dimsum - Jakarta', amount: 4500000, status: 'Processing', date: '2 hours ago' },
]

export default function AdminDashboard() {
    return (
        <div className="space-y-8 relative pb-20">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-[30%] -right-[15%] w-[60%] h-[60%] bg-red-500/5 rounded-full blur-3xl"></div>
                <div className="absolute top-[50%] -left-[10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1">Overview performa bisnis Sam Deni Dimsum hari ini.</p>
                </div>
                <div className="flex gap-2">
                    <GlassCard className="px-4 py-2 bg-white/70 dark:bg-slate-800/70 border-slate-200 shadow-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-medium text-slate-600">System Online</span>
                    </GlassCard>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {/* Total Revenue Card - Hero */}
                <GlassCard className="p-6 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white border-none shadow-xl shadow-red-500/20 hover:shadow-2xl hover:shadow-red-500/30 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-sm font-medium opacity-90">Total Omzet Bulan Ini</h3>
                                <p className="text-3xl font-bold mt-2">Rp 125.000.000</p>
                                <div className="flex items-center gap-1 mt-2 bg-white/20 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
                                    <ArrowUpRight className="w-3 h-3 text-white" />
                                    <span className="text-xs font-medium text-white">+15% vs bulan lalu</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Total Outlets Card */}
                <GlassCard className="p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Outlet Aktif</h3>
                            <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">8</p>
                            <div className="flex items-center gap-1 mt-2">
                                <span className="text-xs text-slate-400">Target: 10 Outlet</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </GlassCard>

                {/* Mitra / Partners Card */}
                <GlassCard className="p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Mitra</h3>
                            <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">24</p>
                            <div className="flex items-center gap-1 mt-2">
                                <ArrowUpRight className="w-3 h-3 text-green-500" />
                                <span className="text-xs text-green-600 font-medium">+3 baru minggu ini</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                </GlassCard>

                {/* Products Sold Card */}
                <GlassCard className="p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Terjual Bulan Ini</h3>
                            <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">4.5k<span className="text-lg text-slate-400 font-normal"> pax</span></p>
                            <div className="flex items-center gap-1 mt-2">
                                <TrendingUp className="w-3 h-3 text-green-500" />
                                <span className="text-xs text-green-600 font-medium">Record high!</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Package className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Charts Section - 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                {/* Revenue Chart (Spans 2 columns) */}
                <GlassCard className="col-span-1 lg:col-span-2 p-6 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Tren Pendapatan</h2>
                            <p className="text-sm text-slate-500">Analisis perkembangan omzet per minggu</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12, fill: '#64748B' }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#64748B' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `${value / 1000000}M`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                    formatter={(value: any) => [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* Outlet Performance Chart */}
                <GlassCard className="p-6 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 shadow-lg">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Kontribusi Outlet</h2>
                        <p className="text-sm text-slate-500">Persentase penjualan per lokasi</p>
                    </div>
                    <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={outletPerformance}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {outletPerformance.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                            <p className="text-xs text-slate-500">Dominasi</p>
                            <p className="text-xl font-bold text-slate-800">Pusat</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Bottom Grid: Recent Transactions & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                {/* Recent Transactions Table */}
                <GlassCard className="col-span-1 lg:col-span-2 p-6 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Transaksi Terakhir</h2>
                        <button className="text-sm text-red-600 font-medium hover:text-red-700 hover:underline">Lihat Semua</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-slate-200 dark:border-slate-700">
                                    <th className="pb-3 text-xs font-semibold text-slate-500 uppercase">Outlet</th>
                                    <th className="pb-3 text-xs font-semibold text-slate-500 uppercase text-right">Amount</th>
                                    <th className="pb-3 text-xs font-semibold text-slate-500 uppercase text-center">Status</th>
                                    <th className="pb-3 text-xs font-semibold text-slate-500 uppercase text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {recentTransactions.map((trx) => (
                                    <tr key={trx.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="py-3 pr-4">
                                            <div className="font-medium text-slate-800 dark:text-slate-200">{trx.outlet}</div>
                                            <div className="text-xs text-slate-500">{trx.id}</div>
                                        </td>
                                        <td className="py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                                            Rp {trx.amount.toLocaleString('id-ID')}
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${trx.status === 'Success' ? 'bg-green-100 text-green-800' :
                                                    trx.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-blue-100 text-blue-800'}`}>
                                                {trx.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-right text-sm text-slate-500">
                                            {trx.date}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>

                {/* Top Products List */}
                <GlassCard className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold">Menu Terlaris</h2>
                        <Package className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="space-y-4">
                        {topProducts.map((product, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                                        ${index === 0 ? 'bg-yellow-400 text-yellow-900' :
                                            index === 1 ? 'bg-slate-300 text-slate-900' :
                                                index === 2 ? 'bg-orange-300 text-orange-900' :
                                                    'bg-slate-700 text-slate-300'}`}>
                                        {index + 1}
                                    </div>
                                    <span className="font-medium text-slate-200">{product.name}</span>
                                </div>
                                <span className="text-sm font-bold text-slate-400">{product.sales} pax</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-700">
                        <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg">
                            <span className="text-xs text-slate-400">Total Produk Terjual</span>
                            <span className="text-lg font-bold text-white">4,050</span>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    )
}
