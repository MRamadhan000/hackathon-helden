"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Mock Data Siskeudes Per Tahun
const mockSiskeudesPerTahun: Record<
  string,
  {
    paguDanaDesa: number;
    persentaseMaksBansos: number; // 25%
    alokasiBansosTerpakai: number;
    nominalBantuanPerKpmBulan: number;
    totalKpmTercover: number;
    statusSinkronisasi: string;
    terakhirSinkron: string;
  }
> = {
  "2026": {
    paguDanaDesa: 1000000000, // Rp 1 Miliar
    persentaseMaksBansos: 25, // Maks Rp 250 Juta
    alokasiBansosTerpakai: 90000000, // Rp 90 Juta
    nominalBantuanPerKpmBulan: 300000, // Rp 300rb/bulan
    totalKpmTercover: 25, // 25 KPM x 300rb x 12 bln = 90 Juta
    statusSinkronisasi: "Terhubung (Siskeudes API v2.4)",
    terakhirSinkron: "01/08/2026 - 08:30 WIB",
  },
  "2025": {
    paguDanaDesa: 950000000,
    persentaseMaksBansos: 25,
    alokasiBansosTerpakai: 108000000,
    nominalBantuanPerKpmBulan: 300000,
    totalKpmTercover: 30,
    statusSinkronisasi: "Arsip Terkunci",
    terakhirSinkron: "31/12/2025 - 23:59 WIB",
  },
  "2024": {
    paguDanaDesa: 900000000,
    persentaseMaksBansos: 25,
    alokasiBansosTerpakai: 144000000,
    nominalBantuanPerKpmBulan: 300000,
    totalKpmTercover: 40,
    statusSinkronisasi: "Arsip Terkunci",
    terakhirSinkron: "31/12/2024 - 23:59 WIB",
  },
};

