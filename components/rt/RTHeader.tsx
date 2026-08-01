"use client";

import Link from "next/link";

export default function RTHeader() {
  return (
    <header className="bg-white border-b border-slate-200/60 sticky top-0 z-40 px-6 lg:px-12 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link href="/">
          <button
            className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 rounded-xl text-slate-700 transition flex items-center justify-center group"
            title="Kembali ke Landing Page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </button>
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-900 text-white flex items-center justify-center font-bold text-sm rounded-xl shadow-sm">
            RT
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 uppercase tracking-tight">
              Panel Utama Ketua RT 03
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Sistem Verifikasi & Pelaporan Mandiri Tingkat Rukun Tetangga
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
