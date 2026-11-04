"use client";

import React, { useState } from "react";
import { Booking, BookingStatus, CafeSettings } from "@/types";
import {
  CalendarDays,
  Search,
  CheckCircle,
  XCircle,
  MessageCircle,
  Clock,
  Users,
  MapPin,
  Check,
  X,
  AlertCircle,
} from "lucide-react";

interface BookingsManagerClientProps {
  initialBookings: Booking[];
  settings: CafeSettings;
}

export default function BookingsManagerClient({
  initialBookings,
  settings,
}: BookingsManagerClientProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const [rejectingBooking, setRejectingBooking] = useState<Booking | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleUpdateStatus = async (
    bookingCode: string,
    status: BookingStatus,
    reason?: string
  ) => {
    try {
      const res = await fetch(`/api/bookings/${bookingCode}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejection_reason: reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setBookings((prev) =>
        prev.map((b) => (b.booking_code === bookingCode ? data.booking : b))
      );
      setRejectingBooking(null);
      setRejectionReason("");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal memperbarui reservasi.");
    }
  };

  const getWhatsAppConfirmLink = (b: Booking) => {
    const wa = b.customer_phone.replace(/[^0-9]/g, "");
    const cleanWa = wa.startsWith("0") ? "62" + wa.slice(1) : wa;
    const text = encodeURIComponent(
      `Halo Kak ${b.customer_name}, reservasi meja Anda di ${settings.name} telah DIKONFIRMASI!\n\n` +
      `Kode Booking: ${b.booking_code}\n` +
      `Tanggal: ${b.booking_date}\n` +
      `Jam: ${b.booking_time} WIB\n` +
      `Jumlah Tamu: ${b.guest_count} Orang\n` +
      `Meja/Area: ${b.table_name || b.area_preference}\n\n` +
      `Kami nantikan kedatangan Anda. Terima kasih!`
    );
    return `https://wa.me/${cleanWa}?text=${text}`;
  };

  const filtered = bookings.filter((b) => {
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      b.booking_code.toLowerCase().includes(q) ||
      b.customer_name.toLowerCase().includes(q) ||
      b.customer_phone.includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DDCB]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#232724]">
            Kelola Reservasi Meja
          </h1>
          <p className="text-xs text-[#7E8680]">
            Konfirmasi jadwal kunjungan, cegah bentrok waktu, dan kirim pesan konfirmasi ke WhatsApp tamu.
          </p>
        </div>

        <div className="bg-[#E2ECE2] text-[#425543] px-3.5 py-1.5 rounded-full text-xs font-semibold">
          Total: {bookings.length} Reservasi
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
            placeholder="Cari kode booking, nama tamu, atau WhatsApp..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-[#E8DDCB] text-xs focus:outline-none focus:border-[#536B54]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 bg-white rounded-xl border border-[#E8DDCB] text-xs focus:outline-none focus:border-[#536B54]"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Menunggu (Pending)</option>
          <option value="confirmed">Dikonfirmasi (Confirmed)</option>
          <option value="completed">Hadir / Selesai (Completed)</option>
          <option value="rejected">Ditolak (Rejected)</option>
        </select>
      </div>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl p-5 border border-[#E8DDCB] shadow-2xs space-y-4 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F1ECE1]">
                <div>
                  <span className="font-mono font-bold text-sm text-[#536B54] block">
                    {b.booking_code}
                  </span>
                  <span className="text-[11px] text-[#7E8680]">
                    Dibuat: {new Date(b.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                    b.status === "confirmed"
                      ? "bg-emerald-100 text-emerald-800"
                      : b.status === "pending"
                      ? "bg-amber-100 text-amber-800"
                      : b.status === "completed"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {b.status}
                </span>
              </div>

              {/* Guest Meta */}
              <div className="pt-2 text-xs space-y-2 text-[#4B524D]">
                <div>
                  <span className="font-bold text-sm text-[#232724] block">
                    {b.customer_name}
                  </span>
                  <span className="text-[#7E8680]">{b.customer_phone}</span>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8DDCB] space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[#232724]">
                    <Clock className="w-3.5 h-3.5 text-[#536B54]" />
                    <span>
                      {b.booking_date} @ {b.booking_time} WIB
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#7E8680]">
                    <Users className="w-3.5 h-3.5" />
                    <span>{b.guest_count} Orang</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#7E8680]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{b.table_name || b.area_preference}</span>
                  </div>
                </div>

                {b.notes && (
                  <p className="text-[11px] italic bg-[#FFFDF9] p-2 rounded-xl border border-[#E8DDCB] text-[#7E8680]">
                    &quot;{b.notes}&quot;
                  </p>
                )}
                {b.rejection_reason && (
                  <p className="text-[11px] text-red-600 bg-red-50 p-2 rounded-xl border border-red-200">
                    Alasan tolak: {b.rejection_reason}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#F1ECE1] flex items-center justify-between gap-2">
              <a
                href={getWhatsAppConfirmLink(b)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#1EBE5D] text-white p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Kirim Konfirmasi ke WhatsApp Tamu"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WA Tamu</span>
              </a>

              <div className="flex items-center gap-1.5">
                {b.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(b.booking_code, "confirmed")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                    >
                      Konfirmasi
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectingBooking(b)}
                      className="px-2.5 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold"
                    >
                      Tolak
                    </button>
                  </>
                )}

                {b.status === "confirmed" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(b.booking_code, "completed")}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Check-in Selesai
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reject Modal */}
      {rejectingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-[#E8DDCB] space-y-4">
            <h3 className="font-bold text-sm text-[#232724]">
              Tolak Reservasi #{rejectingBooking.booking_code}
            </h3>
            <p className="text-xs text-[#7E8680]">
              Masukkan alasan penolakan (misal: kapasitas penuh, kafe sedang private event):
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Alasan penolakan..."
              className="w-full p-3 rounded-xl border border-[#E8DDCB] text-xs bg-[#FAF7F2]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingBooking(null)}
                className="px-4 py-2 rounded-full border text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUpdateStatus(
                    rejectingBooking.booking_code,
                    "rejected",
                    rejectionReason || "Kapasitas penuh"
                  )
                }
                className="px-4 py-2 rounded-full bg-red-600 text-white text-xs font-semibold"
              >
                Tolak Reservasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
