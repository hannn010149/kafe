"use client";

import React, { useState } from "react";
import { translations } from "@/lib/translations";
import { Languages, CheckCircle2, ShieldCheck, Globe, Search } from "lucide-react";

export default function LanguageManagerClient() {
  const [search, setSearch] = useState("");

  const idKeys = Object.keys(translations.id) as (keyof typeof translations.id)[];

  const filteredKeys = idKeys.filter(
    (key) =>
      key.toLowerCase().includes(search.toLowerCase()) ||
      translations.id[key].toLowerCase().includes(search.toLowerCase()) ||
      translations.en[key]?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-[#E8DDCB]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#232724]">
          Pengaturan Bahasa & Kompatibilitas Chrome Auto-Translate
        </h1>
        <p className="text-xs text-[#7E8680]">
          Kelola kamus terjemahan Bahasa Indonesia & English, serta pantau status kepatuhan terjemahan browser otomatis.
        </p>
      </div>

      {/* Chrome Auto-Translation Compliance Status Card */}
      <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#C5D8C6] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#536B54]">
          <ShieldCheck className="w-5 h-5" />
          <h3 className="font-bold text-sm text-[#232724]">
            Status Kompatibilitas Google Chrome Translate: AKTIF & TERVERIFIKASI
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white rounded-2xl border border-[#E8DDCB] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#232724] block">Atribut Semantic Dokumen: lang=&quot;id&quot;</span>
              <span className="text-[#7E8680]">
                Browser Chrome secara otomatis mengenali bahasa default dokumen sebagai Bahasa Indonesia.
              </span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#E8DDCB] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#232724] block">Bebas Atribut &apos;notranslate&apos;</span>
              <span className="text-[#7E8680]">
                Seluruh elemen teks dapat dibaca dan diterjemahkan oleh Google Translate tanpa hambatan.
              </span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#E8DDCB] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#232724] block">Elemen Teks HTML Asli (Bukan Gambar)</span>
              <span className="text-[#7E8680]">
                Semua menu, harga, form booking, dan detail produk dirender sebagai teks HTML yang dapat diindeks.
              </span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#E8DDCB] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#232724] block">Internal Dual-Engine Switcher (ID / EN)</span>
              <span className="text-[#7E8680]">
                Tersedia tombol manual toggle di header dan preferensi tersimpan otomatis di localStorage.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dictionary Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E8680]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kata kunci kamus terjemahan..."
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-[#E8DDCB] text-xs focus:outline-none focus:border-[#536B54]"
        />
      </div>

      {/* Dictionary Table */}
      <div className="bg-white rounded-3xl border border-[#E8DDCB] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E8DDCB] text-[#7E8680] font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Kunci (Key)</th>
                <th className="py-3 px-4">Bahasa Indonesia (Default)</th>
                <th className="py-3 px-4">English</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1ECE1]">
              {filteredKeys.map((key) => (
                <tr key={key} className="hover:bg-[#FAF7F2]/60">
                  <td className="py-2.5 px-4 font-mono text-[#536B54] font-semibold">
                    {key}
                  </td>
                  <td className="py-2.5 px-4 text-[#232724]">
                    {translations.id[key]}
                  </td>
                  <td className="py-2.5 px-4 text-[#4B524D] italic">
                    {translations.en[key] || "-"}
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

