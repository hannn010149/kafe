"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, ShoppingBag, Check } from "lucide-react";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("Regular");
  const [selectedSweetness, setSelectedSweetness] = useState<string>("Normal (100%)");
  const selectedIce = "Normal Ice";
  const [selectedMilk, setSelectedMilk] = useState<string>("Fresh Milk");
  const [customNotes, setCustomNotes] = useState<string>("");
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const displayName = language === "en" && product.name_en ? product.name_en : product.name;
  const displayDesc =
    language === "en" && product.description_en ? product.description_en : product.description;

  // Calculate unit price with size and milk additions
  let unitPrice = product.price;
  if (selectedSize === "Large") unitPrice += 5000;
  if (selectedMilk.includes("Oat Milk")) unitPrice += 8000;
  if (selectedMilk.includes("Soy Milk")) unitPrice += 6000;

  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart({
      product,
      quantity,
      selected_size: selectedSize,
      selected_sweetness: selectedSweetness,
      selected_ice: selectedIce,
      selected_milk: selectedMilk,
      custom_notes: customNotes.trim() || undefined,
      item_total: totalPrice,
    });

    setAddedAnimation(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-[#E8DDCB] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#232724] flex items-center justify-center shadow-md backdrop-blur-xs transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Image Header */}
        <div className="relative w-full h-56 sm:h-64 bg-[#F3ECE0] shrink-0">
          <img
            src={product.image_url}
            alt={displayName}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-xs uppercase tracking-wider bg-[#536B54]/90 px-2.5 py-0.5 rounded-full inline-block mb-1">
              {product.tags?.[0] || "Signature Cafe"}
            </span>
            <h2 className="text-xl font-bold">{displayName}</h2>
          </div>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-5 overflow-y-auto space-y-5 grow">
          <p className="text-sm text-[#4B524D] leading-relaxed">
            {displayDesc}
          </p>

          {/* Size Options */}
          {product.variants?.size && product.variants.size.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#7E8680]">
                {t("modal_size")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.size.map((sz) => {
                  const isSelected = selectedSize === sz.name;
                  return (
                    <button
                      key={sz.name}
                      type="button"
                      onClick={() => setSelectedSize(sz.name)}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                        isSelected
                          ? "border-[#536B54] bg-[#536B54]/5 text-[#536B54] font-semibold"
                          : "border-[#E8DDCB] text-[#4B524D] hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <span>{sz.name}</span>
                      {sz.extra_price > 0 && (
                        <span className="text-[11px] text-[#7E8680]">
                          +Rp {sz.extra_price.toLocaleString("id-ID")}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sweetness Options */}
          {product.variants?.sweetness && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#7E8680]">
                {t("modal_sweetness")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.variants.sweetness.map((sw) => {
                  const isSelected = selectedSweetness === sw;
                  return (
                    <button
                      key={sw}
                      type="button"
                      onClick={() => setSelectedSweetness(sw)}
                      className={`p-2 rounded-xl border text-[11px] font-medium transition-all text-center ${
                        isSelected
                          ? "border-[#536B54] bg-[#536B54]/5 text-[#536B54] font-semibold"
                          : "border-[#E8DDCB] text-[#4B524D] hover:bg-[#FAF7F2]"
                      }`}
                    >
                      {sw}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Milk Options */}
          {product.variants?.milk_options && product.variants.milk_options.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#7E8680]">
                {t("modal_milk")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.milk_options.map((m) => {
                  const isSelected = selectedMilk === m.name;
                  return (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => setSelectedMilk(m.name)}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                        isSelected
                          ? "border-[#536B54] bg-[#536B54]/5 text-[#536B54] font-semibold"
                          : "border-[#E8DDCB] text-[#4B524D] hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <span>{m.name}</span>
                      {m.extra_price > 0 && (
                        <span className="text-[11px] text-[#7E8680]">
                          +Rp {m.extra_price.toLocaleString("id-ID")}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#7E8680]">
              {t("modal_notes_label")}
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder={t("modal_notes_placeholder")}
              className="w-full text-xs p-3 rounded-xl border border-[#E8DDCB] focus:outline-none focus:border-[#536B54] bg-[#FAF7F2]"
            />
          </div>
        </div>

        {/* Modal Footer (Quantity & Add Button) */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#E8DDCB] flex items-center justify-between gap-4 shrink-0">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-2xl border border-[#E8DDCB]">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#4B524D] hover:bg-[#FAF7F2] transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center text-sm font-bold text-[#232724]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#4B524D] hover:bg-[#FAF7F2] transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Submit */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`grow py-3 px-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              addedAnimation
                ? "bg-emerald-600 text-white"
                : "bg-[#536B54] hover:bg-[#425543] text-white shadow-md"
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>Berhasil Ditambahkan!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {t("modal_add_button")} — Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
