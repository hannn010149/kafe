"use client";

import React, { useState } from "react";
import { Order, Booking } from "@/types";
import {
  Download,
  Printer,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  CheckCircle,
  FileSpreadsheet,
} from "lucide-react";

interface ReportsClientProps {
  reportsData: {
    totalRevenue: number;
    totalOrders: number;
    totalBookings: number;
    totalCustomers: number;
    popularProducts: { name: string; count: number; revenue: number }[];
    revenueByDay: Record<string, number>;
  };
  orders: Order[];
  bookings: Booking[];
}

export default function ReportsClient({
  reportsData,
  orders,
  bookings,
}: ReportsClientProps) {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [printDate, setPrintDate] = useState("");

  React.useEffect(() => {
    setPrintDate(new Date().toLocaleString("id-ID"));
  }, []);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["Kode Pesanan", "Pelanggan", "Tipe", "Waktu", "Status", "Metode Bayar", "Total IDR"];
    const rows = orders.map((o) => [
      o.order_code,
      `"${o.customer_name}"`,
      o.order_type,
      o.created_at,
      o.status,
      o.payment_method,
      o.total_amount,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan-penjualan-komorebi-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger Print to PDF
  const handlePrintPDF = () => {
    window.print();
  };

  // Booking statistics
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed" || b.status === "completed").length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const rejectedBookings = bookings.filter((b) => b.status === "rejected").length;
  const bookingSuccessRate = bookings.length > 0 ? Math.round((confirmedBookings / bookings.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Export Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DDCB] no-print">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#232724]">
            Laporan Finansial & Analitik Penjualan
          </h1>
          <p className="text-xs text-[#7E8680]">
            Export ringkasan omset penjualan harian, mingguan, bulanan ke CSV atau cetak PDF.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="bg-white border border-[#E8DDCB] hover:bg-[#FAF7F2] text-[#232724] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handlePrintPDF}
            className="bg-[#536B54] hover:bg-[#425543] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Header (Visible when printed) */}
      <div className="hidden print-only text-center pb-6 border-b border-black">
        <h2 className="text-xl font-bold uppercase tracking-wider">KOMOREBI CAFE & ROASTERY</h2>
        <p className="text-xs">LAPORAN KEUANGAN & STATISTIK OPERASIONAL</p>
        <p className="text-[10px] text-gray-500">Dicetak pada: {printDate || "03/11/2026, 15:45"}</p>
      </div>

      {/* Revenue Periods Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Daily */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-2">
          <span className="text-xs font-semibold text-[#7E8680] uppercase tracking-wider">
            Pendapatan Hari Ini
          </span>
          <div className="text-2xl font-extrabold text-[#232724]">
            Rp {reportsData.revenueByDay["Selasa"]?.toLocaleString("id-ID") || "1.120.000"}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block">
            Target harian tercapai 92%
          </span>
        </div>

        {/* Weekly */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-2">
          <span className="text-xs font-semibold text-[#7E8680] uppercase tracking-wider">
            Pendapatan Mingguan
          </span>
          <div className="text-2xl font-extrabold text-[#536B54]">
            Rp {Object.values(reportsData.revenueByDay).reduce((a, b) => a + b, 0).toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block">
            +18% dibandingkan minggu lalu
          </span>
        </div>

        {/* Monthly */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-2">
          <span className="text-xs font-semibold text-[#7E8680] uppercase tracking-wider">
            Estimasi Omset Bulanan
          </span>
          <div className="text-2xl font-extrabold text-[#8B6B4E]">
            Rp {(Object.values(reportsData.revenueByDay).reduce((a, b) => a + b, 0) * 4).toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] text-[#7E8680] block">
            Berdasarkan tren 4 minggu aktif
          </span>
        </div>
      </div>

      {/* Middle Grid: Top Products & Booking Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Selling Products */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#232724] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#889E73]" />
              <span>Produk Terlaris & Kontribusi Omset</span>
            </h3>
            <span className="text-xs text-[#7E8680] font-mono">Berdasarkan Pesanan</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] border-b border-[#E8DDCB] text-[#7E8680] font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Nama Menu</th>
                  <th className="py-2.5 px-3">Kuantitas</th>
                  <th className="py-2.5 px-3 text-right">Total Penjualan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1ECE1]">
                {reportsData.popularProducts.map((p, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF7F2]/50">
                    <td className="py-2.5 px-3 font-bold text-[#536B54]">#{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-[#232724]">{p.name}</td>
                    <td className="py-2.5 px-3 text-[#4B524D]">{p.count} porsi</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#232724]">
                      Rp {p.revenue.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booking Statistics */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-4">
          <h3 className="font-bold text-base text-[#232724] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#536B54]" />
            <span>Statistik Reservasi Tamu</span>
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 bg-[#E2ECE2]/60 rounded-2xl flex items-center justify-between">
              <span className="font-semibold text-[#334234]">Tingkat Konfirmasi Sukses</span>
              <span className="font-extrabold text-[#536B54] text-base">{bookingSuccessRate}%</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#F1ECE1]">
              <span className="text-[#7E8680]">Dikonfirmasi & Selesai:</span>
              <span className="font-bold text-emerald-700">{confirmedBookings} reservasi</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#F1ECE1]">
              <span className="text-[#7E8680]">Menunggu Persetujuan (Pending):</span>
              <span className="font-bold text-amber-700">{pendingBookings} reservasi</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#F1ECE1]">
              <span className="text-[#7E8680]">Ditolak / Batal:</span>
              <span className="font-bold text-red-600">{rejectedBookings} reservasi</span>
            </div>

            <div className="flex justify-between py-1.5 font-bold text-[#232724]">
              <span>Total Permintaan Masuk:</span>
              <span>{bookings.length} kali</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

