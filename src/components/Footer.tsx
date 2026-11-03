"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { CafeSettings } from "@/types";
import {
  MapPin,
  Phone,
  Clock,
  Heart,
  ExternalLink,
  MessageCircle,
  Globe,
} from "lucide-react";

interface FooterProps {
  cafeSettings?: CafeSettings;
}

export default function Footer({ cafeSettings }: FooterProps) {
  const { t } = useLanguage();

  const name = cafeSettings?.name || "Komorebi Café & Roastery";
  const kanji = cafeSettings?.kanji_name || "木漏れ日 喫茶";
  const address = cafeSettings?.address || "Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan 12190";
  const whatsapp = cafeSettings?.whatsapp || "6281234567890";
  const instagram = cafeSettings?.instagram || "@komorebi.cafe";
  const weekdaysHours = cafeSettings?.opening_hours?.weekdays || "08:00 - 22:00";
  const weekendsHours = cafeSettings?.opening_hours?.weekends || "07:00 - 23:00";
  const desc = cafeSettings?.description || "Sebuah ruang tenang di tengah hiruk pikuk kota, menyajikan racikan matcha murni dari Uji Kyoto, artisan coffee pilihan, dan kudapan khas dengan filosofi ketenangan Wabi-Sabi.";

  return (
    <footer className="bg-[#242A25] text-[#D8DDD9] border-t border-[#363E37] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#363E37]">
          {/* Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#536B54] text-white flex items-center justify-center font-serif text-lg font-bold">
                木
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold tracking-tight">{name}</h3>
                <span className="text-xs text-[#8E9B90] tracking-widest uppercase">{kanji}</span>
              </div>
            </div>
            <p className="text-sm text-[#A8B2AA] leading-relaxed font-light">
              {desc}
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=Halo%20${encodeURIComponent(name)},%20saya%20ingin%20bertanya`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#536B54] hover:bg-[#637E64] text-white text-xs font-medium px-4 py-2.5 rounded-full transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Pemesanan & Info</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A8B2AA]">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {t("nav_home")}
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-white transition-colors">
                  {t("nav_menu")}
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-white transition-colors">
                  {t("nav_booking")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t("nav_about")}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  {t("nav_gallery")}
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors">
                  {t("nav_track_order")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#889E73]" />
              <span>{t("contact_hours_label")}</span>
            </h4>
            <div className="space-y-3 text-sm text-[#A8B2AA]">
              <div>
                <p className="text-white font-medium">Senin — Jumat</p>
                <p className="text-xs text-[#8E9B90]">{weekdaysHours}</p>
              </div>
              <div>
                <p className="text-white font-medium">Sabtu — Minggu & Libur</p>
                <p className="text-xs text-[#8E9B90]">{weekendsHours}</p>
              </div>
              <div className="pt-2 text-xs text-[#889E73] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#889E73] animate-pulse"></span>
                <span>Dine-In & Takeaway Aktif</span>
              </div>
            </div>
          </div>

          {/* Location & Social */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#889E73]" />
              <span>{t("contact_address_label")}</span>
            </h4>
            <p className="text-sm text-[#A8B2AA] leading-relaxed mb-4">
              {address}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={`https://instagram.com/${instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#2F3630] hover:bg-[#536B54] text-[#D8DDD9] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#2F3630] hover:bg-[#536B54] text-[#D8DDD9] hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8E9B90] gap-4">
          <p>
            © 2026 {name}. {t("footer_rights")}
          </p>
          <p className="flex items-center gap-1">
            <span>Dibuat dengan rasa hormat pada ketenangan dan tradisi Jepang</span>
            <span className="text-[#889E73]">和</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

