"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginWarga() {
  const router = useRouter();
  const [nik, setNik] = useState("");
  const [kk, setKk] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (nik.length < 16) {
      alert("Mohon masukkan 16 digit NIK Anda dengan benar.");
      return;
    }
    // Simpan identitas warga sederhana
    localStorage.setItem("warga_nik", nik);
    localStorage.setItem("warga_nama", "Bapak / Ibu Warga");
    router.push("/warga/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans antialiased">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-xl mx-auto border border-blue-100">
            🏡
          </div>
          <h1 className="text-xl font-extrabold text-slate-950">
            Layanan Mandiri Warga Desa
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Selamat datang! Silakan masukkan Nomor NIK dan KK Anda untuk
            mengusulkan perbaikan data atau melaporkan kondisi rumah.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Nomor Induk Kependudukan (NIK) *
            </label>
            <input
              type="text"
              required
              maxLength={16}
              placeholder="Contoh: 3507123456780001"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Nomor Kartu Keluarga (KK) *
            </label>
            <input
              type="text"
              required
              maxLength={16}
              placeholder="Contoh: 3507123456780002"
              value={kk}
              onChange={(e) => setKk(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-blue-600/10 cursor-pointer"
          >
            Masuk ke Layanan Warga →
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <Link
            href="/login"
            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition"
          >
            ← Kembali ke Halaman Login Perangkat Desa
          </Link>
        </div>
      </div>
    </div>
  );
}
