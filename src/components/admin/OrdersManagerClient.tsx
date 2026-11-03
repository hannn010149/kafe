"use client";

import React, { useState } from "react";
import { Order, OrderStatus } from "@/types";
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  X,
  ChefHat,
  BellRing,
  Check,
  AlertTriangle,
} from "lucide-react";

interface OrdersManagerClientProps {
  initialOrders: Order[];
}

export default function OrdersManagerClient({
  initialOrders,
}: OrdersManagerClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewingReceipt, setViewingReceipt] = useState<Order | null>(null);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? data.order : o))
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      o.order_code.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_phone.includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DDCB]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#232724]">
            Kelola Pesanan Pelanggan
          </h1>
          <p className="text-xs text-[#7E8680]">
            Pantau alur pesanan dari kasir, dapur, barista, hingga selesai.
          </p>
        </div>

        <div className="bg-[#E2ECE2] text-[#425543] px-3.5 py-1.5 rounded-full text-xs font-semibold">
          Total: {orders.length} Pesanan
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative grow w-full sm:w-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E8680]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode pesanan, nama pelanggan, atau telepon..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-[#E8DDCB] text-xs focus:outline-none focus:border-[#536B54]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 bg-white rounded-xl border border-[#E8DDCB] text-xs focus:outline-none focus:border-[#536B54]"
        >
          <option value="all">Semua Status</option>
          <option value="confirmed">Dikonfirmasi (Confirmed)</option>
          <option value="preparing">Sedang Dibuat (Preparing)</option>
          <option value="ready">Siap Diambil/Diantar (Ready)</option>
          <option value="completed">Selesai (Completed)</option>
          <option value="cancelled">Dibatalkan (Cancelled)</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((ord) => (
          <div
            key={ord.id}
            className="bg-white rounded-3xl p-5 border border-[#E8DDCB] shadow-2xs space-y-4 flex flex-col justify-between"
          >
            <div>
              {/* Top Meta */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F1ECE1]">
                <div>
                  <span className="font-mono font-bold text-sm text-[#536B54] block">
                    {ord.order_code}
                  </span>
                  <span className="text-[11px] text-[#7E8680]">
                    {new Date(ord.created_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} • {new Date(ord.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                    ord.status === "completed"
                      ? "bg-emerald-100 text-emerald-800"
                      : ord.status === "ready"
                      ? "bg-blue-100 text-blue-800"
                      : ord.status === "preparing"
                      ? "bg-amber-100 text-amber-800"
                      : ord.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {ord.status}
                </span>
              </div>

              {/* Customer & Location */}
              <div className="pt-2 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#7E8680]">Pelanggan:</span>
                  <span className="font-bold text-[#232724]">
                    {ord.customer_name} ({ord.customer_phone})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7E8680]">Tipe:</span>
                  <span className="font-semibold text-[#536B54]">
                    {ord.order_type === "dine_in"
                      ? `Makan di Tempat (Meja ${ord.table_number})`
                      : "Takeaway"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7E8680]">Pembayaran:</span>
                  <span className="font-semibold uppercase text-[#4B524D]">
                    {ord.payment_method} ({ord.payment_status})
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="mt-3 p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8DDCB] space-y-1.5 text-xs">
                {ord.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[#4B524D]">
                    <span>
                      {it.quantity}x {it.product_name}
                    </span>
                    <span className="font-medium">
                      Rp {it.subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#E8DDCB] flex justify-between font-bold text-[#232724]">
                  <span>Total:</span>
                  <span className="text-[#536B54]">
                    Rp {ord.total_amount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Change Status & Print Receipt */}
            <div className="pt-3 border-t border-[#F1ECE1] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setViewingReceipt(ord)}
                className="p-2 rounded-xl border border-[#E8DDCB] text-[#7E8680] hover:text-[#232724] hover:bg-[#FAF7F2] text-xs font-medium flex items-center gap-1 cursor-pointer"
                title="Cetak Struk"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Struk</span>
              </button>

              <div className="flex items-center gap-1">
                {ord.status !== "preparing" && ord.status !== "ready" && ord.status !== "completed" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(ord.id, "preparing")}
                    className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold cursor-pointer"
                  >
                    Masak
                  </button>
                )}

                {ord.status === "preparing" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(ord.id, "ready")}
                    className="px-2.5 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs font-semibold cursor-pointer"
                  >
                    Siap
                  </button>
                )}

                {ord.status === "ready" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(ord.id, "completed")}
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-semibold cursor-pointer"
                  >
                    Selesai
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Thermal Receipt Print Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-[#E8DDCB] space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 no-print">
              <span className="text-xs font-bold text-gray-500 uppercase">Struk Pembayaran Kafe</span>
              <button onClick={() => setViewingReceipt(null)}>
                <X className="w-5 h-5 text-gray-400 hover:text-black" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="text-center font-mono text-xs space-y-2 text-black">
              <h2 className="font-bold text-sm tracking-widest uppercase">KOMOREBI CAFE</h2>
              <p className="text-[10px] text-gray-600">Jl. Senopati No. 88, Jakarta Selatan</p>
              <div className="border-b border-dashed border-gray-400 my-2"></div>

              <div className="text-left space-y-1 text-[11px]">
                <p>No: {viewingReceipt.order_code}</p>
                <p>Waktu: {new Date(viewingReceipt.created_at).toLocaleString("id-ID")}</p>
                <p>Pelanggan: {viewingReceipt.customer_name}</p>
                <p>Tipe: {viewingReceipt.order_type === "dine_in" ? `Meja ${viewingReceipt.table_number}` : "Takeaway"}</p>
              </div>

              <div className="border-b border-dashed border-gray-400 my-2"></div>

              <div className="space-y-1 text-left text-[11px]">
                {viewingReceipt.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.quantity}x {it.product_name}</span>
                    <span>Rp {it.subtotal.toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>

              <div className="border-b border-dashed border-gray-400 my-2"></div>

              <div className="space-y-1 text-left text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Rp {viewingReceipt.subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak (PB1 10%):</span>
                  <span>Rp {viewingReceipt.tax_amount.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service (5%):</span>
                  <span>Rp {viewingReceipt.service_amount.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1 border-t border-black">
                  <span>TOTAL:</span>
                  <span>Rp {viewingReceipt.total_amount.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="border-b border-dashed border-gray-400 my-2"></div>
              <p className="text-[10px] text-gray-600 pt-1">
                Terima kasih atas kunjungan Anda.<br />
                Selamat menikmati ketenangan Komorebi.
              </p>
            </div>

            <div className="pt-2 flex gap-2 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="grow bg-[#536B54] hover:bg-[#425543] text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Thermal Struk</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

