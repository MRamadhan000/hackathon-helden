"use client";

import { useState } from "react";
import Link from "next/link";

// Mock Data Gabungan
const mockLaporanRT = [
  {
    id: "1",
    jenis: "Warga Baru",
    nama: "Rian Hidayat",
    status: "Pending",
    dariRT: "RT 02",
  },
  {
    id: "2",
    jenis: "Mutasi Kematian",
    nama: "Slamet Riyadi (Alm)",
    status: "Pending",
    dariRT: "RT 05",
  },
  {
    id: "3",
    jenis: "Sanggahan Bansos",
    nama: "Ahmad Subari",
    status: "Pending",
    dariRT: "RT 01",
  },
];

const mockSiskeudes = {
  totalAlokasiDana: 90000000,
  danaPerOrang: 300000,
  totalTargetPenerima: 300,
  statusPencairanKPPN: "Dana Siap di Rekening Kas Desa (RKD)",
};

const mockRekomendasiKades = [
  {
    id: "r1",
    nama: "Budi Santoso",
    nik: "3507011234560001",
    alasan: "Skor DTKS Rendah & Lolos RT",
  },
  {
    id: "r2",
    nama: "Siti Aminah",
    nik: "3507019876540002",
    alasan: "Kehilangan Mata Pencaharian",
  },
];

