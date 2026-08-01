// types/sanggahan.ts
import { ActorRole, TipeProses, ReqMethod } from "./mutasi";

export type JenisSanggahan = "PENDUDUK" | "RUMAH";
export type StatusSanggahan =
  | "PENDING"
  | "DIAJUKAN_SEKDES"
  | "APPROVED"
  | "REJECTED"
  | "RESUBMITTED";

export interface SanggahanPenduduk {
  id: string; // UUID
  pendudukId?: string | null; // FK ke tweb_penduduk jika ada
  nikPelapor: string;
  namaPelapor: string;
  jenisKetidakcocokan: string; // Misal: "Ejaan Nama / NIK Typo", "Status Domisili"
  alasanSanggahan: string;
  tipeProses: TipeProses; // 'OFFLINE' | 'ONLINE'
  reqMethod: ReqMethod; // 'OFFLINE' (via RT) | 'ONLINE' (via Web)
  status: StatusSanggahan;
  feedbackSekdes?: string | null;
  tahunPeriode: string;
  createdBy: string;
  approvedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SanggahanRumah {
  id: string; // UUID
  pendudukId?: string | null;
  nikPelapor: string;
  namaPelapor: string;
  jenisDinding: string;
  jenisLantai: string;
  sanitasi: string;
  skorSistem: number;
  alasanWarga: string;
  tipeProses: TipeProses;
  reqMethod: ReqMethod;
  status: StatusSanggahan;
  feedbackSekdes?: string | null;
  tahunPeriode: string;
  createdBy: string;
  approvedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SanggahanLog {
  id: string;
  sanggahanId: string;
  jenisSanggahan: JenisSanggahan;
  actorId: string;
  actorRole: ActorRole;
  action:
    | "SUBMIT_OFFLINE"
    | "SUBMIT_ONLINE"
    | "FORWARD_TO_SEKDES"
    | "APPROVE"
    | "REJECT"
    | "RESUBMIT";
  statusAwal?: string | null;
  statusBaru: StatusSanggahan;
  catatan?: string | null;
  createdAt: string;
}

export interface SanggahanPendudukPayload {
  pendudukId?: string;
  nikPelapor: string;
  namaPelapor: string;
  jenisKetidakcocokan: string;
  alasanSanggahan: string;
  tipeProses: TipeProses;
  reqMethod?: ReqMethod;
  tahunPeriode?: string;
}

export interface SanggahanRumahPayload {
  pendudukId?: string;
  nikPelapor: string;
  namaPelapor: string;
  jenisDinding: string;
  jenisLantai: string;
  sanitasi: string;
  skorSistem?: number;
  alasanWarga: string;
  tipeProses: TipeProses;
  reqMethod?: ReqMethod;
  tahunPeriode?: string;
}

