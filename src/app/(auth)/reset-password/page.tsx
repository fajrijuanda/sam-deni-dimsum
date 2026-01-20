"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast({ title: "Password tidak sama", variant: "destructive" })
            return
        }
        setLoading(true)

        const { error } = await supabase.auth.updateUser({
            password: password
        })

        if (error) {
            toast({
                title: "Gagal Reset Password",
                description: error.message,
                variant: "destructive"
            })
            setLoading(false)
        } else {
            toast({
                title: "Password Berhasil Diubah",
                description: "Silakan login dengan password baru.",
                className: "bg-green-600 text-white border-none"
            })
            router.push('/login')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
                    <p className="text-slate-500 mt-2">Masukkan password baru Anda.</p>
                </div>

                <form onSubmit={handleReset} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Password Baru</Label>
                        <Input
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Konfirmasi Password</Label>
                        <Input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Simpan Password Baru"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
