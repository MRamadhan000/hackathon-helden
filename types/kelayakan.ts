// types/kelayakan.ts
import { ActorRole, TipeProses } from "./mutasi";

export type KategoriKelayakan =
  | "Sangat Layak (Prioritas SK)"
  | "Cukup Layak"
  | "Tidak Layak";

export type StatusKelayakan = "PENDING" | "APPROVED" | "REJECTED";

export interface SurveiKelayakan {
  id: string; // UUID
  pendudukId: string; // FK ke tweb_penduduk
  nik: string;
  nama: string;
  skor: number; // 0 - 100
  kategori: KategoriKelayakan;
  indikatorDetail: string;
  jenisDinding?: string | null;
  jenisLantai?: string | null;
  sanitasi?: string | null;
  penghasilanBulanan?: number | null;
  adaLansia: boolean;
  tipeProses: TipeProses; // 'OFFLINE' (Survei RT) | 'ONLINE' (Pengajuan Warga)
  status: StatusKelayakan;
  feedbackSekdes?: string | null;
  tahunPeriode: string;
  createdBy: string;
  approvedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SurveiKelayakanLog {
  id: string;
  surveiId: string;
  actorId: string;
  actorRole: ActorRole;
  action: "SUBMIT_OFFLINE" | "SUBMIT_ONLINE" | "APPROVE" | "REJECT";
  statusAwal?: string | null;
  statusBaru: StatusKelayakan;
  catatan?: string | null;
  createdAt: string;
}

export interface SurveiKelayakanPayload {
  pendudukId: string;
  nik: string;
  nama: string;
  skor: number;
  kategori: KategoriKelayakan;
  indikatorDetail: string;
  jenisDinding?: string;
  jenisLantai?: string;
  sanitasi?: string;
  penghasilanBulanan?: number;
  adaLansia?: boolean;
  tipeProses: TipeProses;
  tahunPeriode?: string;
}
