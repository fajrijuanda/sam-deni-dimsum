"use client"

import { useState, useMemo } from "react"
import {
    UserCheck,
    Calendar as CalendarIcon,
    Users,
    CheckCircle,
    XCircle,
    AlertCircle,
    Filter
} from "lucide-react"
import { GlassCard } from "@/components/shared/GlassCard"
import { DataTable } from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ATTENDANCE_STATUS } from "@/lib/constants"
import { formatDate } from "@/lib/formatting"
import type { AttendanceRecord } from "@/lib/types"

// Mock data untuk demo
const MOCK_ATTENDANCE: AttendanceRecord[] = [
    { id: "1", userId: "u1", userName: "Ahmad Crew", userRole: "crew", date: "2026-01-20", checkIn: "07:55", checkOut: "17:05", photoUrl: null, latitude: -6.2088, longitude: 106.8456, status: "hadir", outletName: "Sam Deni - Pusat" },
    { id: "2", userId: "u2", userName: "Budi Staff", userRole: "staff", date: "2026-01-20", checkIn: "07:30", checkOut: "16:00", photoUrl: null, latitude: -6.2088, longitude: 106.8456, status: "hadir", outletName: "Produksi" },
    { id: "3", userId: "u3", userName: "Citra Crew", userRole: "crew", date: "2026-01-20", checkIn: null, checkOut: null, photoUrl: null, latitude: null, longitude: null, status: "izin", outletName: "Sam Deni - Bandung" },
    { id: "4", userId: "u4", userName: "Deni Staff", userRole: "staff", date: "2026-01-20", checkIn: "08:15", checkOut: null, photoUrl: null, latitude: -6.9175, longitude: 107.6191, status: "hadir", outletName: "Produksi" },
    { id: "5", userId: "u5", userName: "Eka Crew", userRole: "crew", date: "2026-01-20", checkIn: null, checkOut: null, photoUrl: null, latitude: null, longitude: null, status: "alpha", outletName: "Sam Deni - Surabaya" },
    { id: "6", userId: "u1", userName: "Ahmad Crew", userRole: "crew", date: "2026-01-19", checkIn: "08:00", checkOut: "17:00", photoUrl: null, latitude: -6.2088, longitude: 106.8456, status: "hadir", outletName: "Sam Deni - Pusat" },
    { id: "7", userId: "u2", userName: "Budi Staff", userRole: "staff", date: "2026-01-19", checkIn: "07:45", checkOut: "16:30", photoUrl: null, latitude: -6.2088, longitude: 106.8456, status: "hadir", outletName: "Produksi" },
]

const ROLE_OPTIONS = [
    { value: "all", label: "Semua Role" },
    { value: "crew", label: "Crew" },
    { value: "staff", label: "Staff" },
]

export default function AdminPresensiPage() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [selectedRole, setSelectedRole] = useState("all")
    const [attendance] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE)

    // Filter data
    const filteredData = useMemo(() => {
        return attendance.filter(record => {
            const matchesDate = record.date === selectedDate
            const matchesRole = selectedRole === "all" || record.userRole === selectedRole
            return matchesDate && matchesRole
        })
    }, [attendance, selectedDate, selectedRole])

    // Stats
    const stats = useMemo(() => {
        const todayRecords = attendance.filter(r => r.date === selectedDate)
        return {
            total: todayRecords.length,
            hadir: todayRecords.filter(r => r.status === "hadir").length,
            izin: todayRecords.filter(r => r.status === "izin" || r.status === "sakit").length,
            alpha: todayRecords.filter(r => r.status === "alpha").length,
        }
    }, [attendance, selectedDate])

    const getStatusBadge = (status: AttendanceRecord["status"]) => {
        const statusConfig = ATTENDANCE_STATUS[status]
        return (
            <Badge variant="outline" className={statusConfig.color}>
                {statusConfig.label}
            </Badge>
        )
    }

    const columns = [
        {
            key: "userName",
            label: "Nama",
            render: (record: AttendanceRecord) => (
                <div>
                    <p className="font-medium">{record.userName}</p>
                    <p className="text-xs text-slate-500 capitalize">{record.userRole}</p>
                </div>
            )
        },
        {
            key: "outletName",
            label: "Lokasi",
            render: (record: AttendanceRecord) => (
                <span className="text-sm">{record.outletName || "-"}</span>
            )
        },
        {
            key: "checkIn",
            label: "Check In",
            render: (record: AttendanceRecord) => (
                <span className={record.checkIn ? "text-green-600 font-medium" : "text-slate-400"}>
                    {record.checkIn || "--:--"}
                </span>
            )
        },
        {
            key: "checkOut",
            label: "Check Out",
            render: (record: AttendanceRecord) => (
                <span className={record.checkOut ? "text-blue-600 font-medium" : "text-slate-400"}>
                    {record.checkOut || "--:--"}
                </span>
            )
        },
        {
            key: "status",
            label: "Status",
            render: (record: AttendanceRecord) => getStatusBadge(record.status)
        },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                    Rekap Presensi
                </h1>
                <p className="text-slate-500 mt-1">Monitor kehadiran crew dan staff</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <GlassCard className="p-4 bg-white border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Users className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total</p>
                            <p className="text-2xl font-bold">{stats.total}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white border-none">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Hadir</p>
                            <p className="text-2xl font-bold">{stats.hadir}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Izin/Sakit</p>
                            <p className="text-2xl font-bold">{stats.izin}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white border-none">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <XCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Alpha</p>
                            <p className="text-2xl font-bold">{stats.alpha}</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Filters */}
            <GlassCard className="p-4 bg-white border border-slate-200">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                        <Label className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" /> Tanggal
                        </Label>
                        <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>
                    <div className="w-full sm:w-[200px] space-y-2">
                        <Label className="flex items-center gap-2">
                            <Filter className="w-4 h-4" /> Role
                        </Label>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLE_OPTIONS.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </GlassCard>

            {/* Data Table */}
            <GlassCard className="p-4 bg-white border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                    <UserCheck className="w-5 h-5 text-red-500" />
                    <h2 className="font-semibold text-lg">
                        Data Presensi - {formatDate(selectedDate)}
                    </h2>
                </div>
                <DataTable
                    columns={columns}
                    data={filteredData}
                    emptyMessage="Tidak ada data presensi untuk tanggal ini"
                />
            </GlassCard>
        </div>
    )
}
