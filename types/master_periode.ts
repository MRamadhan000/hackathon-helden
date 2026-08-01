// types/master_periode.ts

export interface MasterPeriode {
  id: number; // bigint (generated always as identity)
  tahun: string; // character varying(4)
  is_aktif: boolean | null; // boolean
  created_at: string | null; // timestamp with time zone
  updated_at: string | null; // timestamp with time zone
}

export type MasterPeriodeInsert = Omit<MasterPeriode, "id" | "created_at" | "updated_at">;
export type MasterPeriodeUpdate = Partial<MasterPeriodeInsert>;