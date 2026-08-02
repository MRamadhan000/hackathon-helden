import { createClient } from "@/utils/supabase/client";
import { ClusterDesa } from "@/types/clusterDesa";

function mapClusterFromDb(row: any): ClusterDesa {
  return {
    id: row.id,
    nama: row.nama || "",
    jenis: row.jenis || "",
    parentId: row.parent_id || row.parentId || null,
    ketuaWilayah: row.ketua_wilayah || row.ketuaWilayah,
    koordinat: row.koordinat,
  };
}

export async function getClusterDesa(): Promise<ClusterDesa[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tweb_clusterdesa")
    .select("*")
    .order("nama", { ascending: true });

  if (error) throw error;

  return (data || []).map(mapClusterFromDb);
}

export async function addClusterDesa(payload: Omit<ClusterDesa, "id">): Promise<ClusterDesa> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tweb_clusterdesa")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteClusterDesa(id: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("tweb_clusterdesa")
    .delete()
    .eq("id", id);

  if (error) throw error;
}