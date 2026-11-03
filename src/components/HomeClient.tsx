"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CafeSettings, Category, Product } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import {
  ArrowRight,
  Calendar,
  Sparkles,
  Coffee,
  Leaf,
  Clock,
  MapPin,
  ChevronRight,
} from "lucide-react";

interface HomeClientProps {
  settings: CafeSettings;
  categories: Category[];
  initialProducts: Product[];
}

export default function HomeClient({
  settings,
  categories,
  initialProducts,
}: HomeClientProps) {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products by selected category
  const filteredProducts =
    activeCategory === "all"
      ? initialProducts
      : initialProducts.filter((p) => p.category_id === activeCategory);

  return (
    <div className="space-y-20 sm:space-y-28 pt-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:py-24">
        {/* Soft background decor */}
        <div className="absolute top-10 right-0 w-96 h-96 bg-[#E2ECE2]/50 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#F3ECE0]/60 rounded-full blur-2xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#E2ECE2] text-[#425543] px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-[#C5D8C6]/50 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#536B54] animate-ping" />
                <span>{t("hero_badge")}</span>
                <span className="text-[#536B54] font-serif font-bold">和</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#232724] leading-[1.15]">
                {t("hero_title_1")}{" "}
                <span className="text-[#536B54] underline decoration-[#C5D8C6] decoration-wavy decoration-2">
                  {t("hero_title_2")}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#4B524D] leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
                {t("hero_subtitle")}
              </p>

              {/* CTA Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto bg-[#536B54] hover:bg-[#425543] text-white px-7 py-3.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>{t("hero_cta_menu")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/booking"
                  className="w-full sm:w-auto bg-white hover:bg-[#FAF7F2] text-[#232724] border border-[#E8DDCB] px-7 py-3.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:border-[#536B54]/50 shadow-2xs cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#536B54]" />
                  <span>{t("hero_cta_booking")}</span>
                </Link>
              </div>

              {/* Operational & Trust Mini Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-[#7E8680]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#536B54]" />
                  <span>Buka Hari Ini: {settings.opening_hours.weekdays}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-[#C5D8C6] hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#536B54]" />
                  <span>Kebayoran Baru, Jakarta</span>
                </div>
              </div>
            </div>

            {/* Right Column: Aesthetic Japanese Cafe Visuals */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Featured Photo */}
                <div className="relative rounded-3xl overflow-hidden aspect-4/5 shadow-xl border-4 border-white bg-[#EAE2D2]">
                  <img
                    src={settings.banner_url}
                    alt={settings.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#C5D8C6]">
                      {settings.kanji_name}
                    </span>
                    <h3 className="text-xl font-bold tracking-tight">
                      Ketenangan dalam Setiap Tegukan
                    </h3>
                    <p className="text-xs text-white/80">
                      Disajikan dengan peralatan keramik khas Mino & Hasami.
                    </p>
                  </div>
                </div>

                {/* Floating Aesthetic Card */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-[#E8DDCB] max-w-[220px] hidden sm:block animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E2ECE2] text-[#536B54] flex items-center justify-center font-bold text-sm">
                      🍵
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#232724]">Kyoto Uji Matcha</h4>
                      <p className="text-[11px] text-[#7E8680]">100% Ceremonial</p>
                    </div>
                  </div>
                </div>

                {/* Floating Rating Badge */}
                <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-md border border-[#E8DDCB] flex items-center gap-2">
                  <span className="text-amber-500 font-bold text-sm">★ 4.9</span>
                  <span className="text-[11px] text-[#7E8680] font-medium">500+ Ulasan Tamu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE CORE PILLARS / HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DDCB]/70 shadow-2xs hover:shadow-sm transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E2ECE2] text-[#536B54] flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#232724]">{t("hl_matcha_title")}</h3>
            <p className="text-xs sm:text-sm text-[#7E8680] leading-relaxed">
              {t("hl_matcha_desc")}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DDCB]/70 shadow-2xs hover:shadow-sm transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F3ECE0] text-[#8B6B4E] flex items-center justify-center">
              <Coffee className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#232724]">{t("hl_coffee_title")}</h3>
            <p className="text-xs sm:text-sm text-[#7E8680] leading-relaxed">
              {t("hl_coffee_desc")}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DDCB]/70 shadow-2xs hover:shadow-sm transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF4EB] text-[#536B54] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#232724]">{t("hl_ambiance_title")}</h3>
            <p className="text-xs sm:text-sm text-[#7E8680] leading-relaxed">
              {t("hl_ambiance_desc")}
            </p>
          </div>
        </div>
      </section>

      {/* 3. MENU SHOWCASE & CATEGORY FILTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#536B54] bg-[#E2ECE2] px-3 py-1 rounded-full">
            {t("menu_section_badge")}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#232724]">
            {t("menu_section_title")}
          </h2>
          <p className="text-xs sm:text-sm text-[#7E8680]">
            {t("menu_section_subtitle")}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === "all"
                ? "bg-[#536B54] text-white shadow-xs"
                : "bg-white text-[#4B524D] border border-[#E8DDCB] hover:bg-[#F3ECE0]"
            }`}
          >
            {t("filter_all")}
          </button>
          {categories.map((cat) => {
            const isCatActive = activeCategory === cat.id;
            const catName = language === "en" && cat.name_en ? cat.name_en : cat.name;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isCatActive
                    ? "bg-[#536B54] text-white shadow-xs"
                    : "bg-white text-[#4B524D] border border-[#E8DDCB] hover:bg-[#F3ECE0]"
                }`}
              >
                {catName}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenModal={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#536B54] hover:text-[#425543] transition-colors group"
          >
            <span>Lihat Seluruh Daftar Menu Lengkap</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 4. ABOUT CAFE & PHILOSOPHY */}
      <section className="bg-white py-16 sm:py-24 border-y border-[#E8DDCB]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visual Collage */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden aspect-4/3 shadow-lg bg-[#F3ECE0]">
                <img
                  src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=80"
                  alt="Komorebi Cafe Atmosphere"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-1/2 aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80"
                  alt="Kyoto tea chasen whisk"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Narrative Content */}
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#536B54] bg-[#E2ECE2] px-3 py-1 rounded-full">
                {t("about_badge")}
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#232724] leading-tight">
                {t("about_title")}
              </h2>
              <p className="text-sm text-[#4B524D] leading-relaxed">
                {t("about_p1")}
              </p>
              <p className="text-sm text-[#4B524D] leading-relaxed">
                {t("about_p2")}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#F1ECE1]">
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-[#536B54]">
                    {t("about_stat_1_val")}
                  </span>
                  <span className="text-xs text-[#7E8680] block mt-0.5">
                    {t("about_stat_1_lbl")}
                  </span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-[#536B54]">
                    {t("about_stat_2_val")}
                  </span>
                  <span className="text-xs text-[#7E8680] block mt-0.5">
                    {t("about_stat_2_lbl")}
                  </span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-[#536B54]">
                    {t("about_stat_3_val")}
                  </span>
                  <span className="text-xs text-[#7E8680] block mt-0.5">
                    {t("about_stat_3_lbl")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOOKING TABLE CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#536B54] text-white p-8 sm:p-14 shadow-xl">
          {/* Background image overlay */}
          <div className="absolute inset-0 opacity-15 mix-blend-overlay">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80"
              alt="Japanese Interior"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="relative max-w-2xl space-y-5">
            <span className="inline-block text-xs uppercase font-mono tracking-widest bg-white/20 px-3 py-1 rounded-full text-white">
              {t("booking_badge")}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              {t("booking_title")}
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-light">
              {t("booking_subtitle")}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link
                href="/booking"
                className="bg-white text-[#536B54] hover:bg-[#FAF7F2] px-7 py-3 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all hover:scale-102 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Buat Reservasi Sekarang</span>
              </Link>
              <span className="text-xs text-white/80">
                ✓ Bebas Biaya Reservasi & Tanpa Antre
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AESTHETIC GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#536B54] bg-[#E2ECE2] px-3 py-1 rounded-full">
            {t("gallery_badge")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#232724]">
            {t("gallery_title")}
          </h2>
          <p className="text-xs sm:text-sm text-[#7E8680]">
            {t("gallery_subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-[#F3ECE0] shadow-2xs group">
            <img
              src="https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80"
              alt="Matcha Latte"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-[#F3ECE0] shadow-2xs group">
            <img
              src="https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=600&q=80"
              alt="Japanese Pancake"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-[#F3ECE0] shadow-2xs group">
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80"
              alt="Drip Coffee"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-[#F3ECE0] shadow-2xs group">
            <img
              src="https://images.unsplash.com/photo-1621236378699-8597fee6a1ce?auto=format&fit=crop&w=600&q=80"
              alt="Fruit Sando"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductModal
        key={selectedProduct?.id ?? "closed"}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
