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

import Image from "next/image"
import logo from "../../../../public/logo.png"

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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-red-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-[40%] -left-[10%] w-[30%] h-[30%] bg-yellow-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md p-0 rounded-xl overflow-hidden shadow-2xl shadow-red-950/60 z-10 bg-gradient-to-b from-[#dc2626] via-[#7f1d1d] to-[#2b0808] border-none ring-1 ring-white/5">
                <div className="space-y-4 flex flex-col items-center pt-12 pb-6 px-4 relative">
                    <Link href="/" className="absolute top-4 left-4 text-xs text-red-200/60 hover:text-white flex items-center gap-1 transition-colors">
                        ← Back to Home
                    </Link>
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
                            Lupa Password?
                        </h1>
                        <p className="text-sm text-red-200/80 font-medium">
                            Masukkan email Anda untuk menerima kode OTP.
                        </p>
                    </div>
                </div>

                <div className="px-8 pb-10 pt-2">
                    <form onSubmit={handleSendOTP} className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-red-50 font-semibold shadow-sm">Email Address</Label>
                            <Input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="nama@email.com"
                                className="bg-white text-slate-900 border-transparent focus:border-yellow-400 focus:ring-yellow-400 h-11 placeholder:text-slate-400 shadow-inner"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-white hover:bg-red-50 text-[#C5161D] font-extrabold text-lg h-12 shadow-lg mt-4 transition-all active:scale-[0.98]" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Kirim OTP"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <Link href="/login" className="text-red-200 hover:text-white hover:underline transition-colors">Kembali ke Login</Link>
                    </div>
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
