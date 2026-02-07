import { ScrollReveal } from "./ScrollReveal"
import { Database, BarChart, Smartphone, Globe, ShieldCheck, Zap } from "lucide-react"

const features = [
    {
        icon: Globe,
        title: "Terintegrasi Online",
        desc: "Akses data penjualan dan stok dari mana saja secara real-time melalui sistem berbasis web."
    },
    {
        icon: Smartphone,
        title: "Mobile Friendly",
        desc: "Desain responsif yang memudahkan input data oleh Crew dan Staff langsung dari smartphone."
    },
    {
        icon: BarChart,
        title: "Analitik Bisnis",
        desc: "Pantau performa outlet dengan dashboard analitik yang lengkap dan mudah dipahami."
    },
    {
        icon: Database,
        title: "Manajemen Stok",
        desc: "Kontrol stok masuk, keluar, dan opname secara akurat untuk meminimalisir kerugian."
    },
    {
        icon: ShieldCheck,
        title: "Keamanan Data",
        desc: "Sistem role-based access control memastikan data hanya bisa diakses oleh yang berwenang."
    },
    {
        icon: Zap,
        title: "Fitur Mitra",
        desc: "Portal khusus mitra untuk request restock, cek saldo, dan monitoring performa jualan."
    }
]

export function Features() {
    return (
        <section id="features" className="py-20 md:py-32 bg-gradient-to-b from-red-50 via-white to-amber-50 dark:from-[#1a0505] dark:via-[#1a0505] dark:to-[#1a0505] text-slate-900 dark:text-white relative overflow-hidden transition-colors">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-300/30 dark:bg-red-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-300/20 dark:bg-yellow-600/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="text-center mb-20">
                    <ScrollReveal>
                        <h2 className="text-red-500 font-bold tracking-widest uppercase text-sm mb-2">Powered by SDMS</h2>
                        <h3 className="text-3xl md:text-5xl font-extrabold mb-6">Sekilas Tentang Sistem Kami</h3>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg pt-2">
                            Sam Deni Dimsum bukan sekadar bisnis kuliner biasa. Kami didukung oleh teknologi **Sam Deni Management System (SDMS)** yang canggih.
                        </p>
                    </ScrollReveal>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <ScrollReveal key={idx} delay={idx * 100}>
                            <div className="bg-white border border-red-100 dark:bg-white/5 dark:border-white/10 backdrop-blur-sm p-8 rounded-2xl hover:bg-red-50 dark:hover:bg-white/10 transition-colors duration-300 group">
                                <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-red-900/50 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h4 className="text-xl font-bold mb-3 text-red-900 dark:text-red-50">{feature.title}</h4>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
