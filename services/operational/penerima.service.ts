// services/operational/penerima.service.ts
import { createClient } from "@/utils/supabase/client";
import type {
  Penerima,
  CreatePenerimaRequest,
  UpdatePenerimaRequest,
  PenerimaFilters,
} from "@/types/penerima";

/**
 * Mapper dari row DB ke tipe Penerima.
 * Tidak menggunakan nested join — hanya kolom flat dari tabel penerima.
 * Field joined (pendudukNama, dll.) akan undefined, ditampilkan sebagai "—" di UI.
 */
function mapFromDb(row: any): Penerima {
  return {
    id: row.id,
    programId: row.program_id,
    pendudukId: row.penduduk_id,
    areaLocationId: row.area_location_id,
    createdBy: row.created_by,
    status: row.status,
    catatan: row.catatan ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    // Joined fields — tidak tersedia tanpa explicit join, tampil undefined
    pendudukNama: undefined,
    pendudukNik: undefined,
    areaLocationNama: undefined,
    programNama: undefined,
  };
}

/* ─── READ ─── */

/** Daftar penerima — difilter by programId, status, atau area */
export async function getPenerimaList(filters?: PenerimaFilters): Promise<Penerima[]> {
  const supabase = createClient();

  let q = supabase
    .from("penerima")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.programId)    q = q.eq("program_id", filters.programId);
  if (filters?.status)       q = q.eq("status", filters.status);
  if (filters?.areaLocationId) q = q.eq("area_location_id", filters.areaLocationId);

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapFromDb);
}

/** Detail satu penerima by ID */
export async function getPenerimaById(id: string): Promise<Penerima | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("penerima")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return mapFromDb(data);
}

/* ─── CREATE ─── */

export async function createPenerima(payload: CreatePenerimaRequest): Promise<Penerima> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("penerima")
    .insert({
      id: crypto.randomUUID(),
      program_id: payload.programId,
      penduduk_id: payload.pendudukId,
      area_location_id: payload.areaLocationId,
      created_by: payload.createdBy,
      catatan: payload.catatan ?? null,
      status: "PENDING",
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapFromDb(data);
}

/* ─── UPDATE STATUS ─── */

export async function updatePenerimaStatus(
  id: string,
  payload: UpdatePenerimaRequest
): Promise<Penerima> {
  const supabase = createClient();
  const patch: Record<string, any> = { updated_at: new Date().toISOString() };
  if (payload.status !== undefined) patch.status = payload.status;
  if (payload.catatan !== undefined) patch.catatan = payload.catatan;

  const { data, error } = await supabase
    .from("penerima")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapFromDb(data);
}

/* ─── DELETE ─── */

/** Hapus penerima (dianjurkan hanya saat status PENDING) */
export async function deletePenerima(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("penerima").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
