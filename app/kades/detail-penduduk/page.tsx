"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import KadesHeader from "@/components/kades/KadesHeader";
import { getDemografiPendudukPerRT } from "@/services/core/demografi.service";
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

// Data Struktur RT
interface DataRT {
  idRT: string;
  namaRT: string;
  ketuaRT: string;
  dusun: string;
  totalWarga: number;
  komposisiUsia: {
    anak: number; // 0-17 thn
    produktif: number; // 18-59 thn
    lansia: number; // 60+ thn
  };
  trenPenduduk5Thn: number[]; // 2022, 2023, 2024, 2025, 2026
  daftarWarga: {
    id: string;
    nik: string;
    nama: string;
    jenisKelamin: "L" | "P";
    tempatLahir: string;
    tanggalLahir: string;
    kategoriUsia: "Anak" | "Produktif" | "Lansia";
    statusPenduduk: "Tetap" | "Warga Baru";
    dukcapil: "Terverifikasi" | "Pending";
  }[];
}

const mockDetailPendudukPerRT: Record<string, DataRT[]> = {
  "2026": [
    {
      idRT: "rt-01",
      namaRT: "RT 01 / RW 01",
      ketuaRT: "Bpk. Heri Setiawan",
      dusun: "Dusun Krajan",
      totalWarga: 680,
      komposisiUsia: { anak: 20, produktif: 65, lansia: 15 },
      trenPenduduk5Thn: [620, 635, 650, 665, 680],
      daftarWarga: [
        {
          id: "w-101",
          nik: "3507019876540002",
          nama: "Siti Aminah",
          jenisKelamin: "P",
          tempatLahir: "Kota Surabaya",
          tanggalLahir: "1958-08-24",
          kategoriUsia: "Lansia",
          statusPenduduk: "Tetap",
          dukcapil: "Terverifikasi",
        },
        {
          id: "w-102",
          nik: "3507017766550004",
          nama: "Supardi",
          jenisKelamin: "L",
          tempatLahir: "Kab. Malang",
          tanggalLahir: "1970-05-10",
          kategoriUsia: "Produktif",
          statusPenduduk: "Tetap",
          dukcapil: "Terverifikasi",
        },
      ],
    },
    {
      idRT: "rt-02",
      namaRT: "RT 02 / RW 01",
      ketuaRT: "Bpk. Agus Rahardjo",
      dusun: "Dusun Krajan",
      totalWarga: 620,
      komposisiUsia: { anak: 25, produktif: 60, lansia: 15 },
      trenPenduduk5Thn: [580, 590, 600, 610, 620],
      daftarWarga: [
        {
          id: "w-201",
          nik: "3507012010920006",
          nama: "Rian Hidayat",
          jenisKelamin: "L",
          tempatLahir: "Kota Malang",
          tanggalLahir: "1992-10-20",
          kategoriUsia: "Produktif",
          statusPenduduk: "Warga Baru",
          dukcapil: "Terverifikasi",
        },
        {
          id: "w-202",
          nik: "3507016677880009",
          nama: "Martono",
          jenisKelamin: "L",
          tempatLahir: "Kab. Blitar",
          tanggalLahir: "1965-01-12",
          kategoriUsia: "Produktif",
          statusPenduduk: "Tetap",
          dukcapil: "Terverifikasi",
        },
      ],
    },
    {
      idRT: "rt-03",
      namaRT: "RT 03 / RW 01",
      ketuaRT: "Bpk. Bambang Sukoco",
      dusun: "Dusun Krajan",
      totalWarga: 750,
      komposisiUsia: { anak: 18, produktif: 67, lansia: 15 },
      trenPenduduk5Thn: [690, 705, 720, 735, 750],
      daftarWarga: [
        {
          id: "w-301",
          nik: "3507011234560001",
          nama: "Budi Santoso",
          jenisKelamin: "L",
          tempatLahir: "Kab. Malang",
          tanggalLahir: "1985-05-12",
          kategoriUsia: "Produktif",
          statusPenduduk: "Tetap",
          dukcapil: "Terverifikasi",
        },
        {
          id: "w-302",
          nik: "3507011122330005",
          nama: "Slamet Riyadi",
          jenisKelamin: "L",
          tempatLahir: "Kab. Kediri",
          tanggalLahir: "1978-11-04",
          kategoriUsia: "Produktif",
          statusPenduduk: "Tetap",
          dukcapil: "Terverifikasi",
        },
      ],
    },
  ],
};

