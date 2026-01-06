"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GlassCard } from "@/components/shared/GlassCard"
import { ArrowLeft } from "lucide-react"

export default function CreateUserPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "staff"
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            // Note: In a real app, this should be an Admin API call because:
            // 1. Creating a user logs them in automatically (in client-side auth), which would log out the Admin.
            // 2. We can't use signUp() for *other* users easily without an Edge Function or simple workaround.

            // WORKAROUND FOR PROTOTYPE:
            // We'll use a secondary text explaining this limitation or try to use a dummy client if possible, 
            // but for now we'll just attempt it. If it logs out the admin, we'll warn them.
            // ACTUALLY: A better approach for this prototype without backend functions is to warn the admin.

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

            // Manually insert into public.users if trigger doesn't exist/fail
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

            setMessage({ type: 'success', text: "User created! (Note: You might have been logged out)" })

            // Optional: Redirect back to list
            setTimeout(() => router.push("/admin/users"), 1500)

        } catch (err: any) {
            setMessage({ type: 'error', text: err.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-2xl font-bold">Create New User</h1>
            </div>

            <GlassCard className="p-6 bg-white dark:bg-slate-900/50">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {message && (
                        <div className={`p-3 rounded-md text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Initial Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={formData.role}
                            onValueChange={(val: string) => setFormData({ ...formData, role: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="staff">Staff (Outlet Keeper)</SelectItem>
                                <SelectItem value="mitra">Mitra (Partner)</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="pt-4">
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-4 text-xs text-yellow-800">
                            <strong>Note for Prototype:</strong> Creating a user via client-side auth might log you out.
                            In production, this would use a secure backend function.
                        </div>
                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={loading}>
                            {loading ? "Creating..." : "Create Account"}
                        </Button>
                    </div>
                </form>
            </GlassCard>
        </div>
    )
}
