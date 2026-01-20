"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { GlassCard } from "@/components/shared/GlassCard"
import { DataTable } from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
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
    const [outlets, setOutlets] = useState<any[]>([])
    const [, setLoading] = useState(true)
    const { toast } = useToast()

    // Approval States
    const [approveOpen, setApproveOpen] = useState(false)
    const [selectedMitra, setSelectedMitra] = useState<MitraUser | null>(null)
    const [mouFile, setMouFile] = useState<File | null>(null)
    const [proofFile, setProofFile] = useState<File | null>(null)
    const [selectedOutlet, setSelectedOutlet] = useState("")
    const [isApproving, setIsApproving] = useState(false)

    const fetchData = async () => {
        setLoading(true)
        // Fetch Users
        const { data: users, error: userError } = await supabase
            .from('users')
            .select(`
                *,
                outlets ( name )
            `)
            .eq('role', 'mitra')
            .order('created_at', { ascending: false })

        if (userError) console.error("Error fetching users:", userError)
        else setMitraList(users as any[])

        // Fetch Outlets
        const { data: outletsData, error: outletError } = await supabase
            .from('outlets')
            .select('*')
            .eq('status', 'active')

        if (outletError) console.error("Error fetching outlets:", outletError)
        else setOutlets(outletsData || [])

        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleOpenApprove = (mitra: MitraUser) => {
        setSelectedMitra(mitra)
        setApproveOpen(true)
        setMouFile(null)
        setProofFile(null)
        setSelectedOutlet("")
    }

    const uploadFile = async (file: File, path: string) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${path}_${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
            .from('mitra-docs')
            .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('mitra-docs').getPublicUrl(fileName)
        return data.publicUrl
    }

    const handleConfirmApprove = async () => {
        if (!selectedMitra) return
        if (!mouFile || !proofFile) {
            toast({ title: "File Penting", description: "Mohon upload MOU dan Bukti Transfer", variant: "destructive" })
            return
        }

        setIsApproving(true)

        try {
            // 1. Upload Files
            const mouUrl = await uploadFile(mouFile, `mou/${selectedMitra.id}`)
            const proofUrl = await uploadFile(proofFile, `payment/${selectedMitra.id}`)

            // 2. Update User Profile
            const updateData: any = {
                status: 'active',
                mou_url: mouUrl,
                payment_proof_url: proofUrl
            }
            if (selectedOutlet) updateData.outlet_id = selectedOutlet

            const { error: updateError } = await supabase
                .from('users')
                .update(updateData)
                .eq('id', selectedMitra.id)

            if (updateError) throw updateError

            // 3. Trigger Email
            await supabase.auth.resetPasswordForEmail(selectedMitra.email, {
                redirectTo: `${window.location.origin}/reset-password`
            })

            toast({
                title: "Mitra Disetujui!",
                description: "Dokumen tersimpan & email akses telah dikirim.",
                className: "bg-green-600 text-white border-none"
            })

            setApproveOpen(false)
            fetchData()

        } catch (error: any) {
            toast({
                title: "Gagal Approve",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setIsApproving(false)
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
            fetchData()
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
            key: "outlet",
            label: "Outlet",
            render: (row: any) => row.outlets?.name || "-"
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
                            <Button size="sm" onClick={() => handleOpenApprove(row)} className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0">
                                <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(row.id)} className="h-8 w-8 p-0">
                                <X className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                    {row.status === 'active' && (
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" asChild>
                                <a href={(row as any).mou_url} target="_blank" className="h-8 w-8 p-0 flex items-center justify-center">
                                    <span className="text-[10px] font-bold">MOU</span>
                                </a>
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => supabase.auth.resetPasswordForEmail(row.email)} title="Resend Password Email">
                                <Mail className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 to-red-500 bg-clip-text text-transparent">Manajemen Mitra & User</h1>
                <Button onClick={fetchData} variant="outline" size="sm">Refresh</Button>
            </div>

            {/* Approval Dialog */}
            <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Approve Mitra: {selectedMitra?.name}</DialogTitle>
                        <DialogDescription>
                            Lengkapi dokumen dan penempatan outlet sebelum menyetujui.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* MOU Upload */}
                        <div className="grid gap-2">
                            <Label>Upload MOU (PDF/Image)</Label>
                            <div className="flex items-center gap-2">
                                <Input type="file" onChange={(e) => setMouFile(e.target.files?.[0] || null)} />
                                {mouFile && <Check className="text-green-500 w-5 h-5" />}
                            </div>
                        </div>

                        {/* Payment Proof Upload */}
                        <div className="grid gap-2">
                            <Label>Upload Bukti Transfer</Label>
                            <div className="flex items-center gap-2">
                                <Input type="file" onChange={(e) => setProofFile(e.target.files?.[0] || null)} />
                                {proofFile && <Check className="text-green-500 w-5 h-5" />}
                            </div>
                        </div>

                        {/* Outlet Select */}
                        <div className="grid gap-2">
                            <Label>Tempatkan di Outlet (Khusus Paket Outlet)</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={selectedOutlet}
                                onChange={(e) => setSelectedOutlet(e.target.value)}
                            >
                                <option value="">-- Pilih Outlet (Jikan Ada) --</option>
                                {outlets.map((o) => (
                                    <option key={o.id} value={o.id}>{o.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setApproveOpen(false)}>Batal</Button>
                        <Button
                            onClick={handleConfirmApprove}
                            disabled={isApproving || !mouFile || !proofFile}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isApproving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                            Setujui & Aktifkan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
