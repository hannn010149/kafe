"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    taxAmount,
    serviceAmount,
    totalAmount,
  } = useCart();
  const { t, language } = useLanguage();

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    if (isCartOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col border-l border-[#E8DDCB] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E8DDCB] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#536B54]" />
              <h2 className="text-base font-bold text-[#232724]">{t("cart_title")}</h2>
              <span className="text-xs font-semibold bg-[#536B54]/10 text-[#536B54] px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
                >
                  {t("cart_clear")}
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#7E8680] hover:text-[#232724] hover:bg-[#FAF7F2] transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="grow overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E2ECE2] text-[#536B54] flex items-center justify-center text-2xl">
                  🍵
                </div>
                <div>
                  <h3 className="font-semibold text-[#232724] text-base">{t("cart_empty")}</h3>
                  <p className="text-xs text-[#7E8680] mt-1 max-w-xs">{t("cart_empty_sub")}</p>
                </div>
                <Link
                  href="/menu"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 bg-[#536B54] hover:bg-[#425543] text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-xs transition-colors"
                >
                  {t("hero_cta_menu")}
                </Link>
              </div>
            ) : (
              cart.map((item, index) => {
                const displayName =
                  language === "en" && item.product.name_en
                    ? item.product.name_en
                    : item.product.name;

                return (
                  <div
                    key={`${item.product.id}-${index}`}
                    className="bg-white rounded-2xl p-3 border border-[#E8DDCB]/70 shadow-2xs flex gap-3 items-center"
                  >
                    <img
                      src={item.product.image_url}
                      alt={displayName}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#F3ECE0]"
                      loading="lazy"
                      decoding="async"
                    />

                    <div className="grow min-w-0">
                      <h4 className="text-sm font-semibold text-[#232724] truncate">
                        {displayName}
                      </h4>

                      {/* Options badges */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.selected_size && (
                          <span className="text-[10px] bg-[#FAF7F2] border border-[#E8DDCB] text-[#7E8680] px-1.5 py-0.5 rounded-md">
                            {item.selected_size}
                          </span>
                        )}
                        {item.selected_sweetness && (
                          <span className="text-[10px] bg-[#FAF7F2] border border-[#E8DDCB] text-[#7E8680] px-1.5 py-0.5 rounded-md">
                            {item.selected_sweetness.split(" ")[0]}
                          </span>
                        )}
                        {item.selected_milk && item.selected_milk !== "Fresh Milk" && (
                          <span className="text-[10px] bg-[#536B54]/10 text-[#536B54] px-1.5 py-0.5 rounded-md font-medium">
                            {item.selected_milk.split(" ")[0]}
                          </span>
                        )}
                      </div>

                      {item.custom_notes && (
                        <p className="text-[11px] text-[#7E8680] italic truncate mt-0.5">
                          &quot;{item.custom_notes}&quot;
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-bold text-[#536B54]">
                          Rp {item.item_total.toLocaleString("id-ID")}
                        </span>

                        {/* Quantity Buttons */}
                        <div className="flex items-center gap-1.5 bg-[#FAF7F2] rounded-lg p-0.5 border border-[#E8DDCB]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-[#4B524D] hover:bg-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-[#4B524D] hover:bg-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(index)}
                      className="text-gray-300 hover:text-red-500 p-1 self-start"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-[#E8DDCB] space-y-3">
              <div className="space-y-1.5 text-xs text-[#7E8680]">
                <div className="flex justify-between">
                  <span>{t("cart_subtotal")}</span>
                  <span className="font-medium text-[#232724]">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("cart_tax")}</span>
                  <span className="font-medium text-[#232724]">
                    Rp {taxAmount.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("cart_service")}</span>
                  <span className="font-medium text-[#232724]">
                    Rp {serviceAmount.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#F1ECE1] flex justify-between text-sm font-bold text-[#232724]">
                  <span>{t("cart_total")}</span>
                  <span className="text-[#536B54]">
                    Rp {totalAmount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-[#536B54] hover:bg-[#425543] text-white py-3 px-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all hover:shadow-lg"
              >
                <span>{t("cart_checkout_btn")}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
