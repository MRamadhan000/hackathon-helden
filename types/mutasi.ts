// types/mutasi.ts

export type JenisMutasi = "Warga Baru" | "Non-Aktif" | "Koreksi Data";
export type TipeProses = "OFFLINE" | "ONLINE";
export type ReqMethod = "OFFLINE" | "ONLINE"; // "OFFLINE" (via RT) | "ONLINE" (via Web Warga)
export type StatusMutasi = "PENDING" | "APPROVED" | "REJECTED" | "RESUBMITTED";
export type ActorRole = "WARGA" | "RT" | "SEKDES";

export interface MutasiPengajuan {
  id: string; // UUID
  nik: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD
  jenisKelamin: string;
  agama: string;
  keluargaId: string;
  clusterdesaId: string;
  jenisMutasi: JenisMutasi;
  keterangan?: string | null;
  tipeProses: TipeProses; // 'OFFLINE' (ke RT) atau 'ONLINE' (langsung)
  reqMethod: ReqMethod; // 'OFFLINE' (via RT) | 'ONLINE' (via Web)
  status: StatusMutasi; // 'PENDING' | 'APPROVED' | 'REJECTED' | 'RESUBMITTED'
  feedbackSekdes?: string | null;
  tahunPeriode: string; // Misal: "2026"
  createdBy: string; // FK ke tweb_penduduk / auth user
  approvedBy?: string | null; // FK ke tweb_penduduk (Sekdes)
  parent?: string | null; // Tracking pengajuan ulang / revisi
  createdAt: string;
  updatedAt: string;
}

export interface MutasiLog {
  id: string; // UUID
  mutasiId: string; // FK ke tweb_mutasi_pengajuan
  actorId: string; // FK ke tweb_penduduk / auth user (siapa yang memproses)
  actorRole: ActorRole; // 'WARGA' | 'RT' | 'SEKDES'
  action: "SUBMIT_OFFLINE" | "SUBMIT_ONLINE" | "APPROVE" | "REJECT" | "RESUBMIT";
  statusAwal?: string | null;
  statusBaru: StatusMutasi;
  catatan?: string | null;
  createdAt: string;
}

export interface MutasiSubmitPayload {
  nik: string;
  nama: string | null;
  tempatLahir: string | null;
  tanggalLahir: string | null;
  jenisKelamin: string | null;
  agama: string | null;
  jenisMutasi: JenisMutasi;
  keterangan: string | null;
  tipeProses: TipeProses;
  reqMethod: ReqMethod; // 'OFFLINE' (RT input) | 'ONLINE' (Warga input)
  tahunPeriode: string;
  createdBy: string;
  parent?: string | null;
}

export interface MutasiVerifyPayload {
  isApproved: boolean;
  feedbackSekdes?: string;
  sekdesId: string;
}

export interface MutasiResubmitPayload {
  nik?: string;
  nama?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  jenisKelamin?: string;
  agama?: string;
  keterangan?: string;
  tipeProses?: TipeProses;
  reqMethod?: ReqMethod;
}

