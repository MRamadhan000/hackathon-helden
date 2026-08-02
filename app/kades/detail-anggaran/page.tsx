"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import KadesHeader from "@/components/kades/KadesHeader";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
);

interface PosAnggaran {
  id: string;
  kodeKegiatan: string;
  namaKegiatan: string;
  kategori: "Bantuan Sosial (BLT)" | "Operasional RT" | "Program Lainnya";
  sumberDana: string;
  paguAnggaran: string;
  realisasi: string;
  statusSiskeudes: "Terserap 100%" | "Berjalan (Tahap III)";
}

interface DataAnggaranRT {
  idRT: string;
  namaRT: string;
  ketuaRT: string;
  dusun: string;
  totalAnggaranRT: string;
  totalAnggaranNominal: number;
  trenAnggaran5Thn: number[]; // 2022 - 2026 (dalam jutaan Rupiah)
  kategoriPersen: {
    bansos: number;
    operasional: number;
    lainnya: number;
  };
  daftarPosAnggaran: PosAnggaran[];
}

const mockDetailAnggaranPerRT: Record<string, DataAnggaranRT[]> = {
  "2026": [
    {
      idRT: "rt-01",
      namaRT: "RT 01 / RW 01",
      ketuaRT: "Bpk. Heri Setiawan",
      dusun: "Dusun Krajan",
      totalAnggaranRT: "Rp 62.000.000",
      totalAnggaranNominal: 62000000,
      trenAnggaran5Thn: [52, 55, 58, 60, 62],
      kategoriPersen: { bansos: 75, operasional: 15, lainnya: 10 },
      daftarPosAnggaran: [
        {
          id: "ang-101",
          kodeKegiatan: "4.2.01",
          namaKegiatan: "Penyaluran BLT Dana Desa (42 KPM)",
          kategori: "Bantuan Sosial (BLT)",
          sumberDana: "DDS (Dana Desa)",
          paguAnggaran: "Rp 50.400.000",
          realisasi: "Rp 37.800.000",
          statusSiskeudes: "Berjalan (Tahap III)",
        },
        {
          id: "ang-102",
          kodeKegiatan: "4.2.02",
          namaKegiatan: "Insentif Operasional Pengurus RT & Pendataan DDK",
          kategori: "Operasional RT",
          sumberDana: "ADD (Alokasi Dana Desa)",
          paguAnggaran: "Rp 7.600.000",
          realisasi: "Rp 5.700.000",
          statusSiskeudes: "Berjalan (Tahap III)",
        },
        {
          id: "ang-103",
          kodeKegiatan: "4.2.03",
          namaKegiatan: "Bantuan Sanitasi MCK MBR & Kesehatan Rentan",
          kategori: "Program Lainnya",
          sumberDana: "DDS (Dana Desa)",
          paguAnggaran: "Rp 4.000.000",
          realisasi: "Rp 3.000.000",
          statusSiskeudes: "Berjalan (Tahap III)",
        },
      ],
    },
    {
      idRT: "rt-02",
      namaRT: "RT 02 / RW 01",
      ketuaRT: "Bpk. Agus Rahardjo",
      dusun: "Dusun Krajan",
      totalAnggaranRT: "Rp 56.500.000",
      totalAnggaranNominal: 56500000,
      trenAnggaran5Thn: [48, 50, 52, 54, 56.5],
      kategoriPersen: { bansos: 72, operasional: 18, lainnya: 10 },
      daftarPosAnggaran: [
        {
          id: "ang-201",
          kodeKegiatan: "4.2.01",
          namaKegiatan: "Penyaluran BLT Dana Desa (38 KPM)",
          kategori: "Bantuan Sosial (BLT)",
          sumberDana: "DDS (Dana Desa)",
          paguAnggaran: "Rp 45.600.000",
          realisasi: "Rp 34.200.000",
          statusSiskeudes: "Berjalan (Tahap III)",
        },
        {
          id: "ang-202",
          kodeKegiatan: "4.2.02",
          namaKegiatan: "Insentif Operasional Pengurus RT",
          kategori: "Operasional RT",
          sumberDana: "ADD (Alokasi Dana Desa)",
          paguAnggaran: "Rp 7.400.000",
          realisasi: "Rp 5.550.000",
          statusSiskeudes: "Berjalan (Tahap III)",
        },
      ],
    },
    {
      idRT: "rt-03",
      namaRT: "RT 03 / RW 01",
      ketuaRT: "Bpk. Bambang Sukoco",
      dusun: "Dusun Krajan",
      totalAnggaranRT: "Rp 78.000.000",
      totalAnggaranNominal: 78000000,
      trenAnggaran5Thn: [65, 68, 72, 75, 78],
      kategoriPersen: { bansos: 80, operasional: 12, lainnya: 8 },
      daftarPosAnggaran: [
        {
          id: "ang-301",
          kodeKegiatan: "4.2.01",
          namaKegiatan: "Penyaluran BLT Dana Desa (55 KPM)",
          kategori: "Bantuan Sosial (BLT)",
          sumberDana: "DDS (Dana Desa)",
          paguAnggaran: "Rp 66.000.000",
          realisasi: "Rp 49.500.000",
          statusSiskeudes: "Berjalan (Tahap III)",
        },
        {
          id: "ang-302",
          kodeKegiatan: "4.2.02",
          namaKegiatan: "Insentif Operasional Pendataan & Survei DDK RT",
          kategori: "Operasional RT",
          sumberDana: "ADD (Alokasi Dana Desa)",
          paguAnggaran: "Rp 8.000.000",
          realisasi: "Rp 6.000.000",
          statusSiskeudes: "Berjalan (Tahap III)",
        },
      ],
    },
  ],
};

