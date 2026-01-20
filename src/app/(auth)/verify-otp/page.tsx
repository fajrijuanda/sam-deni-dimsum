"use client"

import { useState, Suspense } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function VerifyOtpContent() {
    const [token, setToken] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get('email')
    const { toast } = useToast()

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) {
            toast({ title: "Email missing", variant: "destructive" })
            return
        }
        setLoading(true)

        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email',
        })

        if (error) {
            toast({
                title: "Verifikasi Gagal",
                description: error.message,
                variant: "destructive"
            })
            setLoading(false)
        } else {
            // Success - session established
            toast({
                title: "Berhasil",
                description: "Silakan atur password baru Anda.",
            })
            router.push('/reset-password')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Verifikasi OTP</h1>
                    <p className="text-slate-500 mt-2">Masukkan kode 6 digit yang dikirim ke {email}</p>
                </div>

                <form onSubmit={handleVerify} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Kode OTP</Label>
                        <Input
                            type="text"
                            required
                            value={token}
                            onChange={e => setToken(e.target.value)}
                            placeholder="123456"
                            className="text-center text-2xl tracking-widest"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Verifikasi"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <VerifyOtpContent />
        </Suspense>
    )
}
