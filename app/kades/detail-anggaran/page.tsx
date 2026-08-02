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
import {
  getBansosPrograms,
  getPenerimaBansosApproved,
  formatRupiah,
  type BansosProgram,
  type PenerimaBansos,
} from "@/services/operational/bansos.service";

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

function DetailAnggaranContent() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";

  const [programs, setPrograms] = useState<BansosProgram[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>("");
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  const [penerima, setPenerima] = useState<PenerimaBansos[]>([]);
  const [loadingPenerima, setLoadingPenerima] = useState(false);

  const [selectedRTId, setSelectedRTId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Programs
  useEffect(() => {
    setLoadingPrograms(true);
    getBansosPrograms()
      .then((data) => {
        setPrograms(data);
        if (data.length > 0) {
          setSelectedProgramId(data[0].id);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoadingPrograms(false));
  }, []);

  // Fetch Penerima based on selected program
  useEffect(() => {
    if (!selectedProgramId) {
      setPenerima([]);
      return;
    }
    setLoadingPenerima(true);
    getPenerimaBansosApproved(selectedProgramId)
      .then((data) => {
        setPenerima(data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoadingPenerima(false));
  }, [selectedProgramId]);

  // Transform flat penerima data into grouped by RT format
  const listRT = useMemo<DataAnggaranRT[]>(() => {
    if (!penerima || penerima.length === 0) return [];
    
    const program = programs.find((p) => p.id === selectedProgramId);
    const programName = program?.nama || "Bantuan Sosial";

    const groups: Record<string, PenerimaBansos[]> = {};
    penerima.forEach((p) => {
      const area = p.areaLocationNama || "Wilayah Belum Ditentukan";
      if (!groups[area]) groups[area] = [];
      groups[area].push(p);
    });

    const result = Object.entries(groups).map(([area, wargaList], index) => {
      const totalNominal = wargaList.reduce((acc, curr) => acc + (curr.nominal || 0), 0);
      
      // Simulasi Tren Anggaran (Juta Rp)
      const baseJuta = totalNominal / 1000000;
      const trenAnggaran5Thn = [
        Math.max(0, baseJuta - 10),
        Math.max(0, baseJuta - 5),
        baseJuta - 2,
        baseJuta - 1,
        baseJuta
      ];

      return {
        idRT: area,
        namaRT: area,
        ketuaRT: "-",
        dusun: "-",
        totalAnggaranRT: formatRupiah(totalNominal),
        totalAnggaranNominal: totalNominal,
        trenAnggaran5Thn,
        kategoriPersen: { bansos: 100, operasional: 0, lainnya: 0 },
        daftarPosAnggaran: [
          {
            id: `ang-bansos-${index}`,
            kodeKegiatan: "4.2.01",
            namaKegiatan: `Penyaluran ${programName} (${wargaList.length} KPM)`,
            kategori: "Bantuan Sosial (BLT)" as const,
            sumberDana: "Alokasi Program",
            paguAnggaran: formatRupiah(totalNominal),
            realisasi: formatRupiah(totalNominal),
            statusSiskeudes: "Berjalan (Tahap III)" as const,
          }
        ]
      };
    });
    
    return result;
  }, [penerima, programs, selectedProgramId]);

  // Set default selected RT
  useEffect(() => {
    if (listRT.length > 0 && !listRT.find((rt) => rt.idRT === selectedRTId)) {
      setSelectedRTId(listRT[0].idRT);
    }
  }, [listRT, selectedRTId]);

  const rtAktif = useMemo(() => {
    return listRT.find((rt) => rt.idRT === selectedRTId) || listRT[0];
  }, [listRT, selectedRTId]);

  // Data Grafik Tren Anggaran 5 Tahun RT Terpilih
  const trendDataRT = {
    labels: ["2022", "2023", "2024", "2025", "2026"],
    datasets: [
      {
        label: `Total Anggaran ${rtAktif?.namaRT || ""} (Juta Rp)`,
        data: rtAktif?.trenAnggaran5Thn || [],
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
          label: (ctx: any) => ` Total Pagu: Rp ${ctx.parsed.y.toFixed(1)} Juta`,
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
    if (!rtAktif) return [];
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
              Detail Alokasi Anggaran Bansos Per Wilayah
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih program untuk meninjau distribusi anggaran bansos berdasarkan data penerima di tiap wilayah.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 self-start sm:self-auto">
            📅 Periode: <strong>{tahunPeriode}</strong>
          </span>
        </div>

        {/* PROGRAM SELECTOR */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Program Bansos:</label>
          {loadingPrograms ? (
            <div className="text-xs text-slate-500 animate-pulse">Memuat daftar program...</div>
          ) : (
            <select
              value={selectedProgramId}
              onChange={(e) => setSelectedProgramId(e.target.value)}
              className="w-full sm:w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            >
              {programs.length === 0 && <option value="">Belum ada program</option>}
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </select>
          )}
        </div>

        {loadingPenerima ? (
          <div className="py-12 text-center text-slate-500 text-sm font-medium animate-pulse">
            Mengambil alokasi anggaran...
          </div>
        ) : listRT.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
            <div className="text-4xl mb-3">💸</div>
            <p className="text-sm font-bold text-slate-600">Belum ada alokasi anggaran</p>
            <p className="text-xs text-slate-400 mt-1">Pastikan ada data survei kelayakan yang berstatus APPROVED untuk program ini.</p>
          </div>
        ) : (
          <>
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
                        WILAYAH
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          ✓ Dipilih
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 truncate">
                        {rt.namaRT}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Alokasi Program:
                      </span>
                      <span className="text-base font-black text-emerald-800 font-mono">
                        {rt.totalAnggaranRT}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {rtAktif && (
              <>
                {/* 2. SEKSI TREN ANGGARAN 5 TAHUN & KOMPOSISI KATEGORI DANA */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* GRAFIK TREN ANGGARAN RT AKTIF */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-950">
                          📈 Tren Alokasi Bansos {rtAktif.namaRT} (Simulasi)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Perkiraan perkembangan total alokasi program dalam 5 tahun terakhir.
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
                        Persentase pengalokasian dana bansos.
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
                            📋 Operasional & Lainnya
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
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-950 font-medium">
                      💡 Seluruh anggaran untuk program ini teralokasi langsung ke penerima manfaat sebesar{" "}
                      <strong>
                        {rtAktif.totalAnggaranRT}
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
                        📋 Rincian Alokasi Kegiatan — {rtAktif.namaRT}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Rincian pos alokasi dana dan status realisasi anggaran.
                      </p>
                    </div>

                    <input
                      type="text"
                      placeholder="Cari kegiatan atau kode..."
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
                          <th className="px-5 py-3">Kode & Nama Kegiatan</th>
                          <th className="px-5 py-3">Kategori Sektor</th>
                          <th className="px-5 py-3">Sumber Dana</th>
                          <th className="px-5 py-3 text-right">Pagu Anggaran</th>
                          <th className="px-5 py-3 text-right">Realisasi (Terpakai)</th>
                          <th className="px-5 py-3 text-center">Status</th>
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
              </>
            )}
          </>
        )}
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
