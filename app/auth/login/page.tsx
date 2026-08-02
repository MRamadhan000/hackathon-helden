"use client";

import React, { Suspense } from "react";
import Link from "next/link";

function AuthLoginCentralContent() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 pt-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-900 border border-blue-200 font-extrabold text-[10px] rounded-full uppercase tracking-wider">
            SISTEM INTEGRASI KEPENDUDUKAN DESA DIGITAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Pusat Portal Login Peran Desa
          </h1>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Pilih portal peran Anda di bawah ini.
          </p>
        </div>

        {/* CARDS KATEGORI PORTAL LOGIN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link
            href="/auth/login/rt"
            className="p-4 bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-2xl shadow-2xs transition group space-y-2 cursor-pointer"
          >
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-extrabold text-[10px] rounded-md border border-blue-200 uppercase">
              Ketua RT
            </span>
            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-blue-700">
              Portal Ketua RT →
            </h3>
            <p className="text-[11px] text-slate-500">
              Pendataan warga, mutasi offline RT, dan survei kelayakan.
            </p>
          </Link>

          <Link
            href="/auth/login/sekretaris"
            className="p-4 bg-white hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-2xl shadow-2xs transition group space-y-2 cursor-pointer"
          >
            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 font-extrabold text-[10px] rounded-md border border-indigo-200 uppercase">
              Sekretaris Desa
            </span>
            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-700">
              Portal Sekdes →
            </h3>
            <p className="text-[11px] text-slate-500">
              Verifikator mutasi, peninjauan sanggahan, dan audit log.
            </p>
          </Link>

          <Link
            href="/auth/login/kades"
            className="p-4 bg-white hover:bg-purple-50/60 border border-slate-200 hover:border-purple-300 rounded-2xl shadow-2xs transition group space-y-2 cursor-pointer"
          >
            <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 font-extrabold text-[10px] rounded-md border border-purple-200 uppercase">
              Kepala Desa
            </span>
            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-purple-700">
              Portal Kades →
            </h3>
            <p className="text-[11px] text-slate-500">
              Pengambilan keputusan strategis dan persetujuan SK bansos.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthLoginPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs text-slate-400">Memuat Portal Login...</div>}>
      <AuthLoginCentralContent />
    </Suspense>
  );
}