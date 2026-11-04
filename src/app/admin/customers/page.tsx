import React from "react";
import { getCustomers } from "@/lib/db";
import { Phone, Mail } from "lucide-react";
import { requireAdminSession } from "@/lib/admin-auth";

export default async function AdminCustomersPage() {
  await requireAdminSession();
  const customers = await getCustomers();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DDCB]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#232724]">
            Daftar Pelanggan Kafe
          </h1>
          <p className="text-xs text-[#7E8680]">
            Database pelanggan tetap, total frekuensi kunjungan, dan akumulasi transaksi.
          </p>
        </div>

        <div className="bg-[#E2ECE2] text-[#425543] px-3.5 py-1.5 rounded-full text-xs font-semibold">
          Total Pelanggan: {customers.length} Orang
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8DDCB] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E8DDCB] text-[#7E8680] font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Nama Pelanggan</th>
                <th className="py-3.5 px-4">Kontak WhatsApp / Email</th>
                <th className="py-3.5 px-4">Jumlah Pesanan</th>
                <th className="py-3.5 px-4">Total Belanja (IDR)</th>
                <th className="py-3.5 px-4 text-right">Kunjungan Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1ECE1]">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#232724] block">{c.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#4B524D]">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-emerald-800">
                        <Phone className="w-3 h-3" />
                        <span>{c.phone}</span>
                      </div>
                      {c.email && (
                        <div className="flex items-center gap-1.5 text-[#7E8680]">
                          <Mail className="w-3 h-3" />
                          <span>{c.email}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#232724]">
                    {c.total_orders} kali pesan
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#536B54]">
                    Rp {c.total_spent.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3.5 px-4 text-right text-[#7E8680]">
                    {c.last_visit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
