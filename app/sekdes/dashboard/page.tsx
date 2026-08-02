"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

// Mock Data Log Monitoring Status Draft SK dari Kades
const mockLogDraftSekdes: Record<string, any[]> = {
  "2026": [
    {
      id: "sk-log-01",
      nomorDraft: "SK/DSO/2026/003",
      tentang: "Penetapan 30 KPM Bansos BLT-DD Tahap II",
      tanggalPengajuan: "14/05/2026",
      waktuKeputusan: "15/05/2026 • 10:30 WIB",
      statusKeputusan: "Approved",
      catatanKades: "Dokumen Sah & Resmi Masuk Siskeudes",
      jumlahKpm: 30,
      totalNominal: "Rp 90.000.000",
    },
    {
      id: "sk-log-02",
      nomorDraft: "SK/DSO/2026/002",
      tentang: "Penetapan Usulan Tambahan 10 KPM Bansos Sanita",
      tanggalPengajuan: "02/04/2026",
      waktuKeputusan: "03/04/2026 • 16:45 WIB",
      statusKeputusan: "Rejected",
      catatanKades:
        "Tolak sementara: Kuota anggaran melebihi Pagu Siskeudes Tahap I, perlu revisi kuota KPM di RT 03.",
      jumlahKpm: 10,
      totalNominal: "Rp 30.000.000",
    },
  ],
  "2025": [
    {
      id: "sk-log-2025-01",
      nomorDraft: "SK/DSO/2025/089",
      tentang: "Penetapan 260 KPM Bansos BLT-DD TA 2025",
      tanggalPengajuan: "16/12/2025",
      waktuKeputusan: "18/12/2025 • 11:20 WIB",
      statusKeputusan: "Approved",
      catatanKades: "LPJ Siskeudes Rampung & Sah",
      jumlahKpm: 260,
      totalNominal: "Rp 310.800.000",
    },
  ],
};

// Mock Master Data Warga Keseluruhan RT untuk Sekdes
interface WargaSekdes {
  id: string;
  nik: string;
  noKk: string;
  nama: string;
  jenisKelamin: "L" | "P";
  tempatTanggalLahir: string;
  rtRw: string;
  dusun: string;
  pekerjaan: string;
  statusKependudukan:
    | "Penduduk Tetap"
    | "Warga Baru (Pindahan)"
    | "Mutasi Keluar";
  statusDukcapil:
    | "Terverifikasi Valid"
    | "Pending Validasi"
    | "Tidak Cocok (Mismatch)";
  skorProdeskel: number;
  anggotaKeluarga: { hubungan: string; nama: string; nik: string }[];
  riwayatMutasi: string;
}

