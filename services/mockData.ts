import { Penduduk, ClusterDesa, ProgramPeserta, AnggaranDesa } from "./types";

// 1. Mock Data Wilayah (Teks Murni)
export const mockClusters: ClusterDesa[] = [
  { id: "c1", dusun: "Dusun Krajan", rw: "01", rt: "01", id_kepala: "p1" },
  { id: "c2", dusun: "Dusun Krajan", rw: "01", rt: "02", id_kepala: "p3" },
  { id: "c3", dusun: "Dusun Sukomaju", rw: "02", rt: "01", id_kepala: "p4" },
];

// 2. Mock Data Induk Penduduk (Sengaja acak & kotor untuk simulasi)
export const mockPenduduk: Penduduk[] = [
  {
    id: "p1",
    nik: "3507010101010001",
    nama: "Budi Santoso",
    id_kk: "kk1",
    kk_level: 1, // Kepala Keluarga
    sex: "L",
    tanggallahir: "1975-04-12",
    pekerjaan_id: 1,
    id_cluster: "c1",
    status_dasar: "Hidup",
    hamil: false,
    cacat_id: 0,
    sakit_menahun: false,
    is_verified_by_rt: true,
    is_verified_by_sekdes: true,
    updated_at: "2026-07-28T10:00:00Z",
  },
  {
    id: "p2",
    nik: "3507010101010002",
    nama: "Siti Aminah", // Istri Budi (Kondisi Hamil untuk filter Bansos)
    id_kk: "kk1",
    kk_level: 2,
    sex: "P",
    tanggallahir: "1980-08-20",
    pekerjaan_id: 2,
    id_cluster: "c1",
    status_dasar: "Hidup",
    hamil: true, // Target Bansos Stunting/PKH
    cacat_id: 0,
    sakit_menahun: false,
    is_verified_by_rt: true,
    is_verified_by_sekdes: false, // Menunggu verifikasi Sekdes
    updated_at: "2026-07-30T14:22:00Z",
  },
  {
    id: "p3",
    nik: "3507010202020003",
    nama: "Ahmad Sukijan", // Lansia Sakit Menahun
    id_kk: "kk2",
    kk_level: 1,
    sex: "L",
    tanggallahir: "1950-01-01",
    pekerjaan_id: 0,
    id_cluster: "c2",
    status_dasar: "Hidup",
    hamil: false,
    cacat_id: 0,
    sakit_menahun: true, // Target Bansos Lansia
    is_verified_by_rt: true,
    is_verified_by_sekdes: true,
    updated_at: "2026-07-25T08:00:00Z",
  },
  {
    id: "p4",
    nik: "3507010303030004",
    nama: "Warga Fiktif Terhapus", // Simulasi Data Meninggal
    id_kk: "kk3",
    kk_level: 1,
    sex: "L",
    tanggallahir: "1988-11-12",
    pekerjaan_id: 3,
    id_cluster: "c3",
    status_dasar: "Mati", // Penanda kebersihan data untuk Kades
    hamil: false,
    cacat_id: 1,
    sakit_menahun: false,
    is_verified_by_rt: true,
    is_verified_by_sekdes: true,
    updated_at: "2026-06-01T09:00:00Z",
  },
];

// 3. Mock Data Relasi Alur Kerja Bansos & Jalur Sanggah
export const mockProgramPeserta: ProgramPeserta[] = [
  {
    id: "pp1",
    program_id: "prog-blt",
    penduduk_id: "p3", // Ahmad Sukijan
    status_verifikasi: "Rekomendasi", // Baru diajukan RT, perlu approve Sekdes/Kades
    no_sk_bansos: null,
    is_sanggahan: false,
    alasan_sanggahan: null,
    status_sanggahan: "Pending",
    created_at: "2026-07-29T00:00:00Z",
    updated_at: "2026-07-29T00:00:00Z",
  },
  {
    id: "pp2",
    program_id: "prog-pkh",
    penduduk_id: "p1", // Budi Santoso
    status_verifikasi: "Ditetapkan", // Sudah disetujui Kades (Terbit SK)
    no_sk_bansos: "SK-BANSOS/2026/004",
    is_sanggahan: false,
    alasan_sanggahan: null,
    status_sanggahan: "Selesai",
    created_at: "2026-07-01T00:00:00Z",
    updated_at: "2026-07-05T00:00:00Z",
  },
  {
    id: "pp3",
    program_id: "prog-blt",
    penduduk_id: "p2", // Siti Aminah mengajukan sanggahan mandiri
    status_verifikasi: "Ditolak",
    no_sk_bansos: null,
    is_sanggahan: true, // Warga mengaktifkan jalur sanggah
    alasan_sanggahan:
      "Keluarga kami sangat membutuhkan bantuan gizi karena saya sedang hamil tua dan suami di-PHK.",
    status_sanggahan: "Diproses", // Sedang diverifikasi ulang oleh RT/Sekdes
    created_at: "2026-07-31T12:00:00Z",
    updated_at: "2026-07-31T15:00:00Z",
  },
];

// 4. Mock Data Anggaran Transparansi Desa
export const mockAnggaran: AnggaranDesa[] = [
  {
    id: "a1",
    tahun: "2026",
    kategori: "Bansos",
    kode_posting: "5.1.01",
    anggaran_rencana: 150000000,
    anggaran_realisasi: 90000000,
    id_cluster: null,
    is_verified_sekdes: true,
  },
  {
    id: "a2",
    tahun: "2026",
    kategori: "Operasional",
    kode_posting: "5.1.02",
    anggaran_rencana: 75000000,
    anggaran_realisasi: 75000000,
    id_cluster: null,
    is_verified_sekdes: true,
  },
  {
    id: "a3",
    tahun: "2026",
    kategori: "Bansos",
    kode_posting: "5.1.03",
    anggaran_rencana: 20000000,
    anggaran_realisasi: 0,
    id_cluster: "c1",
    is_verified_sekdes: false,
  }, // Bansos khusus RT 01 yang tersendat
];
