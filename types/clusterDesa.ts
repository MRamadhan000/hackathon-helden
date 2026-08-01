// types/clusterDesa.ts

export interface ClusterDesa {
  id: string; // UUID[cite: 1]
  nama: string; // VARCHAR[cite: 1]
  jenis: string; // VARCHAR (misal: Dusun, RW, RT)[cite: 1]
  parentId: string | null; // UUID (Foreign Key ke tabel yang sama untuk hierarki)[cite: 1]
  ketuaWilayah?: string; // VARCHAR[cite: 1]
  koordinat?: Record<string, any>; // JSONB untuk data spasial/peta[cite: 1]
}