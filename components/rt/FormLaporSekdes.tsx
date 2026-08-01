"use client";

import React from "react";
import { PendudukRT } from "./TableWarga";
import SearchableNikSelect from "./SearchableNikSelect";

interface FormLaporSekdesProps {
  daftarWarga: PendudukRT[];
  selectedNik: string;
  setSelectedNik: (nik: string) => void;
  jenisLaporan: "Mutasi Kematian (Mati)" | "Mutasi Wilayah (Pindah)";
  setJenisLaporan: (
    jenis: "Mutasi Kematian (Mati)" | "Mutasi Wilayah (Pindah)",
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function FormLaporSekdes({
  daftarWarga,
  selectedNik,
  setSelectedNik,
  jenisLaporan,
  setJenisLaporan,
  onSubmit,
}: FormLaporSekdesProps) {
  // Cari warga terpilih untuk auto-fill nama
  const wargaTerpilih = daftarWarga.find((w) => w.nik === selectedNik);

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200/80 max-w-xl mx-auto shadow-sm space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold mb-2">
          🚀 Pelaporan Mutasi Cepat RT
        </div>
        <h3 className="text-base font-bold text-slate-950">
          Formulir Pelaporan Mutasi Warga ke Sekdes
        </h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Ketik NIK atau Nama warga dari data RT untuk melaporkan mutasi
          kematian atau kepindahan wilayah secara instan.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* DROPDOWN DENGAN PENGETIKAN LANGSUNG */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Cari / Pilih NIK Warga Terdaftar *
          </label>
          <SearchableNikSelect
            daftarWarga={daftarWarga}
            selectedNik={selectedNik}
            onSelectNik={setSelectedNik}
          />
        </div>

        {/* NAMA LENGKAP WARGA (READ-ONLY) */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Nama Lengkap Warga (Otomatis Terisi)
          </label>
          <input
            type="text"
            readOnly
            disabled
            value={wargaTerpilih ? wargaTerpilih.nama : ""}
            placeholder="Pilih NIK di atas untuk mengisi nama..."
            className="w-full px-4 py-3 border border-slate-200/80 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 cursor-not-allowed select-none"
          />
        </div>

        {/* JENIS BERKAS MUTASI */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Jenis Berkas Mutasi *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setJenisLaporan("Mutasi Kematian (Mati)")}
              className={`py-3 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                jenisLaporan === "Mutasi Kematian (Mati)"
                  ? "bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>🕯️</span> Warga Mati
            </button>

            <button
              type="button"
              onClick={() => setJenisLaporan("Mutasi Wilayah (Pindah)")}
              className={`py-3 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                jenisLaporan === "Mutasi Wilayah (Pindah)"
                  ? "bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>📦</span> Warga Pindah
            </button>
          </div>
        </div>

        {/* TOMBOL SUBMIT */}
        <button
          type="submit"
          disabled={!selectedNik}
          className={`w-full py-3.5 text-white text-sm font-bold rounded-xl transition shadow-md ${
            selectedNik
              ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/10 cursor-pointer"
              : "bg-slate-300 cursor-not-allowed"
          }`}
        >
          Kirim Laporan Resmi ke Sekdes →
        </button>
      </form>
    </div>
  );
}
