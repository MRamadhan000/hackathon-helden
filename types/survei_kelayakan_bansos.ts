// types/survei_kelayakan_bansos.ts

export interface SurveiKelayakanBansos {
  id: string; // uuid
  periode_id: number; // bigint
  nik_warga: string; // character varying(16)
  bansos_id: number | null; // bigint
  bahan_lantai: string; // character varying(50)
  bahan_dinding: string; // character varying(50)
  sumber_air: string; // character varying(50)
  fasilitas_sanitasi: string; // character varying(50)
  mata_pencaharian: string; // character varying(50)
  has_lansia_disabilitas: boolean | null; // boolean
  skor_kelayakan: number; // integer (0 - 100)
  status_rekomendasi: string; // character varying(50)
  ditinjau_oleh: string | null; // character varying(100)
  created_at: string | null; // timestamp with time zone
  updated_at: string | null; // timestamp with time zone
}

export type SurveiKelayakanBansosInsert = Omit<SurveiKelayakanBansos, "id" | "created_at" | "updated_at">;
export type SurveiKelayakanBansosUpdate = Partial<SurveiKelayakanBansosInsert>;