"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { ScrollReveal } from "./ScrollReveal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Package = {
    id: string
    name: string
    price: number
    description: string
    features: string[]
    status: 'available' | 'full' | 'closed'
    is_popular: boolean
}

export function Partnership() {
    const [packages, setPackages] = useState<Package[]>([])
    const [, setLoading] = useState(true)
    const [registerOpen, setRegisterOpen] = useState(false)
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)

    // Form States
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [whatsapp, setWhatsapp] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch from DB
                const { data, error } = await supabase
                    .from('partnership_packages')
                    .select('*')
                    .order('price', { ascending: true })

                if (!error && data && data.length > 0) {
                    setPackages(data)
                } else {
                    // Fallback mock data
                    setPackages([
                        {
                            id: '1',
                            name: 'Mitra Rumahan',
                            price: 3500000,
                            description: 'Paket usaha pemula cocok untuk ibu rumah tangga.',
                            features: [
                                'Booth Portable Exclusive',
                                'Peralatan Masak Lengkap',
                                'Bahan Baku Awal 100 Porsi',
                                'Media Promosi Banner',
                                'Training & SOP'
                            ],
                            status: 'available',
                            is_popular: true
                        },
                        {
                            id: '2',
                            name: 'Mitra Outlet',
                            price: 7500000,
                            description: 'Investasi outlet auto-pilot (terima beres) dengan bagi hasil 30% dari omset dan kontrak 2 tahun.',
                            features: [
                                'Sistem Auto-Pilot (Terima Beres)',
                                'Kontrak Kerjasama 2 Tahun',
                                'Sharing Profit 30% dari Omset',
                                'Gerobak & Aset Milik Mitra',
                                'Pengelolaan SDM oleh Pusat'
                            ],
                            status: 'full',
                            is_popular: false
                        },
                        {
                            id: '3',
                            name: 'Mitra Investasi',
                            price: 10000000,
                            description: 'Investasi pasif dengan return pasti 10% per bulan selama kontrak 2 tahun.',
                            features: [
                                'Return 10% per Bulan (Fixed)',
                                'Kontrak Kerjasama 2 Tahun',
                                'Laporan Keuangan Transparan',
                                'Tanpa Kelola Operasional',
                                'Akses Investor Dashboard'
                            ],
                            status: 'available',
                            is_popular: true
                        }
                    ])
                }
            } catch (error) {
                console.error("Error fetching packages:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleSelectPackage = (pkg: Package) => {
        if (pkg.status !== 'available') return
        setSelectedPackage(pkg)
        setRegisterOpen(true)
    }

    const handleSubmitRegistration = async () => {
        if (!name || !email || !whatsapp || !selectedPackage) {
            toast({
                title: "Mohon lengkapi data",
                description: "Nama, Email, dan WhatsApp wajib diisi.",
                variant: "destructive"
            })
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/auth/register-mitra', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    whatsapp,
                    packageId: selectedPackage.id,
                    packageName: selectedPackage.name
                })
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Gagal mendaftar")
            }

            toast({
                title: "Pendaftaran Berhasil!",
                description: "Akun Anda telah dibuat. Tunggu verifikasi admin untuk mendapatkan password via email.",
                variant: "default",
                className: "bg-green-600 text-white border-none"
            })

            setRegisterOpen(false)
            setName("")
            setEmail("")
            setWhatsapp("")
        } catch (error: any) {
            toast({
                title: "Gagal Mendaftar",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section id="partnership" className="py-20 bg-white dark:bg-slate-950 relative transition-colors">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30 mask-image:linear-gradient(to_bottom,transparent,black,transparent)"></div>

            {/* Registration Dialog */}
            <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Daftar {selectedPackage?.name}</DialogTitle>
                        <DialogDescription>
                            Isi data diri Anda. Akun akan dibuat otomatis dan menunggu verifikasi admin.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Nama Lengkap</Label>
                            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nama Sesuai KTP" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@contoh.com" />
                        </div>
                        <div className="space-y-2">
                            <Label>WhatsApp</Label>
                            <Input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="08xxxxxxxx" />
                        </div>
                        <Button onClick={handleSubmitRegistration} disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700 mt-2">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mendaftarkan...
                                </>
                            ) : (
                                "Daftar Sekarang"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/40 border-none px-4 py-1">Peluang Bisnis</Badge>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-6">Paket Kemitraan</h2>
                        <p className="text-slate-500 dark:text-slate-300 max-w-2xl mx-auto text-lg">
                            Mulai bisnis kuliner Anda sendiri dengan modal terjangkau dan potensi keuntungan tinggi bersama Sam Deni Dimsum.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="flex flex-wrap justify-center gap-8">
                    {packages.map((pkg, idx) => (
                        <ScrollReveal key={pkg.id} delay={idx * 150} className="w-full md:w-[350px]">
                            <div className={`relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group ${pkg.is_popular ? 'border-red-500 shadow-red-100 dark:shadow-red-900/30 ring-4 ring-red-500/10' : 'border-slate-200 dark:border-slate-700'}`}>

                                {pkg.is_popular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                                        Best Seller
                                    </div>
                                )}

                                <div className="p-8 pb-0">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{pkg.name}</h3>
                                    <p className="text-slate-500 dark:text-slate-300 text-sm mb-6 h-10">{pkg.description}</p>

                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">Rp</span>
                                        <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                                            {(pkg.price / 1000000).toLocaleString('id-ID', { minimumFractionDigits: 1 }).replace(',0', '')}
                                        </span>
                                        <span className="text-lg font-bold text-slate-500 dark:text-slate-300">jt</span>
                                    </div>

                                    <Button
                                        className={`w-full h-12 rounded-xl font-bold text-base shadow-lg transition-all ${pkg.status === 'available'
                                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-200'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 shadow-none'
                                            }`}
                                        disabled={pkg.status !== 'available'}
                                        onClick={() => handleSelectPackage(pkg)}
                                    >
                                        {pkg.status === 'available' ? (
                                            "Ambil Paket Ini"
                                        ) : (
                                            <span>
                                                {pkg.status === 'full' ? 'Kuota Penuh' : 'Pendaftaran Tutup'}
                                            </span>
                                        )}
                                    </Button>

                                    {pkg.status !== 'available' && (
                                        <p className="text-center text-xs text-red-500 dark:text-red-300 mt-2 font-medium bg-red-50 dark:bg-red-950/30 py-1 rounded-lg">
                                            Mohon maaf, kuota untuk paket ini sedang penuh.
                                        </p>
                                    )}
                                </div>

                                <div className="p-8 pt-6 mt-auto">
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Yang Anda Dapatkan:</p>
                                        {pkg.features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Check className="w-3 h-3 text-green-600 dark:text-green-300" />
                                                </div>
                                                <span className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-tight">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
