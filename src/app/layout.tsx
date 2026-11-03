import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Komorebi Café & Roastery | 木漏れ日 喫茶",
  description:
    "Website kafe profesional dengan desain Minimalist Japanese Cafe. Nikmati sajian matcha ceremonial Uji Kyoto, artisan single origin coffee, kudapan Jepang lembut, dan reservasi meja online.",
  keywords: [
    "kafe jepang",
    "komorebi cafe",
    "matcha kyoto",
    "artisan coffee",
    "souffle pancake",
    "booking meja cafe",
    "japanese cafe jakarta",
  ],
  authors: [{ name: "Komorebi Artisan Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#232724]">
        <LanguageProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
