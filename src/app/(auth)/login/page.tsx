"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import logo from "../../../../public/logo.png"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { GlassCard } from "@/components/shared/GlassCard"
import { createClient } from "@/lib/supabase-browser"

export default function LoginPage() {
    const router = useRouter()
    const supabase = createClient()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                const role = session.user.user_metadata?.role || 'staff'
                if (role === 'admin') router.push("/admin")
                else if (role === 'staff') router.push("/staff/sales")
                else router.push("/mitra")
            }
        }
        checkSession()
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                setError(error.message)
                return
            }

            if (data.user) {
                // Try to fetch role from public.users table first
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', data.user.id)
                    .single()

                let role = 'staff' // default fallback

                if (userData && !userError) {
                    // Profile exists in database
                    role = userData.role
                } else {
                    // Fallback: use role from Auth user_metadata (set during signup)
                    console.warn("Profile not in DB, using auth metadata:", data.user.user_metadata)
                    role = data.user.user_metadata?.role || 'staff'
                }

                // Redirect based on role (using hard redirect to ensure navigation works)
                if (role === 'admin') window.location.href = "/admin"
                else if (role === 'staff') window.location.href = "/staff/sales"
                else window.location.href = "/mitra"
            }
        } catch (err) {
            console.error(err)
            setError("An unexpected error occurred")
        } finally {
            setLoading(false)
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
                <CardHeader className="space-y-4 flex flex-col items-center pt-12 pb-6">
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
                            Welcome Back
                        </h1>
                        <p className="text-sm text-red-200/80 font-medium">
                            Sign in to manage your outlet
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="px-8 pb-10 pt-2">
                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="bg-white/10 border border-white/20 text-white px-4 py-3 rounded-lg text-sm text-center font-medium backdrop-blur-sm">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-red-50 font-semibold shadow-sm">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="u@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-white text-slate-900 border-transparent focus:border-yellow-400 focus:ring-yellow-400 h-11 placeholder:text-slate-400 shadow-inner"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-red-50 font-semibold shadow-sm">Password</Label>
                                <Link href="/forgot-password" className="text-xs text-red-100 hover:text-white transition-colors underline-offset-4 hover:underline">Forgot password?</Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-white text-slate-900 border-transparent focus:border-yellow-400 focus:ring-yellow-400 h-11 shadow-inner"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-white hover:bg-red-50 text-[#C5161D] font-extrabold text-lg h-12 shadow-lg mt-4 transition-all active:scale-[0.98]">
                            {loading ? "Authenticating..." : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
                <div className="bg-[#2b0808]/80 p-4 text-center">
                    <p className="text-xs text-red-200/40">
                        &copy; 2026 PT Sam Deni Dimsum. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}