export default function DashboardSekdes() {
  const [currentTab, setCurrentTab] = useState<
    "overview" | "verifikasi" | "anggaran" | "rekomendasi"
  >("overview");
  const [laporanState, setLaporanState] = useState(mockLaporanRT);
  const [isBansosSelesai, setIsBansosSelesai] = useState(false);
  const [isSkDiterbitkan, setIsSkDiterbitkan] = useState(false);
  const [notif, setNotif] = useState("");

  const pendingVerifikasiCount = laporanState.filter(
    (l) => l.status === "Pending",
  ).length;
  const hitungTotalPenerimaValid =
    laporanState.filter((l) => l.status === "Disetujui").length +
    mockRekomendasiKades.length;
  const kalkulasiDanaDibutuhkan =
    hitungTotalPenerimaValid * mockSiskeudes.danaPerOrang;
  const isLogikaSinkron =
    mockSiskeudes.totalAlokasiDana >= kalkulasiDanaDibutuhkan;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">
      {/* TOPBAR BANNER & TABS NAVIGATION */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center font-black rounded-xl text-lg shadow-md">
              SD
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 tracking-tight">
                WORKSPACE SEKRETARIS DESA
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Sistem Integrasi Bansos & Dana Desa
              </p>
            </div>
          </div>

          {/* Navigasi Horizontal yang Fleksibel */}
          <nav className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/60 overflow-x-auto">
            {[
              { id: "overview", label: "📊 Ringkasan Kerja" },
              {
                id: "verifikasi",
                label: `📋 Berkas RT (${pendingVerifikasiCount})`,
              },
              { id: "anggaran", label: "💰 Audit Siskeudes" },
              { id: "rekomendasi", label: "📄 Rekomendasi SK" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                  currentTab === tab.id
                    ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* KONTEN UTAMA */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 lg:p-8 space-y-6">
        {notif && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold shadow-sm animate-fadeIn">
            ✓ {notif}
          </div>
        )}

        {/* ================= CONCEPT 1: DYNAMIC KANBAN-STYLE SUMMARY OVERVIEW ================= */}
        {currentTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50/50 border border-indigo-100 p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-indigo-950">
                Selamat Datang Kembali, Pak Sekdes
              </h2>
              <p className="text-xs text-indigo-800 mt-0.5">
                Seluruh berkas masuk dikelompokkan berdasarkan prioritas aksi
                untuk mempermudah pemantauan.
              </p>
            </div>

            {/* Tiga Kolom Alur Kerja Kreatif */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Kolom 1: Perlu Validasi Segera */}
              <div
                onClick={() => setCurrentTab("verifikasi")}
                className="bg-white border border-slate-200 hover:border-indigo-400 p-5 rounded-2xl shadow-sm cursor-pointer transition-all group space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    Perlu Validasi Segera
                  </span>
                  <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded border border-rose-100">
                    {pendingVerifikasiCount} Berkas
                  </span>
                </div>

                <div className="space-y-2">
                  {laporanState.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs group-hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="font-bold text-slate-900">
                        {item.nama}
                      </div>
                      <div className="text-slate-500 text-[11px] flex justify-between mt-1">
                        <span>{item.jenis}</span>
                        <span className="font-semibold text-indigo-600">
                          {item.dariRT}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-right text-[11px] font-bold text-indigo-600 pt-2 group-hover:underline">
                  Buka Berkas Antrean →
                </div>
              </div>

              {/* Kolom 2: Anomali & Audit Anggaran */}
              <div
                onClick={() => setCurrentTab("anggaran")}
                className="bg-white border border-slate-200 hover:border-indigo-400 p-5 rounded-2xl shadow-sm cursor-pointer transition-all group space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    💰 Posisi Kas & Logika Dana
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${isLogikaSinkron ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}
                  >
                    {isLogikaSinkron ? "Sinkron" : "Evaluasi"}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                  <div>
                    <div className="text-slate-500 text-[10px]">
                      Pagu Dana Siskeudes
                    </div>
                    <div className="font-bold text-slate-900 text-sm">
                      Rp{" "}
                      {mockSiskeudes.totalAlokasiDana.toLocaleString("id-ID")}
                    </div>
                  </div>
                  <div className="border-t border-slate-200/80 pt-2">
                    <div className="text-slate-500 text-[10px]">
                      Status Pencairan KPPN
                    </div>
                    <div className="font-medium text-slate-700 mt-0.5">
                      {mockSiskeudes.statusPencairanKPPN}
                    </div>
                  </div>
                </div>
                <div className="text-right text-[11px] font-bold text-indigo-600 pt-2 group-hover:underline">
                  Audit Formula Anggaran →
                </div>
              </div>

              {/* Kolom 3: Siap Diajukan Ke Kades */}
              <div
                onClick={() => setCurrentTab("rekomendasi")}
                className="bg-white border border-slate-200 hover:border-indigo-400 p-5 rounded-2xl shadow-sm cursor-pointer transition-all group space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    📄 Draft SK Siap Kirim
                  </span>
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100">
                    {mockRekomendasiKades.length} KPM
                  </span>
                </div>

                <div className="space-y-2">
                  {mockRekomendasiKades.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <div className="font-bold text-slate-900">{r.nama}</div>
                      <div className="text-slate-500 text-[10px] mt-0.5 truncate">
                        {r.alasan}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-right text-[11px] font-bold text-indigo-600 pt-2 group-hover:underline">
                  Lihat & Ajukan SK Kades →
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 2: DETAIL VALIDASI DATA RT ================= */}
        {currentTab === "verifikasi" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Validasi Berkas Kewargaan Masuk
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tinjau kesesuaian data lapangan yang diunggah oleh perwakilan
                  RT.
                </p>
              </div>
              <button
                onClick={() => setCurrentTab("overview")}
                className="text-xs font-bold text-slate-500 hover:text-indigo-600"
              >
                ✕ Tutup
              </button>
            </div>

            <div className="space-y-3">
              {laporanState.map((lapor) => (
                <div
                  key={lapor.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 flex justify-between items-center gap-4 shadow-sm"
                >
                  <div>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded border border-indigo-100">
                      {lapor.jenis}
                    </span>
                    <h4 className="font-bold text-slate-950 text-sm mt-1">
                      {lapor.nama} -{" "}
                      <span className="text-slate-500 font-normal">
                        {lapor.dariRT}
                      </span>
                    </h4>
                  </div>
                  <div>
                    {lapor.status === "Pending" ? (
                      <button
                        onClick={() => {
                          setLaporanState((prev) =>
                            prev.map((item) =>
                              item.id === lapor.id
                                ? { ...item, status: "Disetujui" }
                                : item,
                            ),
                          );
                          setNotif(`Sukses memverifikasi data ${lapor.nama}`);
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
                      >
                        Validasi & Sahkan
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                        ✓ Data Sah
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= VIEW 3: DETAIL AUDIT ANGGARAN ================= */}
        {currentTab === "anggaran" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Audit Kecocokan Kas SISKEUDES
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Perhitungan matematis alokasi pagu dana desa terhadap KPM
                  terdaftar.
                </p>
              </div>
              <button
                onClick={() => setCurrentTab("overview")}
                className="text-xs font-bold text-slate-500 hover:text-indigo-600"
              >
                ✕ Tutup
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs border-t border-slate-100 pt-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-slate-500 block">
                  Total Pagu Tersedia:
                </span>
                <strong className="text-slate-900 text-base block">
                  Rp {mockSiskeudes.totalAlokasiDana.toLocaleString("id-ID")}
                </strong>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-slate-500 block">
                  Nilai Manfaat per Orang:
                </span>
                <strong className="text-slate-900 text-base block">
                  Rp {mockSiskeudes.danaPerOrang.toLocaleString("id-ID")}
                </strong>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">
                {mockSiskeudes.statusPencairanKPPN}
              </span>
              <button
                disabled={isBansosSelesai}
                onClick={() => {
                  setIsBansosSelesai(true);
                  setNotif("Buku anggaran penyaluran terkunci.");
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition ${isBansosSelesai ? "bg-slate-100 text-slate-400 border border-slate-200" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"}`}
              >
                {isBansosSelesai
                  ? "✓ Buku Anggaran Dikunci"
                  : "Kunci Penyaluran Dana"}
              </button>
            </div>
          </div>
        )}

        {/* ================= VIEW 4: DETAIL REKOMENDASI SK ================= */}
        {currentTab === "rekomendasi" && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Daftar Rekomendasi SK Kades Final
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftar warga yang telah melewati tahap verifikasi dan siap
                  diajukan tanda tangan.
                </p>
              </div>
              <button
                disabled={isSkDiterbitkan}
                onClick={() => {
                  setIsSkDiterbitkan(true);
                  setNotif("Berkas diajukan ke Kepala Desa.");
                }}
                className={`px-4 py-2 text-xs font-black rounded-xl transition ${isSkDiterbitkan ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"}`}
              >
                {isSkDiterbitkan
                  ? "✓ Berhasil Diajukan"
                  : "Kirim Berkas ke Kades"}
              </button>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="px-5 py-3">Nama Warga</th>
                  <th className="px-5 py-3">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {mockRekomendasiKades.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-slate-100 hover:bg-slate-50/30"
                  >
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {r.nama}
                    </td>
                    <td className="px-5 py-4 text-slate-500">{r.alasan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
