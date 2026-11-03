"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CafeSettings, Order, OrderStatus } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import {
  Search,
  CheckCircle2,
  Clock,
  ChefHat,
  BellRing,
  Check,
  AlertCircle,
  MessageCircle,
  Utensils,
} from "lucide-react";

interface TrackClientProps {
  settings: CafeSettings;
}

function TrackClientInner({ settings }: TrackClientProps) {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";
  const { t } = useLanguage();

  const [query, setQuery] = useState(initialCode);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (searchCode: string) => {
    if (!searchCode.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(searchCode.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t("track_not_found"));
      }
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      fetchOrder(initialCode);
    }
  }, [initialCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(query);
  };

  const statusSteps: { key: OrderStatus; label: string; icon: any }[] = [
    { key: "confirmed", label: t("track_status_confirmed"), icon: CheckCircle2 },
    { key: "preparing", label: t("track_status_preparing"), icon: ChefHat },
    { key: "ready", label: t("track_status_ready"), icon: BellRing },
    { key: "completed", label: t("track_status_completed"), icon: Check },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return 0;
      case "confirmed":
        return 1;
      case "preparing":
        return 2;
      case "ready":
        return 3;
      case "completed":
        return 4;
      default:
        return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#232724]">
          {t("track_title")}
        </h1>
        <p className="text-xs sm:text-sm text-[#7E8680]">
          {t("track_subtitle")}
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
        <div className="relative grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E8680]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("track_input_ph")}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-[#E8DDCB] text-xs sm:text-sm focus:outline-none focus:border-[#536B54]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#536B54] hover:bg-[#425543] text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Mencari..." : t("track_btn")}
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs sm:text-sm flex items-center gap-3 max-w-md mx-auto">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Status Display Card */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DDCB] shadow-lg space-y-6 animate-in fade-in duration-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#F1ECE1]">
            <div>
              <span className="text-xs text-[#7E8680]">Nomor Pesanan</span>
              <h2 className="text-xl font-bold font-mono text-[#536B54]">
                {order.order_code}
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-[#7E8680] block">Tipe & Tempat</span>
              <span className="text-xs sm:text-sm font-semibold text-[#232724]">
                {order.order_type === "dine_in"
                  ? `Makan di Tempat (Meja ${order.table_number})`
                  : "Bawa Pulang (Takeaway)"}
              </span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="py-4">
            <div className="grid grid-cols-4 gap-2 text-center relative">
              {statusSteps.map((step, idx) => {
                const isPassed = currentStep >= idx + 1;
                const isCurrent = currentStep === idx + 1;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex flex-col items-center space-y-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isPassed
                          ? "bg-[#536B54] text-white shadow-xs"
                          : "bg-[#F3ECE0] text-[#7E8680]"
                      } ${isCurrent ? "ring-4 ring-[#C5D8C6]" : ""}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs font-semibold leading-tight ${
                        isPassed ? "text-[#232724]" : "text-[#7E8680]"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items Summary */}
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DDCB] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7E8680]">
              Rincian Menu Pesanan
            </h3>
            <div className="space-y-2">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-xs text-[#4B524D]">
                  <span>
                    {it.quantity}x {it.product_name}
                  </span>
                  <span className="font-semibold text-[#232724]">
                    Rp {it.subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-[#E8DDCB] flex justify-between text-sm font-bold text-[#232724]">
              <span>Total Tagihan:</span>
              <span className="text-[#536B54]">Rp {order.total_amount.toLocaleString("id-ID")}</span>
            </div>
          </div>

          {/* WhatsApp Support Button */}
          <div className="pt-2 text-center">
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=Halo%20Komorebi,%20saya%20ingin%20menanyakan%20status%20pesanan%20${order.order_code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#536B54] hover:text-[#425543] bg-[#E2ECE2] px-4 py-2 rounded-full"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Butuh Bantuan? Hubungi Kasir via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackClient({ settings }: TrackClientProps) {
  return (
    <Suspense fallback={<div className="text-center p-8 text-xs text-[#7E8680]">Memuat status...</div>}>
      <TrackClientInner settings={settings} />
    </Suspense>
  );
}

