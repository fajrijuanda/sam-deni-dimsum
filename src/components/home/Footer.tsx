import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, MessageCircle } from "lucide-react"

export function Footer() {
    return (
        <footer id="footer" className="bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white pt-20 pb-10 border-t border-slate-200 dark:border-white/10 transition-colors">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="relative w-10 h-10">
                                <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                            </div>
                            <span className="font-bold text-2xl">SAM DENI DIMSUM</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 max-w-sm mb-6 leading-relaxed">
                            Penyedia dimsum frozen dan siap saji berkualitas premium dengan harga terjangkau. Mitra terpercaya usaha kuliner Anda.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/samdenidimsum?igsh=MWxsZjVicTV6Mmw0NQ%3D%3D" target="_blank" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="https://wa.me/6285117784817" target="_blank" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                                <MessageCircle className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-red-500">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Beranda</Link></li>
                            <li><Link href="#about" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Tentang Kami</Link></li>
                            <li><Link href="#products" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Produk</Link></li>
                            <li><Link href="/login" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Login System</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-red-500">Hubungi Kami</h4>
                        <ul className="space-y-4 text-slate-600 dark:text-slate-300">
                            <li>Jl. Dimsum Enak No. 123</li>
                            <li>Jakarta Selatan, 12345</li>
                            <li><a href="https://wa.me/6285117784817" className="hover:text-slate-900 dark:hover:text-white transition-colors">+62 851-1778-4817</a></li>
                            <li><a href="mailto:samdenihomemade@gmail.com" className="hover:text-slate-900 dark:hover:text-white transition-colors">samdenihomemade@gmail.com</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-white/5 pt-8 text-center text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} PT Sam Deni Dimsum. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
