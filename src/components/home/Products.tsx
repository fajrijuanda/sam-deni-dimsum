import { ScrollReveal } from "./ScrollReveal"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const products = [
    {
        name: "Dimsum Mix",
        desc: "Kombinasi varian dimsum ayam, udang, dan jamur dalam satu porsi yang memuaskan.",
        price: "Rp 15.000/porsi",
        color: "bg-red-600",
        tag: "Best Seller"
    },
    {
        name: "Gyoza Ayam",
        desc: "Dumpling khas Jepang dengan isian ayam cincang juicy dan sayuran segar.",
        price: "Rp 15.000/porsi",
        color: "bg-amber-500",
        tag: "Favorite"
    },
    {
        name: "Wonton Goreng",
        desc: "Pangsit goreng super renyah dengan saus cocolan rahasia yang bikin nagih.",
        price: "Rp 12.000/porsi",
        color: "bg-yellow-500",
        tag: "Crispy"
    },
    {
        name: "Frozen Pack",
        desc: "Kemasan beku praktis siap kukus/goreng untuk persediaan di rumah.",
        price: "Rp 65.000/pack",
        color: "bg-blue-600",
        tag: "Praktis"
    }
]

export function Products() {
    return (
        <section id="products" className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 md:px-8">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <Badge variant="outline" className="mb-4 border-red-200 text-red-600 bg-red-50">Menu Pilihan</Badge>
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Produk Unggulan Kami</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">
                            Berbagai pilihan varian dimsum dan frozen food berkualitas tinggi yang siap memanjakan lidah pelanggan Anda.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, idx) => (
                        <ScrollReveal key={idx} delay={idx * 100}>
                            <div className="group relative h-full">
                                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl transform translate-y-4"></div>
                                <Card className="h-full border-none shadow-lg hover:-translate-y-2 transition-transform duration-300 overflow-hidden">
                                    <div className={`h-48 w-full ${product.color} flex items-center justify-center relative overflow-hidden`}>
                                        <div className="absolute inset-0 bg-black/10"></div>
                                        {/* Product Icon Placeholder */}
                                        <span className="text-white font-bold text-6xl opacity-20 transform group-hover:scale-110 transition-transform duration-500">
                                            {product.name[0]}
                                        </span>
                                        <Badge className="absolute top-4 right-4 bg-white/90 text-slate-900 hover:bg-white border-none shadow-sm">
                                            {product.tag}
                                        </Badge>
                                    </div>
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h3>
                                        <p className="text-slate-500 text-sm mb-4 min-h-[40px]">
                                            {product.desc}
                                        </p>
                                        <div className="flex items-center justify-between border-t pt-4">
                                            <span className="text-red-600 font-bold">{product.price}</span>
                                            <span className="text-xs text-slate-400">Grosir Available</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
