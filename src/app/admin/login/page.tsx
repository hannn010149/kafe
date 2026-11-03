"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Coffee } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@komorebi.id");
  const [password, setPassword] = useState("adminpassword123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login gagal");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF7F2]">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-[#E8DDCB] space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#536B54] text-white flex items-center justify-center font-bold font-serif text-2xl shadow-sm">
            木
          </div>
          <h1 className="text-2xl font-bold text-[#232724]">Portal Pengelola Kafe</h1>
          <p className="text-xs text-[#7E8680]">
            Komorebi Café & Roastery Management System
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Notice Box for Quick Testing */}
        <div className="p-3 bg-[#E2ECE2]/60 rounded-xl border border-[#C5D8C6] text-[11px] text-[#334234]">
          <span className="font-bold block mb-0.5">Kredensial Default Admin:</span>
          <span>Email: <code>admin@komorebi.id</code></span><br />
          <span>Kata Sandi: <code>adminpassword123</code></span>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#7E8680]">Email Admin</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E8680]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DDCB] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#536B54]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#7E8680]">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E8680]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DDCB] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#536B54]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#536B54] hover:bg-[#425543] text-white py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Memverifikasi...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Masuk ke Dashboard</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

