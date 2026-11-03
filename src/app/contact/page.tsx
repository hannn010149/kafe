import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCafeSettings } from "@/lib/db";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";

export default async function ContactPage() {
  const settings = await getCafeSettings();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar cafeSettings={settings} />
      <main className="grow pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Title */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#536B54] bg-[#E2ECE2] px-3.5 py-1 rounded-full">
              Kunjungi Kami
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#232724]">
              Kontak & Lokasi
            </h1>
            <p className="text-xs sm:text-sm text-[#7E8680]">
              Kami selalu siap menyambut kedatangan Anda dengan kehangatan dan keramahan khas Jepang.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Info Cards */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E2ECE2] text-[#536B54] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#232724] text-base">Alamat Kafe</h3>
                <p className="text-xs text-[#7E8680] leading-relaxed">
                  {settings.address}
                </p>
                <a
                  href={settings.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-semibold text-[#536B54] underline pt-1"
                >
                  Buka di Google Maps
                </a>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E2ECE2] text-[#536B54] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#232724] text-base">Jam Operasional</h3>
                <div className="space-y-1 text-xs text-[#7E8680]">
                  <p><strong>Senin - Jumat:</strong> {settings.opening_hours.weekdays}</p>
                  <p><strong>Sabtu - Minggu:</strong> {settings.opening_hours.weekends}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E2ECE2] text-[#536B54] flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#232724] text-base">WhatsApp Resmi</h3>
                <p className="text-xs text-[#7E8680]">
                  Hubungi kami secara langsung untuk pertanyaan reservasi, private event, atau pesanan khusus.
                </p>
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat WhatsApp Sekarang</span>
                </a>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DDCB] shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#232724]">Kirim Pesan / Masukan</h3>
              <p className="text-xs text-[#7E8680]">
                Punya pertanyaan atau masukan untuk kafe kami? Tuliskan pesan Anda di bawah ini:
              </p>

              <form
                action={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                method="GET"
                target="_blank"
                className="space-y-4 pt-2"
              >
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#7E8680]">Nama Anda</label>
                  <input
                    type="text"
                    required
                    name="name"
                    placeholder="Nama lengkap"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#536B54]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#7E8680]">Nomor WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="0812xxxxxxx"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#536B54]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#7E8680]">Pesan / Pertanyaan</label>
                  <textarea
                    rows={4}
                    required
                    name="text"
                    placeholder="Tuliskan pesan Anda..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#536B54]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#536B54] hover:bg-[#425543] text-white py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim via WhatsApp</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer cafeSettings={settings} />
    </div>
  );
}

