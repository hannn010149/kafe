"use client";

import React from "react";
import { Product } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { Plus, Flame, Star, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export default function ProductCard({ product, onOpenModal }: ProductCardProps) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();

  const displayName = language === "en" && product.name_en ? product.name_en : product.name;
  const displayDesc =
    language === "en" && product.description_en ? product.description_en : product.description;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If product has complex variants, open modal; otherwise quick add
    if (product.variants?.size?.length || product.variants?.milk_options?.length) {
      onOpenModal(product);
    } else {
      addToCart({
        product,
        quantity: 1,
        item_total: product.price,
      });
    }
  };

  return (
    <div
      onClick={() => onOpenModal(product)}
      className="group relative bg-white rounded-2xl p-3 sm:p-4 border border-[#E8DDCB]/70 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
    >
      <div>
        {/* Product Image & Badges */}
        <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-[#F3ECE0] mb-3">
          <img
            src={product.image_url}
            alt={displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
            {product.is_popular && (
              <span className="inline-flex items-center gap-1 bg-[#536B54] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                <Flame className="w-2.5 h-2.5" />
                <span>{t("badge_popular")}</span>
              </span>
            )}
            {product.is_featured && !product.is_popular && (
              <span className="inline-flex items-center gap-1 bg-[#889E73] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                <Star className="w-2.5 h-2.5" />
                <span>{t("badge_featured")}</span>
              </span>
            )}
            {product.is_new && (
              <span className="inline-flex items-center gap-1 bg-[#C57B57] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{t("badge_new")}</span>
              </span>
            )}
          </div>

          {!product.is_available && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold uppercase tracking-wider">
              {t("out_of_stock")}
            </div>
          )}
        </div>

        {/* Product Meta */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm sm:text-base text-[#232724] group-hover:text-[#536B54] transition-colors line-clamp-1">
              {displayName}
            </h3>
          </div>
          <p className="text-xs text-[#7E8680] line-clamp-2 leading-relaxed">
            {displayDesc}
          </p>
        </div>
      </div>

      {/* Price & Action Button */}
      <div className="mt-4 pt-3 border-t border-[#F1ECE1] flex items-center justify-between">
        <div>
          <span className="text-xs text-[#7E8680] font-light mr-0.5">Rp</span>
          <span className="text-sm sm:text-base font-bold text-[#232724]">
            {product.price.toLocaleString("id-ID")}
          </span>
        </div>

        <button
          type="button"
          disabled={!product.is_available}
          onClick={handleQuickAdd}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
            product.is_available
              ? "bg-[#536B54] hover:bg-[#425543] text-white shadow-xs"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t("btn_add_to_cart")}</span>
        </button>
      </div>
    </div>
  );
}
