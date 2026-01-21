import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { SplashWrapper } from "@/components/shared/SplashWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sam Deni Dimsum | Kemitraan Dimsum Authentic",
    template: "%s | Sam Deni Dimsum"
  },
  description: "Bergabung dengan kemitraan Sam Deni Dimsum. Solusi bisnis kuliner dimsum authentic dengan sistem manajemen modern dan keuntungan menjanjikan.",
  keywords: ["dimsum", "kemitraan dimsum", "franchise dimsum", "sam deni dimsum", "bisnis kuliner", "umkm", "frozen food"],
  authors: [{ name: "Sam Deni Dimsum Team" }],
  creator: "PT Sam Deni Dimsum",
  publisher: "PT Sam Deni Dimsum",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Sam Deni Dimsum | Kemitraan Dimsum Authentic",
    description: "Solusi bisnis kuliner dimsum authentic dengan sistem manajemen modern.",
    url: "https://sam-deni-dimsum-seven.vercel.app",
    siteName: "Sam Deni Dimsum",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Sam Deni Dimsum Logo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sam Deni Dimsum",
    description: "Kemitraan Dimsum Authentic & Modern",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SplashWrapper />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
