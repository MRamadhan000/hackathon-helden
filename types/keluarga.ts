// types/keluarga.ts

export interface Keluarga {
  id: string; // UUID[cite: 1]
  noKk: string; // VARCHAR(16)[cite: 1]
  alamat: string; // TEXT[cite: 1]
  clusterdesaId: string; // UUID (Foreign Key ke tweb_clusterdesa)[cite: 1]
  createdAt: string; // TIMESTAMP[cite: 1]
}