function DetailAnggaranContent() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";

  const [selectedRTId, setSelectedRTId] = useState<string>("rt-01");
  const [searchQuery, setSearchQuery] = useState("");

  const listRT = useMemo(() => {
    return (
      mockDetailAnggaranPerRT[tahunPeriode] || mockDetailAnggaranPerRT["2026"]
    );
  }, [tahunPeriode]);

  const rtAktif = useMemo(() => {
    return listRT.find((rt) => rt.idRT === selectedRTId) || listRT[0];
  }, [listRT, selectedRTId]);

  // Data Grafik Tren Anggaran 5 Tahun RT Terpilih
  const trendDataRT = {
    labels: ["2022", "2023", "2024", "2025", "2026"],
    datasets: [
      {
        label: `Total Anggaran ${rtAktif.namaRT} (Juta Rp)`,
        data: rtAktif.trenAnggaran5Thn,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.08)",
        pointBackgroundColor: "#2563eb",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
        borderWidth: 2.5,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const trendOptionsRT = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#0f172a",
        bodyColor: "#334155",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (ctx: any) => ` Total Pagu: Rp ${ctx.parsed.y} Juta`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: "#f1f5f9" },
        ticks: {
          stepSize: 10,
          callback: (val: any) => `Rp ${val} Jt`,
        },
      },
    },
  };

  const posAnggaranDisaring = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return rtAktif.daftarPosAnggaran;
    return rtAktif.daftarPosAnggaran.filter(
      (pos) =>
        pos.namaKegiatan.toLowerCase().includes(q) ||
        pos.kodeKegiatan.includes(q) ||
        pos.kategori.toLowerCase().includes(q),
    );
  }, [rtAktif, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased">
      <KadesHeader tahunPeriode={tahunPeriode} setTahunPeriode={() => {}} />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
        {/* NAVIGASI & TITLE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <Link
              href={`/kades/dashboard?tahun=${tahunPeriode}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition mb-2"
            >
              ← Kembali ke Dashboard Kades
            </Link>
            <h2 className="text-xl font-extrabold text-slate-950">
              Detail Alokasi Anggaran Siskeudes Per RT ({tahunPeriode})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih kartu RT di bawah untuk meninjau tren anggaran 5 tahun,
              alokasi per kategori, dan rincian pos kegiatan Siskeudes.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 self-start sm:self-auto">
            📅 Periode: <strong>{tahunPeriode}</strong>
          </span>
        </div>

        {/* 1. SEKSI CARD ANGGARAN PER RT */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {listRT.map((rt) => {
            const isSelected = rt.idRT === selectedRTId;
            return (
              <div
                key={rt.idRT}
                onClick={() => setSelectedRTId(rt.idRT)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? "bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20"
                    : "bg-white border-slate-200/80 hover:border-emerald-400/60 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-200 font-extrabold text-[10px] rounded-md uppercase">
                    WILAYAH RT
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      ✓ Dipilih
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {rt.namaRT}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Ketua RT: <strong>{rt.ketuaRT}</strong> ({rt.dusun})
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Pagu Anggaran RT:
                  </span>
                  <span className="text-base font-black text-emerald-800 font-mono">
                    {rt.totalAnggaranRT}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. SEKSI TREN ANGGARAN 5 TAHUN & KOMPOSISI KATEGORI DANA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* GRAFIK TREN ANGGARAN RT AKTIF */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-950">
                  📈 Tren Pagu Anggaran {rtAktif.namaRT} (5 Tahun Terakhir)
                </h3>
                <p className="text-xs text-slate-500">
                  Perkembangan total pagu anggaran Siskeudes dari tahun 2022
                  hingga {tahunPeriode}.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                2022 - 2026
              </span>
            </div>

            <div className="h-56">
              <Line data={trendDataRT} options={trendOptionsRT as any} />
            </div>
          </div>

          {/* KOMPOSISI KATEGORI ANGGARAN RT */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-950">
                📊 Distribusi Kategori Dana ({rtAktif.namaRT})
              </h3>
              <p className="text-xs text-slate-500">
                Persentase pengalokasian dana desa per sektor.
              </p>
            </div>

            <div className="space-y-3 my-auto">
              {/* Bansos */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">
                    🤝 Bantuan Sosial (BLT)
                  </span>
                  <span className="text-emerald-800">
                    {rtAktif.kategoriPersen.bansos}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${rtAktif.kategoriPersen.bansos}%` }}
                  />
                </div>
              </div>

              {/* Operasional RT */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">
                    📋 Operasional & Pendataan RT
                  </span>
                  <span className="text-blue-800">
                    {rtAktif.kategoriPersen.operasional}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${rtAktif.kategoriPersen.operasional}%` }}
                  />
                </div>
              </div>

              {/* Lainnya */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">
                    💡 Sektor Lainnya & Sanitasi
                  </span>
                  <span className="text-amber-800">
                    {rtAktif.kategoriPersen.lainnya}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${rtAktif.kategoriPersen.lainnya}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-950 font-medium">
              💡 Sebagian besar anggaran di {rtAktif.namaRT} teralokasi untuk{" "}
              <strong>
                Bantuan Sosial BLT ({rtAktif.kategoriPersen.bansos}%)
              </strong>
              .
            </div>
          </div>
        </div>

        {/* 3. TABEL DAFTAR POS ANGGARAN RELEVAN DI RT TERPILIH */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                📋 Daftar Pos Kegiatan & Anggaran Siskeudes — {rtAktif.namaRT}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rincian pos alokasi dana dan status realisasi anggaran
                Siskeudes.
              </p>
            </div>

            <input
              type="text"
              placeholder="Cari kegiatan atau kode Siskeudes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-600 sm:w-72"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="px-5 py-3">No</th>
                  <th className="px-5 py-3">Kode & Nama Kegiatan Siskeudes</th>
                  <th className="px-5 py-3">Kategori Sektor</th>
                  <th className="px-5 py-3">Sumber Dana</th>
                  <th className="px-5 py-3 text-right">Pagu Anggaran</th>
                  <th className="px-5 py-3 text-right">Realisasi (Terpakai)</th>
                  <th className="px-5 py-3 text-center">Status Siskeudes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {posAnggaranDisaring.length > 0 ? (
                  posAnggaranDisaring.map((pos, idx) => (
                    <tr
                      key={pos.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      <td className="px-5 py-3.5 font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">
                          {pos.namaKegiatan}
                        </p>
                        <p className="font-mono text-[10px] text-slate-400">
                          Kode: {pos.kodeKegiatan}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold text-[10px]">
                          {pos.kategori}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-600">
                        {pos.sumberDana}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-900">
                        {pos.paguAnggaran}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-emerald-800">
                        {pos.realisasi}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 font-extrabold text-[10px] rounded-full">
                          ⏳ {pos.statusSiskeudes}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-8 text-center text-slate-400 text-xs"
                    >
                      Tidak ditemukan pos kegiatan anggaran di {rtAktif.namaRT}{" "}
                      untuk pencarian ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DetailAnggaranPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-slate-400">
          Memuat Detail Anggaran...
        </div>
      }
    >
      <DetailAnggaranContent />
    </Suspense>
  );
}
