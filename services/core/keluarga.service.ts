import { createClient } from "@/utils/supabase/client";
import { Keluarga } from "@/types/keluarga";

function mapKeluargaFromDb(row: any): Keluarga {
  return {
    id: row.id,
    noKk: row.no_kk || row.noKk || "",
    alamat: row.alamat || "",
    clusterdesaId: row.clusterdesa_id || row.clusterdesaId || "",
    createdAt: row.created_at || row.createdAt || "",
  };
}

export async function getKeluargaList(): Promise<Keluarga[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tweb_keluarga")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(mapKeluargaFromDb);
}

export async function addKeluarga(payload: Omit<Keluarga, "id" | "createdAt">): Promise<Keluarga> {
  const supabase = createClient();      

  const { data, error } = await supabase
    .from("tweb_keluarga")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteKeluarga(id: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("tweb_keluarga")
    .delete()
    .eq("id", id);

  if (error) throw error;
}