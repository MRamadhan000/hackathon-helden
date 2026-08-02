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

interface DataKpmRT {
  idRT: string;
  namaRT: string;
  ketuaRT: string;
  dusun: string;
  totalKpm: number;
  totalAnggaranRtBln: string;
  trenKpm5Thn: number[]; // 2022 - 2026
  daftarWargaKpm: {
    id: string;
    nik: string;
    nama: string;
    skorDDK: number;
    jenisBantuan: string;
    nominalPerBulan: string;
    noSKKades: string;
    statusBansos: "Aktif Penerima" | "Penerima Baru";
  }[];
}

const mockDetailKpmPerRT: Record<string, DataKpmRT[]> = {
  "2026": [
    {
      idRT: "rt-01",
      namaRT: "RT 01 / RW 01",
      ketuaRT: "Bpk. Heri Setiawan",
      dusun: "Dusun Krajan",
      totalKpm: 42,
      totalAnggaranRtBln: "Rp 12.600.000 / Bln",
      trenKpm5Thn: [44, 46, 48, 45, 42],
      daftarWargaKpm: [
        {
          id: "kpm-101",
          nik: "3507019876540002",
          nama: "Siti Aminah",
          skorDDK: 80,
          jenisBantuan: "BLT Dana Desa",
          nominalPerBulan: "Rp 300.000",
          noSKKades: "SK/DSO/2026/003",
          statusBansos: "Aktif Penerima",
        },
        {
          id: "kpm-102",
          nik: "3507017766550004",
          nama: "Supardi",
          skorDDK: 76,
          jenisBantuan: "BLT Dana Desa",
          nominalPerBulan: "Rp 300.000",
          noSKKades: "SK/DSO/2026/003",
          statusBansos: "Aktif Penerima",
        },
      ],
    },
    {
      idRT: "rt-02",
      namaRT: "RT 02 / RW 01",
      ketuaRT: "Bpk. Agus Rahardjo",
      dusun: "Dusun Krajan",
      totalKpm: 38,
      totalAnggaranRtBln: "Rp 11.400.000 / Bln",
      trenKpm5Thn: [36, 39, 42, 40, 38],
      daftarWargaKpm: [
        {
          id: "kpm-201",
          nik: "3507016677880009",
          nama: "Martono",
          skorDDK: 90,
          jenisBantuan: "BLT Dana Desa",
          nominalPerBulan: "Rp 300.000",
          noSKKades: "SK/DSO/2026/003",
          statusBansos: "Aktif Penerima",
        },
        {
          id: "kpm-202",
          nik: "3507015554440003",
          nama: "Sujono",
          skorDDK: 70,
          jenisBantuan: "BLT Dana Desa",
          nominalPerBulan: "Rp 300.000",
          noSKKades: "SK/DSO/2026/003",
          statusBansos: "Aktif Penerima",
        },
      ],
    },
    {
      idRT: "rt-03",
      namaRT: "RT 03 / RW 01",
      ketuaRT: "Bpk. Bambang Sukoco",
      dusun: "Dusun Krajan",
      totalKpm: 55,
      totalAnggaranRtBln: "Rp 16.500.000 / Bln",
      trenKpm5Thn: [54, 58, 62, 60, 55],
      daftarWargaKpm: [
        {
          id: "kpm-301",
          nik: "3507011234560001",
          nama: "Budi Santoso",
          skorDDK: 85,
          jenisBantuan: "BLT Dana Desa",
          nominalPerBulan: "Rp 300.000",
          noSKKades: "SK/DSO/2026/004",
          statusBansos: "Penerima Baru",
        },
        {
          id: "kpm-302",
          nik: "3507011122330005",
          nama: "Slamet Riyadi",
          skorDDK: 89,
          jenisBantuan: "BLT Dana Desa",
          nominalPerBulan: "Rp 300.000",
          noSKKades: "SK/DSO/2026/004",
          statusBansos: "Penerima Baru",
        },
      ],
    },
  ],
};

