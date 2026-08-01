"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface DetailWargaLengkap {
  nik: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: "Laki-Laki" | "Perempuan";
  agama: string;
  statusPerkawinan: string;
  pekerjaan: string;
  alamatAsal?: string;
  statusDukcapil?: string;
}

interface AuditPengajuRT {
  namaKetuaRT: string;
  wilayahRT: string;
  tanggalKirim: string;
  jamKirim: string;
}

interface BerkasMutasiRT {
  id: string;
  tanggalLapor: string;
  rt: string;
  jenisPengajuan:
    | "1. Warga Baru"
    | "2. Non-Aktif (Pindah/Meninggal)"
    | "3. Koreksi Data NIK/KK";
  keterangan: string;
  status: "Menunggu Validasi" | "Disetujui" | "Ditolak";
  biodata: DetailWargaLengkap;
  pengaju: AuditPengajuRT;
  catatanSekdes?: string;
}

const mockBerkasMasukRT: Record<string, BerkasMutasiRT[]> = {
  "2026": [
    {
      id: "b-2026-01",
      tanggalLapor: "18/03/2026",
      rt: "RT 03 / RW 01",
      jenisPengajuan: "1. Warga Baru",
      keterangan:
        "Pendaftaran Pindah Masuk RT dari Luar Desa (Kartu Keluarga Baru)",
      status: "Menunggu Validasi",
      biodata: {
        nik: "3507011112220004",
        nama: "Andi Pratama",
        tempatLahir: "Kota Malang",
        tanggalLahir: "18 Juni 1994",
        jenisKelamin: "Laki-Laki",
        agama: "Islam",
        statusPerkawinan: "Menikah",
        pekerjaan: "Karyawan Swasta",
        alamatAsal: "Jl. Mawar No. 12, Kec. Sukun, Kota Malang",
        statusDukcapil: "Terverifikasi Aktif",
      },
      pengaju: {
        namaKetuaRT: "Bpk. Bambang Sukoco",
        wilayahRT: "RT 03 / RW 01",
        tanggalKirim: "18 Maret 2026",
        jamKirim: "09:42 WIB",
      },
    },
    {
      id: "b-2026-02",
      tanggalLapor: "15/03/2026",
      rt: "RT 01 / RW 01",
      jenisPengajuan: "3. Koreksi Data NIK/KK",
      keterangan:
        "Koreksi ejaan nama tempat lahir di KK sesuai ijazah & Dukcapil",
      status: "Menunggu Validasi",
      biodata: {
        nik: "3507011234560001",
        nama: "Budi Santoso",
        tempatLahir: "Kab. Malang",
        tanggalLahir: "12 Mei 1985",
        jenisKelamin: "Laki-Laki",
        agama: "Islam",
        statusPerkawinan: "Menikah",
        pekerjaan: "Wiraswasta / Pedagang",
        alamatAsal: "RT 01 / RW 01 Dusun Krajan",
        statusDukcapil: "Terverifikasi Aktif",
      },
      pengaju: {
        namaKetuaRT: "Bpk. Heri Setiawan",
        wilayahRT: "RT 01 / RW 01",
        tanggalKirim: "15 Maret 2026",
        jamKirim: "14:15 WIB",
      },
    },
    {
      id: "b-2026-03",
      tanggalLapor: "10/02/2026",
      rt: "RT 02 / RW 01",
      jenisPengajuan: "2. Non-Aktif (Pindah/Meninggal)",
      keterangan:
        "Laporan Kematian Warga (Surat Keterangan Kematian Terlampir)",
      status: "Disetujui",
      biodata: {
        nik: "3507015554440003",
        nama: "Joko Widodo (Alm)",
        tempatLahir: "Kab. Blitar",
        tanggalLahir: "15 Januari 1945",
        jenisKelamin: "Laki-Laki",
        agama: "Islam",
        statusPerkawinan: "Duda / Ditinggal Mati",
        pekerjaan: "Pensiunan",
        alamatAsal: "RT 02 / RW 01 Dusun Krajan",
        statusDukcapil: "Anomali / Perlu Non-Aktif",
      },
      pengaju: {
        namaKetuaRT: "Bpk. Agus Rahardjo",
        wilayahRT: "RT 02 / RW 01",
        tanggalKirim: "10 Februari 2026",
        jamKirim: "11:05 WIB",
      },
      catatanSekdes:
        "Berkas kematian lengkap, status kependudukan dinonaktifkan.",
    },
  ],
  "2025": [
    {
      id: "b-2025-01",
      tanggalLapor: "12/11/2025",
      rt: "RT 03 / RW 01",
      jenisPengajuan: "1. Warga Baru",
      keterangan: "Pindahan antar RT internal desa",
      status: "Disetujui",
      biodata: {
        nik: "3507019876540002",
        nama: "Siti Aminah",
        tempatLahir: "Kota Surabaya",
        tanggalLahir: "24 Agustus 1958",
        jenisKelamin: "Perempuan",
        agama: "Islam",
        statusPerkawinan: "Janda",
        pekerjaan: "Mengurus Rumah Tangga",
        alamatAsal: "RT 04 / RW 01",
        statusDukcapil: "Terverifikasi Aktif",
      },
      pengaju: {
        namaKetuaRT: "Bpk. Bambang Sukoco",
        wilayahRT: "RT 03 / RW 01",
        tanggalKirim: "12 November 2025",
        jamKirim: "08:30 WIB",
      },
    },
  ],
};

