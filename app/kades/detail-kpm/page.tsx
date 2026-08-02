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

function DetailKpmContent() {
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
  const listRT = useMemo<DataKpmRT[]>(() => {
    if (!penerima || penerima.length === 0) return [];
    
    const programName = programs.find((p) => p.id === selectedProgramId)?.nama || "Bansos";
    const programSK = programs.find((p) => p.id === selectedProgramId)?.nomorSk || "-";

    const groups: Record<string, PenerimaBansos[]> = {};
    penerima.forEach((p) => {
      const area = p.areaLocationNama || "Wilayah Belum Ditentukan";
      if (!groups[area]) groups[area] = [];
      groups[area].push(p);
    });

    const result = Object.entries(groups).map(([area, wargaList]) => {
      const totalNominal = wargaList.reduce((acc, curr) => acc + (curr.nominal || 0), 0);
      return {
        idRT: area,
        namaRT: area,
        ketuaRT: "-",
        dusun: "-",
        totalKpm: wargaList.length,
        totalAnggaranRtBln: formatRupiah(totalNominal),
        // Placeholder trend data
        trenKpm5Thn: [Math.floor(wargaList.length * 0.8), Math.floor(wargaList.length * 0.9), wargaList.length, wargaList.length + 2, wargaList.length],
        daftarWargaKpm: wargaList.map(w => ({
          id: w.id,
          nik: w.nik,
          nama: w.nama,
          skorDDK: w.skor,
          jenisBantuan: programName,
          nominalPerBulan: w.nominal ? formatRupiah(w.nominal) : "-",
          noSKKades: programSK,
          statusBansos: "Aktif Penerima" as const,
        }))
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

  // Data Grafik Tren KPM 5 Tahun RT Terpilih
  const trendDataRT = {
    labels: ["2022", "2023", "2024", "2025", "2026"],
    datasets: [
      {
        label: `Jumlah Penerima KPM ${rtAktif?.namaRT || ""}`,
        data: rtAktif?.trenKpm5Thn || [],
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
    if (!rtAktif) return [];
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
              Detail Data Penerima KPM Bansos Per Program
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih program dan tinjau daftar warga penerima bantuan yang telah disetujui (APPROVED).
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
              className="w-full sm:w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
            Mengambil data penerima...
          </div>
        ) : listRT.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm font-bold text-slate-600">Belum ada penerima untuk program ini</p>
            <p className="text-xs text-slate-400 mt-1">Pastikan ada data survei kelayakan yang berstatus APPROVED.</p>
          </div>
        ) : (
          <>
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
                        WILAYAH
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          ✓ Dipilih
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 truncate">
                        {rt.namaRT}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Total Alokasi: <strong>{rt.totalAnggaranRtBln}</strong>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Total KPM Approved:
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

            {rtAktif && (
              <>
                {/* 2. SEKSI GRAFIK TREN KPM 5 TAHUN RT TERPILIH */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-950">
                        📈 Tren Penerima KPM Bansos {rtAktif.namaRT} (Simulasi 5 Tahun)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Visualisasi estimasi keluarga penerima manfaat dalam 5 tahun terakhir.
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
                        Daftar warga dengan status kelayakan APPROVED.
                      </p>
                    </div>

                    <input
                      type="text"
                      placeholder="Cari nama KPM atau NIK di wilayah ini..."
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
                              <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-900">
                                {warga.nominalPerBulan}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="p-8 text-center text-slate-400 text-xs"
                            >
                              Tidak ditemukan data KPM untuk pencarian ini.
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
