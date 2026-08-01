"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import FormSurveiKelayakan from "@/components/rt/FormSurveiKelayakan";
import { PendudukRT } from "@/components/rt/TableWarga";
import { useSurveiKelayakan } from "@/hooks/cores/useSurveiKelayakan";
import { usePenduduk } from "@/hooks/cores/usePenduduk";

const FILTER_KATEGORI = ["Semua", "Sangat Layak (Prioritas SK)", "Cukup Layak"];

function KelayakanContent() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";
  const isTahunAktif = tahunPeriode === "2026";

  const [selectedNik, setSelectedNik] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKategori, setFilterKategori] = useState("Semua");

  // Real Supabase Connection via Custom Hooks
  const { data: realSurveiList, isLoading, submit: submitSurveiHook } = useSurveiKelayakan(tahunPeriode);
  const { data: realPendudukList } = usePenduduk();

  // Map Real Data Warga ke Format PendudukRT
  const daftarWarga: PendudukRT[] = useMemo(() => {
    return (realPendudukList || []).map((p) => ({
      id: p.id,
      nik: p.nik,
      nama: p.nama,
      jenisKelamin: (p.jenisKelamin === "P" ? "P" : "L") as "L" | "P",
      tempatLahir: p.tempatLahir,
      tanggalLahir: p.tanggalLahir,
      statusPenduduk: (["Tetap", "Pindah", "Meninggal"].includes(p.statusPenduduk)
        ? p.statusPenduduk
        : "Tetap") as "Tetap" | "Pindah" | "Meninggal",
      statusVerifikasiDukcapil: (p.statusVerifikasiDukcapil === "Anomali / Unverified"
        ? "Anomali / Unverified"
        : "Terverifikasi") as "Terverifikasi" | "Anomali / Unverified",
      terakhirDiperbarui: "-",
    }));
  }, [realPendudukList]);

  // Map Real Data Survei Kelayakan Supabase
  const riwayatSurvei = useMemo(() => {
    return (realSurveiList || []).map((item) => ({
      id: item.id,
      tanggal: item.createdAt ? new Date(item.createdAt).toLocaleDateString("id-ID") : "-",
      nik: item.nik,
      nama: item.nama,
      skor: item.skor,
      kategori: item.kategori,
      indikator: item.indikatorDetail,
      rawStatus: item.status,
      reqMethod: item.tipeProses,
    }));
  }, [realSurveiList]);

  const filteredData = useMemo(() => {
    return riwayatSurvei.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.nama.toLowerCase().includes(q) ||
        item.nik.includes(q) ||
        item.indikator.toLowerCase().includes(q);

      const matchFilter =
        filterKategori === "Semua" || item.kategori === filterKategori;

      return matchSearch && matchFilter;
    });
  }, [riwayatSurvei, searchQuery, filterKategori]);

  const handleSurveiSubmit = async (e: React.FormEvent, dataHasil: any) => {
    e.preventDefault();
    try {
      await submitSurveiHook(
        {
          pendudukId: dataHasil?.pendudukId || "00000000-0000-0000-0000-000000000000",
          nik: dataHasil?.nik || selectedNik || "3507000000000001",
          nama: dataHasil?.nama || "Warga Survei",
          skor: Number(dataHasil?.skor) || 50,
          kategori: (dataHasil?.kategori as any) || "Cukup Layak",
          indikatorDetail: dataHasil?.indikator || "Survei Prodeskel DDK",
          jenisDinding: dataHasil?.jenisDinding,
          jenisLantai: dataHasil?.jenisLantai,
          sanitasi: dataHasil?.sanitasi,
          adaLansia: dataHasil?.adaLansia || false,
          tipeProses: "OFFLINE",
          tahunPeriode: tahunPeriode,
        },
        "rt-user-id",
        "RT"
      );
      alert("Hasil survei Prodeskel berhasil dikirim ke Sekretaris Desa!");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim survei kelayakan: " + (err as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10 font-sans antialiased">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href={`/rt?tahun=${tahunPeriode}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition self-start"
          >
            ← Kembali ke Panel RT
          </Link>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
            📅 Periode:{" "}
            <strong className="text-slate-900">{tahunPeriode}</strong>
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Header Card + Action */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-950">
                Hasil Survei Kelayakan Bansos
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Rekapitulasi indikator Prodeskel DDK tahun {tahunPeriode}
              </p>
            </div>

            {isTahunAktif && (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-emerald-600/20 cursor-pointer"
              >
                <span className="text-sm leading-none">+</span>
                Input Survei Baru (Offline RT)
              </button>
            )}
          </div>

          {/* Search + Filter */}
          <div className="p-3 sm:p-4 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Cari nama, NIK, atau indikator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-emerald-500"
              />
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-emerald-500 sm:min-w-[200px]"
            >
              {FILTER_KATEGORI.map((k) => (
                <option key={k} value={k}>
                  {k === "Semua" ? "Semua Kategori" : k}
                </option>
              ))}
            </select>
          </div>

          {/* LOADING STATE */}
          {isLoading ? (
            <div className="p-10 text-center text-xs text-slate-400">
              Memuat data survei kelayakan dari Supabase...
            </div>
          ) : (
            <>
              {/* MOBILE: Card List */}
              <div className="sm:hidden divide-y divide-slate-100">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <div key={item.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">
                            {item.nama}
                          </p>
                          <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                            {item.nik}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold ${
                            item.skor >= 50
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {item.skor >= 50 ? "Sangat Layak" : "Cukup Layak"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-extrabold text-[11px]">
                          Skor: {item.skor} / 100
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {item.tanggal}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.indikator}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-slate-400 text-xs">
                    {searchQuery || filterKategori !== "Semua"
                      ? "Tidak ada data yang cocok dengan pencarian / filter."
                      : `Belum ada hasil survei pada tahun ${tahunPeriode}.`}
                  </div>
                )}
              </div>

              {/* DESKTOP: Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="px-5 py-3">Tgl Survei</th>
                      <th className="px-5 py-3">Nama Warga</th>
                      <th className="px-5 py-3">Indikator Detail</th>
                      <th className="px-5 py-3">Skor Kelayakan</th>
                      <th className="px-5 py-3 text-right">Kategori / Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/60 transition"
                        >
                          <td className="px-5 py-3.5 text-xs text-slate-500 font-mono whitespace-nowrap">
                            {item.tanggal}
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="font-bold text-slate-900 text-xs">
                              {item.nama}
                            </p>
                            <p className="font-mono text-[11px] text-slate-400">
                              NIK: {item.nik}
                            </p>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-slate-600 max-w-[200px]">
                            {item.indikator}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-extrabold text-xs rounded-lg whitespace-nowrap">
                              {item.skor} / 100
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                                item.skor >= 50
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {item.kategori}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-10 text-center text-slate-400 text-xs"
                        >
                          {searchQuery || filterKategori !== "Semua"
                            ? "Tidak ada data yang cocok dengan pencarian / filter."
                            : `Belum ada hasil survei pada tahun ${tahunPeriode}.`}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="px-4 sm:px-5 py-3 bg-slate-50/50 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            Menampilkan {filteredData.length} dari {riwayatSurvei.length} data survei
          </div>
        </div>
      </div>

      {/* Modal Form Survei */}
      {showModal && isTahunAktif && (
        <FormSurveiKelayakan
          tahunPeriode={tahunPeriode}
          daftarWarga={daftarWarga}
          selectedNik={selectedNik}
          setSelectedNik={setSelectedNik}
          onSubmitSurvei={handleSurveiSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default function HalamanKelayakan() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-slate-400">
          Memuat Survei Kelayakan...
        </div>
      }
    >
      <KelayakanContent />
    </Suspense>
  );
}
