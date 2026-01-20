"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navLinks = [
        { name: "Tentang Kami", href: "#about" },
        { name: "Produk", href: "#products" },
        { name: "Teknologi", href: "#features" },
        { name: "Kontak", href: "#footer" },
    ]

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-md py-3 text-red-900" : "bg-transparent py-5 text-white"
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
                    <span className={`font-bold text-xl md:text-2xl tracking-tight hidden sm:block ${isScrolled ? 'text-red-800' : 'text-white'}`}>
                        SAM DENI <span className={`${isScrolled ? 'text-yellow-600' : 'text-yellow-400'}`}>DIMSUM</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`font-medium text-sm lg:text-base hover:text-yellow-500 transition-colors ${isScrolled ? 'text-slate-700' : 'text-white/90'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
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
                        <X className={`w-6 h-6 ${isScrolled ? 'text-slate-900' : 'text-white'}`} />
                    ) : (
                        <Menu className={`w-6 h-6 ${isScrolled ? 'text-slate-900' : 'text-white'}`} />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-xl md:hidden border-t">
                    <div className="flex flex-col p-4 gap-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-slate-800 font-medium py-2 px-4 hover:bg-red-50 rounded-lg"
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
