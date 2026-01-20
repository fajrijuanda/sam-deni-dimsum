import { Navbar } from "@/components/home/Navbar"
import { Hero } from "@/components/home/Hero"
import { About } from "@/components/home/About"
import { Products } from "@/components/home/Products"
import { Features } from "@/components/home/Features"
import { Partnership } from "@/components/home/Partnership"
import { Locations } from "@/components/home/Locations"
import { Footer } from "@/components/home/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <Hero />
      <About />
      <Products />
      <Features />
      <Partnership />
      <Locations />
      <Footer />
    </main>
  )
}
