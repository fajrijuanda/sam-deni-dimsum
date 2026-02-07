import { Navbar } from "@/components/home/Navbar"
import { Hero } from "@/components/home/Hero"
import { About } from "@/components/home/About"
import { Products } from "@/components/home/Products"
import { Features } from "@/components/home/Features"
import { Partnership } from "@/components/home/Partnership"
import { Locations } from "@/components/home/Locations"
import { Footer } from "@/components/home/Footer"
import { WhatsAppBubble } from "@/components/home/WhatsAppBubble"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative transition-colors">
      <Navbar />
      <Hero />
      <About />
      <Products />
      <Partnership />
      <Features />
      <Locations />
      <Footer />
      <WhatsAppBubble />
    </main>
  )
}
