"use client"

import { useState, useEffect } from "react"
import {
    UserCheck,
    MapPin,
    Camera,
    Clock,
    CheckCircle2,
    XCircle,
    Calendar,
    Loader2
} from "lucide-react"
import { GlassCard } from "@/components/shared/GlassCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ATTENDANCE_STATUS } from "@/lib/constants"
import { formatDate } from "@/lib/formatting"
import type { AttendanceRecord } from "@/lib/types"

// Mock data untuk demo
const MOCK_HISTORY: AttendanceRecord[] = [
    { id: "1", userId: "u1", date: "2026-01-20", checkIn: "07:55", checkOut: "17:05", photoUrl: null, latitude: null, longitude: null, status: "hadir" },
    { id: "2", userId: "u1", date: "2026-01-19", checkIn: "08:02", checkOut: "17:10", photoUrl: null, latitude: null, longitude: null, status: "hadir" },
    { id: "3", userId: "u1", date: "2026-01-18", checkIn: null, checkOut: null, photoUrl: null, latitude: null, longitude: null, status: "izin" },
    { id: "4", userId: "u1", date: "2026-01-17", checkIn: "07:58", checkOut: "17:00", photoUrl: null, latitude: null, longitude: null, status: "hadir" },
]

interface AttendancePageProps {
    roleLabel: string // "Crew" atau "Staff"
}

/**
 * Shared attendance page component for crew and staff
 * Handles check-in/check-out with location and photo capture
 */
export function AttendancePage({ roleLabel }: AttendancePageProps) {
    const [loading, setLoading] = useState(false)
    const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null)
    const [history, setHistory] = useState<AttendanceRecord[]>(MOCK_HISTORY)
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [locationError, setLocationError] = useState<string | null>(null)
    const [currentTime, setCurrentTime] = useState(new Date())

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Get current location
    const requestLocation = () => {
        setLocationError(null)
        if (!navigator.geolocation) {
            setLocationError("Browser tidak mendukung GPS")
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError("Izin lokasi ditolak")
                        break
                    case error.POSITION_UNAVAILABLE:
                        setLocationError("Lokasi tidak tersedia")
                        break
                    default:
                        setLocationError("Gagal mendapatkan lokasi")
                }
            },
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }

    // Request location on mount
    useEffect(() => {
        requestLocation()
    }, [])

    const handleCheckIn = async () => {
        if (!location) {
            alert("Lokasi diperlukan untuk check-in")
            requestLocation()
            return
        }

        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        const now = new Date()
        const newRecord: AttendanceRecord = {
            id: Date.now().toString(),
            userId: "current-user",
            date: now.toISOString().split('T')[0],
            checkIn: now.toTimeString().slice(0, 5),
            checkOut: null,
            photoUrl: null,
            latitude: location.lat,
            longitude: location.lng,
            status: "hadir"
        }
        setTodayRecord(newRecord)
        setLoading(false)
    }

    const handleCheckOut = async () => {
        if (!todayRecord) return

        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))

        const now = new Date()
        setTodayRecord({
            ...todayRecord,
            checkOut: now.toTimeString().slice(0, 5)
        })
        setLoading(false)
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    }

    const getStatusBadge = (status: AttendanceRecord["status"]) => {
        const statusConfig = ATTENDANCE_STATUS[status]
        return (
            <Badge variant="outline" className={statusConfig.color}>
                {statusConfig.label}
            </Badge>
        )
    }

    return (
        <div className="space-y-6 pb-20 md:pb-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                    Presensi
                </h1>
                <p className="text-slate-500 mt-1">{roleLabel} - Catat kehadiran harian Anda</p>
            </div>

            {/* Current Time Card */}
            <GlassCard className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white border-none">
                <div className="text-center">
                    <p className="text-sm opacity-70 mb-1">Waktu Sekarang</p>
                    <p className="text-4xl font-bold font-mono tracking-wider">
                        {formatTime(currentTime)}
                    </p>
                    <p className="text-sm opacity-70 mt-2">
                        {currentTime.toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                </div>
            </GlassCard>

            {/* Location Status */}
            <GlassCard className={`p-4 ${location ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-center gap-3">
                    <MapPin className={`w-5 h-5 ${location ? 'text-green-600' : 'text-amber-600'}`} />
                    <div className="flex-1">
                        {location ? (
                            <>
                                <p className="font-medium text-green-700">Lokasi Terdeteksi</p>
                                <p className="text-xs text-green-600">
                                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="font-medium text-amber-700">
                                    {locationError || "Mendapatkan lokasi..."}
                                </p>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="p-0 h-auto text-amber-600"
                                    onClick={requestLocation}
                                >
                                    Coba lagi
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </GlassCard>

            {/* Check In/Out Section */}
            <GlassCard className="p-6 bg-white border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                    <UserCheck className="w-5 h-5 text-red-500" />
                    <h2 className="font-semibold text-lg">Status Hari Ini</h2>
                </div>

                {todayRecord ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                                <Clock className="w-6 h-6 text-green-600 mx-auto mb-1" />
                                <p className="text-xs text-green-600">Check In</p>
                                <p className="text-xl font-bold text-green-700">{todayRecord.checkIn}</p>
                            </div>
                            <div className={`p-4 rounded-lg text-center ${todayRecord.checkOut ? 'bg-blue-50' : 'bg-slate-50'
                                }`}>
                                <Clock className={`w-6 h-6 mx-auto mb-1 ${todayRecord.checkOut ? 'text-blue-600' : 'text-slate-400'
                                    }`} />
                                <p className={`text-xs ${todayRecord.checkOut ? 'text-blue-600' : 'text-slate-400'
                                    }`}>Check Out</p>
                                <p className={`text-xl font-bold ${todayRecord.checkOut ? 'text-blue-700' : 'text-slate-400'
                                    }`}>
                                    {todayRecord.checkOut || "--:--"}
                                </p>
                            </div>
                        </div>

                        {!todayRecord.checkOut && (
                            <Button
                                className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700"
                                onClick={handleCheckOut}
                                disabled={loading}
                            >
                                {loading ? (
                                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Memproses...</>
                                ) : (
                                    <><XCircle className="w-5 h-5 mr-2" /> Check Out</>
                                )}
                            </Button>
                        )}

                        {todayRecord.checkOut && (
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <p className="font-medium text-green-700">Presensi Hari Ini Selesai</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <Button
                        className="w-full py-6 text-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                        onClick={handleCheckIn}
                        disabled={loading || !location}
                    >
                        {loading ? (
                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Memproses...</>
                        ) : (
                            <><CheckCircle2 className="w-5 h-5 mr-2" /> Check In</>
                        )}
                    </Button>
                )}
            </GlassCard>

            {/* History */}
            <GlassCard className="p-4 bg-white border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-red-500" />
                    <h2 className="font-semibold text-lg">Riwayat Bulan Ini</h2>
                </div>

                <div className="space-y-2">
                    {history.map((record) => (
                        <div
                            key={record.id}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                        >
                            <div>
                                <p className="font-medium text-sm">
                                    {formatDate(record.date)}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {record.checkIn || "--:--"} - {record.checkOut || "--:--"}
                                </p>
                            </div>
                            {getStatusBadge(record.status)}
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    )
}
