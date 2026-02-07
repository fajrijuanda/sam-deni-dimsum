import { ScrollReveal } from "./ScrollReveal"
import { MapPin } from "lucide-react"

const locations = [
    { city: "Jakarta Selatan", count: 12, areas: ["Tebet", "Blok M", "Kemang"] },
    { city: "Jakarta Timur", count: 8, areas: ["Rawamangun", "Buaran", "Cakung"] },
    { city: "Depok", count: 15, areas: ["Margonda", "Sawangan", "Cinere"] },
    { city: "Bekasi", count: 10, areas: ["Galaxy", "Harapan Indah", "Jatiwaringin"] },
    { city: "Tangerang", count: 5, areas: ["BSD", "Bintaro", "Pamulang"] },
    { city: "Bogor", count: 6, areas: ["Pajajaran", "Cibinong", "Sentul"] },
]

export function Locations() {
    return (
        <section id="locations" className="py-20 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white relative overflow-hidden transition-colors">
            <div className="absolute inset-0 opacity-25 dark:opacity-10 pointer-events-none">
                <div className="w-full h-full bg-[radial-gradient(#334155_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <h2 className="text-red-500 font-bold tracking-widest uppercase text-sm mb-2">Jangkauan Kami</h2>
                        <h3 className="text-3xl md:text-5xl font-extrabold mb-6">Tersebar di JABODETABEK</h3>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                            Kunjungi outlet terdekat atau bergabunglah menjadi mitra di lokasi strategis yang masih tersedia.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locations.map((loc, idx) => (
                        <ScrollReveal key={idx} delay={idx * 100}>
                            <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-2xl p-6 hover:bg-red-50 dark:hover:bg-white/10 transition-colors group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">{loc.city}</h4>
                                    </div>
                                    <span className="text-2xl font-bold text-slate-400 dark:text-white/50 group-hover:text-slate-700 dark:group-hover:text-white transition-colors">{loc.count}</span>
                                </div>
                                <div className="space-y-2">
                                    {loc.areas.map(area => (
                                        <div key={area} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                            {area}
                                        </div>
                                    ))}
                                    <div className="text-xs text-slate-500 pt-2 italic">And more...</div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal delay={400} className="mt-16 text-center">
                    <div className="inline-block p-1 rounded-full bg-gradient-to-r from-red-600 to-yellow-500">
                        <div className="bg-white dark:bg-slate-900 rounded-full px-8 py-4">
                            <p className="font-medium text-slate-900 dark:text-white">
                                Ingin buka di lokasi baru? <span className="text-yellow-500 dark:text-yellow-400 font-bold ml-1">Cek Ketersediaan Lokasi Sekarang -&gt;</span>
                            </p>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
}