function ValidasiBerkasRTContent() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Semua");
  const [selectedDetail, setSelectedDetail] = useState<BerkasMutasiRT | null>(
    null,
  );

  const [dataList, setDataList] = useState<BerkasMutasiRT[]>(
    () => mockBerkasMasukRT[tahunPeriode] || mockBerkasMasukRT["2026"],
  );

  // Sync state dataList jika query parameter tahun berubah
  useEffect(() => {
    setDataList(mockBerkasMasukRT[tahunPeriode] || mockBerkasMasukRT["2026"]);
  }, [tahunPeriode]);

  // Monitoring Counter Statistik (Aman dari undefined)
  const stats = useMemo(() => {
    const total = dataList.length;
    const pending = dataList.filter(
      (i) => i.status === "Menunggu Validasi",
    ).length;
    const approved = dataList.filter((i) => i.status === "Disetujui").length;
    const rejected = dataList.filter((i) => i.status === "Ditolak").length;
    return { total, pending, approved, rejected };
  }, [dataList]);

  // Filter Data dengan Optional Chaining
  const filteredData = useMemo(() => {
    return dataList.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const namaWarga = item.biodata?.nama?.toLowerCase() || "";
      const nikWarga = item.biodata?.nik || "";
      const rtAsal = item.rt?.toLowerCase() || "";
      const ketRT = item.pengaju?.namaKetuaRT?.toLowerCase() || "";
      const alasanKet = item.keterangan?.toLowerCase() || "";

      const matchSearch =
        !q ||
        namaWarga.includes(q) ||
        nikWarga.includes(q) ||
        rtAsal.includes(q) ||
        ketRT.includes(q) ||
        alasanKet.includes(q);

      const matchFilter =
        filterStatus === "Semua" || item.status === filterStatus;

      return matchSearch && matchFilter;
    });
  }, [dataList, searchQuery, filterStatus]);

  // Handler Verifikasi Sekdes
  const handleAksiVerifikasi = (id: string, aksi: "Disetujui" | "Ditolak") => {
    setDataList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: aksi } : item)),
    );
    setSelectedDetail(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER & NAVIGASI */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href={`/sekdes/dashboard?tahun=${tahunPeriode}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition self-start"
          >
            ← Kembali ke Panel Sekdes
          </Link>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
            📅 Periode Anggaran:{" "}
            <strong className="text-slate-900">{tahunPeriode}</strong>
          </span>
        </div>

        {/* STATS MONITORING DATA BERKAS & MUTASI RT */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Pengajuan RT
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {stats.total}{" "}
              <span className="text-xs font-normal text-slate-400">Berkas</span>
            </div>
          </div>

          <div className="bg-amber-50/80 p-4.5 rounded-2xl border border-amber-200/80 shadow-2xs">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
              ⏳ Menunggu Validasi
            </span>
            <div className="text-2xl font-black text-amber-950 mt-1">
              {stats.pending}{" "}
              <span className="text-xs font-normal text-amber-800">
                Perlu Aksi
              </span>
            </div>
          </div>

          <div className="bg-emerald-50/80 p-4.5 rounded-2xl border border-emerald-200/80 shadow-2xs">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              ✓ Disetujui Sekdes
            </span>
            <div className="text-2xl font-black text-emerald-950 mt-1">
              {stats.approved}{" "}
              <span className="text-xs font-normal text-emerald-800">
                Selesai
              </span>
            </div>
          </div>

          <div className="bg-rose-50/80 p-4.5 rounded-2xl border border-rose-200/80 shadow-2xs">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
              ✕ Ditolak Sekdes
            </span>
            <div className="text-2xl font-black text-rose-950 mt-1">
              {stats.rejected}{" "}
              <span className="text-xs font-normal text-rose-800">Berkas</span>
            </div>
          </div>
        </div>

        {/* KARTU UTAMA TABEL VALIDASI */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-0">
          {/* Header Card */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-950">
                Validasi Berkas & Mutasi Penduduk RT
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verifikasi data pendaftaran warga baru, mutasi domisili, dan
                koreksi NIK dari pengurus RT.
              </p>
            </div>
          </div>

          {/* Search + Filter Tab Status */}
          <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between">
            <input
              type="text"
              placeholder="Cari nama warga, NIK, asal RT, atau nama ketua RT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-indigo-600 sm:w-80"
            />

            {/* Filter Tab Status */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {["Semua", "Menunggu Validasi", "Disetujui", "Ditolak"].map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      filterStatus === st
                        ? "bg-slate-900 text-white shadow-2xs"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {st}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* TABEL DATA PENDATAAN & MUTASI */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="px-5 py-3">Asal RT & Waktu Lapor</th>
                  <th className="px-5 py-3">Jenis Pengajuan</th>
                  <th className="px-5 py-3">Identitas Warga</th>
                  <th className="px-5 py-3">Pengaju (Ketua RT)</th>
                  <th className="px-5 py-3 text-center">Status Verifikasi</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <p className="font-bold text-slate-900">{item.rt}</p>
                        <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                          {item.pengaju?.tanggalKirim || item.tanggalLapor}{" "}
                          {item.pengaju?.jamKirim
                            ? `(${item.pengaju.jamKirim})`
                            : ""}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 font-bold border border-indigo-100 text-[11px]">
                          {item.jenisPengajuan}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">
                          {item.biodata?.nama || "-"}
                        </p>
                        <p className="font-mono text-[11px] text-slate-400">
                          NIK: {item.biodata?.nik || "-"}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <p className="font-bold text-slate-800">
                          {item.pengaju?.namaKetuaRT || "Pengurus RT"}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {item.pengaju?.wilayahRT || item.rt}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        {item.status === "Menunggu Validasi" && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-bold text-[10px]">
                            ⏳ Menunggu Validasi
                          </span>
                        )}
                        {item.status === "Disetujui" && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold text-[10px]">
                            ✓ Disetujui
                          </span>
                        )}
                        {item.status === "Ditolak" && (
                          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-900 border border-rose-200 font-bold text-[10px]">
                            ✕ Ditolak
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedDetail(item)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold rounded-lg border border-indigo-100 transition cursor-pointer"
                        >
                          Tinjau Berkas
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-slate-400 text-xs"
                    >
                      Tidak ada berkas mutasi/perbaikan data yang sesuai filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            Menampilkan {filteredData.length} dari {dataList.length} berkas
            pengajuan RT
          </div>
        </div>
      </div>

      {/* POP-UP MODAL DI TENGAH LAYAR */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                  {selectedDetail.jenisPengajuan}
                </span>
                <h3 className="text-base font-black text-slate-950">
                  Rincian Berkas: {selectedDetail.biodata?.nama || "-"}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 font-extrabold text-xs flex items-center justify-center cursor-pointer transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
              {/* SECTION 1: AUDIT LOG PENGAJU (KETUA RT) */}
              <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-900 block">
                  📌 Informasi Pengaju & Log Laporan RT
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-slate-800 font-medium">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-normal">
                      Nama Ketua RT
                    </span>
                    <strong className="text-slate-900">
                      {selectedDetail.pengaju?.namaKetuaRT || "Pengurus RT"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-normal">
                      Wilayah RT/RW
                    </span>
                    <strong className="text-slate-900">
                      {selectedDetail.pengaju?.wilayahRT || selectedDetail.rt}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-normal">
                      Tanggal & Jam Kirim
                    </span>
                    <strong className="text-slate-900 font-mono">
                      {selectedDetail.pengaju?.tanggalKirim ||
                        selectedDetail.tanggalLapor}{" "}
                      • {selectedDetail.pengaju?.jamKirim || "-"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* SECTION 2: BIODATA WARGA LENGKAP */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs border-b border-slate-100 pb-2">
                  👤 Biodata Lengkap Kependudukan Warga
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Nama Lengkap Sesuai KTP
                    </span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {selectedDetail.biodata?.nama || "-"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Nomor NIK KTP (16 Digit)
                    </span>
                    <span className="font-mono font-extrabold text-slate-900 text-sm">
                      {selectedDetail.biodata?.nik || "-"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Tempat, Tanggal Lahir
                    </span>
                    <span className="font-bold text-slate-800">
                      {selectedDetail.biodata?.tempatLahir || "-"},{" "}
                      {selectedDetail.biodata?.tanggalLahir || "-"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Jenis Kelamin / Agama
                    </span>
                    <span className="font-bold text-slate-800">
                      {selectedDetail.biodata?.jenisKelamin || "-"} •{" "}
                      {selectedDetail.biodata?.agama || "-"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Status Perkawinan & Pekerjaan
                    </span>
                    <span className="font-semibold text-slate-800">
                      {selectedDetail.biodata?.statusPerkawinan || "-"} •{" "}
                      {selectedDetail.biodata?.pekerjaan || "-"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Alamat Asal / Domisili
                    </span>
                    <span className="font-semibold text-slate-800">
                      {selectedDetail.biodata?.alamatAsal || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: KETERANGAN LENGKAP APARATUR */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Catatan / Alasan Permohonan RT
                </span>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {selectedDetail.keterangan}
                </p>
              </div>
            </div>

            {/* Modal Footer / Action Buttons */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 font-mono">
                ID Ref: {selectedDetail.id}
              </span>

              {selectedDetail.status === "Menunggu Validasi" ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleAksiVerifikasi(selectedDetail.id, "Ditolak")
                    }
                    className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    ✕ Tolak Berkas
                  </button>
                  <button
                    onClick={() =>
                      handleAksiVerifikasi(selectedDetail.id, "Disetujui")
                    }
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-2xs"
                  >
                    ✓ Setujui & Simpan Master Data
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition"
                >
                  Tutup Pop-Up
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ValidasiBerkasRTPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-slate-400">
          Memuat Validasi Berkas...
        </div>
      }
    >
      <ValidasiBerkasRTContent />
    </Suspense>
  );
}
