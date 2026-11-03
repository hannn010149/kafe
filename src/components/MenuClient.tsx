"use client";

import React, { useState } from "react";
import { Category, Product } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { Search } from "lucide-react";

interface MenuClientProps {
  categories: Category[];
  initialProducts: Product[];
}

export default function MenuClient({
  categories,
  initialProducts,
}: MenuClientProps) {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = initialProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category_id === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      product.name.toLowerCase().includes(q) ||
      (product.name_en && product.name_en.toLowerCase().includes(q)) ||
      (product.description && product.description.toLowerCase().includes(q)) ||
      (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(q)));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title & Subtitle */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#536B54] bg-[#E2ECE2] px-3 py-1 rounded-full">
          Daftar Menu Otentik
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#232724]">
          {t("nav_menu")}
        </h1>
        <p className="text-xs sm:text-sm text-[#7E8680]">
          Pilihan kreasi kopi, racikan matcha Uji murni, serta hidangan pencuci mulut khas Jepang.
        </p>
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E8680]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("search_placeholder")}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-full border border-[#E8DDCB] shadow-2xs text-xs sm:text-sm focus:outline-none focus:border-[#536B54] transition-colors"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === "all"
              ? "bg-[#536B54] text-white shadow-xs"
              : "bg-white text-[#4B524D] border border-[#E8DDCB] hover:bg-[#F3ECE0]"
          }`}
        >
          {t("filter_all")}
        </button>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const catName = language === "en" && cat.name_en ? cat.name_en : cat.name;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-[#536B54] text-white shadow-xs"
                  : "bg-white text-[#4B524D] border border-[#E8DDCB] hover:bg-[#F3ECE0]"
              }`}
            >
              {catName}
            </button>
          );
        })}
      </div>

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#E2ECE2] text-[#536B54] flex items-center justify-center text-2xl">
            🍵
          </div>
          <p className="text-base font-semibold text-[#232724]">
            Tidak ada produk yang cocok dengan pencarian Anda.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="text-xs text-[#536B54] underline font-medium"
          >
            Reset filter dan pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenModal={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Modal View */}
      <ProductModal
        key={selectedProduct?.id ?? "closed"}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
