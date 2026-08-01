import { createClient } from "@/utils/supabase/client";
import { MutasiWarga, MutasiWargaInsert, MutasiWargaUpdate } from "@/types/mutasi_warga";

export async function getMutasiList(): Promise<MutasiWarga[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("mutasi_warga")
    .select("*, tweb_penduduk(nama, nik)")
    .order("tgl_kejadian", { ascending: false });

  if (error) throw error;
  return data;
}

export async function addMutasi(payload: MutasiWargaInsert): Promise<MutasiWarga> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("mutasi_warga")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMutasi(id: string, payload: MutasiWargaUpdate): Promise<MutasiWarga> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("mutasi_warga")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMutasi(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("mutasi_warga")
    .delete()
    .eq("id", id);

  if (error) throw error;
}