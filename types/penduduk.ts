// types/penduduk.ts

export interface Penduduk {
  id: string; // UUID[cite: 1]
  nik: string; // VARCHAR(16)[cite: 1]
  nama: string; // VARCHAR[cite: 1]
  tempat_lahir: string; // VARCHAR[cite: 1]
  tanggal_lahir: string; // DATE (Format: YYYY-MM-DD)[cite: 1]
  agama: string; // VARCHAR[cite: 1]
  statusPenduduk: string; // VARCHAR[cite: 1]
  statusVerifikasiDukcapil: string; // VARCHAR[cite: 1]
  keluargaId: string; // UUID (Foreign Key ke tweb_keluarga)[cite: 1]
  clusterdesaId: string; // UUID (Foreign Key ke tweb_clusterdesa)[cite: 1]
  jenisKelamin: string; // VARCHAR[cite: 1]
  updated_at: string; // TIMESTAMP[cite: 1]
  created_at: string; // TIMESTAMP[cite: 1]
}

export interface PendudukHistory {
  id: string; // UUID[cite: 1]
  pendudukId: string; // UUID (Foreign Key ke tweb_penduduk)[cite: 1]
  changedBy: string; // UUID (ID pengguna perangkat desa yang mengubah)[cite: 1]
  fieldName: string; // VARCHAR (Nama kolom yang berubah)[cite: 1]
  oldValue: string | null; // TEXT (Nilai lama)[cite: 1]
  newValue: string | null; // TEXT (Nilai baru)[cite: 1]
  createdAt: string; // TIMESTAMP[cite: 1]
}
