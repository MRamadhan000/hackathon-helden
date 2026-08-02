// src/types/program.ts

export interface Program {
  id: string;
  nama: string;
  deskripsi: string | null;

  jumlahAnggaran: number;

  tanggalMulai: string;
  tanggalSelesai: string;

  createdBy: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateProgramRequest {
  nama: string;
  deskripsi?: string | null;

  jumlahAnggaran: number;

  tanggalMulai: string;
  tanggalSelesai: string;

  createdBy: string;
}

export interface UpdateProgramRequest {
  nama?: string;
  deskripsi?: string | null;

  jumlahAnggaran?: number;

  tanggalMulai?: string;
  tanggalSelesai?: string;
}

export interface ProgramFormData {
  nama: string;
  deskripsi: string;

  jumlahAnggaran: number;

  tanggalMulai: string;
  tanggalSelesai: string;
}

export interface ProgramFilters {
  search?: string;

  createdBy?: string;

  startDate?: string;
  endDate?: string;
}

export interface ProgramResponse {
  data: Program[];
  count: number;
}