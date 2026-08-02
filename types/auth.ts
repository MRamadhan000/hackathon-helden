// types/auth.ts

export type UserRole = "KEPALA_DESA" | "SEKRETARIS" | "KETUA_RT" | "WARGA";

export interface UserProfile {
  id: string; // Penduduk ID (UUID)
  nik: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD
  jenisKelamin: string;
  agama: string;
  statusPenduduk: string;
  statusVerifikasiDukcapil: string;
  keluargaId: string;
  clusterdesaId: string;
  role: UserRole;
}

export interface UserRoleRecord {
  id: string;
  pendudukId: string;
  nik: string;
  nama: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  error: string | null;
  login: (nik: string) => Promise<UserProfile>;
  logout: () => void;
  fetchProfile: (pendudukId: string) => Promise<UserProfile>;
}
