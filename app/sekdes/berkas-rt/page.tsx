"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface BerkasMasuk {
  id: string;
  namaWarga: string;
  jenisPengajuan:
    | "Warga Baru"
    | "Mutasi Kematian"
    | "Sanggahan Bansos"
    | "Koreksi Data";
  asalRT: string;
  tanggalMasuk: string;
  keterangan: string;
  status: "Pending" | "Disetujui" | "Ditolak";
}

const initialBerkasPerTahun: Record<string, BerkasMasuk[]> = {
  "2026": [
    {
      id: "b-1",
      namaWarga: "Rian Hidayat",
      jenisPengajuan: "Warga Baru",
      asalRT: "RT 02 / RW 01",
      tanggalMasuk: "01/08/2026",
      keterangan: "Pendaftaran warga baru pindahan dari Kab. Malang.",
      status: "Pending",
    },
    {
      id: "b-2",
      namaWarga: "Slamet Riyadi (Alm)",
      jenisPengajuan: "Mutasi Kematian",
      asalRT: "RT 05 / RW 01",
      tanggalMasuk: "31/07/2026",
      keterangan: "Laporan kematian warga dari Ketua RT 05.",
      status: "Pending",
    },
    {
      id: "b-3",
      namaWarga: "Ahmad Subari",
      jenisPengajuan: "Sanggahan Bansos",
      asalRT: "RT 01 / RW 01",
      tanggalMasuk: "30/07/2026",
      keterangan: "Hasil survei ulang RT: Dinding lapuk, belum punya jamban.",
      status: "Pending",
    },
  ],
  "2025": [
    {
      id: "b-2025-1",
      namaWarga: "Budi Santoso",
      jenisPengajuan: "Koreksi Data",
      asalRT: "RT 03 / RW 01",
      tanggalMasuk: "12/04/2025",
      keterangan: "Perbaikan nomor rumah dan gelar.",
      status: "Disetujui",
    },
  ],
  "2024": [],
};

export default function HalamanValidasiBerkasRT() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";
  const isTahunBerlalu = tahunPeriode !== "2026";

  const [daftarBerkas, setDaftarBerkas] = useState<BerkasMasuk[]>(
    initialBerkasPerTahun[tahunPeriode] || [],
  );

  const [notif, setNotif] = useState("");

  const handleKeputusan = (id: string, keputusan: "Disetujui" | "Ditolak") => {
    setDaftarBerkas((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: keputusan } : item,
      ),
    );
    const itemTarget = daftarBerkas.find((b) => b.id === id);
    setNotif(
      `Sukses: Berkas atas nama ${itemTarget?.namaWarga} telah di-${
        keputusan === "Disetujui"
          ? "verifikasi & disetujui"
          : "tolak/dikembalikan ke RT"
      }.`,
    );
    setTimeout(() => setNotif(""), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12 space-y-6 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* NAVIGASI & HEADER */}
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

        {notif && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-xs font-bold shadow-xs">
            {notif}
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-800 rounded-full text-xs font-bold mb-2">
              📋 Antrean Verifikasi Sekdes
            </div>
            <h2 className="text-lg font-bold text-slate-950">
              Pemeriksaan Berkas Masuk dari Ketua RT ({tahunPeriode})
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Periksa kelengkapan data usulan RT. Tentukan persetujuan untuk
              meneruskan ke sistem desa atau menolak usulan.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-5 py-3.5">Waktu Lapor</th>
                  <th className="px-5 py-3.5">Asal RT</th>
                  <th className="px-5 py-3.5">Nama Warga Terkait</th>
                  <th className="px-5 py-3.5">Jenis Pengajuan</th>
                  <th className="px-5 py-3.5">Catatan / Detail RT</th>
                  <th className="px-5 py-3.5 text-right">Keputusan Sekdes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {daftarBerkas.length > 0 ? (
                  daftarBerkas.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 transition"
                    >
                      <td className="px-5 py-4 text-xs font-mono text-slate-500">
                        {item.tanggalMasuk}
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-extrabold rounded-lg border border-slate-200">
                          {item.asalRT}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900 text-xs">
                          {item.namaWarga}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-800 text-xs font-bold rounded-lg border border-indigo-100">
                          {item.jenisPengajuan}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 max-w-xs">
                        {item.keterangan}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {!isTahunBerlalu && item.status === "Pending" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                handleKeputusan(item.id, "Disetujui")
                              }
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                            >
                              ✓ Verifikasi
                            </button>
                            <button
                              onClick={() =>
                                handleKeputusan(item.id, "Ditolak")
                              }
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition cursor-pointer"
                            >
                              ✕ Tolak
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-block ${
                              item.status === "Disetujui"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-rose-50 text-rose-800 border border-rose-200"
                            }`}
                          >
                            {item.status === "Disetujui"
                              ? "✓ Diverifikasi Sekdes"
                              : "✕ Ditolak Sekdes"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-slate-400 text-xs"
                    >
                      Tidak ada antrean berkas masuk pada periode tahun{" "}
                      {tahunPeriode}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
