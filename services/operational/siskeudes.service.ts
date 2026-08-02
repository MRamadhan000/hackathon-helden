// services/operational/siskeudes.service.ts
import { createClient } from "@/utils/supabase/client";

export type KategoriSiskeudes = "bansos" | "operasional";

export interface Siskeudes {
  id: string;
  nama: string;
  kategori: KategoriSiskeudes;
  nominal: number;
  kkm: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSiskeudesRequest {
  nama: string;
  kategori: KategoriSiskeudes;
  nominal: number;
  kkm?: number | null;
}

export interface UpdateSiskeudesRequest {
  nama?: string;
  kategori?: KategoriSiskeudes;
  nominal?: number;
  kkm?: number | null;
}

function mapFromDb(row: any): Siskeudes {
  return {
    id: row.id,
    nama: row.nama,
    kategori: row.kategori,
    nominal: row.nominal != null ? Number(row.nominal) : 0,
    kkm: row.kkm != null ? Number(row.kkm) : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getSiskeudesList(kategori?: KategoriSiskeudes): Promise<Siskeudes[]> {
  const supabase = createClient();
  let q = supabase.from("siskeudes").select("*").order("created_at", { ascending: false });
  if (kategori) q = q.eq("kategori", kategori);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(mapFromDb);
}

export async function getSiskeudesById(id: string): Promise<Siskeudes | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("siskeudes").select("*").eq("id", id).single();
  if (error) return null;
  return mapFromDb(data);
}

export async function createSiskeudes(payload: CreateSiskeudesRequest): Promise<Siskeudes> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("siskeudes")
    .insert({
      id: crypto.randomUUID(),
      nama: payload.nama,
      kategori: payload.kategori,
      nominal: payload.nominal,
      kkm: payload.kkm ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return mapFromDb(data);
}

export async function updateSiskeudes(id: string, payload: UpdateSiskeudesRequest): Promise<Siskeudes> {
  const supabase = createClient();
  const patch: Record<string, any> = { updated_at: new Date().toISOString() };
  if (payload.nama !== undefined) patch.nama = payload.nama;
  if (payload.kategori !== undefined) patch.kategori = payload.kategori;
  if (payload.nominal !== undefined) patch.nominal = payload.nominal;
  if (payload.kkm !== undefined) patch.kkm = payload.kkm;

  const { data, error } = await supabase
    .from("siskeudes")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapFromDb(data);
}

export async function deleteSiskeudes(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("siskeudes").delete().eq("id", id);
  if (error) throw error;
}
