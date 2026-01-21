"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function SplashScreen({ onFinish }: { onFinish?: () => void }) {
    const [isVisible, setIsVisible] = useState(true)
    const [opacity, setOpacity] = useState(100)

    useEffect(() => {
        // Start fade out after 1.2 seconds
        const timer = setTimeout(() => {
            setOpacity(0)
            // Remove from DOM after fade out completes (300ms transition)
            setTimeout(() => {
                setIsVisible(false)
                if (onFinish) onFinish()
            }, 300)
        }, 1200)

        return () => clearTimeout(timer)
    }, [onFinish])

    if (!isVisible) return null

    return (
        <div
            className={cn(
                "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#2b0808] transition-opacity duration-700 ease-in-out",
                opacity === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
        >
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/30 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-600/20 rounded-full blur-[80px]"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Logo Animation */}
                <div className="relative w-40 h-40 md:w-60 md:h-60 mb-8 animate-in zoom-in fade-in duration-700 slide-in-from-bottom-10">
                    <Image
                        src="/logo.png"
                        alt="Sam Deni Dimsum"
                        fill
                        className="object-contain drop-shadow-[0_0_25px_rgba(255,200,0,0.3)]"
                        priority
                    />
                </div>

                {/* Text Animation */}
                <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-forwards opacity-0" style={{ animationFillMode: 'forwards' }}>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 tracking-tight">
                        SAM DENI
                    </h1>
                    <p className="text-red-200/80 text-sm md:text-base tracking-[0.3em] font-light uppercase">
                        Authentic Dimsum
                    </p>
                </div>

                {/* Loading Bar */}
                <div className="mt-12 w-48 h-1 bg-red-900/50 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-red-600 via-yellow-400 to-red-600 animate-[shimmer_1s_infinite_linear] bg-[length:200%_100%]"></div>
                </div>

                {/* Loading Text */}
                <div className="mt-4 text-xs font-medium tracking-[0.2em] text-yellow-500/80 animate-pulse uppercase">
                    Loading System...
                </div>
            </div>

            {/* Version */}
            <div className="absolute bottom-8 text-xs text-red-200/30 font-mono">
                v6.1.0 • System Ready
            </div>
        </div>
    )
}
