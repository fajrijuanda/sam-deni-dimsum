"use client"

import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/shared/GlassCard"
import { DataTable } from "@/components/shared/DataTable"
import { Plus, Trash2, Pencil, Shield, User, Users, ShoppingBag, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

type UserProfile = {
    id: string
    name: string
    email: string
    role: string
    created_at: string
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    // Create Form State
    const [createLoading, setCreateLoading] = useState(false)
    const [createMessage, setCreateMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "staff"
    })

    const fetchUsers = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) {
            setUsers(data as UserProfile[])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus user ini?")) return;

        const { error } = await supabase.from('users').delete().eq('id', id)
        if (!error) {
            fetchUsers()
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setCreateLoading(true)
        setCreateMessage(null)

        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                        role: formData.role
                    }
                }
            })

            if (error) throw error

            const { error: dbError } = await supabase
                .from('users')
                .upsert({
                    id: data.user?.id,
                    email: formData.email,
                    name: formData.name,
                    role: formData.role,
                    password_hash: 'managed_by_supabase_auth'
                })

            if (dbError) console.error("DB Error:", dbError)

            setCreateMessage({ type: 'success', text: "User berhasil dibuat!" })

            setFormData({ name: "", email: "", password: "", role: "staff" })
            fetchUsers()

            setTimeout(() => {
                setIsCreateOpen(false)
                setCreateMessage(null)
            }, 1000)

        } catch (err: any) {
            setCreateMessage({ type: 'error', text: err.message })
        } finally {
            setCreateLoading(false)
        }
    }

    // Calculate stats
    const stats = useMemo(() => ({
        total: users.length,
        admin: users.filter(u => u.role === 'admin').length,
        staff: users.filter(u => u.role === 'staff').length,
        mitra: users.filter(u => u.role === 'mitra').length,
    }), [users])

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return (
                    <Badge className="bg-red-600 hover:bg-red-700 text-white border-none">
                        <Shield className="w-3 h-3 mr-1" /> Admin
                    </Badge>
                )
            case 'staff':
                return (
                    <Badge className="bg-amber-400 hover:bg-amber-500 text-amber-900 border-none">
                        <ShoppingBag className="w-3 h-3 mr-1" /> Staff
                    </Badge>
                )
            case 'mitra':
                return (
                    <Badge className="bg-slate-800 hover:bg-slate-900 text-white border-none">
                        <User className="w-3 h-3 mr-1" /> Mitra
                    </Badge>
                )
            default:
                return <Badge variant="outline">{role}</Badge>
        }
    }

    // Table columns configuration
    const columns = [
        {
            key: "name" as keyof UserProfile,
            label: "User",
            className: "min-w-[200px]",
            render: (user: UserProfile) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-white">
                            {user.name}
                        </span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                    </div>
                </div>
            ),
        },
        {
            key: "role" as keyof UserProfile,
            label: "Role",
            render: (user: UserProfile) => getRoleBadge(user.role),
        },
        {
            key: "created_at" as keyof UserProfile,
            label: "Tanggal Bergabung",
            className: "hidden sm:table-cell",
            render: (user: UserProfile) => (
                <span className="text-slate-600 dark:text-slate-400">
                    {formatDate(user.created_at)}
                </span>
            ),
        },
        {
            key: "actions" as string,
            label: "Aksi",
            className: "text-right w-[100px]",
            render: (user: UserProfile) => (
                <div className="flex items-center justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                        title="Edit User"
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(user.id)}
                        title="Hapus User"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
                        User Management
                    </h1>
                    <p className="text-slate-500 mt-1">Kelola akses untuk Admin, Staff, dan Mitra</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={handleCreate}>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-red-500" />
                                    Buat User Baru
                                </DialogTitle>
                                <DialogDescription>
                                    Tambahkan user baru ke sistem. Ini akan membuat akun login.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                {createMessage && (
                                    <div className={cn("p-3 rounded-md text-sm font-medium",
                                        createMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                                        {createMessage.text}
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Minimal 6 karakter"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select value={formData.role} onValueChange={(val: string) => setFormData({ ...formData, role: val })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="staff">
                                                <div className="flex items-center gap-2">
                                                    <ShoppingBag className="w-4 h-4 text-amber-500" />
                                                    Staff (Outlet)
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="mitra">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-slate-600" />
                                                    Mitra (Partner)
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="admin">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-4 h-4 text-red-500" />
                                                    Admin
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white" disabled={createLoading}>
                                    {createLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Buat Akun
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <GlassCard className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total User</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white border-none shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Admin</p>
                            <p className="text-2xl font-bold">{stats.admin}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-amber-400 to-amber-500 text-amber-900 border-none shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/30 flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Staff</p>
                            <p className="text-2xl font-bold">{stats.staff}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 bg-gradient-to-br from-slate-700 to-slate-800 text-white border-none shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Mitra</p>
                            <p className="text-2xl font-bold">{stats.mitra}</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Users Table */}
            <GlassCard className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200/50">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-red-500 mb-3" />
                        <p className="text-slate-500">Memuat data user...</p>
                    </div>
                ) : (
                    <DataTable
                        data={users}
                        columns={columns}
                        searchKey="name"
                        searchPlaceholder="Cari user..."
                        emptyMessage="Belum ada user"
                        emptyIcon={<Users className="w-12 h-12" />}
                    />
                )}
            </GlassCard>
        </div>
    )
}
