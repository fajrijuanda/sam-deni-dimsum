"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { GlassCard } from "@/components/shared/GlassCard"
import { DataTable } from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Check, X, Mail } from "lucide-react"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type MitraUser = {
    id: string
    name: string
    email: string
    role: string
    status: 'active' | 'pending_approval' | 'banned'
    created_at: string
}

export default function MitraPage() {
    const [mitraList, setMitraList] = useState<MitraUser[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    const fetchMitra = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'mitra')
            .order('created_at', { ascending: false })

        if (error) {
            toast({
                title: "Gagal memuat data",
                description: error.message,
                variant: "destructive"
            })
        } else {
            setMitraList(data as MitraUser[])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchMitra()
    }, [])

    const handleApprove = async (id: string, email: string) => {
        try {
            // 1. Update status to active
            const { error: updateError } = await supabase
                .from('users')
                .update({ status: 'active' })
                .eq('id', id)

            if (updateError) throw updateError

            // 2. Trigger Password Reset Email
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            })

            if (resetError) {
                toast({
                    title: "Status Aktif, tapi Email Gagal",
                    description: "User aktif, tapi gagal mengirim email reset password: " + resetError.message,
                    variant: "destructive"
                })
            } else {
                toast({
                    title: "Mitra Disetujui!",
                    description: "Email pengaturan password telah dikirim ke " + email,
                    className: "bg-green-600 text-white border-none"
                })
            }

            // Refresh data
            fetchMitra()

        } catch (error: any) {
            toast({
                title: "Gagal menyetujui",
                description: error.message,
                variant: "destructive"
            })
        }
    }

    const handleReject = async (id: string) => {
        if (!confirm("Yakin ingin menolak (ban) user ini?")) return

        try {
            const { error } = await supabase
                .from('users')
                .update({ status: 'banned' })
                .eq('id', id)

            if (error) throw error

            toast({ title: "User ditolak/banned" })
            fetchMitra()
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" })
        }
    }

    const pendingMitra = mitraList.filter(m => m.status === 'pending_approval')
    const activeMitra = mitraList.filter(m => m.status === 'active')

    // Columns
    const columns = [
        {
            key: "name",
            label: "Nama",
            render: (row: MitraUser) => (
                <div>
                    <div className="font-bold">{row.name}</div>
                    <div className="text-xs text-slate-500">{row.email}</div>
                </div>
            )
        },
        {
            key: "status",
            label: "Status",
            render: (row: MitraUser) => (
                <Badge variant={row.status === 'active' ? 'default' : row.status === 'pending_approval' ? 'secondary' : 'destructive'}>
                    {row.status}
                </Badge>
            )
        },
        {
            key: "created_at",
            label: "Terdaftar",
            render: (row: MitraUser) => new Date(row.created_at).toLocaleDateString('id-ID')
        },
        {
            key: "actions",
            label: "Aksi",
            render: (row: MitraUser) => (
                <div className="flex gap-2">
                    {row.status === 'pending_approval' && (
                        <>
                            <Button size="sm" onClick={() => handleApprove(row.id, row.email)} className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0">
                                <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(row.id)} className="h-8 w-8 p-0">
                                <X className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                    {row.status === 'active' && (
                        <Button size="sm" variant="outline" onClick={() => supabase.auth.resetPasswordForEmail(row.email)} title="Resend Password Email">
                            <Mail className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 to-red-500 bg-clip-text text-transparent">Manajemen Mitra & User</h1>
                <Button onClick={fetchMitra} variant="outline" size="sm">Refresh</Button>
            </div>

            <Tabs defaultValue="pending">
                <TabsList>
                    <TabsTrigger value="pending">Menunggu Persetujuan ({pendingMitra.length})</TabsTrigger>
                    <TabsTrigger value="active">Mitra Aktif ({activeMitra.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                    <GlassCard className="p-4">
                        <DataTable
                            data={pendingMitra}
                            columns={columns}
                            searchKey="name"
                            emptyMessage="Tidak ada permintaan baru"
                        />
                    </GlassCard>
                </TabsContent>

                <TabsContent value="active">
                    <GlassCard className="p-4">
                        <DataTable
                            data={activeMitra}
                            columns={columns}
                            searchKey="name"
                            emptyMessage="Belum ada mitra aktif"
                        />
                    </GlassCard>
                </TabsContent>
            </Tabs>
        </div>
    )
}
