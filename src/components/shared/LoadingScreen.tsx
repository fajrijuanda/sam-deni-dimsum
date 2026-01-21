"use client"

import Image from "next/image"
import { Loader2 } from "lucide-react"

export function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#2b0808] text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-600 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-yellow-600 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                <div className="relative w-32 h-32 md:w-48 md:h-48 animate-bounce">
                    <Image
                        src="/logo.png"
                        alt="Loading..."
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority
                    />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
                    <p className="text-sm text-red-100 font-medium tracking-widest uppercase animate-pulse">
                        Loading System...
                    </p>
                </div>
            </div>
        </div>
    )
}
