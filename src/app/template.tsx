"use client"

import { SplashWrapper } from "@/components/shared/SplashWrapper"

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SplashWrapper />
            {children}
        </>
    )
}
