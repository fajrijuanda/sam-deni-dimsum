import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ScrollReveal } from "./ScrollReveal"
import { ArrowRight, ChevronDown } from "lucide-react"

export function Hero() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#8B0000] via-[#A52A2A] to-[#2b0808]">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-10">
                <Image
                    src="/logo.png"
                    alt="pattern"
                    fill
                    className="object-cover scale-150 blur-sm opacity-50grayscale"
                />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-0"></div>

            <div className="container relative z-10 px-4 md:px-8 pt-20 flex flex-col items-center text-center">
                <ScrollReveal>
                    <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 hover:scale-105 transition-transform duration-500">
                        <Image
                            src="/logo.png"
                            alt="Sam Deni Dimsum"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full -z-10 animate-pulse"></div>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
                        Citarasa <span className="text-yellow-400">Authentic</span><br />
                        Dimsum & Chinese Food
                    </h1>
                </ScrollReveal>

                <ScrollReveal delay={400}>
                    <p className="text-lg md:text-2xl text-red-100 mb-10 max-w-2xl font-light">
                        Solusi kemitraan kuliner terpercaya dengan sistem manajemen modern yang terintegrasi. Bergabunglah bersama ratusan mitra sukses kami.
                    </p>
                </ScrollReveal>

                <ScrollReveal delay={600}>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-yellow-500 hover:bg-yellow-400 text-red-900 font-bold shadow-xl hover:shadow-yellow-500/20 transition-all">
                            <Link href="#products">Lihat Menu</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 border-white/20 hover:bg-white/10 text-white hover:text-white backdrop-blur-sm">
                            <Link href="#features">Pelajari Sistem</Link>
                        </Button>
                    </div>
                </ScrollReveal>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                    <ChevronDown className="w-8 h-8 text-white/50" />
                </div>
            </div>
        </div>
    )
}
