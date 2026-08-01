export interface Penduduk {
  id: string;
  nik: string;
  nama: string;
  id_kk: string | null;
  kk_level: number;
  sex: "L" | "P";
  tanggallahir: string;
  pekerjaan_id: number;
  id_cluster: string;
  status_dasar: "Hidup" | "Mati" | "Pindah";
  hamil: boolean;
  cacat_id: number;
  sakit_menahun: boolean;
  is_verified_by_rt: boolean;
  is_verified_by_sekdes: boolean;
  updated_at: string;
}

export interface ClusterDesa {
  id: string;
  dusun: string;
  rw: string;
  rt: string;
  id_kepala: string;
}

export interface ProgramPeserta {
  id: string;
  program_id: string;
  penduduk_id: string;
  status_verifikasi: "Rekomendasi" | "Ditetapkan" | "Ditolak";
  no_sk_bansos: string | null;
  is_sanggahan: boolean;
  alasan_sanggahan: string | null;
  status_sanggahan: "Pending" | "Diproses" | "Selesai";
  created_at: string;
  updated_at: string;
}

export interface AnggaranDesa {
  id: string;
  tahun: string;
  kategori: "Operasional" | "Bansos" | "Pembangunan";
  kode_posting: string;
  anggaran_rencana: number;
  anggaran_realisasi: number;
  id_cluster: string | null;
  is_verified_sekdes: boolean;
}
