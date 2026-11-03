"use client";

import React, { useState } from "react";
import { CafeSettings } from "@/types";
import {
  Save,
  CheckCircle2,
  Upload,
  Globe,
  Store,
  Phone,
  Clock,
  Palette,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";

interface SettingsClientProps {
  initialSettings: CafeSettings;
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [settings, setSettings] = useState<CafeSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleChange = (field: keyof CafeSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedHoursChange = (type: "weekdays" | "weekends", value: string) => {
    setSettings((prev) => ({
      ...prev,
      opening_hours: {
        ...prev.opening_hours,
        [type]: value,
      },
    }));
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo_url" | "banner_url"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengunggah foto");
      handleChange(field, data.url);
      setToast(`Foto ${field === "logo_url" ? "Logo" : "Banner"} berhasil diperbarui!`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSettings(data.settings);
      setToast("Identitas dan pengaturan kafe berhasil disimpan & tersinkronisasi ke website!");
      setTimeout(() => setToast(null), 4000);
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan pengaturan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#232724] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs border border-[#536B54] animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#889E73]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DDCB]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#232724]">
            Pengaturan Identitas Kafe (Dynamic Cafe Settings)
          </h1>
          <p className="text-xs text-[#7E8680]">
            Ubah nama kafe, logo, banner, WhatsApp, jam operasional, dan branding. Langsung aktif di website pelanggan.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="bg-[#536B54] hover:bg-[#425543] text-white px-6 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Menyimpan..." : "Simpan Semua Perubahan"}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Cafe Identity */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-[#232724] flex items-center gap-2">
            <Store className="w-4 h-4 text-[#536B54]" />
            <span>Identitas Utama Kafe</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#7E8680]">Nama Kafe *</label>
              <input
                type="text"
                required
                value={settings.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#7E8680]">Nama Kanji / Subtitle Jepang</label>
              <input
                type="text"
                value={settings.kanji_name || ""}
                onChange={(e) => handleChange("kanji_name", e.target.value)}
                placeholder="Contoh: 木漏れ日 喫茶"
                className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-[#7E8680]">Tagline / Slogan</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-[#7E8680]">Deskripsi Singkat Filosofi Kafe</label>
              <textarea
                rows={3}
                value={settings.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
              />
            </div>
          </div>
        </div>

        {/* 2. Visuals & Branding (Logo, Banner, Color) */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-[#232724] flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#536B54]" />
            <span>Visual, Logo & Banner Homepage</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Logo */}
            <div className="space-y-2">
              <label className="font-semibold text-[#7E8680] block">Logo Kafe</label>
              <div className="flex items-center gap-3">
                <img
                  src={settings.logo_url}
                  alt="Logo"
                  className="w-14 h-14 rounded-2xl object-cover border border-[#E8DDCB]"
                />
                <label className="cursor-pointer bg-[#FAF7F2] border border-[#E8DDCB] hover:bg-white text-[#4B524D] px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#536B54]" />
                  <span>Ganti Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "logo_url")}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Banner */}
            <div className="space-y-2">
              <label className="font-semibold text-[#7E8680] block">Banner Hero Homepage</label>
              <div className="flex items-center gap-3">
                <img
                  src={settings.banner_url}
                  alt="Banner"
                  className="w-24 h-14 rounded-2xl object-cover border border-[#E8DDCB]"
                />
                <label className="cursor-pointer bg-[#FAF7F2] border border-[#E8DDCB] hover:bg-white text-[#4B524D] px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#536B54]" />
                  <span>Ganti Banner</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "banner_url")}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Branding Color Picker */}
            <div className="space-y-1">
              <label className="font-semibold text-[#7E8680]">Warna Primer Branding</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.primary_color}
                  onChange={(e) => handleChange("primary_color", e.target.value)}
                  className="w-9 h-9 rounded-lg border-none cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primary_color}
                  onChange={(e) => handleChange("primary_color", e.target.value)}
                  className="w-28 px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2] font-mono"
                />
                <span className="text-[11px] text-[#7E8680]">Sage Green Default: #536B54</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Operational Hours & Location */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-[#232724] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#536B54]" />
            <span>Jam Operasional & Kontak Pelanggan</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#7E8680]">Jam Buka (Senin - Jumat)</label>
              <input
                type="text"
                value={settings.opening_hours.weekdays}
                onChange={(e) => handleNestedHoursChange("weekdays", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#7E8680]">Jam Buka (Sabtu - Minggu / Libur)</label>
              <input
                type="text"
                value={settings.opening_hours.weekends}
                onChange={(e) => handleNestedHoursChange("weekends", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#7E8680]">Nomor WhatsApp Pemesanan (Aktif) *</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                placeholder="6281234567890"
                className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#7E8680]">Instagram Resmi</label>
              <input
                type="text"
                value={settings.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
                placeholder="@komorebi.cafe"
                className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-[#7E8680]">Alamat Lengkap Kafe</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

