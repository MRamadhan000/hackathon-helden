"use client";

import Link from "next/link";

export default function BridgeSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-16">
      {/* Teks Notifikasi / Informasi Konteks */}
      <div className="mb-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 flex items-start gap-3 text-amber-900">
        <span className="text-base shrink-0">💡</span>
        <div className="text-xs leading-relaxed">
          <strong className="font-bold block text-amber-950 mb-0.5">
            Notifikasi Integrasi Data External:
          </strong>
          Sistem ERP Desa terkoneksi secara <em>read-only</em> dengan dua modul
          pendukung di bawah ini untuk menjaga keabsahan data kependudukan dan
          transparansi batas anggaran bantuan sosial.
        </div>
      </div>

      {/* Card Bridge Siskeudes & Dukcapil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/siskeudes"
          className="group bg-white border border-slate-200 hover:border-emerald-500 p-6 rounded-2xl shadow-sm hover:shadow-md transition flex items-center justify-between"
        >
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
              Bridge Modul Keuangan
            </span>
            <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition pt-1">
              Akses Integrasi Siskeudes →
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Menampilkan struktur APBDes resmi, pagu anggaran teralokasi, serta
              batas maksimal dana per KK.
            </p>
          </div>
        </Link>

        <Link
          href="/dukcapil"
          className="group bg-white border border-slate-200 hover:border-blue-500 p-6 rounded-2xl shadow-sm hover:shadow-md transition flex items-center justify-between"
        >
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
              Bridge Modul Kependudukan
            </span>
            <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition pt-1">
              Akses Master Data Dukcapil →
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pusat referensi data warga resmi untuk validasi format NIK dan
              deteksi warga meninggal/pindah.
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