function DetailPendudukContent() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";

  const [listRT, setListRT] = useState<DataRT[]>([]);
  const [selectedRTId, setSelectedRTId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data real dari backend
  useEffect(() => {
    setLoading(true);
    setError(null);
    getDemografiPendudukPerRT(tahunPeriode)
      .then((data) => {
        setListRT(data);
        if (data.length > 0) {
          setSelectedRTId(data[0].idRT);
        }
      })
      .catch((err) => {
        setError(err.message || "Gagal memuat data demografi");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tahunPeriode]);

  const rtAktif = useMemo(() => {
    if (listRT.length === 0) return null;
    return listRT.find((rt) => rt.idRT === selectedRTId) || listRT[0];
  }, [listRT, selectedRTId]);

  // Data Grafik Tren RT Terpilih
  const trendDataRT = useMemo(() => {
    if (!rtAktif) return { labels: [], datasets: [] };
    return {
      labels: ["2022", "2023", "2024", "2025", "2026"],
      datasets: [
        {
          label: `Pertumbuhan Penduduk ${rtAktif.namaRT}`,
          data: rtAktif.trenPenduduk5Thn,
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
  }, [rtAktif]);

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
          label: (ctx: any) => ` Total: ${ctx.parsed.y} Jiwa`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: "#f1f5f9" },
        ticks: { stepSize: 20 },
      },
    },
  };

  const wargaDisaring = useMemo(() => {
    if (!rtAktif) return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return rtAktif.daftarWarga;
    return rtAktif.daftarWarga.filter(
      (w) => w.nama.toLowerCase().includes(q) || w.nik.includes(q),
    );
  }, [rtAktif, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased flex flex-col">
        <KadesHeader tahunPeriode={tahunPeriode} setTahunPeriode={() => {}} />
        <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-500 animate-pulse">Menghitung sebaran data RT...</p>
        </div>
      </div>
    );
  }

  if (error || listRT.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased flex flex-col">
        <KadesHeader tahunPeriode={tahunPeriode} setTahunPeriode={() => {}} />
        <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-4 text-center max-w-md mx-auto px-6">
          <p className="text-3xl">⚠️</p>
          <h3 className="text-base font-extrabold text-slate-900">Gagal Memuat Sebaran RT</h3>
          <p className="text-xs text-slate-500">{error || "Belum ada wilayah RT yang terdaftar di database."}</p>
          <Link href={`/kades/dashboard?tahun=${tahunPeriode}`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Fallback safety (TypeScript assertion)
  if (!rtAktif) return null;

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
              Detail Sebaran Data Penduduk Per RT ({tahunPeriode})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih kartu RT di bawah untuk meninjau tren pertumbuhan, komposisi
              usia, dan daftar warga.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 self-start sm:self-auto">
            📅 Periode: <strong>{tahunPeriode}</strong>
          </span>
        </div>

        {/* 1. SEKSI CARD PER RT */}
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
                    Total Penduduk:
                  </span>
                  <span className="text-lg font-black text-blue-900 font-mono">
                    {rt.totalWarga}{" "}
                    <span className="text-xs font-normal text-slate-500">
                      Jiwa
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. ANALISIS WILAYAH RT TERPILIH (GRAFIK 5 TAHUN & KOMPOSISI USIA) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* GRAFIK TREN 5 TAHUN RT AKTIF */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-950">
                  📈 Tren Pertumbuhan Penduduk {rtAktif.namaRT} (5 Tahun
                  Terakhir)
                </h3>
                <p className="text-xs text-slate-500">
                  Perkembangan jumlah jiwa terdata dari tahun 2022 hingga{" "}
                  {tahunPeriode}.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                2022 - 2026
              </span>
            </div>

            <div className="h-56">
              <Line data={trendDataRT} options={trendOptionsRT as any} />
            </div>
          </div>

          {/* KOMPOSISI KATEGORI USIA WARGA */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-950">
                📊 Komposisi Usia Warga ({rtAktif.namaRT})
              </h3>
              <p className="text-xs text-slate-500">
                Demografi penduduk berdasarkan kelompok umur.
              </p>
            </div>

            <div className="space-y-3 my-auto">
              {/* Usia Dini & Anak */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">
                    👶 Anak & Remaja (0-17 Thn)
                  </span>
                  <span className="text-blue-900">
                    {rtAktif.komposisiUsia.anak}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{ width: `${rtAktif.komposisiUsia.anak}%` }}
                  />
                </div>
              </div>

              {/* Usia Produktif */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">
                    💼 Usia Produktif (18-59 Thn)
                  </span>
                  <span className="text-emerald-900">
                    {rtAktif.komposisiUsia.produktif}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${rtAktif.komposisiUsia.produktif}%` }}
                  />
                </div>
              </div>

              {/* Lansia */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">
                    🧓 Lansia & Rentan (≥ 60 Thn)
                  </span>
                  <span className="text-amber-900">
                    {rtAktif.komposisiUsia.lansia}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${rtAktif.komposisiUsia.lansia}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 font-medium">
              💡 Mayoritas penduduk di {rtAktif.namaRT} berada dalam kategori{" "}
              <strong>
                Usia Produktif ({rtAktif.komposisiUsia.produktif}%)
              </strong>
              .
            </div>
          </div>
        </div>

        {/* 3. TABEL DAFTAR WARGA RELEVAN DI RT TERPILIH */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                📋 Daftar Master Warga Terdata — {rtAktif.namaRT}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verifikasi identitas kependudukan hasil survei dan validasi
                Ketua RT {rtAktif.ketuaRT}.
              </p>
            </div>

            <input
              type="text"
              placeholder="Cari nama atau NIK warga di RT ini..."
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
                  <th className="px-5 py-3">Nama Lengkap & NIK</th>
                  <th className="px-5 py-3">TTL & JK</th>
                  <th className="px-5 py-3">Kategori Usia</th>
                  <th className="px-5 py-3">Status Domisili</th>
                  <th className="px-5 py-3 text-right">Verifikasi Dukcapil</th>
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
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-slate-700">
                          {warga.tempatLahir}, {warga.tanggalLahir}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold">
                          JK:{" "}
                          {warga.jenisKelamin === "L"
                            ? "Laki-Laki"
                            : "Perempuan"}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold text-[10px]">
                          {warga.kategoriUsia}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${
                            warga.statusPenduduk === "Tetap"
                              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                              : "bg-blue-50 text-blue-900 border border-blue-200"
                          }`}
                        >
                          {warga.statusPenduduk}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-[10px] rounded-full">
                          ✓ {warga.dukcapil}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-slate-400 text-xs"
                    >
                      Tidak ditemukan data warga di {rtAktif.namaRT} untuk
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

export default function DetailPendudukPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-slate-400">
          Memuat Detail Penduduk...
        </div>
      }
    >
      <DetailPendudukContent />
    </Suspense>
  );
}
