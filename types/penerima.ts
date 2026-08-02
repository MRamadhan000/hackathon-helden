// types/penerima.ts

export type StatusPenerima = "PENDING" | "APPROVED" | "REJECTED" | "DISTRIBUTED";

export interface Penerima {
  id: string;
  programId: string;
  pendudukId: string;
  areaLocationId: string;
  createdBy: string;
  status: StatusPenerima;
  nominal: number | null;
  catatan: string | null;
  createdAt: string;
  updatedAt: string;

  // joined fields (opsional, jika query pakai select dengan join)
  pendudukNama?: string;
  pendudukNik?: string;
  areaLocationNama?: string;
  programNama?: string;
}

export interface CreatePenerimaRequest {
  programId: string;
  pendudukId: string;
  areaLocationId: string;
  createdBy: string;
  nominal?: number | null;
  catatan?: string | null;
}

export interface UpdatePenerimaRequest {
  status?: StatusPenerima;
  nominal?: number | null;
  catatan?: string | null;
}

export interface PenerimaFilters {
  programId?: string;
  status?: StatusPenerima;
  areaLocationId?: string;
}

export interface PenerimaStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  distributed: number;
}
