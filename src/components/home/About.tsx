import { ScrollReveal } from "./ScrollReveal"
import { CheckCircle2, Star, Users } from "lucide-react"

export function About() {
    return (
        <section id="about" className="py-20 md:py-32 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Image/Visual Side */}
                    <ScrollReveal>
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-yellow-500 rounded-2xl opacity-75 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-2xl">
                                {/* Placeholder for About Image - could be kitchen or storefront */}
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                    {/* Since we don't have many assets, we use a colored block or icon */}
                                    <div className="text-center p-8">
                                        <Users className="w-24 h-24 mx-auto text-red-500 mb-4" />
                                        <p className="font-bold text-xl text-slate-600">Established 2026</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Text Side */}
                    <div>
                        <ScrollReveal delay={200}>
                            <h2 className="text-red-600 font-bold tracking-wider uppercase text-sm mb-2">Tentang Sam Deni Dimsum</h2>
                            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                                Kualitas Rasa yang <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500">Tak Tertandingi</span>
                            </h3>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                Sam Deni Dimsum hadir dengan misi membawa cita rasa dimsum autentik berbintang lima ke harga kaki lima. Kami memproduksi ribuan pieces setiap hari dengan bahan-bahan pilihan yang segar dan higienis.
                            </p>
                        </ScrollReveal>

                        <div className="space-y-4">
                            <ScrollReveal delay={300}>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-50 border border-red-100 hover:shadow-md transition-all">
                                    <CheckCircle2 className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-slate-900">Bahan Premium</h4>
                                        <p className="text-slate-600 text-sm">Menggunakan daging ayam & udang segar pilihan tanpa pengawet.</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={400}>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-yellow-50 border border-yellow-100 hover:shadow-md transition-all">
                                    <Star className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-slate-900">Resep Rahasia</h4>
                                        <p className="text-slate-600 text-sm">Racikan bumbu rahasia yang membuat rasa dimsum kami khas dan nagih.</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={500}>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100 hover:shadow-md transition-all">
                                    <Users className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-slate-900">Mitra Terpercaya</h4>
                                        <p className="text-slate-600 text-sm">Didukung sistem manajemen yang transparan bagi seluruh mitra.</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
