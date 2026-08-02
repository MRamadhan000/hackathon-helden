"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import KadesHeader from "@/components/kades/KadesHeader";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface LogPenyaluran {
  id: string;
  tanggalJam: string;
  tahapBansos: string;
  kategori: "Bantuan Sosial (BLT)" | "Operasional RT" | "Program Lainnya";
  kpmTerlayani: number;
  nominalTersalurkan: string;
  metodePenyaluran: "Tunai (Kantor Desa)" | "Transfer Bank";
  statusSiskeudes: "Berita Acara Sah" | "Pending SPJ";
}

interface DataRealisasiRT {
  idRT: string;
  namaRT: string;
  ketuaRT: string;
  dusun: string;
  totalRealisasiRT: string;
  persenSerapan: number;
  pagu5Thn: number[]; // 2022 - 2026 (Juta Rp)
  realisasi5Thn: number[]; // 2022 - 2026 (Juta Rp)
  kategoriRealisasi: {
    bansos: string;
    operasional: string;
    lainnya: string;
  };
  logPenyaluran: LogPenyaluran[];
}

const mockDetailRealisasiPerRT: Record<string, DataRealisasiRT[]> = {
  "2026": [
    {
      idRT: "rt-01",
      namaRT: "RT 01 / RW 01",
      ketuaRT: "Bpk. Heri Setiawan",
      dusun: "Dusun Krajan",
      totalRealisasiRT: "Rp 46.500.000",
      persenSerapan: 75,
      pagu5Thn: [52, 55, 58, 60, 62],
      realisasi5Thn: [52, 55, 58, 60, 46.5],
      kategoriRealisasi: {
        bansos: "Rp 37.800.000",
        operasional: "Rp 5.700.000",
        lainnya: "Rp 3.000.000",
      },
      logPenyaluran: [
        {
          id: "log-101",
          tanggalJam: "10/08/2026 • 09:30 WIB",
          tahapBansos: "BLT Dana Desa Tahap III (Juli - Agustus)",
          kategori: "Bantuan Sosial (BLT)",
          kpmTerlayani: 42,
          nominalTersalurkan: "Rp 12.600.000",
          metodePenyaluran: "Tunai (Kantor Desa)",
          statusSiskeudes: "Berita Acara Sah",
        },
        {
          id: "log-102",
          tanggalJam: "15/06/2026 • 14:00 WIB",
          tahapBansos: "BLT Dana Desa Tahap II (Mei - Juni)",
          kategori: "Bantuan Sosial (BLT)",
          kpmTerlayani: 42,
          nominalTersalurkan: "Rp 12.600.000",
          metodePenyaluran: "Tunai (Kantor Desa)",
          statusSiskeudes: "Berita Acara Sah",
        },
        {
          id: "log-103",
          tanggalJam: "02/05/2026 • 11:15 WIB",
          tahapBansos: "Operasional Pendataan DDK RT 01",
          kategori: "Operasional RT",
          kpmTerlayani: 0,
          nominalTersalurkan: "Rp 1.900.000",
          metodePenyaluran: "Transfer Bank",
          statusSiskeudes: "Berita Acara Sah",
        },
      ],
    },
    {
      idRT: "rt-02",
      namaRT: "RT 02 / RW 01",
      ketuaRT: "Bpk. Agus Rahardjo",
      dusun: "Dusun Krajan",
      totalRealisasiRT: "Rp 39.750.000",
      persenSerapan: 70,
      pagu5Thn: [48, 50, 52, 54, 56.5],
      realisasi5Thn: [48, 50, 52, 54, 39.75],
      kategoriRealisasi: {
        bansos: "Rp 34.200.000",
        operasional: "Rp 5.550.000",
        lainnya: "Rp 0",
      },
      logPenyaluran: [
        {
          id: "log-201",
          tanggalJam: "10/08/2026 • 10:45 WIB",
          tahapBansos: "BLT Dana Desa Tahap III (Juli - Agustus)",
          kategori: "Bantuan Sosial (BLT)",
          kpmTerlayani: 38,
          nominalTersalurkan: "Rp 11.400.000",
          metodePenyaluran: "Tunai (Kantor Desa)",
          statusSiskeudes: "Berita Acara Sah",
        },
      ],
    },
    {
      idRT: "rt-03",
      namaRT: "RT 03 / RW 01",
      ketuaRT: "Bpk. Bambang Sukoco",
      dusun: "Dusun Krajan",
      totalRealisasiRT: "Rp 55.500.000",
      persenSerapan: 71,
      pagu5Thn: [65, 68, 72, 75, 78],
      realisasi5Thn: [65, 68, 72, 75, 55.5],
      kategoriRealisasi: {
        bansos: "Rp 49.500.000",
        operasional: "Rp 6.000.000",
        lainnya: "Rp 0",
      },
      logPenyaluran: [
        {
          id: "log-301",
          tanggalJam: "10/08/2026 • 13:15 WIB",
          tahapBansos: "BLT Dana Desa Tahap III (Juli - Agustus)",
          kategori: "Bantuan Sosial (BLT)",
          kpmTerlayani: 55,
          nominalTersalurkan: "Rp 16.500.000",
          metodePenyaluran: "Tunai (Kantor Desa)",
          statusSiskeudes: "Berita Acara Sah",
        },
      ],
    },
  ],
};

