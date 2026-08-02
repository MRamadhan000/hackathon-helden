// services/operational/bansos.service.ts
import { createClient } from "@/utils/supabase/client";
import type { Program } from "@/types/program";

export interface PenerimaBansos {
  id: string;
  pendudukId: string;
  nik: string;
  nama: string;
  skor: number;
  kategori: string;
  penghasilanBulanan: number | null;
  adaLansia: boolean;
  tahunPeriode: string;
  status: string;
  approvedBy: string | null;
  programId: string | null;
  // Dari tabel penerima (jika ada)
  nominal: number | null;
  areaLocationNama: string | null;
}

export interface BansosProgram extends Program {
  jumlahPenerima: number;
  totalNominal: number;
  nomorSk?: string;
}

export interface SKPdfData {
  program: BansosProgram;
  penerima: PenerimaBansos[];
  nomorSk: string;
  tanggalSk: string;
  namaKades: string;
  namaDesa: string;
}

/**
 * Fetch semua program Bansos beserta jumlah penerima yang APPROVED
 */
export async function getBansosPrograms(): Promise<BansosProgram[]> {
  const supabase = createClient();

  // Fetch semua program
  const { data: programs, error: progError } = await supabase
    .from("program")
    .select("*")
    .order("created_at", { ascending: false });

  if (progError) throw new Error(progError.message);
  if (!programs || programs.length === 0) return [];

  // Fetch penerima dengan status APPROVED untuk tiap program
  const { data: penerima, error: penError } = await supabase
    .from("penerima")
    .select("program_id, nominal")
    .eq("status", "APPROVED");

  if (penError) throw new Error(penError.message);

  // Hitung per program
  const penerimaMap: Record<string, { count: number; totalNominal: number }> = {};
  (penerima ?? []).forEach((p: any) => {
    const pid = p.program_id as string;
    if (!penerimaMap[pid]) penerimaMap[pid] = { count: 0, totalNominal: 0 };
    penerimaMap[pid].count += 1;
    penerimaMap[pid].totalNominal += Number(p.nominal ?? 0);
  });

  return programs.map((prog: any) => ({
    id: prog.id,
    nama: prog.nama,
    deskripsi: prog.deskripsi ?? null,
    jumlahAnggaran: Number(prog.jumlah_anggaran ?? 0),
    tanggalMulai: prog.tanggal_mulai,
    tanggalSelesai: prog.tanggal_selesai,
    createdBy: prog.created_by,
    createdAt: prog.created_at,
    updatedAt: prog.updated_at,
    jumlahPenerima: penerimaMap[prog.id]?.count ?? 0,
    totalNominal: penerimaMap[prog.id]?.totalNominal ?? 0,
    nomorSk: generateNomorSk(prog.id, prog.created_at),
  }));
}

/**
 * Fetch penerima APPROVED dari `tweb_survei_kelayakan` yang sudah disetujui
 * sebagai calon penerima Bansos, beserta data join ke penerima table (untuk nominal)
 */
export async function getPenerimaBansosApproved(programId?: string): Promise<PenerimaBansos[]> {
  const supabase = createClient();

  // Query tweb_survei_kelayakan dengan status APPROVED
  let query = supabase
    .from("tweb_survei_kelayakan")
    .select("*")
    .eq("status", "APPROVED")
    .order("skor", { ascending: false });

  if (programId) {
    query = query.eq("program_id", programId);
  }

  const { data: kelayakan, error } = await query;
  if (error) throw new Error(error.message);
  if (!kelayakan || kelayakan.length === 0) return [];

  // Jika ada programId, coba fetch nominal dari tabel penerima
  let nominalMap: Record<string, number> = {};
  let areaMap: Record<string, string> = {};

  if (programId) {
    const { data: penerimaData } = await supabase
      .from("penerima")
      .select("penduduk_id, nominal, area_location_id")
      .eq("program_id", programId)
      .eq("status", "APPROVED");

    (penerimaData ?? []).forEach((p: any) => {
      nominalMap[p.penduduk_id] = Number(p.nominal ?? 0);
      areaMap[p.penduduk_id] = p.area_location_id ?? "";
    });
  }

  return (kelayakan ?? []).map((row: any) => ({
    id: row.id,
    pendudukId: row.penduduk_id,
    nik: row.nik,
    nama: row.nama,
    skor: row.skor,
    kategori: row.kategori,
    penghasilanBulanan: row.penghasilan_bulanan ?? null,
    adaLansia: row.ada_lansia ?? false,
    tahunPeriode: row.tahun_periode,
    status: row.status,
    approvedBy: row.approved_by ?? null,
    programId: row.program_id ?? null,
    nominal: nominalMap[row.penduduk_id] ?? null,
    areaLocationNama: areaMap[row.penduduk_id] ?? null,
  }));
}

/**
 * Generate nomor SK berdasarkan program ID dan created_at
 * Format: SK/BANSOS/[TAHUN]/[3 char uppercase dari program ID]
 */
export function generateNomorSk(programId: string, createdAt: string): string {
  const tahun = new Date(createdAt).getFullYear();
  const kode = programId.replace(/-/g, "").slice(0, 4).toUpperCase();
  return `SK/BANSOS/${tahun}/${kode}`;
}

/**
 * Format currency Rupiah
 */
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