export default function HalamanAuditSiskeudes() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";
  const isTahunBerlalu = tahunPeriode !== "2026";

  const dataSiskeudes =
    mockSiskeudesPerTahun[tahunPeriode] || mockSiskeudesPerTahun["2026"];

  // State Simulasi
  const [jumlahKpmInput, setJumlahKpmInput] = useState(
    dataSiskeudes.totalKpmTercover,
  );
  const [nominalPerBulan, setNominalPerBulan] = useState(
    dataSiskeudes.nominalBantuanPerKpmBulan,
  );

  // Kalkulasi Simulasi Anggaran (12 Bulan)
  const totalSimulasiAnggaran = jumlahKpmInput * nominalPerBulan * 12;
  const batasMaksimalBansos =
    (dataSiskeudes.paguDanaDesa * dataSiskeudes.persentaseMaksBansos) / 100;
  const isMelebihiBatas = totalSimulasiAnggaran > batasMaksimalBansos;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12 space-y-6 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* NAVIGASI & PERIODE */}
        <div className="flex items-center justify-between">
          <Link
            href={`/sekdes/dashboard?tahun=${tahunPeriode}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs transition"
          >
            ← Kembali ke Workspace Sekdes
          </Link>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            📅 Periode:{" "}
            <strong className="text-slate-900">{tahunPeriode}</strong>
          </span>
        </div>

        {/* BANNER HISTORIS JIKA TAHUN BERLALU */}
        {isTahunBerlalu && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-950 rounded-xl text-xs font-bold shadow-2xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              🔒{" "}
              <strong>Mode Arsip Realisasi Siskeudes ({tahunPeriode}):</strong>{" "}
              Data pagu dan realisasi di tahun ini sudah bersifat final dan
              tidak dapat diubah.
            </span>
          </div>
        )}

        {/* HEADER APLIKASI */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold mb-2">
              💰 Integrasi RKDes & Siskeudes Kemendagri
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-950">
              Audit Pagu & Simulasi Alokasi Dana Desa ({tahunPeriode})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Validasi kecukupan anggaran Bansos BLT-DD agar sesuai dengan
              ketentuan Peraturan Menteri Desa / Keuangan.
            </p>
          </div>
          <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-right shrink-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Status Sistem Siskeudes
            </p>
            <p className="text-xs font-black text-emerald-700 mt-0.5">
              {dataSiskeudes.statusSinkronisasi}
            </p>
          </div>
        </div>

        {/* SUMMARY CARDS (STATISTIK SISKEUDES) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Pagu Dana Desa (DD)
            </span>
            <p className="text-lg font-black text-slate-950">
              {formatRupiah(dataSiskeudes.paguDanaDesa)}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Transfer Kas Rekening Kas Desa (RKD)
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Batas Maksimal Bansos BLT (25%)
            </span>
            <p className="text-lg font-black text-indigo-950">
              {formatRupiah(batasMaksimalBansos)}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Batas Atas Regulasi Alokasi DD
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Alokasi Terpakai / Disetujui
            </span>
            <p className="text-lg font-black text-emerald-800">
              {formatRupiah(dataSiskeudes.alokasiBansosTerpakai)}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Tercover: <strong>{dataSiskeudes.totalKpmTercover} KPM</strong>{" "}
              (Aktif)
            </p>
          </div>
        </div>

        {/* PANEL SIMULATOR KUOTA KPM BANSOS (HANYA AKTIF DI TAHUN AKTIF) */}
        {!isTahunBerlalu ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-950">
                🧮 Kalkulator & Simulasi Kuota KPM Bansos Baru (2026)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Hitung perkiraan kebutuhan Pagu Siskeudes apabila jumlah
                Keluarga Penerima Manfaat (KPM) ditambah atau dikurangi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Rencana Jumlah Kuota Penerima (KPM) *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={jumlahKpmInput}
                    onChange={(e) => setJumlahKpmInput(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 bg-white focus:outline-none focus:border-indigo-600"
                  />
                  <span className="text-xs font-bold text-slate-500 shrink-0">
                    Keluarga
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Nominal Bantuan Per KPM / Bulan *
                </label>
                <input
                  type="number"
                  step={50000}
                  value={nominalPerBulan}
                  onChange={(e) => setNominalPerBulan(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* BOX RESULT KALKULASI */}
            <div
              className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isMelebihiBatas
                  ? "bg-rose-50 border-rose-200 text-rose-950"
                  : "bg-emerald-50 border-emerald-200 text-emerald-950"
              }`}
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider">
                  Total Anggaran Dibutuhkan (1 Tahun / 12 Bulan)
                </p>
                <p className="text-xl font-black mt-0.5">
                  {formatRupiah(totalSimulasiAnggaran)}
                </p>
                <p className="text-xs font-medium mt-1">
                  {isMelebihiBatas
                    ? `⚠️ Melebihi batas maksimal regulasi Siskeudes! (Selisih: +${formatRupiah(
                        totalSimulasiAnggaran - batasMaksimalBansos,
                      )})`
                    : `✓ Anggaran aman & memenuhi kriteria pagu Siskeudes (Sisa Kuota Pagu: ${formatRupiah(
                        batasMaksimalBansos - totalSimulasiAnggaran,
                      )})`}
                </p>
              </div>

              <button
                disabled={isMelebihiBatas}
                onClick={() =>
                  alert(
                    "Pagu simulasi berhasil disinkronkan ke draf rekomendasi SK Kades!",
                  )
                }
                className={`px-5 py-3 rounded-xl text-xs font-bold transition shadow-xs shrink-0 ${
                  isMelebihiBatas
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : "bg-indigo-900 hover:bg-indigo-800 text-white cursor-pointer"
                }`}
              >
                Kunci & Sync Pagu Siskeudes →
              </button>
            </div>
          </div>
        ) : (
          /* TAMPILAN HISTORIS TAHUN BERLALU */
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Laporan Realisasi Pagu Siskeudes Terkunci ({tahunPeriode})
            </h3>
            <p className="text-xs text-slate-500">
              Seluruh transaksi pengeluaran alokasi BLT-DD pada tahun anggaran{" "}
              {tahunPeriode} telah diserap sebesar{" "}
              <strong className="text-slate-900">
                {formatRupiah(dataSiskeudes.alokasiBansosTerpakai)}
              </strong>{" "}
              dengan total penerima manfaat sejumlah{" "}
              <strong className="text-slate-900">
                {dataSiskeudes.totalKpmTercover} KPM
              </strong>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
