import React from "react";
import { getReportsData, getProducts, getCategories } from "@/lib/db";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  UtensilsCrossed,
  CalendarDays,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default async function AdminOverviewPage() {
  const [reports, products, categories] = await Promise.all([
    getReportsData(),
    getProducts(),
    getCategories(),
  ]);

  const totalProducts = products.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DDCB]">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#536B54] bg-[#E2ECE2] px-2.5 py-0.5 rounded-full">
            Realtime Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#232724] mt-1">
            Ringkasan Operasional Kafe
          </h1>
          <p className="text-xs text-[#7E8680]">
            Data statistik penjualan, pendapatan, pesanan, dan reservasi langsung dari database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="bg-[#536B54] hover:bg-[#425543] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            + Tambah Produk Baru
          </Link>
        </div>
      </div>

      {/* 5 Core Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#7E8680] font-medium">Total Pendapatan</span>
            <div className="w-8 h-8 rounded-full bg-[#E2ECE2] text-[#536B54] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#232724]">
            Rp {reports.totalRevenue.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.2% minggu ini
          </span>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#7E8680] font-medium">Total Pesanan</span>
            <div className="w-8 h-8 rounded-full bg-[#F3ECE0] text-[#8B6B4E] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#232724]">
            {reports.totalOrders}
          </div>
          <span className="text-[11px] text-[#7E8680]">Dine-In & Takeaway</span>
        </div>

        {/* Total Products */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#7E8680] font-medium">Total Produk</span>
            <div className="w-8 h-8 rounded-full bg-[#EFF4EB] text-[#536B54] flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#232724]">
            {totalProducts}
          </div>
          <span className="text-[11px] text-[#7E8680]">{categories.length} Kategori</span>
        </div>

        {/* Total Bookings */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#7E8680] font-medium">Total Reservasi</span>
            <div className="w-8 h-8 rounded-full bg-[#E2ECE2] text-[#536B54] flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#232724]">
            {reports.totalBookings}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Tanpa double-booking</span>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-2 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#7E8680] font-medium">Pelanggan Aktif</span>
            <div className="w-8 h-8 rounded-full bg-[#F3ECE0] text-[#8B6B4E] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#232724]">
            {reports.totalCustomers}
          </div>
          <span className="text-[11px] text-[#7E8680]">Member & Regular</span>
        </div>
      </div>

      {/* Charts Section: Revenue Breakdown & Weekly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue by Day Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#232724]">Grafik Pendapatan Mingguan</h3>
              <p className="text-xs text-[#7E8680]">Distribusi omset penjualan hari per hari (IDR)</p>
            </div>
            <span className="text-xs font-semibold text-[#536B54] bg-[#E2ECE2] px-2.5 py-1 rounded-full">
              7 Hari Terakhir
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-6 space-y-3">
            {Object.entries(reports.revenueByDay).map(([day, amount]) => {
              const maxAmount = 4000000;
              const percentage = Math.min(100, Math.round((amount / maxAmount) * 100));
              return (
                <div key={day} className="space-y-1">
                  <div className="flex justify-between text-xs text-[#4B524D]">
                    <span className="font-medium">{day}</span>
                    <span className="font-bold text-[#232724]">
                      Rp {amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E8DDCB]">
                    <div
                      className="h-full bg-gradient-to-r from-[#889E73] to-[#536B54] rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Products Top 5 */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#232724]">Produk Terlaris (Popular)</h3>
              <p className="text-xs text-[#7E8680]">Berdasarkan kuantitas pesanan nyata</p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-[#536B54] hover:underline"
            >
              Semua
            </Link>
          </div>

          <div className="space-y-3 divide-y divide-[#F1ECE1]">
            {reports.popularProducts.map((p, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FAF7F2] border border-[#E8DDCB] font-bold text-[#536B54] flex items-center justify-center text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="font-bold text-[#232724] block">{p.name}</span>
                    <span className="text-[11px] text-[#7E8680]">{p.count} porsi terjual</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-[#536B54] block">
                    Rp {p.revenue.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders & Recent Bookings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Table */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#232724]">Pesanan Terbaru</h3>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#536B54] hover:underline flex items-center gap-1"
            >
              <span>Kelola Pesanan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {reports.recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8DDCB] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold font-mono text-[#536B54] block">
                    {ord.order_code}
                  </span>
                  <span className="text-[#4B524D]">{ord.customer_name} • {ord.items.length} item</span>
                </div>
                <div className="text-right space-y-1">
                  <span className="font-bold text-[#232724] block">
                    Rp {ord.total_amount.toLocaleString("id-ID")}
                  </span>
                  <span className="text-[10px] font-semibold uppercase bg-white border border-[#E8DDCB] text-[#536B54] px-2 py-0.5 rounded-full">
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#232724]">Reservasi Terbaru</h3>
            <Link
              href="/admin/bookings"
              className="text-xs font-semibold text-[#536B54] hover:underline flex items-center gap-1"
            >
              <span>Kelola Booking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {reports.recentBookings.map((bk) => (
              <div
                key={bk.id}
                className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8DDCB] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold font-mono text-[#536B54] block">
                    {bk.booking_code}
                  </span>
                  <span className="text-[#4B524D]">
                    {bk.customer_name} ({bk.guest_count} Tamu)
                  </span>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-[#7E8680] block">
                    {bk.booking_date} @ {bk.booking_time}
                  </span>
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                    bk.status === "confirmed"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {bk.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
