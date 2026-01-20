"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Request OTP
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: false,
            }
        })

        if (error) {
            toast({
                title: "Gagal Mengirim OTP",
                description: error.message,
                variant: "destructive"
            })
            setLoading(false)
        } else {
            toast({
                title: "OTP Terkirim",
                description: "Cek email Anda untuk kode verifikasi.",
            })
            // Redirect to Verify OTP page, passing email
            router.push(`/verify-otp?email=${encodeURIComponent(email)}`)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Lupa Password?</h1>
                    <p className="text-slate-500 mt-2">Masukkan email Anda untuk menerima kode OTP.</p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="nama@email.com"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Kirim OTP"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <Link href="/login" className="text-red-600 hover:underline">Kembali ke Login</Link>
                </div>
            </div>
        </div>
    )
}
