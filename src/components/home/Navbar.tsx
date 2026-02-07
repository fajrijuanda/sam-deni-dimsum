"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, LogIn, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { applyTheme, getStoredTheme, resolveTheme, storeTheme } from "@/lib/theme"

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        const stored = getStoredTheme()
        setIsDark(resolveTheme(stored) === "dark")
    }, [])

    const toggleTheme = () => {
        const nextTheme = isDark ? "light" : "dark"
        storeTheme(nextTheme)
        applyTheme(nextTheme)
        setIsDark(!isDark)
    }

    const navLinks = [
        { name: "Tentang", href: "#about" },
        { name: "Menu", href: "#products" },
        { name: "Kemitraan", href: "#partnership" },
        { name: "Sistem", href: "#features" },
        { name: "Lokasi", href: "#locations" },
    ]

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-md py-3 text-red-900 dark:text-slate-100" : "bg-transparent py-5 text-white"
                }`}
        >
            <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform group-hover:scale-110">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            fill
                            className="object-contain drop-shadow-lg"
                        />
                    </div>
                    <span className={`font-bold text-xl md:text-2xl tracking-tight hidden sm:block ${isScrolled ? 'text-red-800 dark:text-slate-100' : 'text-white'}`}>
                        SAM DENI <span className={`${isScrolled ? 'text-yellow-600 dark:text-yellow-400' : 'text-yellow-400'}`}>DIMSUM</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`font-medium text-sm lg:text-base hover:text-yellow-500 transition-colors ${isScrolled ? 'text-slate-700 dark:text-slate-200' : 'text-white/90'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className={`h-10 w-10 rounded-full border flex items-center justify-center transition-colors ${isScrolled
                            ? "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                            : "border-white/40 bg-white/10 text-white hover:bg-white/20"
                            }`}
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    <Button asChild className="bg-red-600 hover:bg-red-700 text-white shadow-lg rounded-full px-6">
                        <Link href="/login">
                            Login <LogIn className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? (
                        <X className={`w-6 h-6 ${isScrolled ? 'text-slate-900 dark:text-slate-100' : 'text-white'}`} />
                    ) : (
                        <Menu className={`w-6 h-6 ${isScrolled ? 'text-slate-900 dark:text-slate-100' : 'text-white'}`} />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-900 shadow-xl md:hidden border-t border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col p-4 gap-4">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="text-left text-slate-800 dark:text-slate-100 font-medium py-2 px-4 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                        >
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            {isDark ? "Light Mode" : "Dark Mode"}
                        </button>
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-slate-800 dark:text-slate-100 font-medium py-2 px-4 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        <Link
                            href="/login"
                            className="mt-2 w-full bg-red-600 text-white font-bold py-3 rounded-xl text-center shadow-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}
