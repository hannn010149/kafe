import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCafeSettings } from "@/lib/db";
import Link from "next/link";
import { Leaf, Coffee, Sparkles, Calendar } from "lucide-react";

export default async function AboutPage() {
  const settings = await getCafeSettings();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar cafeSettings={settings} />
      <main className="grow pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#536B54] bg-[#E2ECE2] px-3.5 py-1 rounded-full">
              Filosofi & Kisah
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#232724]">
              Tentang {settings.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#7E8680] leading-relaxed">
              Membawa harmoni, ketenangan, dan kesempurnaan rasa teh dan kopi Jepang ke dalam ruang santai Anda.
            </p>
          </div>

          {/* Hero Image Collage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="rounded-3xl overflow-hidden aspect-4/3 shadow-md bg-[#F3ECE0]">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80"
                alt="Cafe Interior"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="space-y-4 text-xs sm:text-sm text-[#4B524D] leading-relaxed">
              <h2 className="text-xl sm:text-2xl font-bold text-[#232724]">
                Konsep &quot;Komorebi&quot; (木漏れ日)
              </h2>
              <p>
                Kata <strong>Komorebi</strong> dalam bahasa Jepang menggambarkan momen magis ketika sinar matahari menyusup lembut melalui celah dedaunan pepohonan.
              </p>
              <p>
                Kami merancang kafe ini sebagai oase ketenangan di tengah hiruk pikuk kota. Sebuah tempat di mana Anda dapat melepas lelah, membaca buku, berbincang hangat, atau menikmati aroma seduhan matcha segar yang diolah dengan chasen bambu tradisional.
              </p>
            </div>
          </div>

          {/* Three Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E2ECE2] text-[#536B54] flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#232724] text-base">Matcha Otentik Kyoto</h3>
              <p className="text-xs text-[#7E8680] leading-relaxed">
                Kami hanya menggunakan daun teh pilihan ceremonial grade langsung dari perkebunan tertua di Uji, Kyoto.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F3ECE0] text-[#8B6B4E] flex items-center justify-center">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#232724] text-base">Artisan Slow Brew</h3>
              <p className="text-xs text-[#7E8680] leading-relaxed">
                Setiap tetes kopi pour-over diseduh dengan suhu presisi untuk mengekstraksi nada rasa floral dan buah yang jernih.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EFF4EB] text-[#536B54] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#232724] text-base">Wabi-Sabi Aesthetics</h3>
              <p className="text-xs text-[#7E8680] leading-relaxed">
                Merangkul keindahan alami, kesederhanaan kayu, dan ruang hening yang menenangkan pikiran.
              </p>
            </div>
          </div>

          {/* Booking CTA */}
          <div className="text-center pt-8">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-[#536B54] hover:bg-[#425543] text-white px-8 py-3.5 rounded-full text-sm font-semibold shadow-md transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Reservasi Meja Anda</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer cafeSettings={settings} />
    </div>
  );
}
