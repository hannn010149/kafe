"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CafeSettings, Table, OrderType, PaymentMethod, Order } from "@/types";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import QRISModal from "@/components/QRISModal";
import {
  Utensils,
  ShoppingBag,
  CreditCard,
  QrCode,
  Building,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

interface CheckoutClientProps {
  settings: CafeSettings;
  tables: Table[];
}

export default function CheckoutClient({ settings, tables }: CheckoutClientProps) {
  const router = useRouter();
  const { cart, subtotal, taxAmount, serviceAmount, totalAmount, clearCart } = useCart();
  const { t, language } = useLanguage();

  const [orderType, setOrderType] = useState<OrderType>("dine_in");
  const [tableNumber, setTableNumber] = useState<string>("T-01");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qris");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showQRIS, setShowQRIS] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setErrorMessage(null);
    setSubmitting(true);

    try {
      const orderPayload = {
        order_type: orderType,
        table_number: orderType === "dine_in" ? tableNumber : undefined,
        customer_name: customerName,
        customer_phone: customerPhone,
        notes: notes || undefined,
        items: cart.map((it, idx) => ({
          id: `item-${idx}-${Date.now()}`,
          order_id: "",
          product_id: it.product.id,
          product_name: it.product.name,
          product_image: it.product.image_url,
          price: it.product.price,
          quantity: it.quantity,
          options: {
            size: it.selected_size,
            sweetness: it.selected_sweetness,
            ice: it.selected_ice,
            milk: it.selected_milk,
            notes: it.custom_notes,
          },
          subtotal: it.item_total,
        })),
        subtotal,
        tax_amount: taxAmount,
        service_amount: serviceAmount,
        total_amount: totalAmount,
        payment_method: paymentMethod,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat pesanan");
      }

      setPlacedOrder(data.order);
      clearCart();

      if (paymentMethod === "qris") {
        setShowQRIS(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppOrderLink = (order: Order) => {
    const wa = settings.whatsapp.replace(/[^0-9]/g, "");
    let itemsText = order.items
      .map((it) => `- ${it.quantity}x ${it.product_name} (Rp ${it.subtotal.toLocaleString("id-ID")})`)
      .join("\n");

    const text = encodeURIComponent(
      `Halo Komorebi Cafe, saya telah membuat pesanan baru:\n\n` +
      `Nomor Pesanan: ${order.order_code}\n` +
      `Nama: ${order.customer_name}\n` +
      `Tipe: ${order.order_type === "dine_in" ? `Dine-In (Meja ${order.table_number})` : "Takeaway"}\n` +
      `Metode Bayar: ${order.payment_method.toUpperCase()}\n\n` +
      `Daftar Menu:\n${itemsText}\n\n` +
      `Total Pembayaran: Rp ${order.total_amount.toLocaleString("id-ID")}\n\n` +
      `Mohon segera diproses ya!`
    );
    return `https://wa.me/${wa}?text=${text}`;
  };

  if (placedOrder && !showQRIS) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DDCB] shadow-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#E2ECE2] text-[#536B54] mx-auto flex items-center justify-center">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[#232724]">
              {t("checkout_success_title")}
            </h2>
            <p className="text-xs text-[#7E8680]">
              {t("checkout_success_desc")}
            </p>
            <span className="font-mono font-bold text-lg text-[#536B54] bg-[#E2ECE2] px-3 py-1 rounded-lg inline-block mt-2">
              {placedOrder.order_code}
            </span>
          </div>

          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DDCB] text-xs sm:text-sm text-left space-y-2 text-[#4B524D]">
            <div className="flex justify-between">
              <span className="text-[#7E8680]">Pemesan:</span>
              <span className="font-semibold text-[#232724]">{placedOrder.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7E8680]">Tipe Pesanan:</span>
              <span className="font-semibold text-[#232724]">
                {placedOrder.order_type === "dine_in" ? `Dine-In (Meja ${placedOrder.table_number})` : "Takeaway"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7E8680]">Metode Bayar:</span>
              <span className="font-semibold uppercase text-[#536B54]">{placedOrder.payment_method}</span>
            </div>
            <div className="flex justify-between border-t border-[#E8DDCB] pt-2 font-bold text-[#232724]">
              <span>Total Tagihan:</span>
              <span className="text-[#536B54]">Rp {placedOrder.total_amount.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/track?code=${placedOrder.order_code}`}
              className="w-full sm:w-auto bg-[#536B54] hover:bg-[#425543] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>{t("checkout_track_btn")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={getWhatsAppOrderLink(placedOrder)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1EBE5D] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Kirim ke WhatsApp Kafe</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !placedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#E2ECE2] text-[#536B54] mx-auto flex items-center justify-center text-3xl">
          🍵
        </div>
        <h2 className="text-xl font-bold text-[#232724]">{t("cart_empty")}</h2>
        <p className="text-xs text-[#7E8680] max-w-sm mx-auto">{t("cart_empty_sub")}</p>
        <Link
          href="/menu"
          className="inline-block mt-3 bg-[#536B54] hover:bg-[#425543] text-white px-6 py-3 rounded-full text-xs font-semibold shadow-xs"
        >
          {t("hero_cta_menu")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#232724]">
          {t("checkout_title")}
        </h1>
        <p className="text-xs sm:text-sm text-[#7E8680]">
          Silakan konfirmasi pesanan dan pilih opsi pembayaran Anda.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7 space-y-6">
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs sm:text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Order Type Selection */}
          <div className="bg-white rounded-3xl p-5 border border-[#E8DDCB] shadow-xs space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#7E8680]">
              {t("checkout_type")}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType("dine_in")}
                className={`p-3 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  orderType === "dine_in"
                    ? "bg-[#536B54] text-white border-[#536B54] shadow-xs"
                    : "bg-[#FAF7F2] text-[#4B524D] border-[#E8DDCB] hover:bg-[#F3ECE0]"
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>{t("checkout_type_dinein")}</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType("takeaway")}
                className={`p-3 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  orderType === "takeaway"
                    ? "bg-[#536B54] text-white border-[#536B54] shadow-xs"
                    : "bg-[#FAF7F2] text-[#4B524D] border-[#E8DDCB] hover:bg-[#F3ECE0]"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t("checkout_type_takeaway")}</span>
              </button>
            </div>

            {/* Table Number Selector (Only for Dine-in) */}
            {orderType === "dine_in" && (
              <div className="pt-2">
                <label className="text-xs font-semibold text-[#7E8680] block mb-1">
                  {t("checkout_table")}
                </label>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#536B54]"
                >
                  {tables.map((tbl) => (
                    <option key={tbl.id} value={tbl.table_number}>
                      Meja {tbl.table_number} ({tbl.name})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 2. Customer Information */}
          <div className="bg-white rounded-3xl p-5 border border-[#E8DDCB] shadow-xs space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7E8680]">
              {t("checkout_customer_info")}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#7E8680] block mb-1">
                  {t("checkout_name")}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Raden Arya"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#536B54]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#7E8680] block mb-1">
                  {t("checkout_phone")}
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#536B54]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#7E8680] block mb-1">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Tolong bungkus terpisah, sediakan sedotan ramah lingkungan..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#536B54]"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white rounded-3xl p-5 border border-[#E8DDCB] shadow-xs space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7E8680]">
              {t("checkout_payment_method")}
            </h3>

            <div className="space-y-2">
              <label
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "qris"
                    ? "border-[#536B54] bg-[#536B54]/5"
                    : "border-[#E8DDCB] hover:bg-[#FAF7F2]"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "qris"}
                  onChange={() => setPaymentMethod("qris")}
                  className="text-[#536B54] focus:ring-[#536B54]"
                />
                <QrCode className="w-5 h-5 text-[#536B54]" />
                <div className="text-left grow">
                  <span className="text-xs sm:text-sm font-bold text-[#232724] block">
                    {t("checkout_pay_qris")}
                  </span>
                  <span className="text-[11px] text-[#7E8680]">
                    GoPay, OVO, ShopeePay, Dana, BCA Mobile, Livin, dll.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "bank_transfer"
                    ? "border-[#536B54] bg-[#536B54]/5"
                    : "border-[#E8DDCB] hover:bg-[#FAF7F2]"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "bank_transfer"}
                  onChange={() => setPaymentMethod("bank_transfer")}
                  className="text-[#536B54] focus:ring-[#536B54]"
                />
                <Building className="w-5 h-5 text-[#8B6B4E]" />
                <div className="text-left grow">
                  <span className="text-xs sm:text-sm font-bold text-[#232724] block">
                    {t("checkout_pay_bank")}
                  </span>
                  <span className="text-[11px] text-[#7E8680]">
                    Virtual Account BCA & Mandiri
                  </span>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "cashier"
                    ? "border-[#536B54] bg-[#536B54]/5"
                    : "border-[#E8DDCB] hover:bg-[#FAF7F2]"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cashier"}
                  onChange={() => setPaymentMethod("cashier")}
                  className="text-[#536B54] focus:ring-[#536B54]"
                />
                <CreditCard className="w-5 h-5 text-[#7E8680]" />
                <div className="text-left grow">
                  <span className="text-xs sm:text-sm font-bold text-[#232724] block">
                    {t("checkout_pay_cashier")}
                  </span>
                  <span className="text-[11px] text-[#7E8680]">
                    Bayar langsung di kasir (Tunai / EDC Kartu Debit/Kredit)
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-[#E8DDCB] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#232724]">
              {t("cart_order_summary")}
            </h3>

            {/* Items scroll */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-[#F1ECE1]">
                  <div>
                    <span className="font-semibold text-[#232724] block">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="text-[10px] text-[#7E8680]">
                      {[item.selected_size, item.selected_sweetness, item.selected_milk].filter(Boolean).join(" • ")}
                    </span>
                  </div>
                  <span className="font-medium text-[#232724]">
                    Rp {item.item_total.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-[#7E8680] pt-2 border-t border-[#E8DDCB]">
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
              <div className="pt-2 border-t border-[#F1ECE1] flex justify-between text-base font-extrabold text-[#232724]">
                <span>{t("cart_total")}</span>
                <span className="text-[#536B54]">
                  Rp {totalAmount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#536B54] hover:bg-[#425543] text-white py-3.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span>{t("checkout_processing")}</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t("checkout_submit")}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* QRIS Modal if QRIS payment */}
      {showQRIS && placedOrder && (
        <QRISModal
          orderCode={placedOrder.order_code}
          totalAmount={placedOrder.total_amount}
          cafeName={settings.name}
          onSuccess={() => setShowQRIS(false)}
          onClose={() => setShowQRIS(false)}
        />
      )}
    </div>
  );
}