const mockMasterWargaSekdes: WargaSekdes[] = [
  {
    id: "w-001",
    nik: "3507011234560001",
    noKk: "3507010101180001",
    nama: "Budi Santoso",
    jenisKelamin: "L",
    tempatTanggalLahir: "Kab. Malang, 12 Mei 1985",
    rtRw: "RT 03 / RW 01",
    dusun: "Dusun Krajan",
    pekerjaan: "Buruh Tani",
    statusKependudukan: "Penduduk Tetap",
    statusDukcapil: "Terverifikasi Valid",
    skorProdeskel: 85,
    anggotaKeluarga: [
      {
        hubungan: "Kepala Keluarga",
        nama: "Budi Santoso",
        nik: "3507011234560001",
      },
      { hubungan: "Istri", nama: "Sri Rahayu", nik: "3507015506880002" },
    ],
    riwayatMutasi:
      "Terdata Sejak 2015 • Selesai Pendaftaran Ulang Mandiri 2026",
  },
  {
    id: "w-002",
    nik: "3507019876540002",
    noKk: "3507010101180022",
    nama: "Siti Aminah",
    jenisKelamin: "P",
    tempatTanggalLahir: "Kota Surabaya, 24 Agustus 1958",
    rtRw: "RT 01 / RW 01",
    dusun: "Dusun Krajan",
    pekerjaan: "Tidak Bekerja / Lansia",
    statusKependudukan: "Penduduk Tetap",
    statusDukcapil: "Terverifikasi Valid",
    skorProdeskel: 80,
    anggotaKeluarga: [
      {
        hubungan: "Kepala Keluarga",
        nama: "Siti Aminah",
        nik: "3507019876540002",
      },
    ],
    riwayatMutasi: "Terdata Penerima Bansos Sah Sejak 2023",
  },
  {
    id: "w-003",
    nik: "3507012010920006",
    noKk: "3507010101200099",
    nama: "Rian Hidayat",
    jenisKelamin: "L",
    tempatTanggalLahir: "Kota Malang, 20 Oktober 1992",
    rtRw: "RT 02 / RW 01",
    dusun: "Dusun Krajan",
    pekerjaan: "Karyawan Swasta",
    statusKependudukan: "Warga Baru (Pindahan)",
    statusDukcapil: "Pending Validasi",
    skorProdeskel: 45,
    anggotaKeluarga: [
      {
        hubungan: "Kepala Keluarga",
        nama: "Rian Hidayat",
        nik: "3507012010920006",
      },
    ],
    riwayatMutasi: "Permohonan Masuk Domisili RT 02 Tanggal 28/07/2026",
  },
  {
    id: "w-004",
    nik: "3507013344550007",
    noKk: "3507010101180088",
    nama: "Joko Susilo",
    jenisKelamin: "L",
    tempatTanggalLahir: "Kab. Malang, 15 Juli 1978",
    rtRw: "RT 03 / RW 01",
    dusun: "Dusun Krajan",
    pekerjaan: "Pedagang Keliling",
    statusKependudukan: "Penduduk Tetap",
    statusDukcapil: "Tidak Cocok (Mismatch)",
    skorProdeskel: 65,
    anggotaKeluarga: [
      {
        hubungan: "Kepala Keluarga",
        nama: "Joko Susilo",
        nik: "3507013344550007",
      },
    ],
    riwayatMutasi:
      "Perlu Sinkronisasi NIK dengan Dukcapil Pusat (No KK Berbeda)",
  },
];

function SekdesDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tahunPeriode, setTahunPeriode] = useState("2026");
  const [selectedWargaDetail, setSelectedWargaDetail] =
    useState<WargaSekdes | null>(null);

  // Filter Master Data Warga
  const [filterRT, setFilterRT] = useState("SEMUA");
  const [filterDukcapil, setFilterDukcapil] = useState("SEMUA");
  const [searchWarga, setSearchWarga] = useState("");

  useEffect(() => {
    const qTahun = searchParams.get("tahun");
    if (qTahun) setTahunPeriode(qTahun);
  }, [searchParams]);

  const handleTahunChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const t = e.target.value;
    setTahunPeriode(t);
    router.replace(`/sekdes/dashboard?tahun=${t}`);
  };

  const logDraftSekdes = mockLogDraftSekdes[tahunPeriode] || [];

  // Filter Warga Sekdes
  const wargaFiltered = useMemo(() => {
    return mockMasterWargaSekdes.filter((w) => {
      const matchSearch =
        !searchWarga ||
        w.nama.toLowerCase().includes(searchWarga.toLowerCase()) ||
        w.nik.includes(searchWarga) ||
        w.noKk.includes(searchWarga);
      const matchRT = filterRT === "SEMUA" || w.rtRw.includes(filterRT);
      const matchDukcapil =
        filterDukcapil === "SEMUA" || w.statusDukcapil === filterDukcapil;
      return matchSearch && matchRT && matchDukcapil;
    });
  }, [filterRT, filterDukcapil, searchWarga]);

  // Statistik Ringkas Dukcapil
  const totalWarga = mockMasterWargaSekdes.length;
  const totalValid = mockMasterWargaSekdes.filter(
    (w) => w.statusDukcapil === "Terverifikasi Valid",
  ).length;
  const totalPending = mockMasterWargaSekdes.filter(
    (w) => w.statusDukcapil === "Pending Validasi",
  ).length;
  const totalMismatch = mockMasterWargaSekdes.filter(
    (w) => w.statusDukcapil === "Tidak Cocok (Mismatch)",
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased pb-12">
      {/* HEADER NAVBAR SEKDES */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-blue-900 text-white font-black flex items-center justify-center text-sm shadow-xs">
              SD
            </span>
            <div>
              <h1 className="text-sm font-extrabold text-slate-950 uppercase tracking-wider">
                WORKSPACE SEKRETARIS DESA
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Sistem Integrasi Bansos, Mutasi Warga & Siskeudes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                PERIODE:
              </span>
              <select
                value={tahunPeriode}
                onChange={handleTahunChange}
                className="bg-transparent text-xs font-black text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="2026">Tahun 2026 (Aktif)</option>
                <option value="2025">Tahun 2025</option>
                <option value="2024">Tahun 2024</option>
              </select>
            </div>

            <Link
              href="/login"
              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              🚪 Keluar
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        {/* BANNER WELCOME */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-950">
              Selamat Datang Kembali, Ibu Siti (Sekretaris Desa) 👋
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Kelola verifikasi berjenjang RT, pemutakhiran data kependudukan
              Dukcapil, serta monitoring draft SK Penetapan KPM Bansos.
            </p>
          </div>

          <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-2xl shrink-0 self-start sm:self-auto text-right">
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
              TAHUN ANGGARAN
            </span>
            <span className="text-xs font-black text-blue-950">
              Periode {tahunPeriode}
            </span>
          </div>
        </div>

        {/* 3 KARTU MENU UTAMA VERIFIKASI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-rose-50 text-rose-800 border border-rose-100 text-[10px] font-extrabold rounded-md uppercase">
                1. BERKAS MASUK
              </span>
              <span className="text-xl">📋</span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Validasi Berkas & Mutasi RT
            </h3>
            <p className="text-xs text-slate-500">
              Periksa usulan pendaftaran warga baru, mutasi kematian, dan
              perubahan domisili dari RT.
            </p>
            <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100/80 flex items-center justify-between text-xs font-bold text-rose-950">
              <span>🔔 2 Permohonan Menunggu</span>
              <Link href="/sekdes/berkas-rt">
                <span className="text-blue-600 hover:underline cursor-pointer">
                  Buka Berkas →
                </span>
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-extrabold rounded-md uppercase">
                2. RESPON WARGA
              </span>
              <span className="text-xl">⚖️</span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Validasi Sanggahan Bansos
            </h3>
            <p className="text-xs text-slate-500">
              Tindak lanjuti sanggahan kondisi rumah atau ketidakcocokan data
              kependudukan dari warga.
            </p>
            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 flex items-center justify-between text-xs font-bold text-amber-950">
              <span>🔔 1 Sanggahan Perlu Ditinjau</span>
              <Link href="/sekdes/sanggahan">
                <span className="text-blue-600 hover:underline cursor-pointer">
                  Buka Berkas →
                </span>
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] font-extrabold rounded-md uppercase">
                3. DRAFT SK KADES
              </span>
              <span className="text-xl">📜</span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Rekomendasi Draft SK KPM Bansos
            </h3>
            <p className="text-xs text-slate-500">
              Tinjau kelayakan skor Prodeskel/DTKS hasil verifikasi RT untuk
              disusun menjadi draft SK Kades.
            </p>
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/80 flex items-center justify-between text-xs font-bold text-emerald-950">
              <span>🔔 2 Draft SK Siap Diajukan</span>
              <Link href="/sekdes/rekomendasi-sk">
                <span className="text-blue-600 hover:underline cursor-pointer">
                  Buka Berkas →
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* 1. MONITORING DRAFT SK YANG DIAPPROVE / DIREJECT OLEH KADES */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold mb-1">
                📑 Audit Trail & Status Pengajuan Ke Kades
              </div>
              <h3 className="text-base font-bold text-slate-950">
                Monitoring Log Keputusan Draft SK Bansos ({tahunPeriode})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pantau rekomendasi SK yang disetujui (Approved) atau ditolak
                (Rejected) oleh Kepala Desa beserta catatan revisinya.
              </p>
            </div>
            <span className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 shrink-0">
              Total Log: {logDraftSekdes.length} Berkas
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="px-5 py-3">No. Draft & Perihal SK</th>
                  <th className="px-5 py-3">Tanggal Pengajuan</th>
                  <th className="px-5 py-3">Waktu Keputusan Kades</th>
                  <th className="px-5 py-3 text-center">Status Keputusan</th>
                  <th className="px-5 py-3">Catatan / Instun Kades</th>
                  <th className="px-5 py-3 text-right">Kuota & Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {logDraftSekdes.length > 0 ? (
                  logDraftSekdes.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-bold text-blue-900 block">
                          {log.nomorDraft}
                        </span>
                        <span className="text-[11px] text-slate-700 font-bold block mt-0.5">
                          {log.tentang}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-500 whitespace-nowrap">
                        {log.tanggalPengajuan}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-700 text-[11px] whitespace-nowrap">
                        {log.waktuKeputusan}
                      </td>
                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        {log.statusKeputusan === "Approved" ? (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 font-extrabold text-[10px] rounded-full">
                            ✓ Approved
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-rose-50 text-rose-900 border border-rose-200 font-extrabold text-[10px] rounded-full">
                            ✕ Rejected
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 text-[11px] max-w-xs leading-relaxed">
                        {log.catatanKades}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono whitespace-nowrap">
                        <span className="font-bold text-slate-900 block">
                          {log.totalNominal}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium block">
                          ({log.jumlahKpm} KPM)
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
                      Belum ada riwayat keputusan draft SK untuk periode tahun{" "}
                      {tahunPeriode}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. MASTER DATA PENDUDUK DESA LENGKAP & VALIDASI DUKCAPIL (AKSES KOMPLEKS SEKDES) */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-900 border border-blue-100 rounded-full text-xs font-bold mb-1">
                🗂️ Master Data Induk Kependudukan Desa
              </div>
              <h3 className="text-base font-bold text-slate-950">
                Pengecekan Sinkronisasi Data Penduduk & Dukcapil Pusat
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sekretaris Desa memegang wewenang penuh verifikasi identitas
                warga dari seluruh wilayah RT.
              </p>
            </div>

            {/* RINGKASAN METRIK DUKCAPIL */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200">
                Total: {totalWarga}
              </span>
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold rounded-xl">
                Valid: {totalValid}
              </span>
              <span className="px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold rounded-xl">
                Pending: {totalPending}
              </span>
              <span className="px-3 py-1.5 bg-rose-50 text-rose-900 border border-rose-200 text-xs font-bold rounded-xl">
                Mismatch: {totalMismatch}
              </span>
            </div>
          </div>

          {/* FILTER BAR & PENCARIAN */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Cari berdasarkan Nama, NIK, atau No. KK..."
              value={searchWarga}
              onChange={(e) => setSearchWarga(e.target.value)}
              className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600"
            />

            <select
              value={filterRT}
              onChange={(e) => setFilterRT(e.target.value)}
              className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="SEMUA">Semua Wilayah RT</option>
              <option value="RT 01">RT 01 / RW 01</option>
              <option value="RT 02">RT 02 / RW 01</option>
              <option value="RT 03">RT 03 / RW 01</option>
            </select>

            <select
              value={filterDukcapil}
              onChange={(e) => setFilterDukcapil(e.target.value)}
              className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="SEMUA">Semua Status Dukcapil</option>
              <option value="Terverifikasi Valid">Terverifikasi Valid</option>
              <option value="Pending Validasi">Pending Validasi</option>
              <option value="Tidak Cocok (Mismatch)">
                Tidak Cocok (Mismatch)
              </option>
            </select>
          </div>

          {/* TABEL DATA PENDUDUK KOMPLEKS */}
          <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="px-5 py-3">Identitas Penduduk & NIK</th>
                  <th className="px-5 py-3">No. KK / Wilayah RT</th>
                  <th className="px-5 py-3">TTL & Pekerjaan</th>
                  <th className="px-5 py-3 text-center">Skor Kelayakan</th>
                  <th className="px-5 py-3 text-center">Status Dukcapil</th>
                  <th className="px-5 py-3 text-right">Akses Detail Berkas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {wargaFiltered.length > 0 ? (
                  wargaFiltered.map((warga) => (
                    <tr
                      key={warga.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">{warga.nama}</p>
                        <p className="font-mono text-[10px] text-slate-400">
                          NIK: {warga.nik}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-mono font-bold text-slate-800">
                          {warga.noKk}
                        </p>
                        <p className="text-[10px] text-slate-500 font-semibold">
                          {warga.rtRw} ({warga.dusun})
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-slate-700">
                          {warga.tempatTanggalLahir}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {warga.pekerjaan}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-bold text-amber-900">
                        {warga.skorProdeskel} Pts
                      </td>
                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        {warga.statusDukcapil === "Terverifikasi Valid" && (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 font-extrabold text-[10px] rounded-full">
                            ✓ {warga.statusDukcapil}
                          </span>
                        )}
                        {warga.statusDukcapil === "Pending Validasi" && (
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 font-extrabold text-[10px] rounded-full">
                            ⏳ {warga.statusDukcapil}
                          </span>
                        )}
                        {warga.statusDukcapil === "Tidak Cocok (Mismatch)" && (
                          <span className="px-2.5 py-1 bg-rose-50 text-rose-900 border border-rose-200 font-extrabold text-[10px] rounded-full">
                            ✕ {warga.statusDukcapil}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedWargaDetail(warga)}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition cursor-pointer text-xs"
                        >
                          🔍 Akses Rekam Data →
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
                      Tidak ditemukan data warga sesuai filter ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL POP-UP DETAIL KOMPLEKS WARGA (SEKRETARIS DESA) */}
      {selectedWargaDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header Modal */}
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 uppercase">
                  REKAM DATA INDUK SEKRETARIS DESA
                </span>
                <h3 className="text-base font-black text-slate-950 mt-1">
                  {selectedWargaDetail.nama} ({selectedWargaDetail.nik})
                </h3>
              </div>
              <button
                onClick={() => setSelectedWargaDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 font-extrabold text-xs flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content Scrollable */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800">
              {/* STATUS VITAL DUKCAPIL & PRODESKEL */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Nomor KK Induk
                  </span>
                  <p className="font-mono font-bold text-slate-900">
                    {selectedWargaDetail.noKk}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Skor Kelayakan DDK
                  </span>
                  <p className="font-mono font-bold text-amber-900">
                    {selectedWargaDetail.skorProdeskel} Points
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Status Validasi Dukcapil
                  </span>
                  <p className="font-bold text-emerald-800">
                    {selectedWargaDetail.statusDukcapil}
                  </p>
                </div>
              </div>

              {/* RINCIAN INDUK WARGA */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1">
                  📍 Domisili & Profil Kependudukan:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <p>
                    Wilayah:{" "}
                    <strong>
                      {selectedWargaDetail.rtRw} ({selectedWargaDetail.dusun})
                    </strong>
                  </p>
                  <p>
                    Status Domisili:{" "}
                    <strong>{selectedWargaDetail.statusKependudukan}</strong>
                  </p>
                  <p>
                    TTL:{" "}
                    <strong>{selectedWargaDetail.tempatTanggalLahir}</strong>
                  </p>
                  <p>
                    Pekerjaan: <strong>{selectedWargaDetail.pekerjaan}</strong>
                  </p>
                </div>
              </div>

              {/* ANGGOTA KELUARGA TERDATA DALAM KK */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">
                  👨‍👩‍👧‍👦 Anggota Keluarga Terdaftar (Satu Kartu Keluarga):
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="p-2.5">Hubungan KK</th>
                        <th className="p-2.5">Nama Anggota</th>
                        <th className="p-2.5 text-right">NIK</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {selectedWargaDetail.anggotaKeluarga.map((ak, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-700">
                            {ak.hubungan}
                          </td>
                          <td className="p-2.5 text-slate-900 font-bold">
                            {ak.nama}
                          </td>
                          <td className="p-2.5 text-right font-mono text-slate-500">
                            {ak.nik}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* LOG RIWAYAT PERUBAHAN / MUTASI */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">
                  📝 Catatan Log Audit Sekdes:
                </span>
                <p className="text-slate-700 font-medium">
                  {selectedWargaDetail.riwayatMutasi}
                </p>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <span className="text-[11px] text-slate-400">
                Akses Terkunci Khusus Wewenang Sekdes
              </span>
              <button
                onClick={() => setSelectedWargaDetail(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Tutup Rekam Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SekdesDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-slate-400">
          Memuat Dashboard Sekdes...
        </div>
      }
    >
      <SekdesDashboardContent />
    </Suspense>
  );
}
