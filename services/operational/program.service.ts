// src/services/program.ts
import { createClient } from "@/utils/supabase/client";
import {
  Program,
  CreateProgramRequest,
  UpdateProgramRequest,
  ProgramFilters,
  ProgramResponse,
} from "@/types/program";

function mapProgramFromDb(row: any): Program {
  return {
    id: row.id,
    nama: row.nama,
    deskripsi: row.deskripsi ?? null,
    jumlahAnggaran: row.jumlah_anggaran != null ? Number(row.jumlah_anggaran) : 0,
    tanggalMulai: row.tanggal_mulai,
    tanggalSelesai: row.tanggal_selesai,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// 1. Get List Program (dengan filter)
export async function getProgramList(
  filters?: ProgramFilters
): Promise<Program[]> {
  const supabase = createClient();

  let query = supabase
    .from("program")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.search) {
    const search = filters.search.trim();
    if (search) {
      query = query.or(
        `nama.ilike.%${search}%,deskripsi.ilike.%${search}%`
      );
    }
  }

  if (filters?.createdBy) {
    query = query.eq("created_by", filters.createdBy);
  }

  if (filters?.startDate) {
    query = query.gte("tanggal_mulai", filters.startDate);
  }

  if (filters?.endDate) {
    query = query.lte("tanggal_selesai", filters.endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data || []).map(mapProgramFromDb);
}

// Versi dengan count (berguna untuk pagination / table)
export async function getProgramListWithCount(
  filters?: ProgramFilters
): Promise<ProgramResponse> {
  const supabase = createClient();

  let query = supabase
    .from("program")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters?.search) {
    const search = filters.search.trim();
    if (search) {
      query = query.or(
        `nama.ilike.%${search}%,deskripsi.ilike.%${search}%`
      );
    }
  }

  if (filters?.createdBy) {
    query = query.eq("created_by", filters.createdBy);
  }

  if (filters?.startDate) {
    query = query.gte("tanggal_mulai", filters.startDate);
  }

  if (filters?.endDate) {
    query = query.lte("tanggal_selesai", filters.endDate);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: (data || []).map(mapProgramFromDb),
    count: count ?? 0,
  };
}

// 2. Get Detail Program by ID
export async function getProgramById(id: string): Promise<Program | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("program")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return mapProgramFromDb(data);
}

// 3. Create Program
export async function createProgram(
  payload: CreateProgramRequest
): Promise<Program> {
  const supabase = createClient();
  const programId = crypto.randomUUID();

  const dbPayload = {
    id: programId,
    nama: payload.nama,
    deskripsi: payload.deskripsi ?? null,
    jumlah_anggaran: payload.jumlahAnggaran,
    tanggal_mulai: payload.tanggalMulai,
    tanggal_selesai: payload.tanggalSelesai,
    created_by: payload.createdBy,
  };

  const { data, error } = await supabase
    .from("program")
    .insert(dbPayload)
    .select()
    .single();

  if (error) throw error;
  return mapProgramFromDb(data);
}

// 4. Update Program
export async function updateProgram(
  id: string,
  payload: UpdateProgramRequest
): Promise<Program> {
  const supabase = createClient();

  const dbPayload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (payload.nama !== undefined) dbPayload.nama = payload.nama;
  if (payload.deskripsi !== undefined) dbPayload.deskripsi = payload.deskripsi;
  if (payload.jumlahAnggaran !== undefined)
    dbPayload.jumlah_anggaran = payload.jumlahAnggaran;
  if (payload.tanggalMulai !== undefined)
    dbPayload.tanggal_mulai = payload.tanggalMulai;
  if (payload.tanggalSelesai !== undefined)
    dbPayload.tanggal_selesai = payload.tanggalSelesai;

  const { data, error } = await supabase
    .from("program")
    .update(dbPayload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapProgramFromDb(data);
}

// 5. Delete Program
export async function deleteProgram(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("program").delete().eq("id", id);

  if (error) throw error;
}