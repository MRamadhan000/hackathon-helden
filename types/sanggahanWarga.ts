export interface SanggahanWarga {
  id: string; // uuid
  survei_id: string | null; // uuid
  pelapor_nik: string; // character varying(16)
  alasan_sanggahan: string; // text
  bukti_foto_url: string | null; // character varying(255)
  status_sanggahan: 'Pending' | 'Diproses' | 'Diterima' | 'Ditolak';
  catatan_rt: string | null; // text
  tgl_sanggahan: string | null; // timestamp with time zone
  tgl_tindak_lanjut: string | null; // timestamp with time zone
  updated_at: string | null; // timestamp with time zone
}

export type SanggahanWargaInsert = Omit<SanggahanWarga, "id" | "tgl_sanggahan" | "updated_at">;
export type SanggahanWargaUpdate = Partial<SanggahanWargaInsert>;