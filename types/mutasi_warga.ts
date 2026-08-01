export interface MutasiWarga {
  id: string; // uuid
  nik_warga: string; // character varying(16)
  jenis_mutasi: 'Warga Baru' | 'Pindah Domisili' | 'Meninggal';
  keterangan: string | null; // text
  tgl_kejadian: string; // date
  created_at: string | null; // timestamp with time zone
}

export type MutasiWargaInsert = Omit<MutasiWarga, "id" | "created_at">;
export type MutasiWargaUpdate = Partial<MutasiWargaInsert>;