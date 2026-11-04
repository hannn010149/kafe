"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { CafeSettings } from "@/types";
import {
  ShoppingBag,
  Globe,
  Menu as MenuIcon,
  X,
  Clock,
  Sparkles,
  Search,
  Calendar,
  Coffee,
  ShieldAlert,
} from "lucide-react";

interface NavbarProps {
  cafeSettings?: CafeSettings;
}

export default function Navbar({ cafeSettings }: NavbarProps) {
  const { language, setLanguage, t } = useLanguage();
  const { totalItems, setIsCartOpen } = useCart();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t("nav_home") },
    { href: "/menu", label: t("nav_menu") },
    { href: "/booking", label: t("nav_booking") },
    { href: "/about", label: t("nav_about") },
    { href: "/gallery", label: t("nav_gallery") },
    { href: "/contact", label: t("nav_contact") },
  ];

  const cafeName = cafeSettings?.name || "Komorebi Café & Roastery";
  const kanjiName = cafeSettings?.kanji_name || "木漏れ日 喫茶";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm border-b border-[#E8DDCB]/60 py-3"
          : "bg-[#FAF7F2]/80 backdrop-blur-sm py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#536B54] text-white flex items-center justify-center font-serif text-lg font-bold shadow-sm transition-transform duration-300 group-hover:scale-105">
              木
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight text-[#232724] group-hover:text-[#536B54] transition-colors">
                {cafeName}
              </span>
              <span className="text-xs text-[#7E8680] font-light tracking-widest uppercase">
                {kanjiName}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F1ECE1]/80 px-4 py-1.5 rounded-full border border-[#E2D7C3]/50">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#536B54] text-white shadow-xs"
                      : "text-[#4B524D] hover:text-[#232724] hover:bg-[#EAE2D2]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Language Switcher, Cart, Track Order, Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-[#F1ECE1] rounded-full p-1 border border-[#E2D7C3]/60 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLanguage("id")}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === "id"
                    ? "bg-[#536B54] text-white shadow-xs"
                    : "text-[#636B65] hover:text-[#232724]"
                }`}
                aria-label="Bahasa Indonesia"
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === "en"
                    ? "bg-[#536B54] text-white shadow-xs"
                    : "text-[#636B65] hover:text-[#232724]"
                }`}
                aria-label="English"
              >
                EN
              </button>
            </div>

            {/* Track Order Icon Button */}
            <Link
              href="/track"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#4B524D] hover:text-[#536B54] bg-white px-3 py-2 rounded-full border border-[#E2D7C3] transition-all hover:border-[#536B54]/40"
              title={t("nav_track_order")}
            >
              <Search className="w-3.5 h-3.5 text-[#536B54]" />
              <span>{t("nav_track_order")}</span>
            </Link>

            {/* Cart Button with Count Badge */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-white border border-[#E2D7C3] text-[#232724] hover:border-[#536B54] hover:text-[#536B54] transition-all shadow-xs cursor-pointer"
              aria-label="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#536B54] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-scale">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Admin Dashboard Pill */}
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-1 text-xs text-[#7E8680] hover:text-[#232724] px-2.5 py-1 rounded-md transition-colors"
              title="Dashboard Pengelola"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#232724] hover:bg-[#EAE2D2] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 bg-white rounded-2xl border border-[#E2D7C3] shadow-lg animate-in fade-in duration-200">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#536B54] text-white"
                        : "text-[#4B524D] hover:bg-[#FAF7F2] hover:text-[#232724]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-[#E8DDCB] flex items-center justify-between">
                <Link
                  href="/track"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm text-[#536B54] font-medium"
                >
                  <Search className="w-4 h-4" />
                  <span>{t("nav_track_order")}</span>
                </Link>
                
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