function DetailKpmContent() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";

  const [selectedRTId, setSelectedRTId] = useState<string>("rt-01");
  const [searchQuery, setSearchQuery] = useState("");

  const listRT = useMemo(() => {
    return mockDetailKpmPerRT[tahunPeriode] || mockDetailKpmPerRT["2026"];
  }, [tahunPeriode]);

  const rtAktif = useMemo(() => {
    return listRT.find((rt) => rt.idRT === selectedRTId) || listRT[0];
  }, [listRT, selectedRTId]);

  // Data Grafik Tren KPM 5 Tahun RT Terpilih
  const trendDataRT = {
    labels: ["2022", "2023", "2024", "2025", "2026"],
    datasets: [
      {
        label: `Jumlah Penerima KPM ${rtAktif.namaRT}`,
        data: rtAktif.trenKpm5Thn,
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
          label: (ctx: any) => ` Total: ${ctx.parsed.y} KPM Penerima`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: "#f1f5f9" },
        ticks: { stepSize: 10 },
      },
    },
  };

  const wargaDisaring = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return rtAktif.daftarWargaKpm;
    return rtAktif.daftarWargaKpm.filter(
      (w) => w.nama.toLowerCase().includes(q) || w.nik.includes(q),
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition mb-2"
            >
              ← Kembali ke Dashboard Kades
            </Link>
            <h2 className="text-xl font-extrabold text-slate-950">
              Detail Data Penerima KPM Bansos Per RT ({tahunPeriode})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih kartu RT di bawah untuk meninjau tren penerima KPM 5 tahun
              dan daftar warga penerima bantuan.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 self-start sm:self-auto">
            📅 Periode: <strong>{tahunPeriode}</strong>
          </span>
        </div>

        {/* 1. SEKSI CARD KPM PER RT */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {listRT.map((rt) => {
            const isSelected = rt.idRT === selectedRTId;
            return (
              <div
                key={rt.idRT}
                onClick={() => setSelectedRTId(rt.idRT)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? "bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20"
                    : "bg-white border-slate-200/80 hover:border-blue-400/60 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-900 border border-blue-100 font-extrabold text-[10px] rounded-md uppercase">
                    WILAYAH RT
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
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
                    Total Penerima KPM:
                  </span>
                  <span className="text-lg font-black text-blue-900 font-mono">
                    {rt.totalKpm}{" "}
                    <span className="text-xs font-normal text-slate-500">
                      Keluarga
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. SEKSI GRAFIK TREN KPM 5 TAHUN RT TERPILIH */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-950">
                📈 Tren Penerima KPM Bansos {rtAktif.namaRT} (5 Tahun Terakhir)
              </h3>
              <p className="text-xs text-slate-500">
                Jumlah keluarga penerima manfaat yang terdaftar resmi dari tahun
                2022 hingga {tahunPeriode}.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 block">
                Total Alokasi: {rtAktif.totalAnggaranRtBln}
              </span>
            </div>
          </div>

          <div className="h-56">
            <Line data={trendDataRT} options={trendOptionsRT as any} />
          </div>
        </div>

        {/* 3. TABEL DAFTAR WARGA KPM RELEVAN DI RT TERPILIH */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                📋 Daftar Penerima Manfaat Bansos — {rtAktif.namaRT}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar warga penerima bantuan yang telah disahkan melalui SK
                Kepala Desa.
              </p>
            </div>

            <input
              type="text"
              placeholder="Cari nama KPM atau NIK di RT ini..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 sm:w-72"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="px-5 py-3">No</th>
                  <th className="px-5 py-3">Nama KPM & NIK</th>
                  <th className="px-5 py-3 text-center">Skor DDK</th>
                  <th className="px-5 py-3">Program Bantuan</th>
                  <th className="px-5 py-3">Dasar Hukum (SK Kades)</th>
                  <th className="px-5 py-3 text-right">Nominal Alokasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {wargaDisaring.length > 0 ? (
                  wargaDisaring.map((warga, idx) => (
                    <tr
                      key={warga.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      <td className="px-5 py-3.5 font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">{warga.nama}</p>
                        <p className="font-mono text-[10px] text-slate-400">
                          NIK: {warga.nik}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-bold text-amber-900">
                        {warga.skorDDK} Pts
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold text-[10px]">
                          {warga.jenisBantuan}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-600">
                        {warga.noSKKades}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-900">
                        {warga.nominalPerBulan} / Bln
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-slate-400 text-xs"
                    >
                      Tidak ditemukan data KPM di {rtAktif.namaRT} untuk
                      pencarian ini.
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

export default function DetailKpmPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-slate-400">
          Memuat Detail KPM...
        </div>
      }
    >
      <DetailKpmContent />
    </Suspense>
  );
}
