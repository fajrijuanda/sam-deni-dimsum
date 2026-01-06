import Image from "next/image"
import Link from "next/link"
import logo from "../../public/logo.png"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-[40%] -left-[10%] w-[30%] h-[30%] bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-lg p-0 rounded-xl overflow-hidden shadow-2xl shadow-red-950/60 z-10 bg-gradient-to-b from-[#dc2626] via-[#7f1d1d] to-[#2b0808] border-none ring-1 ring-white/5 flex flex-col items-center">
        <div className="pt-12 pb-8 flex flex-col items-center space-y-6 w-full px-8">
          {/* Logo */}
          <div className="relative w-56 h-40 hover:scale-105 transition-transform duration-300">
            <Image
              src={logo}
              alt="Sam Deni Dimsum Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Text */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              SAM DENI DIMSUM
            </h1>
            <p className="text-red-200/90 font-medium text-lg">
              Management System (SDMS)
            </p>
          </div>

          {/* Action */}
          <div className="w-full pt-4 pb-2">
            <Link
              href="/login"
              className="flex items-center justify-center w-full bg-white hover:bg-red-50 text-[#C5161D] font-extrabold text-lg h-14 rounded-md shadow-lg transition-all active:scale-[0.98]"
            >
              Login to System
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#2b0808]/80 p-4 text-center w-full mt-4">
          <p className="text-xs text-red-200/40">
            &copy; {new Date().getFullYear()} PT Sam Deni Dimsum. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
