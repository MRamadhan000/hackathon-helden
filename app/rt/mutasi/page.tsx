"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import FormMutasiLengkap from "@/components/rt/FormMutasiLengkap";
import { PendudukRT } from "@/components/rt/TableWarga";
import { useMutasi } from "@/hooks/cores/useMutasi";
import { usePenduduk } from "@/hooks/cores/usePenduduk";

interface RiwayatMutasiItem {
  id: string;
  tanggal: string;
  jenis: string;
  nik: string;
  nama: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  jenisKelamin?: string;
  keterangan: string;
  statusSekdes?: string;
  rawStatus?: string;
  reqMethod?: string;
  feedbackSekdes?: string | null;
}

const FILTER_JENIS = [
  "Semua",
  "Warga Baru",
  "Non-Aktif",
  "Koreksi Data",
];

// KOMPONEN KONTEN UTAMA
function MutasiContent() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";
  const isTahunAktif = tahunPeriode === "2026";

  const [selectedNik, setSelectedNik] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJenis, setFilterJenis] = useState("Semua");
  const [selectedDetailItem, setSelectedDetailItem] = useState<RiwayatMutasiItem | null>(null);

  // Real Supabase Hooks Connection
  const { data: realMutasiList, isLoading: isLoadingMutasi, submit: submitMutasiHook } = useMutasi(tahunPeriode);
  const { data: realPendudukList } = usePenduduk();

  // Map Real Data Warga ke Format PendudukRT
  const daftarWarga: PendudukRT[] = useMemo(() => {
    return (realPendudukList || []).map((p) => ({
      id: p.id,
      nik: p.nik,
      nama: p.nama,
      jenisKelamin: (p.jenisKelamin === "P" ? "P" : "L") as "L" | "P",
      tempatLahir: p.tempat_lahir,
      tanggalLahir: p.tanggal_lahir,
      statusPenduduk: (["Tetap", "Pindah", "Meninggal"].includes(p.statusPenduduk)
        ? p.statusPenduduk
        : "Tetap") as "Tetap" | "Pindah" | "Meninggal",
      statusVerifikasiDukcapil: (p.statusVerifikasiDukcapil === "Anomali / Unverified"
        ? "Anomali / Unverified"
        : "Terverifikasi") as "Terverifikasi" | "Anomali / Unverified",
      terakhirDiperbarui: "-",
    }));
  }, [realPendudukList]);

  // Map Real Data Mutasi Supabase
  const riwayatMutasi: RiwayatMutasiItem[] = useMemo(() => {
    return (realMutasiList || []).map((m) => ({
      id: m.id,
      tanggal: m.createdAt ? new Date(m.createdAt).toLocaleDateString("id-ID") : "-",
      jenis: m.jenisMutasi,
      nik: m.nik,
      nama: m.nama,
      tempatLahir: m.tempatLahir,
      tanggalLahir: m.tanggalLahir,
      jenisKelamin: m.jenisKelamin,
      keterangan: m.keterangan || `(Metode Pengajuan: ${m.reqMethod || m.tipeProses})`,
      statusSekdes:
        m.status === "APPROVED"
          ? "✓ Disetujui Sekdes"
          : m.status === "REJECTED"
          ? "✕ Ditolak Sekdes"
          : m.status === "RESUBMITTED"
          ? "🔄 Pengajuan Ulang"
          : "⏳ Pending Sekdes",
      rawStatus: m.status,
      reqMethod: m.reqMethod || m.tipeProses,
      feedbackSekdes: m.feedbackSekdes,
    }));
  }, [realMutasiList]);

  const filteredData = useMemo(() => {
    return riwayatMutasi.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.nama.toLowerCase().includes(q) ||
        item.nik.includes(q) ||
        item.keterangan.toLowerCase().includes(q);

      const matchFilter = filterJenis === "Semua" || item.jenis.includes(filterJenis);

      return matchSearch && matchFilter;
    });
  }, [riwayatMutasi, searchQuery, filterJenis]);

  const handleMutasiSubmit = async (e: React.FormEvent, data: any) => {
    e.preventDefault();
    try {
      await submitMutasiHook(
        {
          nik: data?.nik || selectedNik || "3507000000000001",
          nama: data?.nama || "Warga Baru",
          tempatLahir: data?.tempatLahir || "Kab. Malang",
          tanggalLahir: data?.tanggalLahir || "2000-01-01",
          jenisKelamin: data?.jenisKelamin || "L",
          agama: data?.agama || "Islam",
          keluargaId: data?.keluargaId || "00000000-0000-0000-0000-000000000000",
          clusterdesaId: data?.clusterdesaId || "00000000-0000-0000-0000-000000000000",
          jenisMutasi: (data?.jenisMutasi as any) || "Warga Baru",
          keterangan: data?.keterangan || "Pendaftaran offline via Ketua RT",
          tipeProses: "OFFLINE",
          reqMethod: "OFFLINE",
          tahunPeriode: tahunPeriode,
        },
        "rt-user-id",
        "RT"
      );
      alert("Laporan mutasi berhasil dikirimkan ke Sekretaris Desa!");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan data mutasi: " + (err as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10 font-sans antialiased relative">
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
          {/* Header Card */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-950">
                Riwayat Mutasi & Kependudukan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar transaksi mutasi warga tahun {tahunPeriode}
              </p>
            </div>

            {isTahunAktif && (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-blue-600/20 cursor-pointer"
              >
                <span className="text-sm leading-none">+</span>
                Input Mutasi Baru (Offline RT)
              </button>
            )}
          </div>

          {/* Search + Filter */}
          <div className="p-3 sm:p-4 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Cari nama, NIK, atau keterangan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-blue-500"
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
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-blue-500 sm:min-w-[180px] cursor-pointer"
            >
              {FILTER_JENIS.map((j) => (
                <option key={j} value={j}>
                  {j === "Semua" ? "Semua Jenis Mutasi" : j}
                </option>
              ))}
            </select>
          </div>

          {/* LOADING STATE */}
          {isLoadingMutasi ? (
            <div className="p-10 text-center text-xs text-slate-400">
              Memuat data mutasi dari Supabase...
            </div>
          ) : (
            <>
              {/* MOBILE VIEW */}
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
                          className={`shrink-0 px-2 py-1 rounded-lg border text-[10px] font-bold ${
                            item.rawStatus === "APPROVED"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : item.rawStatus === "REJECTED"
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {item.statusSekdes}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold text-[11px] border border-blue-100">
                          {item.jenis}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono">
                          Req: {item.reqMethod}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {item.tanggal}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.keterangan}
                      </p>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setSelectedDetailItem(item)}
                          className="w-full py-2 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 active:bg-blue-100 rounded-lg border border-blue-100 transition cursor-pointer"
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-slate-400 text-xs">
                    {searchQuery || filterJenis !== "Semua"
                      ? "Tidak ada data yang cocok dengan pencarian / filter."
                      : `Belum ada riwayat mutasi pada tahun ${tahunPeriode}.`}
                  </div>
                )}
              </div>

              {/* DESKTOP TABLE */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="px-5 py-3">Tgl Lapor</th>
                      <th className="px-5 py-3">Metode / Jenis Mutasi</th>
                      <th className="px-5 py-3">Warga Terkait</th>
                      <th className="px-5 py-3">Keterangan</th>
                      <th className="px-5 py-3 text-right">Status Sekdes</th>
                      <th className="px-5 py-3 text-right">Aksi</th>
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
                          <td className="px-5 py-3.5 space-y-1">
                            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold text-xs border border-blue-100 whitespace-nowrap block w-fit">
                              {item.jenis}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 block">
                              Jalur: <strong>{item.reqMethod}</strong>
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="font-bold text-slate-900 text-xs">
                              {item.nama}
                            </p>
                            <p className="font-mono text-[11px] text-slate-400">
                              NIK: {item.nik}
                            </p>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-slate-600">
                            {item.keterangan}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span
                              className={`px-2.5 py-1 rounded-lg border text-xs font-bold whitespace-nowrap ${
                                item.rawStatus === "APPROVED"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : item.rawStatus === "REJECTED"
                                  ? "bg-rose-50 text-rose-800 border-rose-200"
                                  : "bg-amber-50 text-amber-800 border-amber-200"
                              }`}
                            >
                              {item.statusSekdes}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedDetailItem(item)}
                              className="px-3 py-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100 transition cursor-pointer"
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-10 text-center text-slate-400 text-xs"
                        >
                          {searchQuery || filterJenis !== "Semua"
                            ? "Tidak ada data yang cocok dengan pencarian / filter."
                            : `Belum ada riwayat mutasi pada tahun ${tahunPeriode}.`}
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
            Menampilkan {filteredData.length} dari {riwayatMutasi.length} data mutasi
          </div>
        </div>
      </div>

      {/* Modal Input Mutasi Baru */}
      {showModal && isTahunAktif && (
        <FormMutasiLengkap
          tahunPeriode={tahunPeriode}
          daftarWarga={daftarWarga}
          selectedNik={selectedNik}
          setSelectedNik={setSelectedNik}
          onSubmitMutasi={handleMutasiSubmit}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* DRAWER RINCIAN MUTASI WARGA */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-2xs transition-opacity">
          <div className="w-full md:w-1/2 bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              {/* DRAWER HEADER */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                    DETAIL LAPORAN MUTASI RT
                  </span>
                  <h3 className="text-base font-extrabold text-slate-950 mt-1">
                    {selectedDetailItem.nama}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDetailItem(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-sm flex items-center justify-center transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* RINCIAN FIELD MUTASI */}
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">
                      Kategori Mutasi
                    </span>
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-800 font-bold rounded-lg border border-blue-100">
                      {selectedDetailItem.jenis}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">
                      Metode Pengajuan (Req Method)
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-bold rounded-lg border border-slate-200">
                      {selectedDetailItem.reqMethod || "OFFLINE"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">
                      Status Verifikasi Sekdes
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-lg border border-emerald-200">
                      {selectedDetailItem.statusSekdes}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">
                      Tanggal Dilaporkan
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {selectedDetailItem.tanggal}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-xs border-b border-slate-100 pb-2">
                    👤 Data Kependudukan Warga Terkait
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Nama Lengkap
                      </span>
                      <span className="font-bold text-slate-900">
                        {selectedDetailItem.nama}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Nomor Induk Kependudukan (NIK)
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        {selectedDetailItem.nik}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Jenis Kelamin
                      </span>
                      <span className="font-semibold text-slate-800">
                        {selectedDetailItem.jenisKelamin === "P"
                          ? "Perempuan (P)"
                          : "Laki-Laki (L)"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Tempat, Tanggal Lahir
                      </span>
                      <span className="font-semibold text-slate-800">
                        {selectedDetailItem.tempatLahir || "Kab. Malang"},{" "}
                        {selectedDetailItem.tanggalLahir || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedDetailItem.feedbackSekdes && (
                  <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200/80 space-y-1">
                    <span className="text-[10px] text-rose-800 font-extrabold uppercase block">
                      Catatan Feedback Sekdes:
                    </span>
                    <p className="text-slate-800 font-medium leading-relaxed">
                      {selectedDetailItem.feedbackSekdes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* DRAWER FOOTER */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                ID Transaksi: {selectedDetailItem.id}
              </span>
              <button
                type="button"
                onClick={() => setSelectedDetailItem(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Tutup Layar Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HalamanMutasi() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-slate-400">
          Memuat Riwayat Mutasi...
        </div>
      }
    >
      <MutasiContent />
    </Suspense>
  );
}
