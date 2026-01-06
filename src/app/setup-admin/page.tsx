"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SetupAdminPage() {
    const router = useRouter()
    const supabase = createClient()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            // 1. Sign up/Create the user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name,
                        role: 'admin', // Force admin role for this setup route
                    }
                }
            })

            if (authError) throw authError

            if (authData.user) {
                // 2. Insert into public.users table (if not handled by trigger)
                // Note: Ideally a Supabase trigger handles this, but we'll do an explicit insert/upsert to be safe for the blueprint
                const { error: dbError } = await supabase
                    .from('users')
                    .upsert({
                        id: authData.user.id,
                        email: email, // Assuming email column exists for reference, though blueprint keys on ID
                        name: name,
                        role: 'admin',
                        password_hash: 'managed_by_supabase_auth'
                    })

                if (dbError) {
                    console.error("Error creating user profile:", dbError)
                    // Continue anyway since Auth succeeded, might just be a duplicate
                }

                setMessage({ type: 'success', text: "Admin account created successfully! Redirecting..." })
                setTimeout(() => router.push("/login"), 2000)
            }

        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || "Failed to create account" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <Card className="w-full max-w-md shadow-xl border-red-100 dark:border-red-900/20">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-red-700">Setup Master Admin</CardTitle>
                    <CardDescription>
                        Create the initial Super Admin account for the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        {message && (
                            <div className={`p-3 rounded-md text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="Admin Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <p className="text-[10px] text-slate-500">
                                Try avoiding domains like <strong>@mail.com</strong> which Supabase often blocks. Use <strong>@gmail.com</strong> or your company domain.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={loading}>
                            {loading ? "Creating..." : "Create Admin Account"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t p-4 bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-xs text-slate-500">
                        This route should be disabled after initial setup.
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
