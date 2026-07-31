import { mockPenduduk, mockProgramPeserta, mockAnggaran } from "./mockData";
import { ProgramPeserta, Penduduk } from "./types";

export const bansosService = {
  // ROLE: KEPALA DESA - Mendapatkan semua usulan bansos untuk di-approve/SK
  getDaftarRekomendasi: (): ProgramPeserta[] => {
    return mockProgramPeserta.filter(
      (p) => p.status_verifikasi === "Rekomendasi",
    );
  },

  // ROLE: SEKDES - Memverifikasi logika total anggaran vs penerima (Data Siskeudes)
  verifyPenyaluranSelesai: (programPesertaId: string): boolean => {
    const data = mockProgramPeserta.find((p) => p.id === programPesertaId);
    if (data) {
      data.status_verifikasi = "Ditetapkan"; // Simulasi update status
      return true;
    }
    return false;
  },

  // ROLE: KETUA RT - Mengajukan warga yang layak mendapat bansos (Lini Terakhir)
  ajukanWargaBansos: (
    pendudukId: string,
    programId: string,
  ): ProgramPeserta => {
    const newRekomendasi: ProgramPeserta = {
      id: `pp-${Math.random().toString(36).substr(2, 9)}`,
      program_id: programId,
      penduduk_id: pendudukId,
      status_verifikasi: "Rekomendasi",
      no_sk_bansos: null,
      is_sanggahan: false,
      alasan_sanggahan: null,
      status_sanggahan: "Pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockProgramPeserta.push(newRekomendasi);
    return newRekomendasi;
  },

  // ROLE: WARGA - Melakukan pencarian status bansos berdasarkan NIK mandiri
  cekStatusBansosWarga: (
    nik: string,
  ): { penduduk: Penduduk | null; statusBansos: ProgramPeserta[] } => {
    const warga = mockPenduduk.find(
      (p) => p.nik === nik && p.status_dasar === "Hidup",
    );
    if (!warga) return { penduduk: null, statusBansos: [] };

    const status = mockProgramPeserta.filter(
      (pp) => pp.penduduk_id === warga.id,
    );
    return { penduduk: warga, statusBansos: status };
  },

  // ROLE: WARGA - Mengirimkan form jalur sanggah baru jika tidak terdaftar
  kirimSanggahanWarga: (nik: string, alasan: string): boolean => {
    const warga = mockPenduduk.find((p) => p.nik === nik);
    if (!warga) return false;

    const newSanggahan: ProgramPeserta = {
      id: `pp-${Math.random().toString(36).substr(2, 9)}`,
      program_id: "prog-blt", // Default target sanggah program utama
      penduduk_id: warga.id,
      status_verifikasi: "Rekomendasi",
      no_sk_bansos: null,
      is_sanggahan: true,
      alasan_sanggahan: alasan,
      status_sanggahan: "Pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockProgramPeserta.push(newSanggahan);
    return true;
  },
};
