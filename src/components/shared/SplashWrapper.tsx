"use client"

import { useEffect, useState } from "react"
import { SplashScreen } from "./SplashScreen"

export function SplashWrapper() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return <SplashScreen />
}
