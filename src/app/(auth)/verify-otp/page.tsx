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

import Image from "next/image"
import logo from "../../../../public/logo.png"

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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-red-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-[40%] -left-[10%] w-[30%] h-[30%] bg-yellow-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md p-0 rounded-xl overflow-hidden shadow-2xl shadow-red-950/60 z-10 bg-gradient-to-b from-[#dc2626] via-[#7f1d1d] to-[#2b0808] border-none ring-1 ring-white/5">
                <div className="space-y-4 flex flex-col items-center pt-12 pb-6 px-4">
                    <div className="relative w-48 h-32 mb-4 hover:scale-105 transition-transform duration-300">
                        <Image
                            src={logo}
                            alt="Sam Deni Dimsum Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="text-center space-y-1">
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            Verifikasi OTP
                        </h1>
                        <p className="text-sm text-red-200/80 font-medium">
                            Masukkan kode 6 digit yang dikirim ke <br /> <span className="text-white font-bold">{email}</span>
                        </p>
                    </div>
                </div>

                <div className="px-8 pb-10 pt-2">
                    <form onSubmit={handleVerify} className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-red-50 font-semibold shadow-sm">Kode OTP</Label>
                            <Input
                                type="text"
                                required
                                value={token}
                                onChange={e => setToken(e.target.value)}
                                placeholder="123456"
                                className="bg-white text-slate-900 border-transparent focus:border-yellow-400 focus:ring-yellow-400 h-14 text-center text-3xl tracking-[1em] font-bold placeholder:tracking-normal placeholder:text-lg placeholder:text-slate-400 shadow-inner"
                                maxLength={6}
                            />
                        </div>
                        <Button type="submit" className="w-full bg-white hover:bg-red-50 text-[#C5161D] font-extrabold text-lg h-12 shadow-lg mt-4 transition-all active:scale-[0.98]" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Verifikasi"}
                        </Button>
                    </form>
                </div>

                <div className="bg-[#2b0808]/80 p-4 text-center">
                    <p className="text-xs text-red-200/40">
                        &copy; 2026 PT Sam Deni Dimsum. All rights reserved.
                    </p>
                </div>
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
