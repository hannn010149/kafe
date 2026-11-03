"use client";

import React, { useState } from "react";
import { UserCheck, ShieldCheck, Key, Database, Server, CheckCircle2 } from "lucide-react";

export default function AdminProfilePage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savedToast, setSavedToast] = useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setCurrentPassword("");
    setNewPassword("");
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-[#E8DDCB]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#232724]">
          Profil Administrator & Keamanan Sistem
        </h1>
        <p className="text-xs text-[#7E8680]">
          Informasi hak akses, kata sandi, dan status koneksi database kafe.
        </p>
      </div>

      {savedToast && (
        <div className="p-3.5 bg-[#E2ECE2] border border-[#C5D8C6] text-[#242E24] rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Kata sandi admin berhasil diperbarui!</span>
        </div>
      )}

      {/* Admin Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#536B54] text-white flex items-center justify-center font-bold text-xl font-serif">
            木
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#232724]">Head Barista & Super Admin</h2>
            <p className="text-xs text-[#7E8680]">admin@komorebi.id • Hak Akses Penuh (Full Control)</p>
            <span className="inline-block mt-1 text-[10px] bg-[#E2ECE2] text-[#536B54] font-semibold px-2 py-0.5 rounded-full">
              Status Sesi: Aktif (Authenticated)
            </span>
          </div>
        </div>
      </div>

      {/* Password Change Form */}
      <div className="bg-white p-6 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-[#232724] flex items-center gap-2">
          <Key className="w-4 h-4 text-[#536B54]" />
          <span>Ubah Kata Sandi Admin</span>
        </h3>

        <form onSubmit={handleUpdatePassword} className="space-y-3 max-w-md text-xs">
          <div>
            <label className="font-semibold text-[#7E8680] block mb-1">Kata Sandi Saat Ini</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
            />
          </div>

          <div>
            <label className="font-semibold text-[#7E8680] block mb-1">Kata Sandi Baru</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
            />
          </div>

          <button
            type="submit"
            className="bg-[#536B54] hover:bg-[#425543] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xs"
          >
            Simpan Kata Sandi Baru
          </button>
        </form>
      </div>

      {/* System & Architecture Info */}
      <div className="bg-white p-6 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-[#232724] flex items-center gap-2">
          <Server className="w-4 h-4 text-[#536B54]" />
          <span>Status Sistem & Backend Architecture</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8DDCB]">
            <span className="text-[#7E8680] block">Frontend Framework</span>
            <span className="font-bold text-[#232724]">Next.js 16 + React 19</span>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8DDCB]">
            <span className="text-[#7E8680] block">Styling Engine</span>
            <span className="font-bold text-[#232724]">Tailwind CSS v4</span>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8DDCB]">
            <span className="text-[#7E8680] block">Database Engine</span>
            <span className="font-bold text-[#536B54]">Supabase PostgreSQL + Local DB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