function DetailRealisasiContent() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";

  const [selectedRTId, setSelectedRTId] = useState<string>("rt-01");
  const [searchQuery, setSearchQuery] = useState("");

  const listRT = useMemo(() => {
    return (
      mockDetailRealisasiPerRT[tahunPeriode] || mockDetailRealisasiPerRT["2026"]
    );
  }, [tahunPeriode]);

  const rtAktif = useMemo(() => {
    return listRT.find((rt) => rt.idRT === selectedRTId) || listRT[0];
  }, [listRT, selectedRTId]);

  // Data Vertikal Bar Chart Komparasi (Pagu vs Realisasi 5 Tahun)
  const barChartDataRT = {
    labels: ["2022", "2023", "2024", "2025", "2026"],
    datasets: [
      {
        label: "Pagu Anggaran (Juta Rp)",
        data: rtAktif.pagu5Thn,
        backgroundColor: "#93c5fd", // Blue-300
        borderColor: "#2563eb",
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: "Realisasi Terpakai (Juta Rp)",
        data: rtAktif.realisasi5Thn,
        backgroundColor: "#10b981", // Emerald-500
        borderColor: "#047857",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const barChartOptionsRT = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          font: { size: 11, weight: "bold" as const },
          usePointStyle: true,
          boxWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#0f172a",
        bodyColor: "#334155",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (ctx: any) => ` ${ctx.dataset.label}: Rp ${ctx.parsed.y} Juta`,
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

  const logDisaring = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return rtAktif.logPenyaluran;
    return rtAktif.logPenyaluran.filter(
      (log) =>
        log.tahapBansos.toLowerCase().includes(q) ||
        log.kategori.toLowerCase().includes(q) ||
        log.tanggalJam.toLowerCase().includes(q),
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition mb-2"
            >
              ← Kembali ke Dashboard Kades
            </Link>
            <h2 className="text-xl font-extrabold text-slate-950">
              Detail Realisasi & Penyaluran Anggaran Per RT ({tahunPeriode})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih kartu RT di bawah untuk melihat bar chart perbandingan Pagu
              vs Realisasi 5 tahun, alokasi sektor, dan log waktu penyaluran.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 self-start sm:self-auto">
            📅 Periode: <strong>{tahunPeriode}</strong>
          </span>
        </div>

        {/* 1. SEKSI CARD REALISASI PER RT */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {listRT.map((rt) => {
            const isSelected = rt.idRT === selectedRTId;
            return (
              <div
                key={rt.idRT}
                onClick={() => setSelectedRTId(rt.idRT)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? "bg-white border-amber-600 shadow-md ring-2 ring-amber-500/20"
                    : "bg-white border-slate-200/80 hover:border-amber-400/60 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 font-extrabold text-[10px] rounded-md uppercase">
                    WILAYAH RT
                  </span>
                  <span className="text-xs font-black text-amber-900 font-mono bg-amber-100 px-2 py-0.5 rounded-md">
                    {rt.persenSerapan}% Serapan
                  </span>
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
                    Realisasi Terpakai:
                  </span>
                  <span className="text-base font-black text-emerald-800 font-mono">
                    {rt.totalRealisasiRT}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. BAR CHART KOMPARASI (PAGU VS REALISASI) & RINCIAN KATEGORI TERPAKAI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* VERTIKAL BAR CHART 5 TAHUN */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-950">
                  📊 Perbandingan Pagu vs Realisasi {rtAktif.namaRT} (5 Tahun)
                </h3>
                <p className="text-xs text-slate-500">
                  Grafik batang vertikal perbandingan daya serap anggaran per
                  tahun.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                2022 - 2026
              </span>
            </div>

            <div className="h-60">
              <Bar data={barChartDataRT} options={barChartOptionsRT as any} />
            </div>
          </div>

          {/* REALISASI KATEGORI SANKSI/SEKTOR */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-950">
                💰 Realisasi Per Sektor ({rtAktif.namaRT})
              </h3>
              <p className="text-xs text-slate-500">
                Nominal dana yang telah tersalurkan secara riil.
              </p>
            </div>

            <div className="space-y-3 my-auto text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Bantuan Sosial (BLT)
                  </span>
                  <strong className="text-emerald-900 text-sm font-mono">
                    {rtAktif.kategoriRealisasi.bansos}
                  </strong>
                </div>
                <span className="text-xs">🤝</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Operasional & Pendataan RT
                  </span>
                  <strong className="text-blue-900 text-sm font-mono">
                    {rtAktif.kategoriRealisasi.operasional}
                  </strong>
                </div>
                <span className="text-xs">📋</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Sektor Lainnya & Sanitasi
                  </span>
                  <strong className="text-amber-900 text-sm font-mono">
                    {rtAktif.kategoriRealisasi.lainnya}
                  </strong>
                </div>
                <span className="text-xs">💡</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 font-medium">
              💡 Tingkat serapan anggaran di {rtAktif.namaRT} saat ini mencapai{" "}
              <strong>{rtAktif.persenSerapan}%</strong> dari total pagu.
            </div>
          </div>
        </div>

        {/* 3. LOG MONITORING WAKTU PENYALURAN DI RT TERPILIH */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                ⏱️ Log Audit Waktu Penyaluran Bantuan & Dana — {rtAktif.namaRT}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Riwayat pencatatan waktu penyaluran dana sosial beserta jumlah
                KPM terlayani.
              </p>
            </div>

            <input
              type="text"
              placeholder="Cari tahap bantuan atau tanggal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-600 sm:w-72"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="px-5 py-3">No</th>
                  <th className="px-5 py-3">Waktu Penyaluran</th>
                  <th className="px-5 py-3">Tahap & Deskripsi Bantuan</th>
                  <th className="px-5 py-3">Kategori Pos</th>
                  <th className="px-5 py-3 text-center">KPM Terlayani</th>
                  <th className="px-5 py-3 text-right">Nominal Tersalurkan</th>
                  <th className="px-5 py-3 text-center">Status Berita Acara</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {logDisaring.length > 0 ? (
                  logDisaring.map((log, idx) => (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      <td className="px-5 py-3.5 font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[11px] font-bold text-slate-900 whitespace-nowrap">
                        {log.tanggalJam}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">
                          {log.tahapBansos}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          Metode: {log.metodePenyaluran}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold text-[10px]">
                          {log.kategori}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-bold text-blue-900">
                        {log.kpmTerlayani > 0
                          ? `${log.kpmTerlayani} KPM`
                          : "N/A"}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-emerald-800 whitespace-nowrap">
                        {log.nominalTersalurkan}
                      </td>
                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 font-extrabold text-[10px] rounded-full">
                          ✓ {log.statusSiskeudes}
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
                      Tidak ditemukan riwayat penyaluran dana di{" "}
                      {rtAktif.namaRT} untuk pencarian ini.
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

export default function DetailRealisasiPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-slate-400">
          Memuat Detail Realisasi...
        </div>
      }
    >
      <DetailRealisasiContent />
    </Suspense>
  );
}
