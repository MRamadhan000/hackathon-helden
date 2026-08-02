"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function WargaLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";

  const [method, setMethod] = useState<"nik" | "phone">("nik");
  const [nikInput, setNikInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorNotif, setErrorNotif] = useState("");

  const handleLoginWarga = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotif("");

    if (method === "nik" && (!nikInput || nikInput.length < 16)) {
      setErrorNotif(
        "Masukkan 16 digit Nomor Induk Kependudukan (NIK) yang valid.",
      );
      return;
    }

    if (method === "phone" && (!phoneInput || phoneInput.length < 10)) {
      setErrorNotif("Masukkan nomor HP / WhatsApp aktif yang terdaftar.");
      return;
    }

    setLoading(true);

    // Simulasi Login Warga
    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("mock_user_role", "warga");
        localStorage.setItem("mock_user_nik", nikInput || "3507011234560001");
        localStorage.setItem("mock_user_name", "Bpk. Budi Santoso");
      }
      setLoading(false);
      router.push(`/warga/dashboard?tahun=${tahunPeriode}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased flex flex-col justify-between p-4 sm:p-6 lg:p-10">
      {/* HEADER TOP NAVIGASI */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link
          href={`/login?tahun=${tahunPeriode}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition"
        >
          ← Kembali ke Portal Utama
        </Link>
        <span className="text-[11px] font-extrabold text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Layanan Mandiri Warga
        </span>
      </div>

      {/* FORM LOGIN KARTU UTAMA */}
      <div className="max-w-md w-full mx-auto my-8 space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          {/* JUDUL & LOGO KELURAHAN/DESA */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-600 text-white font-black text-xl rounded-2xl mx-auto flex items-center justify-center shadow-md shadow-emerald-600/20">
              🏡
            </div>
            <h1 className="text-xl font-extrabold text-slate-950 tracking-tight">
              Layanan & Cek Bansos Warga
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Masukan identitas Anda untuk memeriksa kelayakan bantuan, status
              bansos, atau melakukan sanggahan mandiri.
            </p>
          </div>

          {errorNotif && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold">
              ⚠️ {errorNotif}
            </div>
          )}

          {/* TAB PILIHAN METODE LOGIN */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMethod("nik")}
              className={`py-2 rounded-lg transition ${
                method === "nik"
                  ? "bg-white text-slate-950 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Cek Via NIK
            </button>
            <button
              type="button"
              onClick={() => setMethod("phone")}
              className={`py-2 rounded-lg transition ${
                method === "phone"
                  ? "bg-white text-slate-950 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              No. WhatsApp
            </button>
          </div>

          {/* INPUT FORM */}
          <form onSubmit={handleLoginWarga} className="space-y-4">
            {method === "nik" ? (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Nomor Induk Kependudukan (NIK)
                </label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="Contoh: 3507011234560001"
                  value={nikInput}
                  onChange={(e) =>
                    setNikInput(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-emerald-600 transition"
                  required
                />
                <span className="text-[10px] text-slate-400 block">
                  Sesuai dengan 16 digit NIK pada Kartu Tanda Penduduk (KTP) /
                  KK.
                </span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Nomor HP / WhatsApp Aktif
                </label>
                <input
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={phoneInput}
                  onChange={(e) =>
                    setPhoneInput(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-emerald-600 transition"
                  required
                />
                <span className="text-[10px] text-slate-400 block">
                  Nomor terdaftar pada database sistem pelayanan desa.
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-extrabold rounded-xl transition shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Memeriksa Data...</span>
              ) : (
                <>
                  <span>Masuk Portal Warga →</span>
                </>
              )}
            </button>
          </form>

          {/* INFORMASI BANTUAN SINGKAT */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Layanan Mandiri Yang Tersedia:
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-slate-700">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                🔍 Cek Bansos
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                🏠 Sanggah Rumah
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                📝 Perbaiki Data
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BERSANTAI */}
      <div className="text-center text-xs text-slate-400 font-medium pb-2">
        Aplikasi Pelayanan Desa Berbasis Transparansi & Digitalisasi
        Kependudukan
      </div>
    </div>
  );
}

export default function WargaLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-slate-400">
          Memuat Halaman...
        </div>
      }
    >
      <WargaLoginContent />
    </Suspense>
  );
}
