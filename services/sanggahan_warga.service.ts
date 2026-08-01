import { createClient } from "@/utils/supabase/client";
import { SanggahanWarga, SanggahanWargaInsert, SanggahanWargaUpdate } from "@/types/sanggahanWarga";

export async function getSanggahanList(): Promise<SanggahanWarga[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sanggahan_warga")
    .select("*, tweb_penduduk(nama, nik), survei_kelayakan_bansos(status_rekomendasi)")
    .order("tgl_sanggahan", { ascending: false });

  if (error) throw error;
  return data;
}

export async function addSanggahan(payload: SanggahanWargaInsert): Promise<SanggahanWarga> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sanggahan_warga")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSanggahan(id: string, payload: SanggahanWargaUpdate): Promise<SanggahanWarga> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sanggahan_warga")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSanggahan(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("sanggahan_warga")
    .delete()
    .eq("id", id);

  if (error) throw error;
}