"use client";

import React, { useState } from "react";
import { CafeSettings, Table, Booking } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface BookingClientProps {
  settings: CafeSettings;
  tables: Table[];
}

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

export default function BookingClient({ settings, tables }: BookingClientProps) {
  const { t } = useLanguage();

  const [date, setDate] = useState("2026-11-03");
  const [minDate, setMinDate] = useState("2026-11-03");

  React.useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    setDate(todayStr);
    setMinDate(todayStr);
  }, []);
  const [time, setTime] = useState("14:00");
  const [guests, setGuests] = useState(2);
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [areaPreference, setAreaPreference] = useState<string>("tatami");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Available tables matching guest count or area
  const filteredTables = tables.filter((t) => {
    if (!t.is_active) return false;
    if (areaPreference && areaPreference !== "any" && t.area !== areaPreference) return false;
    return t.capacity >= guests;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const selectedTable = tables.find((t) => t.id === selectedTableId);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          customer_email: email || undefined,
          booking_date: date,
          booking_time: time,
          guest_count: guests,
          table_id: selectedTableId || undefined,
          table_name: selectedTable ? `${selectedTable.table_number} - ${selectedTable.name}` : undefined,
          area_preference: areaPreference,
          notes: notes || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat reservasi");
      }

      setCreatedBooking(data.booking);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppConfirmLink = (booking: Booking) => {
    const wa = settings.whatsapp.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `Halo Komorebi Cafe, saya ingin mengonfirmasi reservasi saya:\n\n` +
      `Kode Booking: ${booking.booking_code}\n` +
      `Nama: ${booking.customer_name}\n` +
      `Tanggal: ${booking.booking_date}\n` +
      `Jam: ${booking.booking_time}\n` +
      `Jumlah Tamu: ${booking.guest_count} Orang\n` +
      `Area/Meja: ${booking.table_name || booking.area_preference}\n` +
      (booking.notes ? `Catatan: ${booking.notes}\n` : "") +
      `\nTerima kasih!`
    );
    return `https://wa.me/${wa}?text=${text}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#536B54] bg-[#E2ECE2] px-3 py-1 rounded-full">
          {t("booking_badge")}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#232724]">
          {t("booking_title")}
        </h1>
        <p className="text-xs sm:text-sm text-[#7E8680]">
          {t("booking_subtitle")}
        </p>
      </div>

      {createdBooking ? (
        /* Success Screen */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DDCB] shadow-lg text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-[#E2ECE2] text-[#536B54] mx-auto flex items-center justify-center">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#232724]">
              {t("booking_success_title")}
            </h2>
            <p className="text-sm text-[#7E8680]">
              {t("booking_success_desc")}{" "}
              <span className="font-mono font-bold text-[#536B54] bg-[#E2ECE2] px-2 py-0.5 rounded-md">
                {createdBooking.booking_code}
              </span>
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="max-w-md mx-auto bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8DDCB] text-left text-xs sm:text-sm space-y-2 text-[#4B524D]">
            <div className="flex justify-between">
              <span className="text-[#7E8680]">Nama Tamu:</span>
              <span className="font-semibold text-[#232724]">{createdBooking.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7E8680]">Tanggal & Jam:</span>
              <span className="font-semibold text-[#232724]">{createdBooking.booking_date} @ {createdBooking.booking_time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7E8680]">Jumlah Tamu:</span>
              <span className="font-semibold text-[#232724]">{createdBooking.guest_count} Orang</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7E8680]">Area / Meja:</span>
              <span className="font-semibold text-[#232724]">{createdBooking.table_name || createdBooking.area_preference}</span>
            </div>
          </div>

          <p className="text-xs text-[#7E8680] max-w-md mx-auto">
            {t("booking_success_info")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={getWhatsAppConfirmLink(createdBooking)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1EBE5D] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t("booking_whatsapp_btn")}</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setCreatedBooking(null);
                setName("");
                setPhone("");
                setNotes("");
              }}
              className="w-full sm:w-auto bg-white border border-[#E8DDCB] text-[#4B524D] hover:bg-[#FAF7F2] px-6 py-3 rounded-full text-xs sm:text-sm font-medium transition-colors"
            >
              {t("booking_new_btn")}
            </button>
          </div>
        </div>
      ) : (
        /* Reservation Form */
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DDCB] shadow-md space-y-6"
        >
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs sm:text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Date Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#7E8680] flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-[#536B54]" />
                <span>{t("booking_date")}</span>
              </label>
              <input
                type="date"
                required
                min={minDate}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#536B54]"
              />
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#7E8680] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#536B54]" />
                <span>{t("booking_time")}</span>
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#536B54]"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot} WIB
                  </option>
                ))}
              </select>
            </div>

            {/* Guest Count */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#7E8680] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#536B54]" />
                <span>{t("booking_guests")}</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 4, 6, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuests(num)}
                    className={`grow py-2 rounded-xl text-xs font-semibold border transition-all ${
                      guests === num
                        ? "bg-[#536B54] text-white border-[#536B54]"
                        : "bg-[#FAF7F2] text-[#4B524D] border-[#E8DDCB] hover:bg-[#F3ECE0]"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Area Preference */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#7E8680] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#536B54]" />
                <span>{t("booking_area")}</span>
              </label>
              <select
                value={areaPreference}
                onChange={(e) => {
                  setAreaPreference(e.target.value);
                  setSelectedTableId("");
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#536B54]"
              >
                <option value="tatami">{t("booking_area_tatami")}</option>
                <option value="main_hall">{t("booking_area_main")}</option>
                <option value="garden_terrace">{t("booking_area_garden")}</option>
                <option value="bar_counter">{t("booking_area_bar")}</option>
              </select>
            </div>
          </div>

          {/* Table Specific Selection (Optional) */}
          {filteredTables.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#7E8680]">
                Pilih Meja Tersedia (Kapasitas Sesuai)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredTables.map((t) => {
                  const isSelected = selectedTableId === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTableId(isSelected ? "" : t.id)}
                      className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                        isSelected
                          ? "border-[#536B54] bg-[#536B54]/10 text-[#536B54] font-semibold"
                          : "border-[#E8DDCB] bg-[#FAF7F2] text-[#4B524D] hover:bg-[#F3ECE0]"
                      }`}
                    >
                      <span className="font-bold block">{t.table_number}</span>
                      <span className="text-[11px] text-[#7E8680] block truncate">
                        {t.name} (Max {t.capacity} org)
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customer Personal Details */}
          <div className="pt-4 border-t border-[#F1ECE1] space-y-4">
            <h3 className="text-sm font-bold text-[#232724]">Informasi Pemesan</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#7E8680]">{t("booking_name")}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Raden Arya"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#536B54]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#7E8680]">{t("booking_phone")}</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#536B54]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-[#7E8680]">{t("booking_notes")}</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("booking_notes_ph")}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#536B54]"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#536B54] hover:bg-[#425543] text-white py-3.5 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span>{t("booking_submitting")}</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t("booking_submit")}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

